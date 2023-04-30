import { BasePuppeteer } from "base-puppeteer";
import url from "url";
import qs from "querystring";

const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: process.env.TWOCAPTCHA_API_KEY,
    },
    visualFeedback: true,
  })
);


export class FaxvinPuppeteer extends BasePuppeteer {
  async waitForNavigation() {
    const page = this._page;
    await page.waitForTimeout(1000);
  }
  async submitRecaptchasAndWait() {
    const page = this._page;
    await this.waitForNavigation();
    try {
      await page.click('button[type="submit"]');
      await this.waitForNavigation();
    } catch (e) {
      console.error(e);
      console.error("pass");
    }
  }
  async solveCaptchas() {
    const page = this._page;
    await page.solveRecaptchas();
  }
  async extractData() {
    const page = this._page;
    try {
      const [ vin, make, model, year, trim, style, engine, madeIn, age ] = await page.evaluate(() =>
        ((it) => {
          let value = null;
          const result = [];
          while ((value = it.iterateNext())) {
            result.push(value);
          }
          return result;
        })(document.evaluate("//tbody//td//b", document)).map((v) =>
          v.innerText.trim()
        )
      );
      return {
        vin,
        make,
        model,
        year,
        trim,
        style,
        engine,
        madeIn,
        age,
      };
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e);
      return null;
    }
  }
  async _resultWorkflow() {
    const page = this._page;
    await page.waitForNetworkIdle();
    await this.solveCaptchas();
    await this.waitForNavigation();
    await page.waitForSelector('tbody');
    return await this.extractData();
  }
  async openPage(url) {
    await this.goto({ url });
  }
  async searchPlate({ plate, state }) {
    await this.openPage(
      url.format({
        protocol: "https:",
        hostname: "www.faxvin.com",
        pathname: "/",
      })
    );
    const page = this._page;
    await page.waitForNetworkIdle();
    const site =
      url.format({
        protocol: "https:",
        hostname: "www.faxvin.com",
        pathname: "/license-plate-lookup/result",
      }) +
      "?" +
      qs.stringify({ plate, state });
    await this.goto({ url: site });
    return await this._resultWorkflow();
  }
  async close() {
    try {
      await this._browser.close();
    } catch (e) {
      console.error(e);
    }
  }
}

export const lookupPlate = async ({ plate, state }) => {
  const fv = await FaxvinPuppeteer.initialize() as FaxvinPuppeteer;
  const result = await fv.searchPlate({ plate, state });
  fv.close()
  return result;
};

#!/usr/bin/env node
'use strict';

const path = require('path');

const { createLogger, PuppeteerCLI } = require('base-puppeteer');

const logger = createLogger(require('../package').name);

const cli = new PuppeteerCLI({
  programName: 'faxvin',
  puppeteerClassPath: path.join(__dirname, '..', 'lib', 'faxvin'),
  logger
});

(async () => {
  await cli.runCLI();
})().catch((err) => logger.error(err));

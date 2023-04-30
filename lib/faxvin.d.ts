import { BasePuppeteer } from "base-puppeteer";
export declare class FaxvinPuppeteer extends BasePuppeteer {
    waitForNavigation(): Promise<void>;
    submitRecaptchasAndWait(): Promise<void>;
    solveCaptchas(): Promise<void>;
    extractData(): Promise<{
        vin: any;
        make: any;
        model: any;
        year: any;
        trim: any;
        style: any;
        engine: any;
        madeIn: any;
        age: any;
    }>;
    _resultWorkflow(): Promise<{
        vin: any;
        make: any;
        model: any;
        year: any;
        trim: any;
        style: any;
        engine: any;
        madeIn: any;
        age: any;
    }>;
    openPage(url: any): Promise<void>;
    searchPlate({ plate, state }: {
        plate: any;
        state: any;
    }): Promise<{
        vin: any;
        make: any;
        model: any;
        year: any;
        trim: any;
        style: any;
        engine: any;
        madeIn: any;
        age: any;
    }>;
    close(): Promise<void>;
}
export declare const lookupPlate: ({ plate, state }: {
    plate: any;
    state: any;
}) => Promise<{
    vin: any;
    make: any;
    model: any;
    year: any;
    trim: any;
    style: any;
    engine: any;
    madeIn: any;
    age: any;
}>;

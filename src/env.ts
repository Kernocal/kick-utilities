import 'dotenv/config';

export const BROWSER = process.env.BROWSER === 'firefox' ? 'firefox' : 'chrome';
export const GECKO_ID = process.env.GECKO_ID ?? '123qwe456asd789zxc';
export const PRODUCTION = process.env.NODE_ENV === 'production';
export const ZIP = process.env.ZIP === 'true' ? true : false;

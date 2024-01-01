import { Property, Validators, createAction } from "@activepieces/pieces-framework"
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export const scrollingListWebscrapper = createAction({
  name: 'scrolling_list_webscrapper',
  displayName: 'Scrolling List Webscrapper',
  description: 'Scrapes a website that uses continuous scrolling to load more data.',
  props: {
    url: Property.ShortText({
        displayName: 'URL',
        description: 'The URL of the website to scrape.',
        required: true,
        validators: [Validators.url]
    }),
    hasCookieAcceptDialog: Property.Checkbox({
      displayName: 'Has Cookie Accept Dialog',
      description: 'Whether the website has a cookie accept dialog.',
      required: true
    }),
    cookieDialogSelector: Property.ShortText({
      displayName: 'Cookie Dialog Selector',
      description: 'The selector for the cookie accept dialog.',
      required: false
    }),
    cookieButtonSelector: Property.ShortText({
      displayName: 'Cookie Button Selector',
      description: 'The selector for the cookie accept button.',
      required: false
    }),
    scrollX: Property.Number({
      displayName: 'Scroll X',
      description: 'The number of pixels to scroll horizontally for each interval.',
      required: true,
      defaultValue: 0
    }),
    scrollY: Property.Number({
      displayName: 'Scroll Y',
      description: 'The number of pixels to scroll vertically for each interval.',
      required: true,
      defaultValue: 100
    }),
    listItemSelector: Property.ShortText({
      displayName: 'List Item Selector',
      description: 'The selector for the list item.',
      required: true
    }),
  },
  async run(context) {
    const {url, hasCookieAcceptDialog, cookieDialogSelector, cookieButtonSelector, scrollX, scrollY, listItemSelector} = context.propsValue;

    // open browser
    const browser = await puppeteer.launch({headless: true});

    // load blank page
    const page = await browser.newPage();

    // create promise for page opening
    const navigationPromise = page.waitForNavigation();

    // visit URL when page loaded
    await page.goto(url, {waitUntil: 'networkidle0'});

    // Wait for page loaded
    await navigationPromise;

    if (hasCookieAcceptDialog && cookieDialogSelector && cookieButtonSelector) {
      // accept cookies
      await acceptCookiePolicy(page, cookieDialogSelector, cookieButtonSelector);
    }

    // scroll to bottom of page
    await scrollPageToBottom(page, scrollX, scrollY);

    // get page content
    const content = await page.content();

    // close browser
    await browser.close();

    const listItems = await itemMapping(content, listItemSelector);
    
    return listItems

  }
})

async function acceptCookiePolicy(page: puppeteer.Page, dialogSelector: string, buttonSelector: string) {
  // Check if cookie dialog loaded
  await page.waitForSelector(dialogSelector);
  // click Accept button when seeing cookie dialog
  await page.click(buttonSelector);
}

async function scrollPageToBottom(page: puppeteer.Page, scrollX: number, scrollY: number) {
  await page.evaluate(() => {
    let scrollTop = -1;

    // scroll down 100 per 1 second
    const interval: NodeJS.Timeout = setInterval(() => {
      // scroll down 100
      window.scrollBy(scrollX, scrollY);

      // Scroll down continuously until reaching end of the page
      if(document.documentElement.scrollTop !== scrollTop) {
        scrollTop = document.documentElement.scrollTop;
        return null;
      }
      clearInterval(interval);
      return interval;
    }, 1000);
  });
}

async function itemMapping(content: string, listItemSelector: string) {
  const returnValues: any[] = [];
  const $ = cheerio.load(content);

  const listItemElements = $(listItemSelector)
  listItemElements.map((index, element) => {
    returnValues.push($(element).html());
  });
  return returnValues;
}


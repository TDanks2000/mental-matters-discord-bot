import { load } from 'cheerio';
import ms from 'ms';
import colors from '../utils/colors';

interface Helpline {
  country: string;
  helplines: string[];
}

export class Helplines {
  private helplines: Map<string, Helpline> = new Map();
  private interval: number = ms('24 hours');
  private lastUpdated: Date | null = null;

  async scrapeAndCache() {
    const url = `https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines`;

    try {
      const res = await fetch(url);
      const text = await res.text();

      const $ = load(text);

      const table = $('table.wikitable');

      const rows = table.find('tr');

      for await (const row of rows) {
        const country = $(row).find('th').text().trim();
        const helplines = $(row).find('td ul li');

        if (country === 'country') {
          console.log('Skipping country header');
          continue;
        }

        if (!helplines.length) continue;

        this.helplines.set(country?.toLowerCase(), {
          country: country,
          helplines: helplines.text().trim().split('\n'),
        });

        continue;
      }

      this.lastUpdated = new Date();
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async start() {
    console.log(colors.yellow('Scraping helplines...'));
    const now = new Date();
    if (!this.lastUpdated || now.getTime() - this.lastUpdated.getTime() > this.interval) await this.scrapeAndCache();

    setInterval(async () => {
      console.log(colors.yellow('Scraping helplines again because of )interval...'));
      await this.scrapeAndCache();
    }, this.interval);

    console.log(colors.green('Helplines scraped and cached.'));
    return true;
  }

  get(country?: string | undefined | null): Helpline[] | undefined {
    if (!country) {
      return Array.from(this.helplines.values());
    }
    return Array.from(this.helplines.values()).filter(
      (helpline) => helpline.country.toLowerCase() === country.toLowerCase(),
    );
  }
}

const helplines = new Helplines();
export { helplines };

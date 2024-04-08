import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { RedditFeed } from '../../@types';

const parser = new XMLParser();

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

class RedditScrape {
  private subreddit: string;
  public subredditImage?: string;

  constructor(subreddit: string) {
    this.subreddit = subreddit;
  }

  public async getLatest(): Promise<RedditFeed> {
    const data = await this.scrape('new');
    return data;
  }

  public async getTop(): Promise<RedditFeed> {
    const data = await this.scrape('top');
    return data;
  }

  private async scrape(type: 'new' | 'top' | 'original' = 'new'): Promise<RedditFeed> {
    const ext: 'json' | 'xml' = 'json';
    const baseUrl = `https://www.reddit.com/r/${this.subreddit}`;

    let url = `${baseUrl}/${type}.${ext}`;
    switch (type) {
      case 'new':
        url = `${baseUrl}/new.${ext}`;
        break;
      case 'top':
        url = `${baseUrl}/top.${ext}`;
        break;
      case 'original':
        url = `${baseUrl}.${ext}`;
        break;
    }

    const { data } = await axios.request<RedditFeed>({
      url,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      },
      maxBodyLength: Infinity,
    });

    return data;
  }
}

export { RedditScrape };

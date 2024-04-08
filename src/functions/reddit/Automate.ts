import Console from '@tdanks2000/fancyconsolelog';
import dayjs from 'dayjs';
import { EmbedBuilder, HexColorString, OAuth2Guild, TextChannel } from 'discord.js';
import ms from 'ms';
import { client } from '../../Bot';
import { ClientClass } from '../../structure/Client';
import { createMDLink } from '../tools';
import { RedditScrape } from './scrape';

const console = new Console();

export class RedditAutomate {
  private intervalId: NodeJS.Timeout | undefined;
  private client: ClientClass;
  private guild: Set<OAuth2Guild> = new Set();
  public interval: number = ms('5 hours');

  constructor() {
    this.client = client;
  }

  async init() {
    // get all guilds
    const guilds = await this.client.guilds.fetch();

    for await (const guild of guilds.values()) {
      this.guild.add(guild);

      // check in db for channels db.channelsettings for interval
      const channel = await this.client.db.channelSettings.findFirst({
        where: {
          guid_id: guild.id,
        },
      });

      if (channel && channel.subreddits_interval_hours)
        this.interval = ms(`${channel.subreddits_interval_hours} hours`);
    }

    await this.intervalCode();
    this.intervalId = setInterval(async () => {
      await this.intervalCode();
    }, this.interval);
  }

  private intervalCode = async () => {
    const db = this.client.db;
    // check in db for channels db.channelsettings
    for await (const guild of this.guild) {
      console.info(`Starting Reddit Automate for ${guild.name}`);
      const channel = await db.channelSettings.findFirst({
        where: {
          guid_id: guild.id,
        },
      });

      if (!channel || !channel.channel_id_reddit_posts) {
        console.info(`Skipping ${guild.name} because it doesn't have a reddit channel set`);
        continue;
      }

      if (channel.subreddits_interval_hours) this.interval = ms(`${channel.subreddits_interval_hours} hours`);

      const fetchChannel = this.client.channels.cache.get(channel.channel_id_reddit_posts);
      if (!fetchChannel) {
        console.info(`Skipping ${guild.name} because it doesn't have a reddit channel set`);
        continue;
      }

      // get subreddits from db
      const subreddits = channel.subreddits || [];
      if (subreddits.length === 0) {
        console.info(`Skipping ${guild.name} because it doesn't have any subreddits set`);
        continue;
      }

      for await (const subreddit of subreddits) {
        const redditClass = new RedditScrape(subreddit);
        console.info(`Starting Reddit Automate for ${guild.name} | ${subreddit}`);
        const redditData = await redditClass.getLatest();
        const data = redditData.data.children[0].data;

        const check = await db.redditPosts.findFirst({
          where: {
            guiid_id: guild.id,
            reddit_id: data.id,
            sub: subreddit,
          },
        });

        if (check) {
          console.info(`Skipping ${guild.name} for ${subreddit} because it already has a post with the same id`);
          continue;
        } else {
          await db.redditPosts.create({
            data: {
              guiid_id: guild.id,
              title: data.title,
              reddit_id: data.id,
              sub: subreddit,
            },
          });
        }

        // console.log(JSON.stringify(redditData.feed, null, 2));

        const embed = new EmbedBuilder()
          .setTitle(`SevenSeas | r/${subreddit}`)
          .setColor(this.client.config.color as HexColorString)
          .setDescription(
            `
          ${data.title}\n
          ${data?.selftext.length > 1 ? `${data?.selftext?.slice(0, 250)}...\n` : ''}
          ${createMDLink('Link', 'https://reddit.com', data?.permalink ?? data.url ?? undefined)}
        `,
          )
          .addFields({
            name: 'Author',
            value: data.author,
            inline: true,
          })
          .setFooter({
            text: `Created: ${dayjs(data.created).format('DD MMM YYYY, HH:mm')}`,
          });

        if (data?.preview?.images) embed.setImage(data.preview.images[0].source.url);

        await (fetchChannel as TextChannel).send({
          embeds: [embed],
        });
        console.info(`Finished Reddit Automate for ${subreddit} for guild ${guild.name}`);
      }
      console.info(`Finished Reddit Automate for ${guild.name}`);
    }
  };

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async restart() {
    await this.stop();
    await this.init();
  }

  async destroy() {
    await this.stop();
  }
}

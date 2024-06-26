import { Client, Collection } from 'discord.js';
import path from 'node:path';
import { ModLogs } from '../functions';
import { Handler } from '../handler';
import { config } from '../utils';
import colors from '../utils/colors';
import { Database } from './Prisma';
import { clientOptions } from './utils/ClientOptions';

import helplines from '../utils/configs/helplines.json';

export class ClientClass extends Client {
  public buttons = new Collection();
  public db = new Database();
  public config = config;

  public modLogs = new ModLogs();
  public helplines = helplines;

  constructor() {
    super(clientOptions);
  }

  public async init() {
    console.info(colors.yellow('Bot is loading...'));

    // await this.helplines.start();
    await this.modLogs.init(this);

    new Handler({
      client: this,
      commandsPath: path.join(__dirname, '..', 'commands'),
      eventsPath: path.join(__dirname, '..', 'events'),
      componentsPath: path.join(__dirname, '..', 'components'),
    });

    const TOKEN = process.env.NODE_ENV! === 'production' ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV;
    await this.login(TOKEN);
  }
}

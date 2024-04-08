import type { Client } from 'discord.js';
import { Handler } from '../../handler';
import { ClientClass } from '../../structure/Client';

export default function (c: Client<true>, client: ClientClass, handler: Handler) {
  client.modLogs.init(client);
}

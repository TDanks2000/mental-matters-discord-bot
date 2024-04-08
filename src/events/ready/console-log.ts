import type { Client } from 'discord.js';
import { Handler } from '../../handler';
import colors from '../../utils/colors';

export default function (c: Client<true>, client: Client<true>, handler: Handler) {
  console.log(colors.green(`Logged in as ${c.user?.username}!`));
}

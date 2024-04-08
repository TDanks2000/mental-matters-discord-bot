import { EmbedBuilder, GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import { Handler } from '../../handler';
import { ClientClass } from '../../structure/Client';

export default function (member: GuildMember | PartialGuildMember, client: ClientClass, handler: Handler) {
  try {
    if (!member.guild) return;
    console.log('test');

    const modLogs = client.modLogs.get(member.guild.id);
    if (!modLogs) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('User Left')
      .setAuthor({ name: member?.user.tag, iconURL: member.user.displayAvatarURL() })
      .setDescription(`${member} has left the server.`)
      .setTimestamp();

    (client.channels.cache.get(modLogs.channelId) as TextChannel)?.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

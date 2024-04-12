import canvafy from 'canvafy';
import { GuildMember, TextChannel } from 'discord.js';
import { ClientClass } from '../../structure/Client';
import { getColorFromStatus } from '../../utils';

export default async function (member: GuildMember, client: ClientClass) {
  const db = client.db;

  const config = await db.guild_config.findFirst({
    where: {
      guild_id: member.guild.id,
    },
  });

  if (!config || !config.join_messages) return;

  const data = await db.channelSettings.findFirst({
    where: {
      guid_id: member.guild.id,
    },
  });

  if (!data || !data.join_messages) return;

  const channel = (await client.channels.fetch(data.join_messages)) as TextChannel;

  if (!channel) return;

  const image = await new canvafy.WelcomeLeave()
    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
    .setBackground('color', member.displayHexColor)
    .setTitle('Welcome')
    .setDescription('Welcome to this server, go read the rules please!')
    .setAvatarBorder(getColorFromStatus(member.presence?.status ?? 'online'))
    .setOverlayOpacity(0.5)
    .build();

  return await channel.send({
    content: `<@${member.user.id}> Welcome to the server!`,
    files: [
      {
        attachment: image,
        name: `welcome-${member.id}.png`,
      },
    ],
  });
}

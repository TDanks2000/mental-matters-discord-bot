import { EmbedBuilder, Message, PartialMessage } from 'discord.js';
import { ClientClass } from '../../structure/Client';

export default async function (message: Message | PartialMessage, client: ClientClass) {
  if (!message.guild) return;

  const guildId = message.guild.id;

  if (!message.author || message.author.bot || !message.content) return;
  if (isNaN(parseInt(message.content))) return;

  const message_number = parseInt(message.content);

  const db = client.db.counting_game;

  const data = await db.findFirst({
    where: {
      guild_id: guildId!,
    },
  });

  if (!data) return;

  const list = [
    `it's okay <USER>, let's try again!`,
    `it's okay <USER>, try again!`,
    `it's okay <USER>, try harder!`,
    `The count is wrong <USER>, try again!`,
  ];

  if (message.channel.id === data.channel_id) {
    if (message.author.id == data.last_person_id || message_number < data.count || message_number > data.count) {
      const randomItem = list[Math.floor(Math.random() * list.length)].replace('<USER>', `<@${message.author.id}>`);

      await db.updateMany({
        where: {
          guild_id: guildId!,
          channel_id: data.channel_id,
        },
        data: {
          last_person_id: '',
          count: 1,
        },
      });

      const embed = new EmbedBuilder()
        .setTitle(`Counting | ${message.guild?.name}`)
        .setColor('Red')
        .setDescription(randomItem)
        .setTimestamp();

      const msg = await message.channel.send({ embeds: [embed] });

      await msg.react('😡');

      return await message.react('❌');
    }

    if (message_number == 100 && data.count == 100) message.react('💯');
    else message.react('✅');

    await db.updateMany({
      where: {
        guild_id: guildId!,
        channel_id: data.channel_id,
      },
      data: {
        last_person_id: message.author.id,
        count: (data.count += 1),
      },
    });
  }
}

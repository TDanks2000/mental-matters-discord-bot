import { EmbedBuilder, Message, PartialMessage } from 'discord.js';
import { ClientClass } from '../../structure/Client';

export default async function (message: Message | PartialMessage, client: ClientClass) {
  const guildId = message.guild!.id;

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
    ` <USER> Is stupid and ruined it at **${data.count}**`,
    `What the *BEEP* you *BEEP* <USER> Ruined it at **${data.count}**`,
    `<USER> has RUINED! RUINED! RUINED! it at  **${data.count}** `,
    `<USER> has RUINED it at **${data.count}**`,
    `what where you thinking <USER>! you ruined it at **${data.count}**`,
    `omg its all gone to *BEEP* we can't have anything nice omg, you have actually ruined all this hard work  <USER> at **${data.count}**`,
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
        count: data.count++,
      },
    });
  }
}

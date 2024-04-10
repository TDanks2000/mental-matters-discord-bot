import { CommandData, CommandOptions, SlashCommandProps } from '../../handler';

import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export const data: CommandData = {
  name: 'poll',
  description: 'creates a poll',
  options: [
    {
      name: 'topic',
      description: 'topic of the poll',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  await interaction.reply({
    content: 'Creating a poll',
    ephemeral: true,
  });

  const topic = interaction.options.getString('topic', true);

  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setTitle('📌 Poll started')
    .setDescription(`> ${topic}`)
    .addFields({ name: '✅ Yes', value: '0', inline: true })
    .addFields({ name: '❌ No', value: '0', inline: true })
    .setFooter({
      text: `Started by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('upvotePoll').setLabel('✅ YES').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('downvotePoll').setLabel('❌ NO').setStyle(ButtonStyle.Danger),
  );

  const msg = await interaction.channel!.send({
    embeds: [embed],
    components: [buttons],
  });

  msg.createMessageComponentCollector();

  await client.db.poll_votes.create({
    data: {
      guild_id: interaction.guild!.id,
      owner_id: interaction.user.id,
      message_id: msg.id,
      down_members: [],
      up_members: [],
      downvotes: 0,
      upvotes: 0,
    },
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ['Administrator'],
};

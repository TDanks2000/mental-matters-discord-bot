import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { ClientClass } from '../../structure/Client';
import { arrayRemove } from '../../utils';

module.exports = {
  data: {
    name: 'upvotePoll',
  },
  async run(interaction: ButtonInteraction<'cached'>, client: ClientClass) {
    const data = await client.db.poll_votes.findFirst({
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message.id,
      },
    });

    if (!data) return;

    if (data.up_members.includes(interaction.user.id))
      return interaction.reply({
        content: 'You already voted for this poll!',
        ephemeral: true,
      });

    const msg = await interaction.channel!.messages.fetch(data.message_id);

    let downvotes = data.downvotes;
    if (data.down_members.includes(interaction.user.id)) {
      downvotes = downvotes - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: '✅ Yes',
        value: `${data.upvotes + 1}`,
        inline: true,
      },
      {
        name: '❌ No',
        value: `${downvotes}`,
        inline: true,
      },
    );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('upvotePoll').setLabel('✅ YES').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('downvotePoll').setLabel('❌ NO').setStyle(ButtonStyle.Danger),
    );

    await interaction.update({
      embeds: [newEmbed],
      components: [buttons],
    });

    data.upvotes++;

    if (data.down_members.includes(interaction.user.id)) {
      data.downvotes = data.downvotes - 1;
    }

    data.up_members.push(interaction.user.id);
    data.down_members = arrayRemove(data.down_members, interaction.user.id);

    await client.db.poll_votes.updateMany({
      data,
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message.id,
      },
    });
  },
};

import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { ClientClass } from '../../structure/Client';
import { arrayRemove } from '../../utils';

module.exports = {
  data: {
    name: 'downvotePoll',
  },
  async run(interaction: ButtonInteraction<'cached'>, client: ClientClass) {
    const data = await client.db.poll_votes.findFirst({
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message.id,
      },
    });

    if (!data) return;

    if (data.down_members.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'You already voted for this poll!',
        ephemeral: true,
      });
    }

    const msg = await interaction.channel!.messages.fetch(data.message_id);

    let upvotes = data.upvotes;
    if (data.up_members.includes(interaction.user.id)) {
      upvotes = upvotes - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: '✅ Yes',
        value: `${upvotes}`,
        inline: true,
      },
      { name: '❌ No', value: `${data.downvotes + 1}`, inline: true },
    );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('upvotePoll').setLabel('✅ YES').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('downvotePoll').setLabel('❌ NO').setStyle(ButtonStyle.Danger),
    );

    await interaction.update({
      embeds: [newEmbed],
      components: [buttons],
    });

    data.downvotes++;

    if (data.up_members.includes(interaction.user.id)) {
      data.upvotes = data.upvotes - 1;
    }

    data.down_members.push(interaction.user.id);
    data.up_members = arrayRemove(data.up_members, interaction.user.id);

    await client.db.poll_votes.updateMany({
      data,
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message.id,
      },
    });
  },
};

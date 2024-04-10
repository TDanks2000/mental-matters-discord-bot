import { CommandData, CommandOptions, SlashCommandProps } from '../../handler';

import { EmbedBuilder } from 'discord.js';

export const data: CommandData = {
  name: 'affirmation',
  description: 'Sends a random affirmation',
};

interface Affirmation {
  affirmation: string;
}

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const data = await fetch('https://www.affirmations.dev/');
  const affirmation = (await data.json()) as Affirmation;

  if (!affirmation) return await interaction.reply('There was an error, please try again.');

  const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Affirmation')
    .setDescription(`**${affirmation.affirmation}**`)
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  await interaction.reply({
    embeds: [embed],
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};

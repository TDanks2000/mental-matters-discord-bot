import { CommandData, CommandOptions, SlashCommandProps } from '../../handler';

import { ApplicationCommandOptionType } from 'discord.js';

export const data: CommandData = {
  name: 'helplines',
  description: 'Get helplines',
  options: [
    {
      name: 'country',
      description: 'Country',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const country = interaction.options.getString('country');
  const helplines = client.helplines.get(country);

  if (!helplines) {
    return await interaction.reply({
      content: 'No helplines found for that country',
      ephemeral: true,
    });
  }

  const message = `
    ${helplines.map(
      (helpline) =>
        `**${helpline.country}**\n 
      ${helpline.helplines.join(', ')}\n`,
    )}
  `;

  await interaction.reply({ content: JSON.stringify(message) });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: true,
};

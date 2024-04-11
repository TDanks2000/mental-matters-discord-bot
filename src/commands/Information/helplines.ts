import Fuse from 'fuse.js';
import { Helpline } from '../../@types';
import { AutocompleteProps, CommandData, CommandOptions, SlashCommandProps } from '../../handler';

function getHelpline(helplines: Helpline[], country: string) {
  const countries = helplines.map((item) => item.country.toLowerCase());

  const fuzzy = new Fuse(countries, {
    includeScore: true,
    threshold: 0.7,
    distance: 100,
  });

  const results = fuzzy.search(country);
  return results;
}

import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export const data: CommandData = {
  name: 'helplines',
  description: 'Get helplines',
  options: [
    {
      name: 'country',
      description: 'Country',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
};

export function autocomplete({ interaction, client, handler }: AutocompleteProps) {
  const focusedValue = interaction.options.getFocused()?.toLowerCase();

  const countries = getHelpline(client.helplines as Helpline[], focusedValue);

  if (!focusedValue)
    return interaction.respond(countries.map((country) => ({ name: country.item, value: country.item })).slice(0, 25));

  const filtered = countries.map((country) => ({ name: country.item, value: country.item })).slice(0, 25);
  interaction.respond(filtered);
}

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const country = interaction.options.getString('country', true);
  const helplines: Helpline[] = client.helplines as Helpline[];

  if (!helplines?.length) {
    return await interaction.reply({
      content: 'No helplines found for that country',
      ephemeral: true,
    });
  }

  const findHotline = helplines.find((item) => item.country.toLowerCase() === country.toLowerCase());

  if (!findHotline || !findHotline.helplines) {
    return await interaction.reply({
      content: 'No helplines found for that country',
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setTitle(`Helplines | ${country}`)
    .addFields(
      findHotline.helplines.map((helpline) => {
        return {
          name: helpline.name,
          value: `> ${
            helpline?.description?.length && helpline?.phone?.length
              ? `${helpline?.description}\n > ${helpline?.phone}`
              : helpline.phone
              ? helpline?.phone
              : helpline.description
              ? helpline.description
              : helpline?.phone ?? helpline?.sms ?? helpline?.email ?? helpline?.website ?? ''
          } \n`,
        };
      }),
    )
    .setFooter({
      text: 'You will be okay! :)',
    })
    .setTimestamp();

  try {
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};

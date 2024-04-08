import { ActivityType, ClientOptions, GatewayIntentBits, Options } from 'discord.js';

export const clientOptions: ClientOptions = {
  presence: {
    status: 'dnd',
    activities: [{ name: 'You will be okay', type: ActivityType.Playing }],
  },
  intents: [Object.keys(GatewayIntentBits).map((key) => GatewayIntentBits[key as keyof typeof GatewayIntentBits])],
  makeCache: Options.cacheEverything(),
};

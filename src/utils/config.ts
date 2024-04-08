import { BannedWordsConfig, Config } from '../@types';

let config: Config;
let bannedWords: BannedWordsConfig;

try {
  config = require('./config.json');
} catch (error) {
  config = {
    color: '#fbc531',
    music: {
      default_volume: 100,
      max_playlist_size: 100,
    },
  };
}

try {
  bannedWords = require('./configs/banned_words.json');
} catch (error) {
  bannedWords = [];
}

export { bannedWords, config };

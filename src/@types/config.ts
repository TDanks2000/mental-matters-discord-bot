export interface Config {
  color: `#${string}`;
  music: {
    max_playlist_size: number;
    default_volume: number;
  };
}

export type BannedWordsConfig = string[];

export interface Helpline {
  country: string;
  emergency_numbers: { [key: string]: string };
  helplines: HelplineElement[];
}

export interface HelplineElement {
  name: string;
  website?: string;
  phone: string;
  availability?: string;
  description?: string;
  sms?: string;
  email?: string;
}

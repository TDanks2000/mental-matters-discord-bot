// This types file is for development
// For exported types use ./types/index.ts

import type { CacheType, Client, Interaction } from 'discord.js';
import { ClientClass } from '../../structure/Client';
import type { Handler } from '../Handler';
import type { CommandHandler, ComponentHandler, EventHandler, ValidationHandler } from '../handlers';
import type { CommandData, CommandOptions, ReloadType } from './index';

/**
 * Options for instantiating a Handler handler.
 */
export interface HandlerOptions {
  /**
   * The Discord.js client object to use with Handler.
   */
  client: ClientClass;
  /**
   * The path to your commands directory.
   */
  commandsPath?: string;

  /**
   * The path to your events directory.
   */
  eventsPath?: string;

  /**
   * The path to the validations directory.
   */
  validationsPath?: string;

  /**
   * List of development guild IDs to restrict devOnly commands to.
   */
  devGuildIds?: string[];

  /**
   * List of developer user IDs to restrict devOnly commands to.
   */
  devUserIds?: string[];

  /**
   * List of developer role IDs to restrict devOnly commands to.
   */
  devRoleIds?: string[];

  /**
   * Skip Handler's built-in validations (for devOnly commands).
   */
  skipBuiltInValidations?: boolean;

  /**
   * Bulk register application commands instead of one-by-one.
   */
  bulkRegister?: boolean;
  /**
   * Options for experimental features.
   */
  experimental?: {
    /**
     * Enable hooks. This allows you to utilize hooks such as `useInteraction()` to access the interaction object anywhere inside the command.
     */
    hooks?: boolean;
  };

  componentsPath?: string;
}

/**
 * Private data for the Handler class.
 */
export interface HandlerData extends HandlerOptions {
  commandHandler?: CommandHandler;
  eventHandler?: EventHandler;
  validationHandler?: ValidationHandler;
  componentsHandler?: ComponentHandler;
}

/**
 * Represents a command context.
 */
export interface CommandContext<T extends Interaction, Cached extends CacheType> {
  /**
   * The interaction that triggered this command.
   */
  interaction: Interaction<CacheType>;
  /**
   * The client that instantiated this command.
   */
  client: Client;
  /**
   * The command data.
   */
  handler: Handler;
}

/**
 * Represents a command file.
 */
export interface CommandFileObject {
  data: CommandData;
  options?: CommandOptions;
  run: <Cached extends CacheType = CacheType>(ctx: CommandContext<Interaction, Cached>) => Awaited<void>;
  autocomplete?: <Cached extends CacheType = CacheType>(ctx: CommandContext<Interaction, Cached>) => Awaited<void>;
  filePath: string;
  category: string | null;
  [key: string]: any;
}

/**
 * A reload type for commands.
 */
export type ReloadOptions = 'dev' | 'global' | ReloadType;

export interface ComponentHandlerOptions {
  client: ClientClass;
  componentsPath: string;
}

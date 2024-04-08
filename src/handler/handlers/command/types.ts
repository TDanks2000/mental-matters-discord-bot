import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  ContextMenuCommandInteraction,
} from 'discord.js';
import type { CommandFileObject } from '../../@types';
import type { Handler } from '../../Handler';
import type { ValidationHandler } from '../validation';

/**
 * Command handler options.
 * Similar to Handler options in structure.
 */
export interface CommandHandlerOptions {
  /**
   * The client created by the user.
   */
  client: Client;

  /**
   * Path to the user's commands.
   */
  commandsPath: string;

  /**
   * An array of developer guild IDs.
   */
  devGuildIds: string[];

  /**
   * An array of developer user IDs.
   */
  devUserIds: string[];

  /**
   * An array of developer role IDs.
   */
  devRoleIds: string[];

  /**
   * A validation handler instance to run validations before commands.
   */
  validationHandler?: ValidationHandler;

  /**
   * A boolean indicating whether to skip Handler's built-in validations (permission checking, etc.)
   */
  skipBuiltInValidations: boolean;

  /**
   * The Handler handler that instantiated this.
   */
  HandlerInstance: Handler;

  /**
   * A boolean indicating whether to register all commands in bulk.
   */
  bulkRegister: boolean;
  /**
   * Whether to enable hooks context.
   */
  enableHooks: boolean;
}

/**
 * Private command handler data.
 */
export interface CommandHandlerData extends CommandHandlerOptions {
  /**
   * An array of command file objects.
   */
  commands: CommandFileObject[];

  /**
   * An array of built-in validations.
   */
  builtInValidations: BuiltInValidation[];

  /**
   * A validation handler instance to run validations before commands.
   */
  validationHandler?: ValidationHandler;
}

/**
 * Parameters for Handler's built-in validations.
 */
export interface BuiltInValidationParams {
  /**
   * The target command to validate.
   */
  targetCommand: CommandFileObject;

  /**
   * The interaction of the target command.
   */
  interaction: HandlerInteraction;

  /**
   * The command handler's data.
   */
  handlerData: CommandHandlerData;
}

/**
 * Represents a command interaction.
 */
export type HandlerInteraction = ChatInputCommandInteraction | ContextMenuCommandInteraction | AutocompleteInteraction;

/**
 * A built in validation. Returns a boolean or void.
 */
export type BuiltInValidation = ({}: BuiltInValidationParams) => boolean | void;

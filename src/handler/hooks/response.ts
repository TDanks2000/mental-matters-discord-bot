// this is partially based on sapphire's safelyReplyToInteraction helper

import type {
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  PartialTextBasedChannelFields,
} from 'discord.js';
import { HandlerInteraction } from '../handlers/command/types';
import { useInteraction } from './useInteraction';

type ChatInputReplyData = Parameters<ChatInputCommandInteraction['reply']>[0];
type UpdateData = Parameters<MessageComponentInteraction['update']>[0];
type MessageData = Parameters<PartialTextBasedChannelFields['send']>[0] | ChatInputReplyData;

export async function response(data: MessageData) {
  const interaction = useInteraction() as HandlerInteraction | MessageComponentInteraction;

  if (interaction.isAutocomplete()) return;

  if (interaction.replied || interaction.deferred) {
    await interaction.editReply(data);
  } else if (interaction.isMessageComponent()) {
    // TODO: this is not yet allowed in command handler
    await interaction.update(data as UpdateData);
  } else {
    await interaction.reply(data as ChatInputReplyData);
  }

  // TODO: handle message based commands
}

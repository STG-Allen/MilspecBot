import type { Message } from 'discord.js';

export type Dict<T> = {
  [index: string]: T;
}

export interface Command {
  name: string,
  description: string,
  execute(message: Message, ...args: string[]): Promise<Message> | Promise<Message[]>;
}
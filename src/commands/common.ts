import type { Message } from 'discord.js';

export function authorIsStaff(message: Message) {
  if (!message.guild) return false;
  else return message.member.roles.cache.some(r => r.name === 'Staff');
}
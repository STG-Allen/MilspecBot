import outdent from 'outdent';

export const permissionError = outdent`
  You do not have permission to run this command.`;

export const notInGuild = outdent`
  You must be in a discord server to run this command.`;

export const unspecifiedTicket = (action: string)=> outdent`
  Please specify a ticket id to ${action}!`

export const informOfClosure = (id: string, solution: string)=> outdent`
  Your ticket with ID ${id} has been closed.
  Provided solution:
  \`\`\`${solution}\`\`\``

export const ticketStatusAlready = (status: string, id: string)=> outdent`
  Ticket ${id} is already ${status}.`

export const genericActionError = (action: string, id: string)=> outdent`
  Could not ${action} ticket no. ${id}`;
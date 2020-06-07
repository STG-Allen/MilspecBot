import outdent from 'outdent';

export const permissionError = outdent`
  You do not have permission to run this command.`;

export const notInGuild = outdent`
  You must be in a discord server to run this command.`;

export const noComment = 'Please specify a comment!';

export const unspecifiedTicket = (action: string)=> outdent`
  Please specify a ticket id to ${action}!`

export const informOfClosure = (id: string, solution: string)=> outdent`
  Your ticket with ID ${id} has been closed.
  Provided solution: \`\`\`
  ${solution}
  \`\`\``

export const ticketStatusAlready = (status: string, id: string)=> outdent`
  Ticket ${id} is already ${status}.`

export const genericActionError = (action: string, id: string)=> outdent`
  Could not ${action} ticket no. ${id}
  If the problem persists, contact an administrator.`;

export const commentSuccess = (comment: string, id: string)=> outdent`
  Comment successfully added to the ticket with id ${id}
  Content: \`\`\`
  ${comment}
  \`\`\``;

export const informOfComment = (comment: string, id: string)=> outdent`
  Your ticket with ID \`${id}\` has been updated with a comment.
  Content: \`\`\`
  ${comment}
  \`\`\``;

export const noTicketReason = 'Please specify a reason for creating your ticket.';

export const ticketCreationSuccess = (desc: string, id: string)=> outdent`
  You have successfully created a ticket with description:\`\`\`
  ${desc}
  \`\`\`
  Your ticket number is \`${id}\`.
  Please do not submit mutliple tickets for the same issue.`;

export const newUserEntry = (whom: string)=> outdent`
  Creating a new entry for ${whom} in the database!`;

export const ticketCreationFailure = outdent`
  We were unable to create your ticket, please contact an administrator!`;

export const informOfTicketCreation = (n: string, prefix: string)=> outdent`
  Created a new ticket with ID: \`${n}\`.
  You can now view this ticket with \`${prefix}ticket info ${n}\``;

export const informOfHold = (id: string)=> outdent`
  Your ticket with ID \`${id}\` has been put on hold.`;

export const commentDisplay = (comment: string, author: string)=> outdent`
  ${comment}

  Author: ${author}`;

export const informOfDM = outdent`
  Please check your DM's, I have sent you a message regarding that ticket!`;

export const ticketNotFound = outdent`
  Your ticket could not be found!
  If your ticket ID is correct and the issue persists,
  please contact an administrator!`;

export const noActiveTickets = 'Does not have any active tickets.';

export const informOfDMList = outdent`
  Please check your DM's.
  I have sent you a list of tickets pertaining to the specific user.`;

export const permissionErrorList = outdent`
  You are not permitted to view tickets belonging to others.`
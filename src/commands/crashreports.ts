import Discord from 'discord.js';

const windowsInstructions = [
  'Press the ``windows key`` and ``r`` at the same time.',
  'When the text box appears, type ``%appdata%`` and press enter.',
  'This should open up a file browser.',
  'In that browser, click on ``.technic`` then navigate to ``modpacks``.',
  'Once you are in this folder, navigate to the modpack folder of which recently crashed.',
  'Once inside that folder, find a subfolder that is labeled ``crash-reports``. ',
  'Inside the ``crash-reports`` folder there will potentially be a couple text files.',
  'Make sure that you open the most recent.'
];

const crashReportsHowTo = [
  'To obtain your crash report, please navigate to the',
  '`crash-reports` folder and open the latest file.'
];

const uploadInstructions = [
  'Once you have obtained your crash-report,',
  'please upload it to https://hastebin.com and then post the link below this message!'
];

const name = "crashreport";
const description = 'Display a how-to for crash reports.';

function execute(message: Discord.Message) {
  const embed = new Discord.MessageEmbed()
  .setColor('0099ff')
  .addField('Crash-Reports', crashReportsHowTo.join(' '))
  .addField('Windows', windowsInstructions)
  .addField('Uploading', uploadInstructions.join(' '))
  .setFooter('Created by Milspec Dev Team');
  return message.channel.send({ embed }).catch(console.error);
}


export { name, description, execute }

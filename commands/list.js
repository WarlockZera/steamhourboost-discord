const { knex, db } = require('../helpers/database');
const log = require('../helpers/logger');

module.exports = {
  name: 'list',
  description: 'List of your accounts.',
  async execute(client, prefix, commands, message, args, user = []) {
    // return if user is not found
    if (!user.length) return;

    let msg = "";
    let number = 1;

    msg += "**Account List**";
    msg += "\n---------------------------------\n";

    try {
      const steamAccounts = await knex(db.table.steam).where({ owner_id: user[0].id });
      steamAccounts.forEach(account => {
        const status = (account.is_running) ? 'Running' : 'Stopped';
        msg += `${number++}. **${account.username}** - Status: \`${status}\``;
        msg += "\n";
      });

      if (!steamAccounts.length) {
        message.author.send(`${log('discord')} No accounts found!`);
        return;
      }

      message.author.send(`${log('discord')}\n${msg}`);
    } catch (err) {
      console.log(`${log('discord')} ERROR | ${err}`);
      message.author.send("Oops! Something went wrong.");
      return;
    }
  }
};
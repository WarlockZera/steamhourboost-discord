const { steamAccounts } = require('../steamClient');
const verifyArgs = require('../helpers/verify-arguments');

module.exports = {
  name: '2fa',
  description: 'Steam Guard Authentication',
  execute(client, prefix, commands, message, args, user = []) {
    // return if user is not found
    if (!user.length) return;

    if (!verifyArgs(args, '2fa')) return;

    const username = args[0];
    const steamGuardCode = args[1];
    const steamAccount = steamAccounts.find(acc => acc.steamClient.username === username && acc.steamClient.ownerId === user[0].id);

    if (steamAccount == null) {
      return;
    }

    steamAccount.steamClient.steamGuardAuth.callback(steamGuardCode);
  }
};
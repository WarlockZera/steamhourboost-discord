const { prisma } = require('./prisma.service');
const { logger } = require('../helpers/logger.helper');
const { appIdsToBytes, bytesToAppIds } = require('../utils/steam.util');

class SteamAccount {
  static async insert({ username, password, loginKey, sharedSecret, games, discordOwnerId }) {
    try {
      return await prisma.steamAccounts.create({
        data: {
          username,
          password,
          loginKey,
          sharedSecret,
          games: appIdsToBytes(games),
          discordOwner: {
            connect: { discordId: discordOwnerId },
          },
        },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to insert new Steam account to database');
    }
  }

  static async remove(steamUsername) {
    try {
      return await prisma.steamAccounts.delete({
        where: { username: steamUsername },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to remove Steam account from database');
    }
  }

  static async getAll(discordId) {
    try {
      const steamAccounts = await prisma.steamAccounts.findMany({
        where: {
          discordOwner: {
            discordId,
          },
        },
      });

      return steamAccounts.map((steamAccount) => ({
        ...steamAccount,
        games: bytesToAppIds(steamAccount.games),
      }));
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to get Steam accounts from database');
    }
  }

  static async getAllRunning() {
    try {
      const steamAccounts = await prisma.steamAccounts.findMany({
        where: { isRunning: true },
      });

      return steamAccounts.map((steamAccount) => ({
        ...steamAccount,
        games: bytesToAppIds(steamAccount.games),
      }));
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to get all running Steam accounts from database');
    }
  }

  static async getAccount(discordId, steamUsername) {
    try {
      const steamAccount = await prisma.steamAccounts.findFirst({
        where: {
          username: steamUsername,
          discordOwner: {
            discordId,
          },
        },
      });

      if (!steamAccount) {
        return null;
      }

      return {
        ...steamAccount,
        games: bytesToAppIds(steamAccount.games),
      };
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to get Steam account from database');
    }
  }

  static async setLoginKey(steamUsername, loginKey) {
    try {
      return await prisma.steamAccounts.update({
        where: { username: steamUsername },
        data: { loginKey },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to set login key for Steam account in database');
    }
  }

  static async setRunningStatus(steamUsername, isRunning) {
    try {
      return await prisma.steamAccounts.update({
        where: { username: steamUsername },
        data: { isRunning },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to set running status for Steam account in database');
    }
  }

  static async setGames(steamUsername, games) {
    try {
      return await prisma.steamAccounts.update({
        where: { username: steamUsername },
        data: { games: appIdsToBytes(games) },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to set games for Steam account in database');
    }
  }

  static async setOnlineStatus(steamUsername, onlineStatus) {
    try {
      return await prisma.steamAccounts.update({
        where: { username: steamUsername },
        data: { onlineStatus },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to set online status for Steam account in database');
    }
  }

  static async setSharedSecret(steamUsername, sharedSecret) {
    try {
      return await prisma.steamAccounts.update({
        where: { username: steamUsername },
        data: { sharedSecret },
      });
    } catch (error) {
      logger.error(error);
      throw new Error('Failed to set shared secret for Steam account in database');
    }
  }
}

module.exports = SteamAccount;

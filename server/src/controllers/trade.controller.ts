import { ethers } from "ethers";
import cron, { ScheduledTask } from "node-cron";
import { Request, Response } from "express";

import Wallet from "../models/wallet.model";
import { provider, approveToken, approveTokenOfWallets, createWallet, withdrawAll, tradingFunction } from "../utils/trade";
import { log } from "../utils/helper";
import CONFIG from "../config/config";

var task: ScheduledTask;

const approve = async (_: Request, res: Response) => {
  const logs = await approveToken();
  res.json(logs);
};

const create = async (_: Request, res: Response) => {
  const logs = await createWallet(5);
  res.json(logs);
};

const withdraw = async (_: Request, res: Response) => {
  const logs = await withdrawAll();
  res.json(logs);
};

const start = async (_: Request, res: Response) => {
  const logs: string[] = [];
  try {
    const ws = await Wallet.find({ deposited: true, withdrawn: false });

    if (ws.length === 0) {
      log(logs, 'No wallet created. Create wallet.');
    } else {
      const wallets = ws.map(w => new ethers.Wallet(w.privateKey, provider));

      const approveLogs = await approveTokenOfWallets(wallets);
      logs.push(...approveLogs);

      tradingFunction(wallets);
      task = cron.schedule(`*/${CONFIG.TRADE_INTERVAL_IN_MINUTE} * * * *`, () => {
        const randomDelay = Math.floor(Math.random() * CONFIG.TRADE_INTERVAL_IN_MINUTE * 60000);
        setTimeout(() => tradingFunction(wallets), randomDelay);
      });

      log(logs, 'Trading started.');
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) log(logs, err.message);
  } finally {
    return res.json(logs);
  }
};

const stop = async (_: Request, res: Response) => {
  if (task) task.stop();
  console.log('Trading stopped.');
  return res.json(['Trading stopped.']);
}

export { approve, create, withdraw, start, stop };
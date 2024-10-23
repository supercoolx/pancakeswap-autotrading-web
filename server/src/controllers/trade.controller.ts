import { ethers } from "ethers";
import cron, { ScheduledTask } from "node-cron";
import { Request, Response } from "express";

import Wallet from "../models/wallet.model";
import { provider, approveToken, approveTokenOfWallets, createWallet, withdrawAll, tradingFunction } from "../utils/trade";
import { log } from "../utils/helper";

import { startProcessing, stopProcessing, checkStatus } from "../middlewares/once.middleware";

var task: ScheduledTask | null = null;

const approve = async (_: Request, res: Response) => {
  startProcessing();
  const logs = await approveToken();
  res.json(logs);
  stopProcessing();
};

const create = async (req: Request, res: Response) => {
  startProcessing();
  const { count, minBNB, maxBNB, minToken, maxToken } = req.body;
  const logs = await createWallet(count, minBNB, maxBNB, minToken, maxToken);
  res.json(logs);
  stopProcessing();
};

const withdraw = async (_: Request, res: Response) => {
  startProcessing();
  const logs = await withdrawAll();
  res.json(logs);
  stopProcessing();
};

const start = async (req: Request, res: Response) => {
  startProcessing();
  if (task) return res.json(['Trading is running.']);
  const interval = Math.floor(req.body.interval);

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
      task = cron.schedule(`*/${interval} * * * *`, () => {
        const randomDelay = Math.floor(Math.random() * interval * 60000);
        setTimeout(() => tradingFunction(wallets), randomDelay);
      });

      log(logs, 'Trading started.');
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) log(logs, err.message);
    stopProcessing();
  } finally {
    return res.json(logs);
  }
};

const stop = async (_: Request, res: Response) => {
  stopProcessing();
  if (task) {
    task.stop();
    task = null;
    console.log('Trading stopped.');
    return res.json(['Trading stopped.']);
  } else {
    console.log('No trades run.');
    return res.json(['No trades run.']);
  }
}

const status = (_: Request, res: Response) => {
  res.json({ status: checkStatus() });
}

export { approve, create, withdraw, start, stop, status };
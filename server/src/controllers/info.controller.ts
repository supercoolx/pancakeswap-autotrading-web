import { ethers } from "ethers";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import Trade from "../models/trade.model";
import Wallet from "../models/wallet.model";
import { provider } from "../utils/trade";

const index = async (_: Request, res: Response) => {
  const owner = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const ownerBalance = await provider.getBalance(owner.address);

  const totalWalletCount = await Wallet.countDocuments();
  const tradeWalletCount = await Wallet.countDocuments({ deposited: true, withdrawn: false });
  
  const totalTradeCount = await Trade.countDocuments();

  res.json({
    ownerAddress: owner.address,
    ownerBalance: ethers.formatEther(ownerBalance),
    walletsCreated: totalWalletCount,
    walletsTrading: tradeWalletCount,
    totalTrades: totalTradeCount
  });
};

const wallets = async (_: Request, res: Response) => {
  const wallets = await Wallet.find({ deposited: true, withdrawn: false });
  res.json(wallets.map(wallet => wallet.address));
};

const trades = async (_: Request, res: Response) => {
  const trades = await Trade.find().sort({ createdAt: -1 }).limit(100).sort({ createdAt: 1 }).select('-_id address type transactionHash');
  res.json(trades.map(trade => trade.toJSON()));
};

export { index, wallets, trades };
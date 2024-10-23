import { ethers } from "ethers";
import { Request, Response } from "express";
import { provider } from "../utils/trade";

import Trade from "../models/trade.model";
import Wallet from "../models/wallet.model";

const index = async (_: Request, res: Response) => {
  const owner = new ethers.Wallet(process.env.PRIVATE_KEY!);
  // const ownerBalance = await provider.getBalance(owner.address);

  const totalWalletCount = await Wallet.countDocuments();
  const tradeWalletCount = await Wallet.countDocuments({ deposited: true, withdrawn: false });
  
  const totalTradeCount = await Trade.countDocuments();

  res.json({
    ownerAddress: owner.address,
    walletsCreated: totalWalletCount,
    walletsTrading: tradeWalletCount,
    totalTrades: totalTradeCount
  });
};

export { index };
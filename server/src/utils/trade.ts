import { ethers, MaxInt256 } from "ethers";

import Trade from "../models/trade.model";
import Wallet from "../models/wallet.model";

import address from "../config/address.json";
import routerABI from "../abi/router.json";
import tokenABI from "../abi/token.json";
import batchABI from "../abi/batch.json";

import { ConfigType } from "../models/config.model";

import { TradeType, NETWORK } from "./constants";
import { generateRandomValue, log } from "./helper";

export const provider = new ethers.JsonRpcProvider(`https://bsc-${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_KEY}`);

const routerAddress = address[process.env.NETWORK as NETWORK].router;
const wbnbAddress = address[process.env.NETWORK as NETWORK].wbnb;
const tokenAddress = address[process.env.NETWORK as NETWORK].token;
const batchAddress = address[process.env.NETWORK as NETWORK].batch;

const owner = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const batchContract = new ethers.Contract(batchAddress, batchABI, owner);

export const approveToken = async () => {
    const logs: string[] = [];
    try {
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, owner);
        const tx = await tokenContract.approve(batchAddress, MaxInt256);
        await Trade.create({
            address: owner.address,
            type: TradeType.Approve,
            bnbAmount: MaxInt256.toString(),
            transactionHash: tx.hash
        });
        await tx.wait();
        log(logs, `Token approved: ${tx.hash}`);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const createWallet = async (config: ConfigType) => {
    var logs: string[] = [];

    try {
        const balance = await provider.getBalance(owner);

        const wallets = new Array(config.walletCount).fill(0).map(() => {
            let wallet = ethers.Wallet.createRandom(provider);
            return wallet;
        });

        const fee = await provider.getFeeData();
        if (!fee.gasPrice) {
            log(logs, 'Cannot estimate gas price!.');
            return logs;
        }

        const params = wallets.map(wallet => {
            const address = wallet.address;
            const bnb = generateRandomValue(config.minBNB, config.maxBNB, 3);
            const token = generateRandomValue(config.minToken, config.maxToken, 0);
            const bnbInWei = ethers.parseUnits(bnb.toString(), 'ether');
            const tokenInWei = ethers.parseUnits(token.toString(), 'ether');

            return { address, bnb, bnbInWei, token, tokenInWei };
        });

        const bnbAmount = params.reduce((acc, cur) => acc + cur.bnbInWei, BigInt(0));
        if (bnbAmount > balance + ethers.parseUnits(config.txFee.toString(), 'ether')) {
            log(logs, 'Insufficient owner balance.');
            return logs;
        }

        const sendBNBTx = await batchContract.bnbTransfer(
            params.map(param => param.address),
            params.map(param => param.bnbInWei),
            { value: bnbAmount }
        );

        params.forEach(param => {
            log(logs, `${param.bnb} BNB, ${param.token} Token sent to ${param.address}`);
        });

        await Wallet.insertMany(wallets.map(wallet => ({ address: wallet.address, privateKey: wallet.privateKey, deposited: true })));

        Trade.create({
            address: owner.address,
            type: TradeType.Transfer,
            bnbAmount: bnbAmount.toString(),
            transactionHash: sendBNBTx.hash
        });
        log(logs, `BNB sent: ${sendBNBTx.hash}`);
        await sendBNBTx.wait();

        const tokenAmount = params.reduce((acc, cur) => acc + cur.tokenInWei, BigInt(0));
        const sendTokenTx = await batchContract.tokenTransfer(
            tokenAddress,
            params.map(param => param.address),
            params.map(param => param.tokenInWei)
        );
        Trade.create({
            address: owner.address,
            type: TradeType.Transfer,
            tokenAmount: tokenAmount.toString(),
            transactionHash: sendTokenTx.hash
        });
        log(logs, `Token sent: ${sendTokenTx.hash}`);
        await sendTokenTx.wait();
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const withdrawAll = async () => {
    const logs: string[] = [];

    try {
        const ws = await Wallet.find({ deposited: true, withdrawn: false });
        if (ws.length === 0) {
            log(logs, 'There\'s no wallet to withdraw.');
            return logs;
        }

        const wallets = ws.map(w => new ethers.Wallet(w.privateKey, provider));

        const fee = await provider.getFeeData();
        if (!fee.gasPrice) {
            log(logs, 'Cannot estimate gas price!.');
            return logs;
        }

        const returnTokenPromises = wallets.map(async (wallet, key) => {
            const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
            const balance = await tokenContract.balanceOf(wallet.address);

            if (balance === BigInt(0)) {
                ws[key].withdrawn = true;
                await ws[key].save();
                log(logs, `No tokens to return in ${wallet.address}`);
                return logs;
            }
            const tx = await tokenContract.transfer(owner.address, balance);
            await Trade.create({
                address: wallet.address,
                type: TradeType.Transfer,
                tokenAmount: balance.toString(),
                transactionHash: tx.hash
            });
            await Wallet.findOneAndUpdate(
                { address: wallet.address },
                { withdrawn: true }
            );
            log(logs, `${ethers.formatEther(balance)} token returned from ${wallet.address}`);
            await tx.wait();
        });
        await Promise.all(returnTokenPromises);

        const returnBNBPromises = wallets.map(async (wallet) => {
            const balance = await provider.getBalance(wallet.address);
            const returnBalance = balance - fee.gasPrice! * BigInt(21000);
            const param = {
                to: owner.address,
                value: returnBalance,
                gasLimit: 21000,
                gasPrice: fee.gasPrice
            };
            const tx = await wallet.sendTransaction(param);
            await Trade.create({
                address: wallet.address,
                type: TradeType.Transfer,
                bnbAmount: returnBalance.toString(),
                transactionHash: tx.hash
            });
            await Wallet.findOneAndUpdate(
                { address: wallet.address },
                { withdrawn: true }
            );
            log(logs, `${ethers.formatEther(returnBalance)} BNB returned from ${wallet.address}`);
            await tx.wait();
        });

        await Promise.all(returnBNBPromises);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const startBuyTrade = async (wallet: ethers.Wallet, config: ConfigType) => {
    const logs: string[] = [];
    try {
        const balanceInWei = await provider.getBalance(wallet.address);
        const txFeeInWei = ethers.parseUnits(config.txFee.toString(), 'ether');
        if (balanceInWei < txFeeInWei) return log(logs, 'Insufficient transaction fee.');

        const balance = parseFloat(ethers.formatEther(balanceInWei));
        const amountIn = config.bnbLimit <= 0 ? generateRandomValue(0, balance - config.txFee, 3) : Math.min(config.bnbLimit, generateRandomValue(0, balance - config.txFee, 3));

        if (amountIn === 0) {
            log(logs, 'No BNB to buy.');
            return logs;
        }

        const amountInWei = ethers.parseUnits(amountIn.toString(), 'ether');

        const fee = await provider.getFeeData();
        if (!fee.gasPrice) {
            log(logs, 'Cannot estimate gas price!.');
            return logs;
        }

        // Swap BNB to token
        const routerContract = new ethers.Contract(routerAddress, routerABI, wallet);
        const amountOut = await routerContract.getAmountsOut(amountInWei, [wbnbAddress, tokenAddress]);

        const deadline = ~~(Date.now() / 1000) + 3600 * 24;
        const tx = await routerContract.swapExactETHForTokens(0, [wbnbAddress, tokenAddress], wallet.address, deadline, { value: amountInWei });
        log(logs, `Address: ${wallet.address}\nSwapped ${amountIn} BNB to ${ethers.formatEther(amountOut[1])} Token: ${tx.hash}`);
        await Trade.create({
            address: wallet.address,
            type: TradeType.Buy,
            bnbAmount: amountInWei.toString(),
            transactionHash: tx.hash
        });
        await tx.wait();
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const startSellTrade = async (wallet: ethers.Wallet, config: ConfigType) => {
    const logs: string[] = [];
    try {
        const balance = await provider.getBalance(wallet.address);
        const txFeeInWei = ethers.parseUnits(config.txFee.toString(), 'ether');
        if (balance < txFeeInWei) {
            log(logs, 'Insufficient transaction fee.');
            return logs;
        }

        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
        const tokenBalanceInWei = await tokenContract.balanceOf(wallet.address);
        const tokenBalance = parseFloat(ethers.formatEther(tokenBalanceInWei));

        const amountIn = config.tokenLimit <= 0 ? generateRandomValue(0, tokenBalance) : Math.min(config.tokenLimit, generateRandomValue(0, tokenBalance));
        if (amountIn === 0) {
            log(logs, 'No tokens to sell.');
            return logs;
        }
        const amountInWei = ethers.parseUnits(amountIn.toString(), 'ether');

        const fee = await provider.getFeeData();
        if (!fee.gasPrice) {
            log(logs, 'Cannot estimate gas price!.');
            return logs;
        }

        // Swap token to BNB
        const routerContract = new ethers.Contract(routerAddress, routerABI, wallet);
        const amountOut = await routerContract.getAmountsOut(amountInWei, [tokenAddress, wbnbAddress]);

        const deadline = ~~(Date.now() / 1000) + 3600 * 24;
        const tx = await routerContract.swapExactTokensForETH(amountInWei, 0, [tokenAddress, wbnbAddress], wallet.address, deadline);
        log(logs, `Address: ${wallet.address}\nSwapped ${amountIn} Token to ${ethers.formatEther(amountOut[1])} BNB\n${tx.hash}`);
        await Trade.create({
            address: wallet.address,
            type: TradeType.Sell,
            tokenAmount: amountInWei.toString(),
            transactionHash: tx.hash
        });
        await tx.wait();
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const approveTokenOfWallets = async (wallets: ethers.Wallet[]) => {
    const logs: string[] = [];
    try {
        const promises = wallets.map(async (wallet) => {
            const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
            const tx = await tokenContract.approve(routerAddress, MaxInt256);
            await Trade.create({
                address: wallet.address,
                type: TradeType.Approve,
                bnbAmount: MaxInt256.toString(),
                transactionHash: tx.hash
            });
            await tx.wait();
            log(logs, `Token approved: ${tx.hash}`);
        });
        await Promise.all(promises);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) log(logs, err.message);
    } finally {
        return logs;
    }
}

export const tradingFunction = async (wallets: ethers.Wallet[], config: ConfigType) => {
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    if (Math.random() > 0.5) return startBuyTrade(wallet, config);
    else return startSellTrade(wallet, config);
}
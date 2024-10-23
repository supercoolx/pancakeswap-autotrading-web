import { useState, FormEvent } from "react";
import API from "../../utils/api";

const Actions = ({ appendLog }: { appendLog: (...logs: string[]) => void }) => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        count: 5,
        minBNB: 0.3,
        maxBNB: 0.5,
        minToken: 5000,
        maxToken: 10000,
        interval: 2,
    });

    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        setConfig({ ...config, [e.currentTarget.name]: parseFloat(e.currentTarget.value) });
    }

    const handleApprove = () => {
        setLoading(true);
        API.post('/trade/approve').then(res => {
            appendLog(...(res.data as string[]));
        }).catch(err => {
            console.error(err);
            appendLog(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleCreate = () => {
        setLoading(true);
        API.post('/trade/create', config).then(res => {
            appendLog(...(res.data as string[]));
        }).catch(err => {
            console.error(err);
            appendLog(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleWithdraw = () => {
        setLoading(true);
        API.post('/trade/withdraw').then(res => {
            appendLog(...(res.data as string[]));
        }).catch(err => {
            console.error(err);
            appendLog(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleStart = () => {
        setLoading(true);
        API.post('/trade/start', { interval: config.interval }).then(res => {
            appendLog(...(res.data as string[]));
        }).catch(err => {
            console.error(err);
            appendLog(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleStop = () => {
        setLoading(true);
        API.post('/trade/stop').then(res => {
            appendLog(...(res.data as string[]));
        }).catch(err => {
            console.error(err);
            appendLog(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div className="relative flex items-end col-span-2 gap-5 p-2 border border-slate-500">
            { loading && <div className="absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-sm">Please wait...</div> }
            <div className="w-full">
                <div className="font-bold text-center">Configuration</div>
                <div className="mt-2 ">
                    <div className="space-y-2">
                        <div className="flex gap-2" title="The count of wallet you are going to create.">
                            <div>Wallet count create:</div>
                            <div className="flex-1">
                                <input name="count" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.count} min={1} />
                            </div>
                        </div>
                        <div className="flex gap-2" title="The minimum BNB amount that you are going to send to created wallet for trading.">
                            <div>Min BNB amount to send per wallet:</div>
                            <div className="flex-1">
                                <input name="minBNB" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.minBNB} />
                            </div>
                        </div>
                        <div className="flex gap-2" title="The maximum BNB amount that you are going to send to created wallet for trading.">
                            <div>Max BNB amount to send per wallet:</div>
                            <div className="flex-1">
                                <input name="maxBNB" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.maxBNB} />
                            </div>
                        </div>
                        <div className="flex gap-2" title="The minimum Token amount that you are going to send to created wallet for trading.">
                            <div>Min Token amount to send per wallet:</div>
                            <div className="flex-1">
                                <input name="minToken" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.minToken} min={1} />
                            </div>
                        </div>
                        <div className="flex gap-2" title="The maximum BNB amount that you are going to send to created wallet for trading.">
                            <div>Max Token amount to send per wallet:</div>
                            <div className="flex-1">
                                <input name="maxToken" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.maxToken} min={1} />
                            </div>
                        </div>
                        <div className="flex gap-2" title="Trade will be done at random moment every this minutes.">
                            <div>Trading interval in minutes:</div>
                            <div className="flex-1">
                                <input name="interval" onChange={handleChange} className="w-full text-right border outline-none border-slate-500 invalid:border-red-500" type="number" value={config.interval} min={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start gap-2">
                <button disabled={loading} onClick={handleCreate} title="Create wallets and send random BNB and Tokens for trading." className="w-40 px-2 py-1 border border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400 disabled:border-slate-300">Create Wallet</button>
                <button disabled={loading} onClick={handleWithdraw} title="Return all BNB and tokens from created wallets." className="w-40 px-2 py-1 border border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400 disabled:border-slate-300">Withdraw Assets</button>
                <button disabled={loading} onClick={handleStart} title="Start auto trading. Buy or sell trade will be started at random time every interval on random wallet with random amount of BNB or Token." className="w-40 px-2 py-1 border border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400 disabled:border-slate-300">Start Trade</button>
                <button disabled={loading} onClick={handleStop} title="Stop auto trading. You can restart by click start button." className="w-40 px-2 py-1 border border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400 disabled:border-slate-300">Stop Trade</button>
                <button disabled={true} onClick={handleApprove} title="Approve tokens of owner wallet to batch transfer contract. BNB and tokens are distributed using batch transfer contract. No need if you once done." className="w-40 px-2 py-1 border border-slate-500 disabled:cursor-not-allowed disabled:text-slate-400 disabled:border-slate-300">Approve Tokens</button>
            </div>
        </div>
    )
}

export default Actions;
import { useState } from "react";
import API from "../../utils/api";

const Actions = ({ appendLog }: { appendLog: (...logs: string[]) => void }) => {
    const [loading, setLoading] = useState(false);

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
        API.post('/trade/create').then(res => {
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
        API.post('/trade/start').then(res => {
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
        <div className="flex justify-between">
            <button disabled={loading} onClick={handleCreate} className="px-2 py-1 border border-slate-500 disabled:cursor-not-allowed">Create Wallet</button>
            <button disabled={loading} onClick={handleWithdraw} className="px-2 py-1 border border-slate-500 disabled:cursor-not-allowed">Withdraw Assets</button>
            <button disabled={loading} onClick={handleStart} className="px-2 py-1 border border-slate-500 disabled:cursor-not-allowed">Start Trade</button>
            <button disabled={loading} onClick={handleStop} className="px-2 py-1 border border-slate-500 disabled:cursor-not-allowed">Stop Trade</button>
            <button disabled={loading} onClick={handleApprove} className="px-2 py-1 border border-slate-500 disabled:cursor-not-allowed">Approve Tokens</button>
        </div>
    )
}

export default Actions;
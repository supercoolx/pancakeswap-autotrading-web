import { useState, useEffect } from "react"
import API from "../utils/api";

import Actions from "../layout/Home/Actions"
import Logs from "../layout/Home/Logs"
import Info from "../layout/Home/Info";
import Wallets from "../layout/Home/Wallets";
import Transactions from "../layout/Home/Transactions";

const Home = () => {
  const [wallets, setWallets] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<{ address: string, type: string, transactionHash: string }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const appendLog = (...log: string[]) => setLogs(prev => [...prev, ...log, '--------------------------------------']);
  const clearLog = () => setLogs([]);

  const fetchWallets = () => {
    API.get('/info/wallets').then(res => setWallets(res.data)).catch(console.error);
  }
  const fetchTransactions = () => {
    API.get('/info/trades').then(res => setTransactions(res.data)).catch(console.error);
  }
  const fetchLogs = () => {
    API.get('/info/trades').then(res => setLogs(res.data.map((tx: { address: string, type: string, transactionHash: string }) => `${tx.type} ${tx.address} on ${tx.transactionHash}`))).catch(console.error);
  }
  
  useEffect(() => {
    fetchWallets();
    fetchTransactions();
    fetchLogs();
  }, []);

  return (
    <div className="px-5 mx-auto mt-5 containe">
      <Info />
      <div className="grid grid-cols-5 gap-5 mt-10">
        <Actions appendLog={appendLog} fetchWallets={fetchWallets} />
        <div className="grid grid-cols-2 col-span-3 gap-2 border border-slate-500">
          <Wallets wallets={wallets} fetchWallets={fetchWallets} />
          <Transactions transactions={transactions} fetchTransactions={fetchTransactions} />
        </div>
      </div>
      <hr className="my-5" />
      <div className="">
        <Logs logs={logs} clearLog={clearLog} />
      </div>
    </div>
  )
}

export default Home
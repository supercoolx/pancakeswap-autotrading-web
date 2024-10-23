import { IS_MAINNET } from "../../config/config";

const Transactions = ({ transactions, fetchTransactions }: { transactions: { address: string, type: string, transactionHash: string }[], fetchTransactions: () => void }) => {
    

    return (
        <div className="p-2">
            <div className="relative">
                <div className="font-bold text-center">Last { transactions.length } Transactions</div>
                <div onClick={fetchTransactions} className="absolute bottom-0 right-0 cursor-pointer">Refresh</div>
            </div>
            <div className="flex flex-col h-48 p-2 mt-2 overflow-auto border border-slate-500">
                { transactions.map((tx, key) => <a href={`https://${ IS_MAINNET ? '' : 'testnet.' }bscscan.com/tx/${tx.transactionHash}`} target="_blank" key={key} className="">{ tx.transactionHash }</a>) }
            </div>
        </div>
    )
}

export default Transactions;
import { IS_MAINNET } from "../../config/config";

const Wallets = ({ wallets, fetchWallets }: { wallets: string[], fetchWallets: () => void }) => {
    

    return (
        <div className="p-2">
            <div className="relative">
                <div className="font-bold text-center">Deposited wallets ({ wallets.length })</div>
                <div onClick={fetchWallets} className="absolute bottom-0 right-0 cursor-pointer">Refresh</div>
            </div>
            <div className="flex flex-col h-48 p-2 mt-2 overflow-auto border border-slate-500">
                { wallets.map((wallet, key) => <a href={`https://${ IS_MAINNET ? '' : 'testnet.' }bscscan.com/address/${wallet}`} target="_blank" key={key} className="cursor-pointer">{ wallet }</a>) }
            </div>
        </div>
    )
}

export default Wallets;
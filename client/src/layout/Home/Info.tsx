import { useState, useEffect } from "react";

import API from "../../utils/api";

type InfoType = {
    ownerAddress?: string
    ownerBalance?: string
    walletsCreated?: string
    walletsTrading?: string
    totalTrades?: string
}

const Info = () => {
    const [info, setInfo] = useState<InfoType>({});

    useEffect(() => {
        API.get('/info').then(res => setInfo(res.data)).catch(console.error);
    }, []);

    return (
        <div className="">
            <div className="flex gap-5">
                <a href={`https://testnet.bscscan.com/address/${info.ownerAddress}`} target="_blank" className="cursor-pointer">Owner address: <span className="text-blue-500">{ info.ownerAddress }</span></a>
                <div className="">Owner balance: { parseFloat(info.ownerBalance ?? '0').toFixed(5) } BNB</div>
            </div>
            <div className="flex gap-5">
                <div className="">Total created wallet: { info.walletsCreated }</div>
                <div className="">Currently deposited wallet: { info.walletsTrading }</div>
                <div className="">Total transactions: { info.totalTrades }</div>
            </div>
        </div>
    )
}

export default Info;
import { useState, useEffect } from "react";

import API from "../../utils/api";

type InfoType = {
    ownerAddress?: string
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
        <div className="grid grid-cols-2 mt-10">
            <div className="">Owner address:</div>
            <div> { info.ownerAddress }</div>
            <div className="">Total created wallet:</div>
            <div> { info.walletsCreated }</div>
            <div className="">Currently trading wallet:</div>
            <div> { info.walletsTrading }</div>
            <div className="">Total trades:</div>
            <div> { info.totalTrades }</div>
        </div>
    )
}

export default Info;
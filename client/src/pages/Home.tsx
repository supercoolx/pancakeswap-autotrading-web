import { useState } from "react"

import Actions from "../layout/Home/Actions"
import Logs from "../layout/Home/Logs"
import Info from "../layout/Home/Info";

const Home = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const appendLog = (...log: string[]) => setLogs(prev => [...prev, ...log, '--------------------------------------']);
  const clearLog = () => setLogs([]);

  return (
    <div className="container grid grid-cols-2 gap-10 px-5 mx-auto mt-10">
      <div className="">
        <Actions appendLog={appendLog} />
        <Info />
      </div>
      <div className="">
        <Logs logs={logs} clearLog={clearLog} />
      </div>
    </div>
  )
}

export default Home
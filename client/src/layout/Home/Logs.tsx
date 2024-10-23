import { useEffect, useRef } from "react";

const Logs = ({ logs, clearLog }: { logs: string[], clearLog: () => void }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null!);

    useEffect(() => {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <span>Logs:</span>
                <button onClick={clearLog} className="px-2 border border-slate-500">Clear</button>
            </div>
            <textarea ref={textareaRef} className="mt-2 w-full resize-none border border-slate-500 h-[300px] outline-none p-2" readOnly value={logs.join('\n')} />
        </div>
    )
}

export default Logs;
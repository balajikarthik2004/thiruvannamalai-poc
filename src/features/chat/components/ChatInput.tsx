import { useTranslation } from "react-i18next";
import { Mic, Send } from "lucide-react";

export function ChatInput({ input, setInput, send }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="fixed lg:sticky bottom-16 lg:bottom-0 inset-x-0 bg-white border-t border-border p-3 lg:p-4 z-30">
      <div className="max-w-2xl mx-auto flex items-center gap-2 bg-secondary rounded-full border border-border/80 shadow-sm px-4 py-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send(input)} placeholder={tStr("Ask about any temple...")} className="flex-1 bg-transparent outline-none text-lg text-white placeholder:text-white/70" />
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"><Mic className="w-5 h-5" /></button>
        <button onClick={() => send(input)} className="w-10 h-10 rounded-full gradient-saffron text-white flex items-center justify-center hover:scale-105 transition-transform"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
}

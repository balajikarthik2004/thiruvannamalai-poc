import { useTranslation } from "react-i18next";
import { Msg } from "../types";

export function ChatMessages({ messages, typing, endRef, send }: any) {
  const { t: tStr } = useTranslation();

  const quick = [
    "Best time to visit Tiruvannamalai today?",
    "Is Meenakshi crowded now?",
    "Which temple has least crowd today?",
    "Pooja timings for Kapaleeshwarar",
    "When is Karthigai Deepam?",
    "Girivalam route and Ashta Lingams",
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 pb-32 lg:pb-4 bg-background">
      {messages.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-10">
          <div className="w-20 h-20 mx-auto rounded-full gradient-saffron flex items-center justify-center text-white font-serif text-4xl">ॐ</div>
          <h2 className="font-serif text-3xl font-semibold mt-4">{tStr("Vanakkam! 🙏")}</h2>
          <p className="text-muted-foreground mt-1">{tStr("I'm your personal temple guide. Ask me anything:")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {quick.map(q => (
              <button key={q} onClick={() => send(q)} className="text-base rounded-full bg-white border border-border px-3.5 py-2 hover:border-saffron/40">{tStr(q)}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((m: Msg, i: number) => (
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"} fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-base ${m.role==="user"?"bg-user-bg rounded-br-md":"bg-ai-bg rounded-bl-md"}`}>
                <div className="whitespace-pre-wrap">{m.role === "user" ? tStr(m.text) : m.text}</div>
                {m.card}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-ai-bg rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-saffron typing-dot"/>
                <span className="w-2 h-2 rounded-full bg-saffron typing-dot" style={{ animationDelay: "0.15s" }}/>
                <span className="w-2 h-2 rounded-full bg-saffron typing-dot" style={{ animationDelay: "0.3s" }}/>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}

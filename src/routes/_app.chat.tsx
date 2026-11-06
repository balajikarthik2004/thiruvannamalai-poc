import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Msg } from "@/features/chat/types";
import { generateReply } from "@/features/chat/utils/generateReply";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatMessages } from "@/features/chat/components/ChatMessages";
import { ChatInput } from "@/features/chat/components/ChatInput";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Temple Assistant — OMG Smart Temple" }] }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { t: tStr } = useTranslation();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(text, tStr);
      setMessages(m => [...m, reply]);
      setTyping(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col h-[100dvh] lg:h-screen">
      <ChatHeader />
      <ChatMessages messages={messages} typing={typing} endRef={endRef} send={send} />
      <ChatInput input={input} setInput={setInput} send={send} />
    </div>
  );
}

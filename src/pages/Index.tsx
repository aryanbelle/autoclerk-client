import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatMessage, ChatMessageProps } from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useParams, useNavigate } from "react-router-dom";

export default function Index() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [allChatSessions, setAllChatSessions] = useState<Array<{ id: number; title: string; date: string; messages: Array<{role: string, content: string}> }>>(() => {
    const savedSessions = localStorage.getItem('allChatSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  const [currentChatSessionId, setCurrentChatSessionId] = useState<number | null>(null);

  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      const id = parseInt(chatId);
      const session = allChatSessions.find(s => s.id === id);
      if (session) {
        setCurrentChatSessionId(id);
        setMessages(session.messages);
        setStarted(session.messages.length > 0);
      } else {
        // If chat ID in URL doesn't exist, navigate to a new chat
        handleNewChat();
      }
    } else if (allChatSessions.length > 0) {
      // If no chat ID in URL and there are saved sessions, load the first one
      setCurrentChatSessionId(allChatSessions[0].id);
      setMessages(allChatSessions[0].messages);
      setStarted(allChatSessions[0].messages.length > 0);
      navigate(`/chat/${allChatSessions[0].id}`);
    } else {
      // If no chat ID in URL and no saved sessions, ensure welcome screen is shown
      setMessages([]);
      setStarted(false);
      setCurrentChatSessionId(null);
    }
  }, [chatId, allChatSessions.length]); // Only depend on allChatSessions.length to avoid infinite loops

  useEffect(() => {
    if (messages.length > 0 && currentChatSessionId !== null) {
      setAllChatSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentChatSessionId ? { ...session, messages: messages } : session
        )
      );
    } else if (messages.length > 0 && currentChatSessionId === null) {
      // This handles the case where a user starts typing without explicitly clicking new chat
      const newSession = {
        id: Date.now(),
        title: messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? "..." : ""), // Use first message as title
        date: new Date().toLocaleDateString(),
        messages: messages,
      };
      setAllChatSessions(prevSessions => [...prevSessions, newSession]);
      setCurrentChatSessionId(newSession.id);
      navigate(`/chat/${newSession.id}`);
    }
  }, [messages]);

  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = async (prompt: string) => {
    if (!started) setStarted(true);
    
    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    
    setLoading(true);
    await sendToBackend(newMessages);
  };

  const sendToBackend = async (currentMessages: Array<{role: string, content: string}>) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentMessages[currentMessages.length - 1].content, history: currentMessages }), // Pass current messages as history
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Add assistant message to state and save to localStorage
      setMessages((prev) => {
        const newMessages = [...prev, { role: "assistant", content: data.response }];
        return newMessages;
      });
    } catch (error) {
      console.error("Error sending message to backend:", error);
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          { role: "assistant", content: "Error: Could not get a response from the AI." },
        ];
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setStarted(false);
    setCurrentChatSessionId(null);
    localStorage.removeItem('chatMessages'); // Clear old single chat message history
  };

  const handleSelectChat = (id: number) => {
    const session = allChatSessions.find(s => s.id === id);
    if (session) {
      setCurrentChatSessionId(id);
      setMessages(session.messages);
      setStarted(session.messages.length > 0);
      navigate(`/chat/${id}`);
    }
  };

  const handleDeleteChat = (id: number) => {
    setAllChatSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(session => session.id !== id);
      if (currentChatSessionId === id) {
        handleNewChat();
      }
      return updatedSessions;
    });
  };

  useEffect(() => {
    localStorage.setItem('allChatSessions', JSON.stringify(allChatSessions));
  }, [allChatSessions]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full relative">
        <div className="sidebar-wrapper">
          <AppSidebar 
            onNewChat={handleNewChat} 
            onSelectChat={handleSelectChat} 
            onDeleteChat={handleDeleteChat}
            chatHistory={allChatSessions.map(session => ({ id: session.id, title: session.title, date: session.date }))}
          />
        </div>
        <SidebarInset className="flex-1 content-wrapper">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Modern AI Chat</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex flex-col h-[calc(100vh-3.5rem)] relative">
            {!started ? (
              <section className="flex-1 grid place-items-center px-4">
                <div className="w-full max-w-2xl text-center animate-fade-in">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Hi, Aryan 👋</h1>
                  <p className="text-muted-foreground mb-8">Type your prompt and press Enter to start chatting.</p>
                  <div className="flex items-center gap-2 rounded-full border border-input bg-card/80 backdrop-blur px-2 py-1 shadow-[var(--shadow-elev-1)]">
                    <div className="px-3 text-muted-foreground"><Sparkles className="h-5 w-5" aria-hidden /></div>
                    <input
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLInputElement;
                          const text = target.value.trim();
                          if (text) {
                            handleSend(text);
                            target.value = "";
                          }
                        }
                      }}
                      placeholder="Ask anything..."
                      className="h-12 flex-1 rounded-full bg-transparent outline-none text-base"
                      aria-label="Initial prompt"
                    />
                    <Button variant="hero" size="pill" onClick={() => setStarted(true)}>Start</Button>
                  </div>
                </div>
              </section>
            ) : (
              <>
                <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="w-full max-w-2xl md:max-w-3xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground">Say hello to start the conversation.</div>
                    ) : (
                      messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)
                    )}
                  </div>
                </div>

                <div className="px-4 pb-6 sticky bottom-0 bg-background/80 backdrop-blur">
                  <div className="w-full max-w-2xl md:max-w-3xl mx-auto">
                    <ChatInput onSend={handleSend} disabled={loading} />
                  </div>
                </div>
              </>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

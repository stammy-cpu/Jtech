import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  messageText: string;
  isAdminMessage: boolean;
  createdAt: string;
}

export default function UserMessageModal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: ["/api/messages/user"],
    enabled: isOpen && !!user && !user.isAdmin,
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!user || user.isAdmin) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/messages", { messageText: message });
      setMessage("");
      toast({ title: "Success", description: "Message sent to JTECH!" });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/user"] });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send message", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
        data-testid="button-message-float"
        title="Message JTECH"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute w-2 h-2 bg-chart-2 rounded-full animate-pulse -top-1 -right-1" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          data-testid="modal-backdrop"
        />
      )}

      {/* Modal */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
              <h3 className="font-bold text-lg">Chat with JTECH</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    Hi <span className="font-semibold text-primary">{user.username}</span>! Drop us a message and we'll get back to you shortly.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdminMessage ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.isAdminMessage 
                        ? 'bg-muted border border-primary/20' 
                        : 'bg-gradient-to-r from-primary to-chart-1 text-white'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {msg.isAdminMessage ? 'JTECH Admin' : 'You'}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.messageText}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/10">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-lg bg-muted border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  data-testid="textarea-message"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-primary to-chart-1 text-white self-end"
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}

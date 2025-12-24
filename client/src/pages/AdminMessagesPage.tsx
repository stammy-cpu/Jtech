import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFloatingMessages from "@/components/AdminFloatingMessages";

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  messageText: string;
  isAdminMessage: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [replyText, setReplyText] = useState("");
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  if (!user?.isAdmin) {
    navigate("/home");
    return null;
  }

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSender) return;

    try {
      await apiRequest("POST", "/api/messages/reply", { 
        messageText: replyText,
        recipientId: selectedSender
      });
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Success", description: "Reply sent!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send reply", variant: "destructive" });
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.senderId]) {
      acc[msg.senderId] = [];
    }
    acc[msg.senderId].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const sendersList = Object.entries(groupedMessages);

  return (
    <>
      <AdminNavbar />
      <AdminFloatingMessages />
      <div className="min-h-screen bg-background pt-24">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Messages from Users
          </h1>
          <p className="text-muted-foreground mt-2">Manage all customer messages in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Senders List */}
          <div className="lg:col-span-1">
            <Card className="border-primary/20">
              <div className="p-4 border-b border-primary/10">
                <h2 className="font-bold text-lg">Conversations ({sendersList.length})</h2>
              </div>
              <div className="divide-y divide-primary/10 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : sendersList.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">No messages yet</div>
                ) : (
                  sendersList.map(([senderId, senderMessages]) => (
                    <button
                      key={senderId}
                      onClick={() => setSelectedSender(senderId)}
                      className={`w-full p-4 text-left hover:bg-primary/5 transition-colors ${
                        selectedSender === senderId ? "bg-primary/10 border-l-4 border-primary" : ""
                      }`}
                      data-testid={`button-sender-${senderMessages[0].senderUsername}`}
                    >
                      <p className="font-semibold text-primary">{senderMessages[0].senderUsername}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {senderMessages[0].messageText}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(senderMessages[0].createdAt), { addSuffix: true })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedSender && groupedMessages[selectedSender] ? (
              <Card className="border-primary/20 h-[600px] flex flex-col">
                <div className="p-4 border-b border-primary/10">
                  <p className="font-bold text-lg">{groupedMessages[selectedSender][0].senderUsername}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {groupedMessages[selectedSender]
                    .slice()
                    .reverse()
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdminMessage ? "justify-end" : "justify-start"}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.isAdminMessage
                              ? "bg-gradient-to-r from-primary to-chart-1 text-white rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{msg.messageText}</p>
                          <p className={`text-xs mt-1 ${msg.isAdminMessage ? "text-white/70" : "text-muted-foreground"}`}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t border-primary/10 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 rounded-2xl bg-muted border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="input-admin-reply"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="px-4 bg-gradient-to-r from-primary to-chart-1"
                    size="icon"
                    data-testid="button-send-reply"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-primary/20 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Select a conversation to reply</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot } from "lucide-react";

interface Message {
  text: string;
  isBot: boolean;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await apiRequest("POST", "/api/help/chat", { question });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    chatMutation.mutate(input);
    setInput("");
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                message.isBot ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.isBot
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100"
                }`}
              >
                {message.isBot && (
                  <Bot className="h-5 w-5 mb-1" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 animate-pulse" />
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <CardContent className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={chatMutation.isPending}
          />
          <Button 
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your FIDEERS AI assistant. I'm here to help you with your fitness journey. Feel free to ask me about nutrition, workouts, or any health-related questions!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);

    // Simulate bot response (placeholder)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: "Thanks for your message! This is a placeholder response. The AI integration will be implemented soon to provide personalized fitness and nutrition guidance.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Chat Assistant</h1>
        <p className="text-muted-foreground">Get personalized fitness and nutrition guidance</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>FIDEERS AI Assistant</span>
          </CardTitle>
          <CardDescription>
            Ask questions about nutrition, workouts, or your fitness goals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[80%] space-x-2 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about fitness, nutrition, or your goals..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Nutrition Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized meal suggestions and macro adjustments based on your goals.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Workout Advice</h3>
            <p className="text-sm text-muted-foreground">
              Receive exercise modifications and progression tips tailored to your fitness level.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Progress Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get insights on your progress and recommendations for staying on track.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Notice */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">AI Integration Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This chat interface is ready for AI integration. The system will provide personalized 
              fitness and nutrition guidance based on your profile, goals, and progress data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
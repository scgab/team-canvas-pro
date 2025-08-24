import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m here to help you with any questions about the platform. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'d be happy to help! You can find more detailed assistance in our Help Center, or feel free to ask me specific questions about using the platform.';
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('task')) {
      return 'For project and task management, you can use the Projects page to create new projects, add tasks, and track progress. Would you like me to guide you through any specific feature?';
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('member')) {
      return 'You can manage your team members from the Team page. There you can invite new members, assign roles, and manage permissions.';
    }
    
    if (lowerMessage.includes('shift') || lowerMessage.includes('schedule')) {
      return 'For shift planning and scheduling, check out the Shift Planning page where you can create shifts, manage availability, and view the team calendar.';
    }
    
    if (lowerMessage.includes('calendar')) {
      return 'The Calendar view helps you see all your tasks, shifts, and meetings in one place. You can also integrate with Google Calendar for better synchronization.';
    }
    
    if (lowerMessage.includes('subscription') || lowerMessage.includes('billing')) {
      return 'For subscription and billing information, visit the Subscription page where you can view your current plan and make changes.';
    }
    
    return 'Thanks for your question! For detailed assistance, please visit our Help Center or contact our support team. Is there anything specific about the platform I can help you with?';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-custom-lg",
              "bg-primary hover:bg-primary-dark",
              "text-primary-foreground",
              "transition-all duration-200 hover:scale-105"
            )}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open chat</span>
          </Button>
        )}

        {/* Chat Interface */}
        {isOpen && (
          <Card className={cn(
            "w-80 h-96 flex flex-col",
            "shadow-custom-lg border-border bg-card"
          )}>
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b border-border",
              "bg-primary text-primary-foreground rounded-t-lg"
            )}>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Chat with Us</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-primary-dark text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ChatBot;
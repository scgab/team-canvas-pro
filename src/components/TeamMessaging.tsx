import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, User } from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface TeamMessagingProps {
  currentUser: string;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export function TeamMessaging({ currentUser, teamMembers }: TeamMessagingProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMember) return;

    const message: Message = {
      id: Date.now().toString(),
      from: currentUser,
      to: selectedMember,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
  };

  const getConversationMessages = (memberId: string) => {
    return messages.filter(
      msg => 
        (msg.from === currentUser && msg.to === memberId) ||
        (msg.from === memberId && msg.to === currentUser)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const selectedMemberData = teamMembers.find(m => m.id === selectedMember);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Team Members List */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamMembers.map(member => (
              <Button
                key={member.id}
                variant={selectedMember === member.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedMember(member.id)}
              >
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2 bg-gradient-card shadow-custom-card">
        <CardHeader>
          <CardTitle>
            {selectedMemberData ? `Chat with ${selectedMemberData.name}` : "Select a team member"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex flex-col">
          {selectedMember ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {getConversationMessages(selectedMember).map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === currentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.from === currentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a team member to start messaging</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";
import { useUserColors } from "@/components/UserColorContext";
import { Send, User, Paperclip, Download, File, Image, X } from "lucide-react";

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Message {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  content: string;
  timestamp: Date;
  read: boolean;
  files?: FileAttachment[];
  deliveryStatus: 'sent' | 'delivered' | 'read';
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
  const { getColorByEmail } = useUserColors();
  const { messages, sendMessage: sendSharedMessage } = useSharedData();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user data
  const currentUserData = teamMembers.find(m => m.name === currentUser);
  const currentUserEmail = currentUserData?.email || currentUser;

  const handleFileUpload = (files: File[]) => {
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can only attach up to 5 files per message.",
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum file size is 10MB.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const sendMessage = (senderId: string, senderEmail: string, receiverId: string, receiverEmail: string, content: string, files?: FileAttachment[]) => {
    // Use the shared message sender
    sendSharedMessage(senderEmail, receiverEmail, content);
    
    return {
      id: Date.now().toString(),
      from: senderId,
      fromEmail: senderEmail,
      to: receiverId,
      toEmail: receiverEmail,
      content: content,
      timestamp: new Date(),
      read: false,
      files: files,
      deliveryStatus: 'sent' as const
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!selectedMember) return;

    const selectedMemberData = teamMembers.find(m => m.id === selectedMember);
    if (!selectedMemberData) return;

    // Create file attachments
    const fileAttachments: FileAttachment[] = selectedFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // In real app, upload to server
    }));

    const message = sendMessage(
      currentUser,
      currentUserEmail,
      selectedMemberData.name,
      selectedMemberData.email,
      newMessage.trim(),
      fileAttachments.length > 0 ? fileAttachments : undefined
    );

    setNewMessage("");
    setSelectedFiles([]);

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedMemberData.name}.`,
    });
  };

  const getUserMessages = (user1: string, user1Email: string, user2: string, user2Email: string) => {
    return messages.filter(msg => 
      (msg.senderId === user1Email && msg.receiverId === user2Email) ||
      (msg.senderId === user2Email && msg.receiverId === user1Email)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getConversationMessages = (memberId: string) => {
    const selectedMemberData = teamMembers.find(m => m.id === memberId);
    if (!selectedMemberData) return [];

    return getUserMessages(
      currentUser,
      currentUserEmail,
      selectedMemberData.name,
      selectedMemberData.email
    );
  };

  const getUnreadCount = (memberId: string) => {
    const selectedMemberData = teamMembers.find(m => m.id === memberId);
    if (!selectedMemberData) return 0;

    return messages.filter(
      msg => 
        !msg.read && 
        (msg.senderId === selectedMemberData.email && msg.receiverId === currentUserEmail)
    ).length;
  };

  const markMessagesAsRead = (memberId: string) => {
    const selectedMemberData = teamMembers.find(m => m.id === memberId);
    if (!selectedMemberData) return;
    
    // For now, just mark as read in the UI - in a real app, you'd update the shared state
    console.log('Marking messages as read for:', selectedMemberData.email);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId);
    markMessagesAsRead(memberId);
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
            {teamMembers.map(member => {
              const unreadCount = getUnreadCount(member.id);
              const memberColor = getColorByEmail(member.email);
              
              return (
                <Button
                  key={member.id}
                  variant={selectedMember === member.id ? "default" : "ghost"}
                  className="w-full justify-start relative"
                  onClick={() => handleMemberSelect(member.id)}
                >
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarFallback 
                      className={`${memberColor.avatar} text-white`}
                      style={{ backgroundColor: memberColor.primary }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="bg-destructive text-white text-xs ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
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
                <div className="space-y-4 p-2">
                  {getConversationMessages(selectedMember).map(message => {
                    const isCurrentUser = message.senderId === currentUserEmail;
                    const senderColor = getColorByEmail(message.senderId);
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-xs space-y-2">
                          {/* Message bubble */}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-muted text-foreground'
                            }`}
                            style={isCurrentUser ? {} : { backgroundColor: `${senderColor.primary}20`, borderLeft: `3px solid ${senderColor.primary}` }}
                          >
                            {message.content && (
                              <div className="text-sm">{message.content}</div>
                            )}
                            
                             {/* Note: File attachments removed for simplification */}
                            
                             <div className="flex justify-between items-center text-xs opacity-70 mt-1">
                               <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                               {isCurrentUser && (
                                 <span className="ml-2 text-primary">✓✓</span>
                               )}
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* File attachments preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 p-3 bg-muted/20 rounded border">
                  <div className="text-xs font-medium text-muted-foreground">Attachments:</div>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <File className="w-3 h-3" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div
                className={`border-2 border-dashed rounded-lg p-3 transition-colors ${
                  isDragOver ? 'border-primary bg-primary/10' : 'border-transparent'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message... (or drag files here)"
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(Array.from(e.target.files));
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {isDragOver && (
                  <div className="text-center text-sm text-primary mt-2">
                    Drop files here to attach them
                  </div>
                )}
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
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersistedState } from "@/hooks/useDataPersistence";
import { useUserColors } from "@/components/UserColorContext";
import { 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Users, 
  Bell,
  X,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'project' | 'task' | 'calendar' | 'team' | 'file';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  fromUser?: string;
  fromEmail?: string;
  actionUrl?: string;
}

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: string;
}

export function NotificationPanel({ open, onOpenChange, currentUser }: NotificationPanelProps) {
  const { getColorByEmail } = useUserColors();
  const [notifications, setNotifications] = usePersistedState<Notification[]>('notifications', [
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from team member',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      fromUser: 'HNA User',
      fromEmail: 'hna@scandac.com'
    },
    {
      id: '2',
      type: 'project',
      title: 'Project Update',
      description: 'Project "Mobile App Redesign" status changed to In Progress',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Upcoming Meeting',
      description: 'Team standup meeting in 30 minutes',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'project': return <FileText className="w-4 h-4" />;
      case 'task': return <CheckCircle2 className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-50" onClick={() => onOpenChange(false)}>
      <div 
        className="absolute right-4 top-16 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-gradient-card shadow-custom-card border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {getUnreadCount() > 0 && (
                  <Badge className="bg-destructive text-white">
                    {getUnreadCount()}
                  </Badge>
                )}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={getUnreadCount() === 0}
                >
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map(notification => {
                    const senderColor = notification.fromEmail ? getColorByEmail(notification.fromEmail) : null;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer border-b ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.actionUrl) {
                            // Navigate to action URL
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {notification.fromEmail ? (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback 
                                  className="text-white text-xs"
                                  style={{ backgroundColor: senderColor?.primary }}
                                >
                                  {notification.fromUser?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{notification.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {notification.description}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatTimestamp(notification.timestamp)}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
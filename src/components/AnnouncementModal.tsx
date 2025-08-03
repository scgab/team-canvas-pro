import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, Users, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  author: string;
  authorEmail: string;
  createdAt: Date;
  recipients: 'all' | 'team' | 'managers';
}

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnnouncementSent: (announcement: Announcement) => void;
}

export function AnnouncementModal({ open, onOpenChange, onAnnouncementSent }: AnnouncementModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    recipients: 'all' as const
  });

  const handleSendAnnouncement = async () => {
    if (!announcement.title.trim() || !announcement.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to send announcements.',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);

    try {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        author: user.user_metadata?.full_name || user.email || 'Unknown User',
        authorEmail: user.email,
        createdAt: new Date(),
        recipients: announcement.recipients
      };

      // Send email notifications via edge function
      const { data, error } = await supabase.functions.invoke('send-announcement', {
        body: {
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          author: newAnnouncement.author,
          authorEmail: newAnnouncement.authorEmail,
          recipients: announcement.recipients
        }
      });

      if (error) {
        throw error;
      }

      onAnnouncementSent(newAnnouncement);

      // Reset form
      setAnnouncement({
        title: '',
        content: '',
        type: 'info',
        recipients: 'all'
      });

      onOpenChange(false);

      const emailCount = data?.emailsSent || 0;
      toast({
        title: '📧 Announcement Sent!',
        description: `Your announcement has been sent to ${emailCount} team member${emailCount !== 1 ? 's' : ''} via email.`,
        duration: 5000
      });
    } catch (error: any) {
      console.error('Error sending announcement:', error);
      toast({
        title: 'Failed to Send Announcement',
        description: error.message || 'There was an error sending the announcement.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-primary';
      case 'warning': return 'bg-warning';
      case 'success': return 'bg-success';
      case 'urgent': return 'bg-destructive';
      default: return 'bg-primary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Send Team Announcement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="announcement-title">Title *</Label>
            <Input
              id="announcement-title"
              value={announcement.title}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
            />
          </div>
          
          <div>
            <Label htmlFor="announcement-content">Message *</Label>
            <Textarea
              id="announcement-content"
              value={announcement.content}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your announcement message..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="announcement-type">Type</Label>
              <Select value={announcement.type} onValueChange={(value: any) => setAnnouncement(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Information
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Warning
                    </div>
                  </SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="announcement-recipients">Recipients</Label>
              <Select value={announcement.recipients} onValueChange={(value: any) => setAnnouncement(prev => ({ ...prev, recipients: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      All Team Members
                    </div>
                  </SelectItem>
                  <SelectItem value="team">Team Members</SelectItem>
                  <SelectItem value="managers">Managers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Preview */}
          <div className="border rounded-lg p-3 bg-muted/20">
            <Label className="text-xs text-muted-foreground">Preview:</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`${getTypeColor(announcement.type)} text-white`}>
                  {getTypeIcon(announcement.type)}
                  {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                </Badge>
              </div>
              <h4 className="font-medium">{announcement.title || 'Announcement Title'}</h4>
              <p className="text-sm text-muted-foreground">{announcement.content || 'Announcement content will appear here...'}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAnnouncement} disabled={isSending}>
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send Announcement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
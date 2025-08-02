import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Crown } from 'lucide-react';

export const AdminInviteButton = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendAdminInvite = async () => {
    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-invite', {
        body: {
          email: 'hassan@quartz.org',
          adminLevel: 'full'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "✨ Admin Invite Sent!",
          description: "Full admin access email sent to hassan@quartz.org with unlimited team capabilities.",
          duration: 5000
        });
      } else {
        throw new Error(data.error || 'Failed to send invite');
      }
    } catch (error: any) {
      console.error('Error sending admin invite:', error);
      toast({
        title: "Failed to Send Invite",
        description: error.message || "There was an error sending the admin invitation.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button 
      onClick={sendAdminInvite}
      disabled={isSending}
      className="gap-2"
      variant="default"
    >
      {isSending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Sending...
        </>
      ) : (
        <>
          <Crown className="h-4 w-4" />
          <Mail className="h-4 w-4" />
          Send Admin Invite
        </>
      )}
    </Button>
  );
};
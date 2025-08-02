import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Crown } from 'lucide-react';

export const AdminInviteButton = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendAdminInvite = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation to.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-invite', {
        body: {
          email: email.trim(),
          adminLevel: 'full'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "✨ Admin Invite Sent!",
          description: `Full admin access email sent to ${email} with unlimited team capabilities.`,
          duration: 5000
        });
        setEmail(''); // Clear the input after successful send
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email Address</Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSending) {
              sendAdminInvite();
            }
          }}
        />
      </div>
      
      <Button 
        onClick={sendAdminInvite}
        disabled={isSending || !email.trim()}
        className="gap-2 w-full"
        variant="default"
      >
        {isSending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Sending Invitation...
          </>
        ) : (
          <>
            <Crown className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            Send Admin Invite
          </>
        )}
      </Button>
    </div>
  );
};
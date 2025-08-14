import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function N8NWebhookTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      const testPayload = {
        meetingId: "test-123",
        title: "Test Meeting from Lovable",
        date: new Date().toISOString().split('T')[0],
        time: "14:00",
        end_time: "15:00",
        attendees: ["test@example.com"],
        createdBy: "test-user",
        location: "Virtual",
        agenda: ["Test agenda item"],
        source: "test",
        timestamp: new Date().toISOString()
      };

      console.log('Sending test payload:', testPayload);

      const { data, error } = await supabase.functions.invoke('forward-n8n-meeting', {
        body: testPayload
      });

      console.log('Response from edge function:', { data, error });

      if (error) {
        toast.error(`Error: ${error.message}`);
        setLastResponse({ error });
      } else {
        toast.success('Test payload sent successfully!');
        setLastResponse(data);
      }
    } catch (err: any) {
      console.error('Test failed:', err);
      toast.error(`Test failed: ${err.message}`);
      setLastResponse({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>N8N Webhook Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Target URL: https://wheewls.app.n8n.cloud/webhook/webhook-test/a8ad0817-3fd7-4465-a7f4-4cccc7d0a40c
          </p>
          <Button 
            onClick={testWebhook} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Test Payload to N8N'}
          </Button>
        </div>
        
        {lastResponse && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Last Response:</h3>
            <pre className="bg-muted p-3 rounded-md text-sm overflow-auto">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <h4 className="font-semibold">Troubleshooting Tips:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure your N8N workflow is <strong>active</strong></li>
            <li>Check Google Calendar authentication in your workflow</li>
            <li>Verify Gmail authentication for sending messages</li>
            <li>Check if the webhook node is configured correctly</li>
            <li>Look at N8N execution logs for errors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OAuthTroubleshooting = () => {
  const { toast } = useToast();
  const currentOrigin = window.location.origin;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text copied successfully"
    });
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  const openGoogleConsentScreen = () => {
    window.open('https://console.cloud.google.com/apis/consent', '_blank');
  };

  const openSupabaseAuth = () => {
    window.open('https://supabase.com/dashboard/project/susniyygjqxfvisjwpun/auth/providers', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* URGENT REDIRECT URI MISMATCH FIX */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            🚨 URGENT: Fix Error 400 - redirect_uri_mismatch
          </CardTitle>
          <CardDescription>
            The redirect URI in Google Console doesn't match what Supabase is sending
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              This is the EXACT error from your screenshot! The Google OAuth client needs the correct redirect URI.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h5 className="font-bold text-sm mb-2">REQUIRED REDIRECT URI FOR GOOGLE CONSOLE:</h5>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded border border-destructive">
                <code className="text-sm font-mono text-destructive font-bold">
                  https://susniyygjqxfvisjwpun.supabase.co/auth/v1/callback
                </code>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => copyToClipboard('https://susniyygjqxfvisjwpun.supabase.co/auth/v1/callback')}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-sm mb-2">ALSO ADD FOR LOCAL DEVELOPMENT:</h5>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded border">
                <code className="text-sm font-mono">{currentOrigin}/</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${currentOrigin}/`)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <Alert className="border-warning bg-warning/5">
              <Shield className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning font-medium">
                You MUST add the Supabase redirect URI to fix the Error 400 shown in your screenshot!
              </AlertDescription>
            </Alert>

            <Button variant="destructive" onClick={openGoogleConsole} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              OPEN GOOGLE CONSOLE - FIX REDIRECT URI NOW
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CONFIGURATION STEPS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">1</div>
              <div className="flex-1">
                <h5 className="font-medium text-sm">Google Cloud Console</h5>
                <p className="text-xs text-muted-foreground mb-2">Configure OAuth client with redirect URIs</p>
                <Button variant="outline" size="sm" onClick={openGoogleConsole}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Google Console
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">2</div>
              <div className="flex-1">
                <h5 className="font-medium text-sm">Supabase Configuration</h5>
                <p className="text-xs text-muted-foreground mb-2">Update Google provider settings</p>
                <Button variant="outline" size="sm" onClick={openSupabaseAuth}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Supabase Auth
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">3</div>
              <div className="flex-1">
                <h5 className="font-medium text-sm">Test Signup</h5>
                <p className="text-xs text-muted-foreground">After configuration, test the signup flow</p>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          <div className="space-y-2 mt-6">
            <h4 className="font-medium text-sm">Debug Information</h4>
            <div className="p-3 bg-muted/10 rounded text-xs font-mono space-y-1">
              <div>User Agent: {navigator.userAgent.slice(0, 80)}...</div>
              <div>Timestamp: {new Date().toISOString()}</div>
              <div>Port: {window.location.port || 'default'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
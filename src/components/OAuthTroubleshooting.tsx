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
      {/* URGENT 403 ERROR FIX */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="w-5 h-5" />
            🚨 URGENT: Fix 403 "Access Denied" Error
          </CardTitle>
          <CardDescription>
            The Google OAuth consent screen is not configured for external users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              Your app is in testing mode and you're not added as a test user, OR the consent screen needs to be published.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">!</div>
              <div className="flex-1">
                <h5 className="font-bold text-sm text-destructive">IMMEDIATE ACTION REQUIRED</h5>
                <p className="text-xs text-muted-foreground mb-2">Fix Google OAuth Consent Screen Configuration</p>
                <Button variant="destructive" size="sm" onClick={openGoogleConsentScreen}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Consent Screen Settings
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/10 rounded border space-y-2">
            <h5 className="font-bold text-sm">Choose ONE of these fixes:</h5>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-success text-success-foreground text-xs flex items-center justify-center font-bold">1</div>
                <div>
                  <div className="font-medium">OPTION 1: Publish the App (Recommended)</div>
                  <div className="text-xs text-muted-foreground">Set Publishing Status to "In Production"</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-warning text-warning-foreground text-xs flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="font-medium">OPTION 2: Add Test Users</div>
                  <div className="text-xs text-muted-foreground">Add your email address as a test user</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* REDIRECT URI CONFIGURATION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Redirect URI Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Add this redirect URI to your Google Cloud Console OAuth client
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded border">
            <code className="text-sm font-mono flex-1">{currentOrigin}/</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`${currentOrigin}/`)}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>

          <Button variant="outline" onClick={openGoogleConsole}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Google Console OAuth Settings
          </Button>
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
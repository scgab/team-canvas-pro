import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OAuthTroubleshooting = () => {
  const { toast } = useToast();
  const currentOrigin = window.location.origin;

  const requiredRedirectUris = [
    `${currentOrigin}/auth/google/callback`,
    `${currentOrigin}/auth/callback`,
    `${currentOrigin}/callback`,
    `${currentOrigin}/`
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Redirect URI copied successfully"
    });
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  const openSupabaseAuth = () => {
    window.open('https://supabase.com/dashboard/project/susniyygjqxfvisjwpun/auth/providers', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            OAuth Configuration Troubleshooting
          </CardTitle>
          <CardDescription>
            Follow these steps to fix Google OAuth redirect URI mismatch errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Environment Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Current Environment</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Badge variant="outline">Origin</Badge>
                <p className="mt-1 font-mono text-xs">{currentOrigin}</p>
              </div>
              <div>
                <Badge variant="outline">Protocol</Badge>
                <p className="mt-1 font-mono text-xs">{window.location.protocol}</p>
              </div>
            </div>
          </div>

          {/* Required Redirect URIs */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Required Redirect URIs for Google Console</h4>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Add ALL of these redirect URIs to your Google Cloud Console OAuth client configuration
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              {requiredRedirectUris.map((uri, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded border">
                  <code className="text-xs font-mono flex-1">{uri}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(uri)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Configuration Steps</h4>
            
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
          </div>

          {/* Debug Information */}
          <div className="space-y-2">
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
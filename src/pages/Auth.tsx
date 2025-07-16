import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { OAuthTroubleshooting } from '@/components/OAuthTroubleshooting';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUpWithGoogle } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignup = async () => {
    setLoading(true);
    setAuthError(null);
    
    console.log('=== Starting Google Signup Process ===');
    console.log('Current URL:', window.location.href);
    
    const { error } = await signUpWithGoogle();
    
    if (error) {
      console.error('=== Signup Error ===');
      console.error('Error:', error.message);
      
      // Handle specific Google OAuth errors
      if (error.message === 'GOOGLE_CONSENT_SCREEN_ERROR') {
        setAuthError(`🚫 Google OAuth Access Denied (403 Error)

IMMEDIATE FIX REQUIRED:

1. Go to Google Cloud Console OAuth Consent Screen
2. Set User Type to "External" 
3. Set Publishing Status to "In Production"
4. OR add your email as a Test User if keeping it in Testing

The app is currently in testing mode and you're not added as a test user.`);
        setShowTroubleshooting(true);
      } else if (error.message === 'REDIRECT_URI_MISMATCH') {
        setAuthError(`🔧 Redirect URI Mismatch Error

ADD THESE URLs TO GOOGLE CONSOLE:
• ${window.location.origin}/
• ${window.location.origin}/auth/callback

Current origin: ${window.location.origin}`);
        setShowTroubleshooting(true);
      } else if (error.message === 'UNAUTHORIZED_CLIENT') {
        setAuthError(`⚠️ Unauthorized Client Error

FIXES:
• Verify Google Client ID in Supabase
• Check OAuth consent screen configuration
• Ensure proper scopes are configured`);
        setShowTroubleshooting(true);
      } else {
        setAuthError(`❌ Signup Failed: ${error.message}

Check console for detailed error information.`);
        setShowTroubleshooting(true);
      }
    } else {
      toast({
        title: "Redirecting to Google",
        description: "Please complete your signup with Google...",
      });
    }
    
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-secondary/20 p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Let's manage our way to +$100M!
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Project Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            "Success is not final, failure is not fatal: it is the courage to continue that counts."
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-border/50">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold text-center">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up with Google to join our project management team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs text-left whitespace-pre-line">
                <div className="font-medium mb-1">Configuration Error:</div>
                {authError}
              </div>
            )}
            
            <Button 
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Creating account...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign Up with Google
                </>
              )}
            </Button>
            
            {/* Troubleshooting Section */}
            {authError && (
              <Collapsible open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full text-xs">
                    {showTroubleshooting ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-1" />
                        Hide Configuration Help
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-1" />
                        Show Configuration Help
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <OAuthTroubleshooting />
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Secure signup • Join the team managing their way to +$100M
          </p>
          <p className="text-xs text-muted-foreground">
            Current URL: {window.location.origin} • Check console for debug info
          </p>
        </div>
      </div>
    </div>
  );
}
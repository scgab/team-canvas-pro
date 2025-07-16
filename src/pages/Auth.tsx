import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';

export default function Auth() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signInWithCredentials } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    // Basic validation
    if (!emailOrUsername.trim()) {
      setLoginError('Please enter your email or username');
      setLoading(false);
      return;
    }

    if (!password) {
      setLoginError('Please enter your password');
      setLoading(false);
      return;
    }

    console.log('=== Login Attempt ===');
    console.log('Email/Username:', emailOrUsername);
    console.log('Password length:', password.length);

    const { error } = await signInWithCredentials(emailOrUsername, password);

    if (error) {
      console.error('Login failed:', error.message);
      setLoginError(error.message);
      
      // Show toast for failed login
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('Login successful, redirecting to dashboard...');
      
      // Show success toast
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in. Let's manage our way to +$100M!",
        duration: 3000
      });
      
      // Navigate to dashboard
      navigate('/');
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

        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-border/50">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your project management dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email/Username Field */}
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Email or Username
                </Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  autoFocus
                  className="h-11"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                  Remember me for 24 hours
                </Label>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Secure authentication • Welcome to the +$100M management team
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Demo Accounts:</strong></p>
            <p>hna@scandac.com • myh@scandac.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
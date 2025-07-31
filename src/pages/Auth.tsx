import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  BarChart3,
  MessageCircle,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const BrandingSection = () => {
  return (
    <div className="space-y-6">
      {/* Logo and Brand Name */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">W</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            WHEEWLS
          </h1>
        </div>
        
        {/* Main Slogan */}
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 leading-tight">
          Streamline Your Workforce,
          <br />
          <span className="text-blue-600">Maximize Your Success</span>
        </h2>
        
        {/* Supporting Tagline */}
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
          The all-in-one platform for project management, team collaboration, 
          and workforce optimization. Transform how your team works together.
        </p>
      </div>
      
      {/* Value Propositions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800">Boost Efficiency</h3>
          <p className="text-sm text-gray-600">Streamline workflows and eliminate bottlenecks</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800">Team Synergy</h3>
          <p className="text-sm text-gray-600">Connect teams across projects and departments</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800">Drive Growth</h3>
          <p className="text-sm text-gray-600">Scale your operations with data-driven insights</p>
        </div>
      </div>
    </div>
  );
};

const FeatureHighlights = () => {
  const features = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Smart Scheduling",
      description: "AI-powered shift planning and resource allocation"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Real-time Analytics",
      description: "Track performance and productivity metrics instantly"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Seamless Communication",
      description: "Keep teams connected with integrated messaging"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Enterprise Security",
      description: "Bank-grade security for your sensitive data"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Everything you need to manage your workforce
      </h3>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <div className="text-white">
                {feature.icon}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrustIndicators = () => {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">500+</div>
          <div className="text-sm text-gray-600">Teams Managed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">99.9%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 opacity-70">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Enterprise Grade Security</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Lock className="w-4 h-4" />
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
};

const AuthenticationCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user, signInWithCredentials, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !fullName)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signInWithCredentials(email, password);
        
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in",
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border-white/20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Success Message */}
          <div className="text-center mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              Let's manage our way to +$100M!
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">Demo Accounts:</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-700">Admin:</span>
                <code className="text-blue-800">hna@scandac.com</code>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Member:</span>
                <code className="text-blue-800">myh@scandac.com</code>
              </div>
              <p className="text-blue-600 mt-2">Password: test123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BackgroundGraphics = () => {
  return (
    <>
      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>
    </>
  );
};

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
          {/* Left Side - Branding and Content */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8 animate-fade-in">
            <BrandingSection />
            <div className="hidden lg:block space-y-8">
              <FeatureHighlights />
              <TrustIndicators />
            </div>
          </div>
          
          {/* Right Side - Authentication */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-scale-in">
            <AuthenticationCard />
          </div>
          
          {/* Mobile: Show features below auth */}
          <div className="order-3 lg:hidden space-y-6 animate-fade-in">
            <FeatureHighlights />
            <TrustIndicators />
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <BackgroundGraphics />
    </div>
  );
};

export default Auth;
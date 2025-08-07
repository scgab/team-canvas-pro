import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TeamAuthService } from '@/services/teamAuth';
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
  Loader2,
  Menu,
  User,
  FolderOpen,
  Check,
  ChevronDown
} from 'lucide-react';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header height
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const scrollToAuth = (mode: 'login' | 'signup') => {
    // Update URL to reflect the mode
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url.toString());
    
    // Scroll to auth section
    scrollToSection('auth-section');
  };

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200/20 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">W</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              WHEEWLS
            </h1>
          </div>

          {/* Middle - Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right - CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => scrollToAuth('login')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => scrollToAuth('signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('products')} className="text-left text-gray-700 hover:text-blue-600 font-medium">
                Products
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-left text-gray-700 hover:text-blue-600 font-medium">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-gray-700 hover:text-blue-600 font-medium">
                FAQ
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => scrollToAuth('login')}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => scrollToAuth('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-left"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const BrandingSection = ({ scrollToAuth }: { scrollToAuth: (mode: 'login' | 'signup') => void }) => {
  return (
    <div className="space-y-6">
      {/* Main Headline - Larger and more prominent */}
      <div className="space-y-6">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
          Streamline Your
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Workforce Management
          </span>
        </h1>
        
        {/* Supporting Tagline */}
        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
          The all-in-one platform for project management, team collaboration, 
          and workforce optimization. Transform how your team works together.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => scrollToAuth('signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Start Free Trial
          </button>
          <button 
            onClick={() => scrollToAuth('signup')}
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            Watch Demo
          </button>
        </div>
      </div>
      
      {/* Value Props Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Boost Efficiency</h3>
          <p className="text-sm text-gray-600">Streamline workflows and eliminate bottlenecks</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Team Synergy</h3>
          <p className="text-sm text-gray-600">Connect teams across projects and departments</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Drive Growth</h3>
          <p className="text-sm text-gray-600">Scale operations with data-driven insights</p>
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
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isTeamSetup, setIsTeamSetup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user, signInWithCredentials, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
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

  // Set form mode based on URL parameter
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Redirect if already authenticated or handle plan selection
  useEffect(() => {
    if (user) {
      const plan = searchParams.get('plan');
      if (plan && plan !== 'free') {
        // User is authenticated and wants to subscribe to a paid plan
        navigate(`/subscription?plan=${plan}`);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, searchParams]);

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

    // For signup, check if we need team setup
    if (!isLogin && !isTeamSetup) {
      if (!teamName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a team name",
          variant: "destructive"
        });
        return;
      }
      setIsTeamSetup(true);
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
      } else if (isTeamSetup) {
        // Create team and admin user
        try {
          const teamData = await TeamAuthService.createTeamAndAdmin({
            email,
            password,
            fullName,
            teamName
          });

          toast({
            title: "Team created successfully!",
            description: `Welcome to ${teamName}! Your team ID is ${teamData.team.team_id}`,
          });
          
          // Auto-login after successful team creation
          const { error: loginError } = await signInWithCredentials(email, password);
          if (!loginError) {
            navigate('/');
          }
        } catch (error: any) {
          toast({
            title: "Team Creation Failed",
            description: error.message,
            variant: "destructive"
          });
          // Go back to first step
          setIsTeamSetup(false);
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
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-white/20 pointer-events-auto">
        <CardContent className="p-8 pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 
               isTeamSetup ? 'Create Your Team' : 
               'Get Started'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 
               isTeamSetup ? 'Set up your team workspace' :
               'Create your account and team'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll be the admin of this team and can invite members later.
                  </p>
                </div>
              </>
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
                  className="pr-12"
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
                  {isLogin ? 'Signing in...' : 
                   isTeamSetup ? 'Creating team...' : 
                   'Continue'}
                </>
              ) : (
                isLogin ? 'Sign In' : 
                isTeamSetup ? 'Create Team & Account' : 
                'Continue'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Back button for team setup */}
          {isTeamSetup && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsTeamSetup(false);
                  setTeamName('');
                }}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                ← Back to signup
              </button>
            </div>
          )}

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsTeamSetup(false);
                  setTeamName('');
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
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
      <div className="fixed inset-0 opacity-5 pointer-events-none">
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

const ProductsSection = () => {
  const products = [
    {
      title: "Project Management",
      description: "Organize projects, track progress, and manage deadlines with our intuitive project management tools.",
      icon: <FolderOpen className="w-8 h-8" />,
      features: ["Kanban Boards", "Gantt Charts", "Task Assignment", "Progress Tracking"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Team Collaboration",
      description: "Keep your team connected with real-time messaging, file sharing, and collaborative workspaces.",
      icon: <Users className="w-8 h-8" />,
      features: ["Real-time Messaging", "File Sharing", "Team Calendar", "Video Meetings"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Workforce Management",
      description: "Optimize your workforce with intelligent scheduling, shift planning, and performance analytics.",
      icon: <Calendar className="w-8 h-8" />,
      features: ["Shift Scheduling", "Availability Tracking", "Performance Reports", "Time Management"],
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Analytics & Insights",
      description: "Make data-driven decisions with comprehensive analytics and customizable reporting tools.",
      icon: <BarChart3 className="w-8 h-8" />,
      features: ["Custom Reports", "Performance Metrics", "Team Analytics", "ROI Tracking"],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Powerful Products for Modern Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage projects, collaborate with your team, and optimize your workforce in one integrated platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className={`w-16 h-16 bg-gradient-to-r ${product.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}>
                {product.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{product.title}</h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <ul className="space-y-2">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = ({ scrollToAuth }: { scrollToAuth: (mode: 'login' | 'signup') => void }) => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "3 projects",
        "Basic project management",
        "Community support",
        "Mobile app access"
      ],
      buttonText: "Get Started Free",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per user/month",
      description: "Best for growing teams and businesses",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Shift planning",
        "Time tracking"
      ],
      buttonText: "Start Free Trial",
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with custom needs",
      features: [
        "Everything in Professional",
        "Custom branding",
        "SSO integration",
        "Dedicated support",
        "Custom workflows",
        "Advanced security",
        "API access"
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your team. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => scrollToAuth('signup')}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is WHEEWLS and how does it work?",
      answer: "WHEEWLS is an all-in-one workforce management platform that combines project management, team collaboration, and workforce optimization tools. It helps teams streamline their workflows, manage projects efficiently, and optimize their workforce scheduling."
    },
    {
      question: "Can I try WHEEWLS for free?",
      answer: "Yes! We offer a free Starter plan that includes up to 5 team members and 3 projects. You can also start a 14-day free trial of our Professional plan to explore all advanced features."
    },
    {
      question: "How secure is my data with WHEEWLS?",
      answer: "We take security seriously. All data is encrypted in transit and at rest, we're GDPR compliant, and we undergo regular security audits. Enterprise plans include additional security features like SSO and advanced access controls."
    },
    {
      question: "Can I integrate WHEEWLS with other tools?",
      answer: "Absolutely! WHEEWLS integrates with popular tools like Slack, Google Workspace, Microsoft Teams, and many others. Professional and Enterprise plans include custom integration options."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide community support for free users, priority email support for Professional users, and dedicated support for Enterprise customers. All plans include access to our comprehensive documentation and video tutorials."
    },
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments on your next invoice."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We have answers. If you can't find what you're looking for, feel free to contact our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full py-6 text-left flex justify-between items-center hover:text-blue-600 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                <div className={`transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              {openFAQ === index && (
                <div className="pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

const Auth = () => {
  const navigate = useNavigate();

  const scrollToAuth = (mode: 'login' | 'signup') => {
    // Update URL to reflect the mode
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url.toString());
    
    // Scroll to auth section
    const element = document.getElementById('auth-section');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <LandingHeader />
      
      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-h-[80vh]">
            
            {/* Left Side - Branding and Content (7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              <BrandingSection scrollToAuth={scrollToAuth} />
              <FeatureHighlights />
              <TrustIndicators />
            </div>
            
            {/* Right Side - Authentication (5 columns) - Aligned with headline */}
            <div id="auth-section" className="lg:col-span-5 flex justify-center lg:justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <AuthenticationCard />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Products Section */}
      <ProductsSection />
      
      {/* Pricing Section */}
      <PricingSection scrollToAuth={scrollToAuth} />
      
      {/* FAQ Section */}
      <FAQSection />
      
      <BackgroundGraphics />
    </div>
  );
};

export default Auth;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  BarChart3,
  MessageCircle,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Lock,
  Check,
  Crown,
  Rocket,
  Building,
  Menu,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          localStorage.setItem('currentUser', formData.email);
          toast({
            title: "Welcome back!",
            description: "Successfully signed in",
          });
          navigate('/');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.email.split('@')[0],
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account",
        });
        setIsLogin(true);
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
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'For individuals looking to keep track of their work',
      members: 'Up to 3 members',
      icon: Check,
      features: [
        'Unlimited docs',
        '200+ templates',
        '8 column types',
        'iOS and Android apps'
      ],
      popular: false,
      stripeUrl: null
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      description: 'Manage all your team\'s work in one place',
      members: 'Up to 9 members',
      icon: Zap,
      features: [
        'Everything in Free',
        'Unlimited free viewers',
        'Unlimited items',
        '5GB file storage',
        '500 AI credits per month per account',
        'Prioritised customer support',
        'Create a dashboard based on 1 board'
      ],
      popular: false,
      stripeUrl: 'https://buy.stripe.com/test_basic'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 49,
      description: 'Collaborate & optimize your work across teams',
      members: 'Up to 18 members',
      icon: Crown,
      features: [
        'Everything in Basic',
        'Timeline & Gantt views',
        'Calendar View',
        'Guest access',
        '500 AI credits per month per account',
        'Automations (250 actions per month)',
        'Integrations (250 actions per month)',
        'Create a dashboard that combines 5 boards'
      ],
      popular: true,
      stripeUrl: 'https://buy.stripe.com/test_standard'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      description: 'Streamline complex workflows at scale',
      members: 'Up to 36 members',
      icon: Rocket,
      features: [
        'Everything in Standard',
        'Private boards',
        'Chart View',
        'Time tracking',
        'Formula Column',
        '500 AI credits per month per account',
        'Automations (25K actions per month)',
        'Integrations (25K actions per month)',
        'Create a dashboard that combines 20 boards'
      ],
      popular: false,
      stripeUrl: 'https://buy.stripe.com/test_pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Get exclusive features for your organization',
      members: 'Unlimited members',
      icon: Building,
      features: [
        'Everything in Pro',
        'Enterprise-scale automations & integrations',
        'Multi-level permissions',
        'Enterprise-grade security & governance',
        'Advanced reporting & analytics',
        '500 AI credits per month per account',
        'Enterprise support',
        'Create a dashboard that combines 50 boards'
      ],
      popular: false,
      stripeUrl: null
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (planId === 'free') {
      window.location.href = '/auth?mode=signup';
      return;
    }

    if (planId === 'enterprise') {
      window.open('mailto:sales@wheewls.com?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    if (plan.stripeUrl) {
      setLoading(planId);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.open(plan.stripeUrl, '_blank');
      } catch (error) {
        console.error('Error redirecting to Stripe:', error);
      } finally {
        setLoading(null);
      }
    }
  };

  const getDisplayPrice = (price: number | string) => {
    if (typeof price !== 'number') return price;
    return isAnnual ? Math.floor(price * 0.8) : price;
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Scale your team productivity with the right plan for your needs
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = getDisplayPrice(plan.price);
            
            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {typeof displayPrice === 'number' ? `€${displayPrice}` : displayPrice}
                      {typeof displayPrice === 'number' && (
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      )}
                    </div>
                    {isAnnual && typeof plan.price === 'number' && (
                      <div className="text-sm text-gray-500 line-through">€{plan.price}/month</div>
                    )}
                    <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                    <p className="text-sm font-semibold text-blue-600">{plan.members}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : plan.id === 'free'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      plan.id === 'free' ? 'Get Started Free' :
                      plan.id === 'enterprise' ? 'Contact Sales' :
                      'Subscribe Now'
                    )}
                  </Button>
                  
                  {plan.id === 'free' && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                      No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            All plans include our core features. Need a custom solution?{' '}
            <button 
              onClick={() => window.open('mailto:sales@wheewls.com?subject=Custom Solution Inquiry', '_blank')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact our sales team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    window.location.href = '/auth?mode=login';
  };

  const handleGetStarted = () => {
    window.location.href = '/auth?mode=signup';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-white/20 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WHEEWLS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleSignIn}
              className="hover:bg-blue-50"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Button 
                variant="ghost" 
                onClick={handleSignIn}
                className="justify-start"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Header */}
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-8 lg:py-16 relative z-10">
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
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Background Elements */}
      <BackgroundGraphics />
    </div>
  );
};

export default Landing;
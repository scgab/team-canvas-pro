import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Rocket, Building } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
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
    disabled: true
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '€29',
    description: 'Manage all your team\'s work in one place',
    members: 'Up to 9 members',
    icon: Zap,
    features: [
      'Everything in Free',
      'Unlimited free viewers',
      'Unlimited items',
      '5GB file storage',
      '500 AI credits per month',
      'Prioritised customer support',
      'Create dashboard based on 1 board'
    ],
    popular: false,
    disabled: false
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '€49',
    description: 'Collaborate & optimize your work across teams',
    members: 'Up to 18 members',
    icon: Crown,
    features: [
      'Everything in Basic',
      'Timeline & Gantt views',
      'Calendar View',
      'Guest access',
      '500 AI credits per month',
      'Automations (250 actions/month)',
      'Integrations (250 actions/month)',
      'Create dashboard combining 5 boards'
    ],
    popular: true,
    disabled: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€79',
    description: 'Streamline complex workflows at scale',
    members: 'Up to 36 members',
    icon: Rocket,
    features: [
      'Everything in Standard',
      'Private boards',
      'Chart View',
      'Time tracking',
      'Formula Column',
      '500 AI credits per month',
      'Automations (25K actions/month)',
      'Integrations (25K actions/month)',
      'Create dashboard combining 20 boards'
    ],
    popular: false,
    disabled: false
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
      '500 AI credits per month',
      'Enterprise support',
      'Create dashboard combining 50 boards'
    ],
    popular: false,
    disabled: true
  }
];

export const SubscriptionPlans = () => {
  const { subscription_tier, createCheckout, openCustomerPortal, subscribed } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free' || planId === 'enterprise') {
      return; // Free plan is already active, enterprise needs custom pricing
    }
    createCheckout(planId);
  };

  const getCurrentPlanName = () => {
    return subscription_tier === 'free' ? 'Free' : 
           subscription_tier === 'basic' ? 'Basic' :
           subscription_tier === 'standard' ? 'Standard' :
           subscription_tier === 'pro' ? 'Pro' :
           subscription_tier === 'enterprise' ? 'Enterprise' : 'Free';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Scale your team productivity with the right plan for your needs
        </p>
        {subscribed && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Current Plan: {getCurrentPlanName()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={openCustomerPortal}
              className="ml-2"
            >
              Manage Subscription
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = subscription_tier === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge variant="secondary" className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Current Plan
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {plan.price}
                  {plan.price !== 'Custom' && plan.price !== '€0' && (
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <p className="text-sm font-semibold text-primary">{plan.members}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={plan.disabled || isCurrentPlan}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : plan.disabled
                    ? plan.id === 'free'
                      ? 'Free Forever'
                      : 'Contact Sales'
                    : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
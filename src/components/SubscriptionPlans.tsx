import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Rocket, Building } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for small teams getting started',
    members: 'Up to 5 team members',
    icon: Check,
    features: [
      'Up to 5 team members',
      '3 projects',
      'Basic project management',
      'Community support',
      'Mobile app access'
    ],
    popular: false,
    disabled: true
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$29',
    description: 'Best for growing teams and businesses',
    members: 'Unlimited team members',
    icon: Crown,
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Shift planning',
      'Time tracking'
    ],
    popular: true,
    disabled: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    members: 'Contact us',
    icon: Building,
    features: [
      'Everything in Professional',
      'Custom branding',
      'SSO integration',
      'Dedicated support',
      'Custom workflows',
      'Advanced security',
      'API access'
    ],
    popular: false,
    disabled: true
  }
];

export const SubscriptionPlans = () => {
  const { subscription_tier, createCheckout, openCustomerPortal, subscribed } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    if (planId === 'starter' || planId === 'enterprise') {
      return; // Starter plan is already active, enterprise needs custom pricing
    }
    createCheckout(planId);
  };

  const getCurrentPlanName = () => {
    return subscription_tier === 'starter' ? 'Starter' : 
           subscription_tier === 'professional' ? 'Professional' :
           subscription_tier === 'enterprise' ? 'Enterprise' : 'Starter';
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {plan.name === 'Professional' && (
                    <span className="text-sm font-normal text-muted-foreground">/per user/month</span>
                  )}
                  {plan.price === 'Free' && (
                    <span className="text-sm font-normal text-muted-foreground"> forever</span>
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
                    ? plan.id === 'starter'
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
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { useSubscription } from '@/hooks/useSubscription';

const Subscription = () => {
  const [searchParams] = useSearchParams();
  const { createCheckout } = useSubscription();

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && plan !== 'free' && plan !== 'enterprise') {
      // Automatically trigger checkout for paid plans
      createCheckout(plan);
    }
  }, [searchParams, createCheckout]);

  return (
    <div className="min-h-screen bg-background">
      <SubscriptionPlans />
    </div>
  );
};

export default Subscription;
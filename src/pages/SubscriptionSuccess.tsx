import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription } = useSubscription();
  const { toast } = useToast();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Refresh subscription status after successful payment
      setTimeout(() => {
        checkSubscription();
        toast({
          title: "🎉 Subscription Activated!",
          description: "Welcome to your new plan. You now have access to all premium features.",
          duration: 5000
        });
      }, 2000);
    }
  }, [sessionId, checkSubscription, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully. You now have access to all premium features.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Your subscription is now active. It may take a few moments for all features to be available.
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/subscription')}
            >
              View Subscription Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
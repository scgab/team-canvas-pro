import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface SetupResult {
  email: string;
  status: 'created' | 'already_exists' | 'error';
  user_id?: string;
  error?: string;
}

export const DemoUserSetup = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [results, setResults] = useState<SetupResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const setupDemoUsers = async () => {
    setIsSettingUp(true);
    setResults([]);

    try {
      console.log('🚀 Setting up demo users...');
      
      const { data, error } = await supabase.functions.invoke('setup-demo-users');
      
      if (error) {
        console.error('❌ Setup failed:', error);
        toast({
          title: "Setup Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Setup completed:', data);
      
      if (data.success) {
        setResults(data.results);
        setIsComplete(true);
        toast({
          title: "Demo Users Setup Complete",
          description: "You can now login with hna@scandac.com or myh@scandac.com using password: Scandac2025!",
          variant: "default"
        });
      } else {
        toast({
          title: "Setup Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      toast({
        title: "Setup Error",
        description: "An unexpected error occurred during setup",
        variant: "destructive"
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'already_exists':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created':
        return 'Created successfully';
      case 'already_exists':
        return 'Already exists';
      case 'error':
        return 'Setup failed';
      default:
        return status;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <Users className="h-5 w-5" />
          Demo Users Setup
        </CardTitle>
        <CardDescription>
          Set up the demo users (hna@scandac.com and myh@scandac.com) to restore your access
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isComplete && (
          <Button 
            onClick={setupDemoUsers}
            disabled={isSettingUp}
            className="w-full"
            size="lg"
          >
            {isSettingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up users...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Set Up Demo Users
              </>
            )}
          </Button>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Setup Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="text-sm font-medium">{result.email}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {getStatusText(result.status)}
                </span>
              </div>
            ))}
          </div>
        )}

        {isComplete && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Demo users are ready! You can now login with:
            </p>
            <ul className="text-xs text-green-700 mt-1 space-y-1">
              <li>• hna@scandac.com</li>
              <li>• myh@scandac.com</li>
              <li>• Password: Scandac2025!</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
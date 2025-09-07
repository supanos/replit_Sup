import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Database, User, Settings, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface SetupStatus {
  isSetupMode: boolean;
  completedSteps: string[];
  currentStep: number;
}

export default function Setup() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    isSetupMode: false,
    completedSteps: [],
    currentStep: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: 'Supanos',
    password: 'Newyork1453*-'
  });
  
  const { toast } = useToast();

  const steps = [
    { id: 'check', title: 'System Check', icon: Settings, description: 'Checking system requirements' },
    { id: 'database', title: 'Database Setup', icon: Database, description: 'Setting up PostgreSQL database' },
    { id: 'migration', title: 'Data Migration', icon: Database, description: 'Transferring data from files to database' },
    { id: 'admin', title: 'Admin User', icon: User, description: 'Creating admin account' },
    { id: 'complete', title: 'Complete', icon: CheckCircle2, description: 'Finalizing setup' }
  ];

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/setup/status');
      const data = await response.json();
      setSetupStatus(data);
    } catch (error) {
      console.error('Setup status check failed:', error);
    }
  };

  const runSetupStep = async (stepId: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      let body = {};

      switch (stepId) {
        case 'check':
          endpoint = '/api/setup/check';
          break;
        case 'database':
          endpoint = '/api/setup/database';
          break;
        case 'migration':
          endpoint = '/api/setup/migrate';
          break;
        case 'admin':
          endpoint = '/api/setup/admin';
          body = adminForm;
          break;
        case 'complete':
          endpoint = '/api/setup/complete';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        setSetupStatus(prev => ({
          ...prev,
          completedSteps: [...prev.completedSteps, stepId],
          currentStep: prev.currentStep + 1
        }));
        
        toast({
          title: "Success",
          description: result.message || `${stepId} completed successfully`
        });

        if (stepId === 'complete') {
          toast({
            title: "Setup Complete! 🎉",
            description: "Redirecting to main site...",
            variant: "default"
          });
          
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        throw new Error(result.error || 'Setup step failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Setup step failed',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runAllSteps = async () => {
    for (const step of steps) {
      if (!setupStatus.completedSteps.includes(step.id)) {
        await runSetupStep(step.id);
        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  if (!setupStatus.isSetupMode) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gold" />
            <CardTitle>Setup Already Complete</CardTitle>
            <CardDescription>
              The system has already been configured. If you need to reconfigure, please contact an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Main Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4">🏆 Supono's Sports Bar</h1>
          <h2 className="text-2xl mb-2">System Setup Wizard</h2>
          <p className="text-gray-300">Let's get your sports bar website up and running!</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Setup Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(setupStatus.currentStep / steps.length) * 100} className="mb-4" />
            <p className="text-sm text-gray-600">
              Step {setupStatus.currentStep} of {steps.length}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = setupStatus.completedSteps.includes(step.id);
            const isCurrent = index === setupStatus.currentStep;
            const isPending = index > setupStatus.currentStep;

            return (
              <Card key={step.id} className={`
                ${isCompleted ? 'border-green-500 bg-green-50' : ''}
                ${isCurrent ? 'border-gold bg-gold/10' : ''}
                ${isPending ? 'border-gray-300 bg-gray-50' : ''}
              `}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Icon className={`h-4 w-4 ${isCurrent ? 'text-gold' : 'text-gray-400'}`} />
                    )}
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600">{step.description}</p>
                  {isCurrent && step.id === 'admin' && (
                    <div className="mt-4 space-y-2">
                      <div>
                        <Label htmlFor="username">Admin Username</Label>
                        <Input
                          id="username"
                          value={adminForm.username}
                          onChange={(e) => setAdminForm(prev => ({...prev, username: e.target.value}))}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Admin Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({...prev, password: e.target.value}))}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This wizard will automatically set up your database, migrate data, and create your admin account.
            The process is completely automated and will take just a few minutes.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <Button 
            onClick={runAllSteps}
            disabled={loading || setupStatus.currentStep >= steps.length}
            size="lg"
            className="bg-gold hover:bg-gold/90 text-navy px-8"
          >
            {loading ? 'Setting Up...' : 'Start Automatic Setup'}
          </Button>
          
          {setupStatus.currentStep > 0 && setupStatus.currentStep < steps.length && (
            <Button 
              onClick={() => runSetupStep(steps[setupStatus.currentStep].id)}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? 'Running...' : `Run ${steps[setupStatus.currentStep].title} Step`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
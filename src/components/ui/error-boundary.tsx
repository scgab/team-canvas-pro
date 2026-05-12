import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
          <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {this.state.error.message}
          </p>
          <Button onClick={this.reset} className="mt-4">
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

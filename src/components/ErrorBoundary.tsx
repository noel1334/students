import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * App-wide error boundary. Catches render errors in the React tree so a single
 * broken component doesn't produce a white screen for the whole app.
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Hook a real error reporter (Sentry, etc.) here later.
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-card border rounded-lg p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. You can try reloading the app.
          </p>
          {this.state.error?.message && (
            <pre className="text-xs text-left bg-muted rounded p-3 overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleReset} className="w-full">
            Reload app
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
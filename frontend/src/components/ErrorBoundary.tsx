import React, { Component, ErrorInfo } from 'react';
import { Stack, Text, PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{
            root: {
              height: '100vh',
              padding: '20px'
            }
          }}
        >
          <Stack tokens={{ childrenGap: 20 }} styles={{ root: { maxWidth: 600 } }}>
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={true}
            >
              <Text variant="large" block>
                Something went wrong
              </Text>
              <Text>
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>
            </MessageBar>
            <PrimaryButton
              text="Try Again"
              onClick={this.handleReset}
              styles={{ root: { width: 120 } }}
            />
          </Stack>
        </Stack>
      );
    }

    return this.props.children;
  }
}
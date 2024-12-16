import React from 'react';
import { Stack, Spinner, SpinnerSize, Text, useTheme } from '@fluentui/react';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...' 
}) => {
  const theme = useTheme();

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000
        }
      }}
    >
      <Stack
        horizontalAlign="center"
        tokens={{ childrenGap: 16 }}
        styles={{
          root: {
            backgroundColor: theme.palette.white,
            padding: '24px',
            borderRadius: '4px',
            boxShadow: theme.effects.elevation8
          }
        }}
      >
        <Spinner size={SpinnerSize.large} />
        <Text variant="large">{message}</Text>
      </Stack>
    </Stack>
  );
};
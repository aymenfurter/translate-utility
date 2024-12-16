import React from 'react';
import { MessageBar, MessageBarType, IStackStyles, Stack } from '@fluentui/react';

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}

const notificationStyles: IStackStyles = {
  root: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '400px',
    zIndex: 1000
  }
};

const getMessageBarType = (type: NotificationProps['type']): MessageBarType => {
  switch (type) {
    case 'success':
      return MessageBarType.success;
    case 'error':
      return MessageBarType.error;
    case 'warning':
      return MessageBarType.warning;
    case 'info':
      return MessageBarType.info;
    default:
      return MessageBarType.info;
  }
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onDismiss
}) => {
  return (
    <Stack styles={notificationStyles}>
      <MessageBar
        messageBarType={getMessageBarType(type)}
        onDismiss={onDismiss}
        dismissButtonAriaLabel="Close"
        styles={{
          root: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {message}
      </MessageBar>
    </Stack>
  );
};
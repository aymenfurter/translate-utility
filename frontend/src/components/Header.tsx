import React from 'react';
import {
  Stack,
  Text,
  CommandBar,
  ICommandBarItemProps,
  useTheme,
  mergeStyles,
  ICommandBarStyles
} from '@fluentui/react';
import { Document10016Filled, Save24Regular, DocumentMultiple24Regular } from '@fluentui/react-icons';

interface HeaderProps {
  onExport?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  canExport: boolean;
  canSave: boolean;
}

const translateHeaderStyles = mergeStyles({
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  borderBottom: '1px solid #e1dfdd'
});

const translateHeaderContentStyles = mergeStyles({
  padding: '0 24px',
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const translateHeaderLogoStyles = mergeStyles({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#323130',
  userSelect: 'none'
});

const commandBarStyles: Partial<ICommandBarStyles> = {
  root: {
    padding: 0,
    height: 48,
    backgroundColor: 'transparent'
  },
  primarySet: {
    height: 48
  },
  secondarySet: {
    height: 48
  }
};

export const Header: React.FC<HeaderProps> = ({ onExport, onSave, onLoad, canExport, canSave }) => {
  const theme = useTheme();

  const commandItems: ICommandBarItemProps[] = [
    {
      key: 'save',
      text: 'Save',
      iconProps: { iconName: 'Save' },
      onClick: onSave,
      disabled: !canSave
    },
    {
      key: 'load',
      text: 'Load',
      iconProps: { iconName: 'OpenFile' },
      onClick: onLoad
    },
    {
      key: 'export',
      text: 'Export',
      iconProps: { iconName: 'Download' },
      onClick: onExport,
      disabled: !canExport,
      buttonStyles: {
        root: {
          height: 48,
          padding: '0 12px',
          backgroundColor: 'transparent',
          selectors: {
            ':hover': {
              backgroundColor: theme.palette.neutralLighter
            }
          }
        },
        rootHovered: {
          backgroundColor: theme.palette.neutralLighter
        }
      }
    },
    {
      key: 'help',
      text: 'Help',
      iconProps: { iconName: 'Help' },
      onClick: () => window.open('https://github.com/aymenfurter/translate-utility', '_blank'),
      buttonStyles: {
        root: {
          height: 48,
          padding: '0 12px',
          backgroundColor: 'transparent',
          selectors: {
            ':hover': {
              backgroundColor: theme.palette.neutralLighter
            }
          }
        },
        rootHovered: {
          backgroundColor: theme.palette.neutralLighter
        }
      }
    }
  ];

  return (
    <div className={translateHeaderStyles}>
      <div className={translateHeaderContentStyles}>
        <div className={translateHeaderLogoStyles}>
          <Document10016Filled 
            style={{ 
              fontSize: 22, 
              color: theme.palette.themePrimary 
            }} 
          />
          <Text
            variant="large"
            styles={{
              root: {
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '48px'
              }
            }}
          >
            Document Translator
          </Text>
        </div>
        <CommandBar
          items={commandItems}
          styles={commandBarStyles}
        />
      </div>
    </div>
  );
};
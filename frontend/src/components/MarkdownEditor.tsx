import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  ITextFieldStyles,
  Stack,
  PrimaryButton,
  useTheme,
  mergeStyles,
  FocusZone,
  Icon,
  Text
} from '@fluentui/react';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const editorContainerStyles = mergeStyles({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative'
});

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    '.ms-TextField-wrapper': {
      height: '100%'
    },
    '.ms-TextField-fieldGroup': {
      height: '100%'
    },
    '.ms-TextField-field': {
      height: '100%',
      resize: 'none',
      padding: '16px',
      fontSize: '14px',
      lineHeight: '1.6'
    }
  }
};

const previewContainerStyles = mergeStyles({
  backgroundColor: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: '6px',
  padding: '16px',
  overflow: 'auto',
  height: '100%',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease',
});

const editOverlayStyles = mergeStyles({
  position: 'absolute',
  top: '8px',
  right: '8px',
  zIndex: 1
});

const emptyStateStyles = mergeStyles({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '32px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px dashed #e9ecef',
  color: '#6c757d',
  textAlign: 'center',
  gap: '16px'
});

const EmptyState: React.FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => (
  <div className={emptyStateStyles}>
    <Icon 
      iconName={isReadOnly ? "TimelineProgress" : "Edit"} 
      styles={{ root: { fontSize: 32, color: '#0078d4' } }}
    />
    <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
      {isReadOnly 
        ? "Waiting for translation to start..."
        : "Click to start editing"}
    </Text>
    <Text>
      {isReadOnly 
        ? "The translated content will appear here automatically"
        : "You can edit and preview the translation in real-time"}
    </Text>
  </div>
);

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleApplyChanges();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, localValue]);

  const handleApplyChanges = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const startEditing = () => {
    if (!readOnly) {
      setIsEditing(true);
      setTimeout(() => textFieldRef.current?.focus(), 0);
    }
  };

  return (
    <div ref={containerRef} className={editorContainerStyles} style={{ height: '100%' }}>
      {!value && !isEditing ? (
        <EmptyState isReadOnly={readOnly} />
      ) : isEditing ? (
        <FocusZone style={{ height: '100%' }}>
          <Stack style={{ height: '100%' }}>
            <TextField
              componentRef={textFieldRef}
              multiline
              value={localValue}
              onChange={(_, newValue) => setLocalValue(newValue || '')}
              styles={textFieldStyles}
              autoFocus
              placeholder={placeholder}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ padding: '8px 0 0' }}>
              <PrimaryButton
                text="Save"
                onClick={handleApplyChanges}
              />
            </Stack>
          </Stack>
        </FocusZone>
      ) : (
        <div className={previewContainerStyles} onClick={startEditing}>
          <div className={editOverlayStyles}>
            <PrimaryButton
              text="Edit"
              onClick={startEditing}
              styles={{ root: { minWidth: 60 } }}
            />
          </div>
          <MarkdownPreview content={value} />
        </div>
      )}
    </div>
  );
};
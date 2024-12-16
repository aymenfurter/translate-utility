import React, { useState, useEffect } from 'react';
import { 
  Stack,
  PrimaryButton,
  ScrollablePane,
  Text,
  TextField,
  useTheme,
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter,
  IStackStyles,
  ITextFieldStyles,
  IButtonStyles,
  mergeStyles,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import DOMPurify from 'dompurify';
import { MarkdownPreview } from './MarkdownPreview';

interface EditorPanelProps {
  translatedChapters: Array<{
    id: string;
    translated_markdown: string;
  }>;
  onSave: (chapters: Array<{ id: string; translated_markdown: string }>) => void;
  onExport: () => void;
  isExportEnabled: boolean;
}

const stackStyles: IStackStyles = {
  root: {
    width: '50%',
    padding: '20px',
    height: '100%',
    borderLeft: '1px solid #edebe9',
    backgroundColor: '#faf9f8'
  }
};

const headerStyles = mergeStyles({
  padding: '12px 0',
  borderBottom: '1px solid #edebe9',
  marginBottom: '20px'
});

const editorContainerStyles = mergeStyles({
  backgroundColor: '#ffffff',
  padding: '16px',
  borderRadius: '4px',
  boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132), 0 0.3px 0.9px 0 rgba(0,0,0,0.108)'
});

const textFieldStyles: Partial<ITextFieldStyles> = {
  field: {
    minHeight: '200px',
    fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    padding: '12px'
  },
  fieldGroup: {
    border: '1px solid #edebe9',
    '&:hover': {
      border: '1px solid #c8c6c4'
    }
  }
};

const buttonStyles: IButtonStyles = {
  root: {
    margin: '0 4px'
  }
};

export const EditorPanel: React.FC<EditorPanelProps> = ({
  translatedChapters,
  onSave,
  onExport,
  isExportEnabled
}) => {
  const theme = useTheme();
  const [editedChapters, setEditedChapters] = useState(translatedChapters);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  useEffect(() => {
    setEditedChapters(translatedChapters);
  }, [translatedChapters]);

  const handleTextChange = (id: string, newValue: string) => {
    setEditedChapters(prev => 
      prev.map(chapter => 
        chapter.id === id 
          ? { ...chapter, translated_markdown: newValue }
          : chapter
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave(editedChapters);
    setHasUnsavedChanges(false);
  };

  const handlePreview = (id: string) => {
    setSelectedChapter(id);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedChapter(null);
  };

  const handleExport = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onExport();
    }
  };

  return (
    <Stack styles={stackStyles}>
      <Stack.Item className={headerStyles}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Translation Editor
          </Text>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton
              text={hasUnsavedChanges ? "Save Changes" : "Saved"}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              styles={buttonStyles}
            />
            <DefaultButton
              text="Export"
              onClick={handleExport}
              disabled={!isExportEnabled}
              styles={buttonStyles}
            />
          </Stack>
        </Stack>
      </Stack.Item>

      {hasUnsavedChanges && (
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
          styles={{ root: { marginBottom: 16 } }}
        >
          You have unsaved changes
        </MessageBar>
      )}

      <ScrollablePane>
        <Stack tokens={{ childrenGap: 16 }}>
          {editedChapters.map((chapter) => (
            <Stack key={chapter.id} className={editorContainerStyles}>
              <TextField
                multiline
                autoAdjustHeight
                value={chapter.translated_markdown}
                onChange={(_, newValue) => 
                  handleTextChange(chapter.id, newValue || '')
                }
                styles={textFieldStyles}
              />
              <Stack horizontal horizontalAlign="end" tokens={{ padding: '12px 0 0' }}>
                <DefaultButton
                  text="Preview"
                  onClick={() => handlePreview(chapter.id)}
                  styles={buttonStyles}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </ScrollablePane>

      <Dialog
        hidden={!showPreview}
        onDismiss={handleClosePreview}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Preview',
          closeButtonAriaLabel: 'Close',
          styles: { content: { minHeight: '60vh', maxHeight: '80vh' } }
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: '80vw', width: '800px' } }
        }}
      >
        {selectedChapter && (
          <MarkdownPreview
            content={editedChapters.find(c => c.id === selectedChapter)?.translated_markdown || ''}
          />
        )}
        <DialogFooter>
          <DefaultButton onClick={handleClosePreview} text="Close" />
        </DialogFooter>
      </Dialog>

      <Dialog
        hidden={!showUnsavedDialog}
        onDismiss={() => setShowUnsavedDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Unsaved Changes',
          subText: 'You have unsaved changes. Would you like to save before exporting?'
        }}
      >
        <DialogFooter>
          <PrimaryButton 
            onClick={() => {
              handleSave();
              onExport();
              setShowUnsavedDialog(false);
            }} 
            text="Save and Export" 
          />
          <DefaultButton
            onClick={() => {
              onExport();
              setShowUnsavedDialog(false);
            }}
            text="Export without Saving"
          />
          <DefaultButton
            onClick={() => setShowUnsavedDialog(false)}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
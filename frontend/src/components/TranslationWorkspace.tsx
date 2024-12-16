import React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  IStackStyles,
  mergeStyles,
  Dialog,
  DialogType,
  DefaultButton,
  DialogFooter, // Add this import
  Icon,
  ProgressIndicator,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';

interface TranslationWorkspaceProps {
  chapters: Array<{ id: string; title: string; content: string }>;
  translatedChapters: Array<{ id: string; content: string }>;
  isTranslating: boolean;
  onTranslate: () => void;
  onUpdateTranslation: (id: string, content: string) => void;
  totalCharCount: number; // Add this prop
}

const workspaceStyles: IStackStyles = {
  root: {
    height: 'calc(100vh - 48px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  }
};

const headerStyles = mergeStyles({
  padding: '24px 32px 0 32px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
  backgroundColor: '#f8f9fa',
  marginBottom: '24px'
});

const contentContainerStyles = mergeStyles({
  flex: 1,
  overflowY: 'auto',
  padding: '0 32px 32px 32px'
});

const gridContainerStyles = mergeStyles({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
  alignItems: 'stretch',
  marginBottom: '32px'
});

const chapterStyles = mergeStyles({
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
  }
});

const chapterHeaderStyles = mergeStyles({
  padding: '20px 24px',
  borderBottom: '1px solid #e9ecef',
  backgroundColor: '#fff',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px'
});

const chapterContentStyles = mergeStyles({
  padding: '24px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px'
});

const estimateBarStyles = mergeStyles({
  backgroundColor: '#EFF6FC',
  padding: '16px 32px',
  borderBottom: '1px solid #DEECF9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const progressBarStyles = mergeStyles({
  backgroundColor: '#fff',
  padding: '16px 24px',
  borderBottom: '1px solid #DEECF9',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  textAlign: 'center'
});

const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const TranslationWorkspace: React.FC<TranslationWorkspaceProps> = ({
  chapters,
  translatedChapters,
  isTranslating,
  onTranslate,
  onUpdateTranslation,
  totalCharCount
}) => {
  const [showEstimate, setShowEstimate] = React.useState(true);
  const estimatedMinutes = Math.ceil((totalCharCount / 500) / 60);
  const translationProgress = translatedChapters.length / chapters.length;

  const handleStartTranslation = () => {
    setShowEstimate(false);
    onTranslate();
  };

  return (
    <Stack styles={workspaceStyles}>
      {isTranslating && (
        <div className={progressBarStyles}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
              Translating... Please wait
            </Text>
            <Spinner size={SpinnerSize.large} />
          </Stack>
        </div>
      )}

      {showEstimate && !isTranslating && translatedChapters.length === 0 && (
        <div className={estimateBarStyles}>
          <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
            <Icon 
              iconName="TimelineProgress" 
              styles={{ root: { color: '#0078d4', fontSize: 20 } }}
            />
            <Text>
              This document contains {totalCharCount.toLocaleString()} characters. 
              Estimated translation time: {estimatedMinutes} {estimatedMinutes === 1 ? 'minute' : 'minutes'}.
            </Text>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton 
              text="Start Translation" 
              onClick={handleStartTranslation}
            />
            <DefaultButton 
              text="Dismiss" 
              onClick={() => setShowEstimate(false)}
            />
          </Stack>
        </div>
      )}

      {/* Fixed Header */}
      <div className={headerStyles}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Original Content
          </Text>
          <PrimaryButton
            text={isTranslating ? 'Translating...' : 'Start Translation'}
            onClick={onTranslate}
            disabled={isTranslating}
          />
        </Stack>
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
          Translation
        </Text>
      </div>

      {/* Scrollable Content */}
      <div className={contentContainerStyles}>
        {chapters.map((chapter, index) => {
          const translatedContent = translatedChapters.find(t => t.id === chapter.id)?.content || '';
          
          return (
            <div key={chapter.id} className={gridContainerStyles} style={{ marginBottom: index < chapters.length - 1 ? '20px' : 0 }}>
              {/* Original Content Box */}
              <div className={chapterStyles}>
                <div className={chapterHeaderStyles}>
                  <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                    {chapter.title || `Chapter ${index + 1}`}
                  </Text>
                </div>
                <div className={chapterContentStyles}>
                  <MarkdownPreview content={chapter.content} />
                </div>
              </div>

              {/* Translation Box */}
              <div className={chapterStyles}>
                <div className={chapterHeaderStyles}>
                  <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                    {chapter.title || `Chapter ${index + 1}`} (Translated)
                  </Text>
                </div>
                <div className={chapterContentStyles}>
                  <MarkdownEditor
                    value={translatedContent}
                    onChange={(content) => onUpdateTranslation(chapter.id, content)}
                    readOnly={isTranslating}
                    placeholder={isTranslating ? 'Translating...' : 'Translation will appear here'}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Stack>
  );
};
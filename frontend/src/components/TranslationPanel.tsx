import React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  ScrollablePane,
  ProgressIndicator,
  useTheme,
  IStackStyles,
  mergeStyles
} from '@fluentui/react';
import { MarkdownPreview } from './MarkdownPreview';

interface TranslationPanelProps {
  chapters: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  onTranslate: () => void;
  isTranslating: boolean;
  translationProgress: number;
  selectedLanguage: string;
}

const containerStyles: IStackStyles = {
  root: {
    width: '50%',
    height: '100%',
    padding: '20px',
    backgroundColor: '#faf9f8'
  }
};

const chapterStyles = mergeStyles({
  backgroundColor: '#ffffff',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '4px',
  boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,0.132), 0 0.3px 0.9px 0 rgba(0,0,0,0.108)'
});

const headerStyles = mergeStyles({
  padding: '12px 0',
  borderBottom: '1px solid #edebe9',
  marginBottom: '20px'
});

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  chapters,
  onTranslate,
  isTranslating,
  translationProgress,
  selectedLanguage
}) => {
  const theme = useTheme();

  return (
    <Stack styles={containerStyles}>
      <Stack.Item className={headerStyles}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Original Content
          </Text>
          <PrimaryButton
            text={isTranslating ? 'Translating...' : 'Start Translation'}
            onClick={onTranslate}
            disabled={isTranslating || !selectedLanguage || chapters.length === 0}
            styles={{
              root: {
                minWidth: 120
              }
            }}
          />
        </Stack>
      </Stack.Item>

      {isTranslating && (
        <Stack.Item styles={{ root: { marginBottom: 16 } }}>
          <ProgressIndicator
            label="Translation Progress"
            description={`Translating chapters... ${Math.round(translationProgress * 100)}%`}
            percentComplete={translationProgress}
          />
        </Stack.Item>
      )}

      <ScrollablePane>
        <Stack tokens={{ childrenGap: 16 }}>
          {chapters.map((chapter) => (
            <Stack key={chapter.id} className={chapterStyles}>
              <Text
                variant="large"
                styles={{
                  root: {
                    fontWeight: 600,
                    color: theme.palette.themePrimary,
                    marginBottom: 8
                  }
                }}
              >
                {chapter.title}
              </Text>
              <MarkdownPreview content={chapter.content} />
            </Stack>
          ))}
        </Stack>
      </ScrollablePane>
    </Stack>
  );
};
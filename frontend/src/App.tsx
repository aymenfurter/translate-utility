import React, { useState, useCallback } from 'react';
import {
  ThemeProvider,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { Header } from './components/Header';
import { DocumentUpload } from './components/DocumentUpload';
import { TranslationWorkspace } from './components/TranslationWorkspace';
import { getThemeWithCustomizations } from './theme';
import * as styles from './styles';
import { mergeStyles } from '@fluentui/merge-styles';
import { saveTranslation, loadTranslation } from './utils/storage';

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface TranslatedChapter {
  id: string;
  content: string;
}

const translateAppContainerStyles = mergeStyles({
  height: '100vh',
  backgroundColor: '#faf9f8',
  display: 'flex',
  flexDirection: 'column'
});

const translateContentStyles = mergeStyles({
  flex: 1,
  overflow: 'auto',
  padding: '0 0 32px 0'
});

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [translatedChapters, setTranslatedChapters] = useState<TranslatedChapter[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('de');
  const [error, setError] = useState<string | null>(null);

  const totalCharCount = React.useMemo(() => 
    chapters.reduce((sum, chapter) => sum + chapter.content.length, 0),
    [chapters]
  );

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload file');
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setChapters(data.chapters.map((ch: any) => ({
        id: ch.id,
        title: ch.title || 'Untitled',
        content: ch.markdown
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslate = async () => {
    if (!chapters.length || !sessionId) return;
    
    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          target_language: selectedLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Translation failed');
      }

      const { job_id } = await response.json();
      pollTranslationStatus(job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setIsTranslating(false);
    }
  };

  const pollTranslationStatus = useCallback((jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch status');
        }

        const data = await response.json();

        if (data.translated_chapters && data.translated_chapters.length > 0) {
          setTranslatedChapters(data.translated_chapters.map((ch: any) => ({
            id: ch.id,
            content: ch.translated_markdown
          })));
        }

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(pollInterval);
          setIsTranslating(false);
          
          if (data.status === 'failed') {
            setError('Translation process failed. Please try again.');
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(pollInterval);
        setIsTranslating(false);
        setError(err instanceof Error ? err.message : 'Failed to check translation status');
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleSave = () => {
    if (!sessionId || !chapters.length || !translatedChapters.length) return;
    
    try {
      saveTranslation({
        sessionId,
        chapters,
        translatedChapters,
        selectedLanguage
      });
      setError('Translation progress saved successfully');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError('Failed to save translation progress');
    }
  };

  const handleLoad = () => {
    try {
      const saved = loadTranslation();
      if (!saved) {
        setError('No saved translation found');
        return;
      }

      setSessionId(saved.sessionId);
      setChapters(saved.chapters);
      setTranslatedChapters(saved.translatedChapters);
      setSelectedLanguage(saved.selectedLanguage);
      
      setError('Translation loaded successfully');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError('Failed to load saved translation');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          chapters: translatedChapters.map(ch => ({
            id: ch.id,
            translated_markdown: ch.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translated-document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleUpdateTranslation = (id: string, content: string) => {
    setTranslatedChapters(prev =>
      prev.map(ch => ch.id === id ? { ...ch, content } : ch)
    );
  };

  return (
    <ThemeProvider theme={getThemeWithCustomizations()}>
      <div className={translateAppContainerStyles}>
        <Header
          onExport={handleExport}
          canExport={translatedChapters.length > 0 && !isTranslating}
          canSave={translatedChapters.length > 0}
          onSave={handleSave}
          onLoad={handleLoad}
        />
        
        <main className={translateContentStyles}>
          {chapters.length === 0 ? (
            <DocumentUpload
              onFileUpload={handleFileUpload}
              onLanguageSelect={setSelectedLanguage}
              selectedLanguage={selectedLanguage}
              isLoading={isUploading}
            />
          ) : (
            <TranslationWorkspace
              chapters={chapters}
              translatedChapters={translatedChapters}
              isTranslating={isTranslating}
              onTranslate={handleTranslate}
              onUpdateTranslation={handleUpdateTranslation}
              totalCharCount={totalCharCount}
            />
          )}

          {error && (
            <MessageBar
              messageBarType={error.includes('success') ? MessageBarType.success : MessageBarType.error}
              isMultiline={false}
              onDismiss={() => setError(null)}
              styles={{ root: { 
                position: 'fixed', 
                bottom: 20, 
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '600px',
                minWidth: '400px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}}
            >
              {error}
            </MessageBar>
          )}

          {isTranslating && (
            <div className={styles.translationStatus}>
              <Spinner 
                label="Translating..." 
                size={SpinnerSize.large} 
              />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
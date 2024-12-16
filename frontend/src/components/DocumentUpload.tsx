import React from 'react';
import { 
  Stack,
  Dropdown,
  IDropdownOption,
  Text,
  Icon,
  useTheme,
  mergeStyles,
  Spinner,
  SpinnerSize,
  IStackStyles
} from '@fluentui/react';
import { SUPPORTED_LANGUAGES } from '../types';

interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
  onLanguageSelect: (language: string) => void;
  selectedLanguage: string;
  isLoading: boolean;
}

const translateUploadContainerStyles = mergeStyles({
  maxWidth: '800px',
  width: '100%',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  margin: '40px auto'
});

const translateUploadZoneStyles = mergeStyles({
  border: '1px dashed #c8c6c4',
  borderRadius: '4px',
  padding: '40px 32px',
  textAlign: 'center',
  backgroundColor: '#faf9f8',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  marginTop: '24px',
  '&:hover': {
    borderColor: '#0078d4',
    backgroundColor: '#f3f2f1'
  }
});

const loadingOverlayStyles = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '4px'
});

const translateFormatListStyles = mergeStyles({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginTop: '24px',
  padding: '16px',
  backgroundColor: '#faf9f8',
  borderRadius: '4px'
});

const formatItemStyles = mergeStyles({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
});

const headerStackStyles: IStackStyles = {
  root: {
    marginBottom: '16px'
  }
};

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileUpload,
  onLanguageSelect,
  selectedLanguage,
  isLoading
}) => {
  const theme = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['.md', '.docx', '.pdf'];
      const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validTypes.includes(fileType)) {
        alert('Please upload a valid file type (Markdown, Word, or PDF)');
        return;
      }

      setSelectedFile(file);
      await onFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    await handleFiles(e.dataTransfer.files);
  };

  return (
    <Stack className={translateUploadContainerStyles}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Upload Document
          </Text>
          <Text variant="medium" styles={{ root: { color: theme.palette.neutralSecondary } }}>
            Choose a document to translate
          </Text>
        </Stack>
        <Dropdown
          placeholder="Select target language"
          selectedKey={selectedLanguage}
          options={SUPPORTED_LANGUAGES}
          styles={{ dropdown: { width: 200 } }}
          onChange={(_, option) => option && onLanguageSelect(option.key as string)}
        />
      </Stack>

      <div
        className={mergeStyles(
          translateUploadZoneStyles,
          dragActive && {
            borderColor: theme.palette.themePrimary,
            backgroundColor: theme.palette.themeLighter
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className={loadingOverlayStyles}>
            <Spinner size={SpinnerSize.large} />
            <Text variant="large" styles={{ root: { color: theme.palette.themePrimary } }}>
              Processing your document...
            </Text>
          </div>
        ) : (
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Icon 
              iconName="CloudUpload" 
              styles={{ root: { fontSize: 40, color: theme.palette.themePrimary } }}
            />
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              {selectedFile 
                ? `Selected: ${selectedFile.name}`
                : 'Drag and drop your file here'
              }
            </Text>
            <Text variant="medium">
              or <span style={{ color: theme.palette.themePrimary, cursor: 'pointer' }}>browse files</span>
            </Text>
          </Stack>
        )}
      </div>

      <div className={translateFormatListStyles}>
        {[
          { icon: 'MarkdownDocument', text: 'Markdown (.md)' },
          { icon: 'WordDocument', text: 'Word (.docx)' },
          { icon: 'PDF', text: 'PDF (.pdf)' }
        ].map((format) => (
          <div key={format.text} className={formatItemStyles}>
            <Icon 
              iconName={format.icon} 
              styles={{ root: { color: theme.palette.themePrimary } }}
            />
            <Text>{format.text}</Text>
          </div>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept=".md,.docx,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {selectedFile && !isLoading && (
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8, padding: '16px 0 0' }}>
          <Text variant="medium" styles={{ root: { color: theme.palette.neutralSecondary } }}>
            File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
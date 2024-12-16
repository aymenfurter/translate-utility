import { mergeStyles } from '@fluentui/react';

export const contentContainer = mergeStyles({
  height: 'calc(100vh - 48px)',
  display: 'flex',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5'
});

export const panelContainer = mergeStyles({
  flex: '1 1 50%',
  padding: '20px',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
});

export const cellContainer = mergeStyles({
  margin: '10px 0',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden'
});

export const cellHeader = mergeStyles({
  padding: '12px 16px',
  borderBottom: '1px solid #edebe9',
  backgroundColor: '#f8f9fa'
});

export const cellContent = mergeStyles({
  padding: '16px',
  minHeight: '100px'
});

export const editorContainer = mergeStyles({
  flex: 1,
  overflow: 'auto',
  paddingRight: '10px'
});

export const translationStatus = mergeStyles({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  maxWidth: '300px'
});
import DOMPurify from 'dompurify';

export const sanitizeMarkdown = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'b', 'i', 'strong', 'em',
      'ul', 'ol', 'li', 'a', 'img', 'code',
      'pre', 'blockquote', 'table', 'thead',
      'tbody', 'tr', 'th', 'td', 'hr', 'del',
      'ins', 'sup', 'sub', 'dl', 'dt', 'dd'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target']
  });
};

export const downloadMarkdown = (content: string, filename: string = 'document.md') => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const validateFileSize = (file: File, maxSize: number = 40 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (filename: string): boolean => {
  const allowedExtensions = ['.md', '.docx', '.pdf'];
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(ext);
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};
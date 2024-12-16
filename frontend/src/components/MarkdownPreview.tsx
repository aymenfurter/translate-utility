import React from 'react';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { Stack, IStackStyles, mergeStyles } from '@fluentui/react';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

interface MarkdownPreviewProps {
  content: string;
}

const containerStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
    position: 'relative',
    lineHeight: '1.6', // Changed to string to ensure it's not interpreted as pixels
    color: '#24292e',
    wordBreak: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  }
};

const markdownStyles = mergeStyles({
  width: '100%',
  maxWidth: '100%',
  display: 'block',
  textAlign: 'left', // Add default left alignment for the container
  
  '& > *': {
    textAlign: 'left' // Ensure all direct children are left-aligned by default
  },

  '& h1': { 
    fontSize: '2em', 
    marginTop: '1.5em',
    marginBottom: '0.5em', 
    fontWeight: 600,
    lineHeight: '1.25', // Fixed lineHeight
    borderBottom: '1px solid #eaecef',
    paddingBottom: '0.3em',
    textAlign: 'left'
  },
  '& h2': { 
    fontSize: '1.5em', 
    marginTop: '1.5em',
    marginBottom: '0.5em', 
    fontWeight: 600,
    lineHeight: '1.25', // Fixed lineHeight
    borderBottom: '1px solid #eaecef',
    paddingBottom: '0.3em',
    textAlign: 'left'
  },
  '& h3': { 
    fontSize: '1.25em', 
    marginTop: '1.5em',
    marginBottom: '0.5em', 
    fontWeight: 600,
    lineHeight: '1.25', // Fixed lineHeight
    textAlign: 'left'
  },
  '& h4, & h5, & h6': { 
    fontSize: '1em', 
    marginTop: '1.5em',
    marginBottom: '0.5em', 
    fontWeight: 600,
    lineHeight: '1.25', // Fixed lineHeight
    textAlign: 'left'
  },
  '& p': { 
    marginTop: 0,
    marginBottom: '16px',
    lineHeight: '1.6', // Fixed lineHeight
    fontSize: '14px',
    whiteSpace: 'normal', // Add this
    textAlign: 'left !important', // Force left alignment for paragraphs
    maxWidth: '100%', // Ensure text doesn't overflow
    '& br': {
      display: 'inline', // Show line breaks in paragraphs
      content: '" "' // Add space after line break
    },
    '&:empty': {
      display: 'none' // Hide empty paragraphs
    },
    '& br': {
      display: 'block',
      content: '""',
      marginBottom: '8px'
    }
  },
  '& ul, & ol': { 
    marginTop: 0,
    marginBottom: '16px',
    paddingLeft: '2em',
    lineHeight: '1.6' // Added lineHeight for lists
  },
  '& li': { 
    marginTop: '0.25em',
    marginBottom: '0.25em',
    lineHeight: '1.6' // Added lineHeight for list items
  },
  '& li + li': {
    marginTop: '0.25em'
  },
  '& table': {
    display: 'block',
    width: '100%',
    overflow: 'auto',
    marginTop: 0,
    marginBottom: '16px',
    borderSpacing: 0,
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  '& table tr': {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e1e4e8'
  },
  '& table th, & table td': {
    padding: '6px 13px',
    border: '1px solid #e1e4e8',
    lineHeight: '1.5' // Fixed lineHeight for table cells
  },
  '& table th': { 
    fontWeight: 600,
    backgroundColor: '#f6f8fa'
  },
  '& code': {
    padding: '0.2em 0.4em',
    margin: 0,
    fontSize: '85%',
    backgroundColor: 'rgba(27,31,35,0.05)',
    borderRadius: '3px',
    fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace'
  },
  '& pre': {
    padding: '16px',
    overflow: 'auto',
    fontSize: '85%',
    lineHeight: '1.45', // Fixed lineHeight for pre blocks
    backgroundColor: '#f6f8fa',
    borderRadius: '3px',
    marginTop: 0,
    marginBottom: '16px',
    wordWrap: 'normal'
  },
  '& pre code': {
    display: 'inline',
    padding: 0,
    margin: 0,
    overflow: 'visible',
    lineHeight: 'inherit',
    wordWrap: 'normal',
    backgroundColor: 'transparent',
    border: 0,
    fontSize: '100%',
    wordBreak: 'normal',
    whiteSpace: 'pre'
  },
  '& blockquote': {
    padding: '0 1em',
    color: '#6a737d',
    borderLeft: '0.25em solid #dfe2e5',
    marginTop: 0,
    marginBottom: '16px',
    lineHeight: '1.6' // Added lineHeight for blockquotes
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '16px auto', // Center images but keep text left-aligned
    borderRadius: '4px'
  },
  '& hr': {
    height: '0.25em',
    padding: 0,
    margin: '24px 0',
    backgroundColor: '#e1e4e8',
    border: 0
  },
  '& figure': {
    margin: '24px 0',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    '& > p:empty, & > p:blank': {  // Only hide empty paragraphs
      display: 'none'
    },
    '& > *': {
      textAlign: 'left' // Ensure all figure content is left-aligned
    },
    '& > p': {
      textAlign: 'left',
      marginBottom: '8px'
    },
    // Only use grid for specific data visualizations
    '&:has(p:first-child:matches([=\\-\\d₸.]{1,2}))': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
      gap: '8px',
      padding: '16px',
      '& > p': {
        margin: 0,
        padding: '4px',
        textAlign: 'center', // Center only for grid items
        backgroundColor: '#fff',
        borderRadius: '4px',
        minWidth: '30px'
      }
    }
  },
  '& figcaption': {
    marginTop: '12px',
    fontSize: '14px',
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    gridColumn: '1 / -1', // Make caption span all columns in grid layout
    borderTop: '1px solid #e9ecef',
    paddingTop: '12px',
    marginBottom: 0
  },
  '& p:has(> br + br)': { // Targets paragraphs with multiple line breaks
    display: 'inline-block',
    marginRight: '16px',
    marginBottom: '8px'
  },
  '& p:has(☐)': {
    marginBottom: '8px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef'
  },
  '& figcaption': {
    marginTop: '8px',
    fontSize: '14px',
    color: '#6a737d',
    lineHeight: '1.5' // Added lineHeight for figcaptions
  },
  '& figure:empty': {
    display: 'none'
  },
  '& p:has(%)': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '4px 0'
  },

  // Add specific styles for table of contents
  '& h1:first-of-type': { 
    marginTop: '0.5em' // Reduce top margin for first heading
  },

  '& h1:first-of-type + p, & h1:first-of-type + p + p': {
    marginBottom: '8px',
    paddingLeft: '16px',
    borderLeft: '2px solid #e9ecef',
    lineHeight: '1.8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '& br': {
      content: '""',
      display: 'block',
      marginBottom: '8px'
    }
  },

  // Add styles for the container when it contains a table of contents
  '&:has(h1:first-child:contains("Inhaltsverzeichnis"))': {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '& h1:first-of-type': {
      fontSize: '1.5em',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e9ecef'
    }
  }
});

const sanitizeOptions = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'b', 'i', 'strong', 'em',
    'ul', 'ol', 'li', 'a', 'img', 'code',
    'pre', 'blockquote', 'table', 'thead',
    'tbody', 'tr', 'th', 'td', 'hr',
    'figure', 'figcaption', 'div', 'span' // Added div and span
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 
    'id', 'name', 'width', 'height', // Added more attributes
    'style', 'data-*' // Allow style and data attributes
  ],
  ADD_TAGS: ['br'], 
  KEEP_CONTENT: true,
  ALLOW_DATA_ATTR: true,
  WHOLE_DOCUMENT: false, // Added to ensure proper fragment handling
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  FORCE_BODY: false,
  transformTags: {
    'br': (tagName: string, attribs: any) => ({
      tagName: 'br',
      attribs: {}
    }),
    'figure': (tagName: string, attribs: any, innerHTML: string) => {
      // Only keep figures that have actual content
      if (!innerHTML || innerHTML.trim() === '') {
        return {
          tagName: 'span',
          attribs: {},
          text: ''
        };
      }
      return {
        tagName: 'figure',
        attribs: attribs
      };
    },
    'p': (tagName: string, attribs: any, innerHTML: string) => {
      // Clean up special characters and normalize content
      let cleanContent = innerHTML
        .replace(/☐/g, '') // Remove checkbox character
        .replace(/<br\s*\/?>/g, ' ') // Replace <br> with space
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Don't create empty paragraphs
      if (!cleanContent) {
        return {
          tagName: 'span',
          attribs: {},
          text: ''
        };
      }

      return {
        tagName: 'p',
        attribs: attribs,
        text: cleanContent
      };
    },
    'figcaption': (tagName: string, attribs: any, innerHTML: string) => ({
      tagName: 'figcaption',
      attribs: attribs,
      text: innerHTML.replace(/<br\s*\/?>/g, ' ').trim()
    }),
    'div': (tagName: string, attribs: any) => ({
      tagName: 'div',
      attribs: attribs
    }),
    'span': (tagName: string, attribs: any) => ({
      tagName: 'span',
      attribs: attribs
    })
  }
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const html = React.useMemo(() => {
    const rendered = md.render(content);
    return DOMPurify.sanitize(rendered, sanitizeOptions);
  }, [content]);

  return (
    <Stack styles={containerStyles}>
      <div
        className={markdownStyles}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Stack>
  );
};
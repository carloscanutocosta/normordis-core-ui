import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'del',
    'ins',
    'mark',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'pre',
    'code',
    'a',
    'span',
    'div',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'img',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
};

/**
 * Renders sanitized rich-text HTML. Input is always passed through DOMPurify
 * before rendering to prevent XSS, regardless of source.
 */
interface RichTextDisplayProps {
  value?: string;
  className?: string;
}

export default function RichTextDisplay({ value, className }: RichTextDisplayProps) {
  const clean = useMemo(() => (value ? DOMPurify.sanitize(value, PURIFY_CONFIG) : ''), [value]);

  if (!clean) return <span className="text-sm text-muted-foreground italic">—</span>;

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-foreground',
        '[&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold',
        '[&_p]:text-sm [&_p]:leading-relaxed',
        '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:text-sm',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_a]:text-primary [&_a]:underline',
        '[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

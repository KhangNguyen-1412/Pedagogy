import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Component to render text containing LaTeX mathematical expressions.
 * Supports:
 * - Block math: $$formula$$
 * - Inline math: $formula$
 * - Plain text and newlines
 */
export const MathText = ({ text = '', className = '', tag = 'span' }) => {
    const renderedNodes = useMemo(() => {
        if (!text) return null;
        const str = String(text);

        // Regex to match block math $$...$$ and inline math $...$
        const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(str)) !== null) {
            // Push preceding plain text
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: str.substring(lastIndex, match.index)
                });
            }

            const rawMatch = match[0];
            if (rawMatch.startsWith('$$') && rawMatch.endsWith('$$')) {
                parts.push({
                    type: 'math-block',
                    content: rawMatch.slice(2, -2).trim()
                });
            } else if (rawMatch.startsWith('$') && rawMatch.endsWith('$')) {
                parts.push({
                    type: 'math-inline',
                    content: rawMatch.slice(1, -1).trim()
                });
            }

            lastIndex = regex.lastIndex;
        }

        // Push trailing text
        if (lastIndex < str.length) {
            parts.push({
                type: 'text',
                content: str.substring(lastIndex)
            });
        }

        return parts.map((part, index) => {
            if (part.type === 'math-block') {
                try {
                    const html = katex.renderToString(part.content, {
                        displayMode: true,
                        throwOnError: false
                    });
                    return (
                        <div
                            key={index}
                            className="my-2 overflow-x-auto py-1 text-center select-text"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                } catch (err) {
                    return <code key={index} className="text-red-500 font-mono text-xs">{part.content}</code>;
                }
            }

            if (part.type === 'math-inline') {
                try {
                    const html = katex.renderToString(part.content, {
                        displayMode: false,
                        throwOnError: false
                    });
                    return (
                        <span
                            key={index}
                            className="inline-block px-0.5 select-text"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                } catch (err) {
                    return <code key={index} className="text-red-500 font-mono text-xs">${part.content}$</code>;
                }
            }

            // Normal text with newline splitting
            const lines = part.content.split('\n');
            return (
                <span key={index}>
                    {lines.map((line, lIdx) => (
                        <React.Fragment key={lIdx}>
                            {line}
                            {lIdx < lines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </span>
            );
        });
    }, [text]);

    const Tag = tag;

    return (
        <Tag className={`leading-relaxed ${className}`}>
            {renderedNodes}
        </Tag>
    );
};

export default MathText;

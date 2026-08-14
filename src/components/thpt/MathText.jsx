import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Parses rich inline text formatting:
 * - HTML tags: <u>, <b>, <strong>, <i>, <em>, <mark>, <s>, <del>, <sup>, <sub>, <code>
 * - Markdown tokens: **bold**, *italic*, ~~strikethrough~~, `code`
 * - LaTeX inline command: \underline{...}
 */
const parseRichInline = (rawText) => {
    if (!rawText) return null;

    const tokenRegex = /(<u>[\s\S]*?<\/u>|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>|<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>|<mark>[\s\S]*?<\/mark>|<s>[\s\S]*?<\/s>|<del>[\s\S]*?<\/del>|<sup>[\s\S]*?<\/sup>|<sub>[\s\S]*?<\/sub>|\*\*[\s\S]+?\*\*|\*[^\*\n]+?\*|~~[\s\S]+?~~|`[^`\n]+`|\\underline\{([^{}]+)\})/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(rawText)) !== null) {
        if (match.index > lastIndex) {
            parts.push({
                type: 'plain',
                content: rawText.substring(lastIndex, match.index)
            });
        }

        const tagStr = match[0];
        const lower = tagStr.toLowerCase();

        if (lower.startsWith('<u>') && lower.endsWith('</u>')) {
            parts.push({
                type: 'u',
                content: tagStr.slice(3, -4)
            });
        } else if (tagStr.startsWith('\\underline{') && tagStr.endsWith('}')) {
            parts.push({
                type: 'u',
                content: tagStr.slice(11, -1)
            });
        } else if ((lower.startsWith('<b>') && lower.endsWith('</b>')) || (lower.startsWith('<strong>') && lower.endsWith('</strong>'))) {
            const inner = lower.startsWith('<b>') ? tagStr.slice(3, -4) : tagStr.slice(8, -9);
            parts.push({
                type: 'b',
                content: inner
            });
        } else if (tagStr.startsWith('**') && tagStr.endsWith('**')) {
            parts.push({
                type: 'b',
                content: tagStr.slice(2, -2)
            });
        } else if ((lower.startsWith('<i>') && lower.endsWith('</i>')) || (lower.startsWith('<em>') && lower.endsWith('</em>'))) {
            const inner = lower.startsWith('<i>') ? tagStr.slice(3, -4) : tagStr.slice(4, -5);
            parts.push({
                type: 'i',
                content: inner
            });
        } else if (tagStr.startsWith('*') && tagStr.endsWith('*')) {
            parts.push({
                type: 'i',
                content: tagStr.slice(1, -1)
            });
        } else if (lower.startsWith('<mark>') && lower.endsWith('</mark>')) {
            parts.push({
                type: 'mark',
                content: tagStr.slice(6, -7)
            });
        } else if ((lower.startsWith('<s>') && lower.endsWith('</s>')) || (lower.startsWith('<del>') && lower.endsWith('</del>'))) {
            const inner = lower.startsWith('<s>') ? tagStr.slice(3, -4) : tagStr.slice(5, -6);
            parts.push({
                type: 's',
                content: inner
            });
        } else if (tagStr.startsWith('~~') && tagStr.endsWith('~~')) {
            parts.push({
                type: 's',
                content: tagStr.slice(2, -2)
            });
        } else if (lower.startsWith('<sup>') && lower.endsWith('</sup>')) {
            parts.push({
                type: 'sup',
                content: tagStr.slice(5, -6)
            });
        } else if (lower.startsWith('<sub>') && lower.endsWith('</sub>')) {
            parts.push({
                type: 'sub',
                content: tagStr.slice(5, -6)
            });
        } else if (tagStr.startsWith('`') && tagStr.endsWith('`')) {
            parts.push({
                type: 'code',
                content: tagStr.slice(1, -1)
            });
        }

        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < rawText.length) {
        parts.push({
            type: 'plain',
            content: rawText.substring(lastIndex)
        });
    }

    return parts.map((p, idx) => {
        if (p.type === 'u') {
            return (
                <u key={idx} className="underline underline-offset-4 decoration-2 decoration-current font-medium">
                    {parseRichInline(p.content)}
                </u>
            );
        }
        if (p.type === 'b') {
            return (
                <strong key={idx} className="font-bold text-inherit">
                    {parseRichInline(p.content)}
                </strong>
            );
        }
        if (p.type === 'i') {
            return (
                <em key={idx} className="italic text-inherit">
                    {parseRichInline(p.content)}
                </em>
            );
        }
        if (p.type === 'mark') {
            return (
                <mark key={idx} className="bg-yellow-200 text-yellow-950 px-1 py-0.5 rounded-xs">
                    {parseRichInline(p.content)}
                </mark>
            );
        }
        if (p.type === 's') {
            return (
                <s key={idx} className="line-through opacity-70">
                    {parseRichInline(p.content)}
                </s>
            );
        }
        if (p.type === 'sup') {
            return <sup key={idx} className="text-[0.75em] leading-none">{parseRichInline(p.content)}</sup>;
        }
        if (p.type === 'sub') {
            return <sub key={idx} className="text-[0.75em] leading-none">{parseRichInline(p.content)}</sub>;
        }
        if (p.type === 'code') {
            return (
                <code key={idx} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono text-[0.85em] text-brand-jasper">
                    {p.content}
                </code>
            );
        }
        return p.content;
    });
};

/**
 * Component to render text containing LaTeX mathematical expressions, rich text formatting (<u>, <b>, etc.), LaTeX tables, & Markdown tables.
 */
export const MathText = ({ text = '', className = '', tag = 'span' }) => {
    const renderedNodes = useMemo(() => {
        if (!text) return null;
        let str = String(text);

        // 1. Normalize \begin{tabular} to \begin{array}
        str = str
            .replace(/\\begin\{tabular\}/gi, '\\begin{array}')
            .replace(/\\end\{tabular\}/gi, '\\end{array}');

        // 2. Auto-wrap un-wrapped LaTeX environments (\begin{array}, \begin{matrix}, \begin{cases}) in $$...$$
        str = str.replace(
            /(?<!\$)(?:\\begin\{(array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases|aligned|gathered)\}[\s\S]*?\\end\{\1\})(?!\$)/g,
            (match) => `\n$$${match}$$\n`
        );

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
                            className="my-2.5 overflow-x-auto py-1 text-center select-text"
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

            // Normal text: check if contains Markdown tables, blockquotes or newlines
            const lines = part.content.split('\n');
            const hasMarkdownTable = lines.some(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
            const hasBlockQuote = lines.some(l => l.trim().startsWith('>'));

            if (!hasMarkdownTable && !hasBlockQuote) {
                return (
                    <span key={index}>
                        {lines.map((line, lIdx) => (
                            <React.Fragment key={lIdx}>
                                {parseRichInline(line)}
                                {lIdx < lines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </span>
                );
            }

            // Render text with embedded Markdown Table & Blockquote support
            const elements = [];
            let i = 0;
            while (i < lines.length) {
                const line = lines[i];
                const trimmed = line.trim();

                if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
                    const tableRows = [];
                    while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                        const rowStr = lines[i].trim();
                        // Ignore separator line like |---|---|
                        if (!/^[\|\s\-:]+$/.test(rowStr)) {
                            const cells = rowStr.slice(1, -1).split('|').map(c => c.trim());
                            tableRows.push(cells);
                        }
                        i++;
                    }

                    if (tableRows.length > 0) {
                        elements.push(
                            <div key={`${index}_tbl_${i}`} className="my-2.5 overflow-x-auto">
                                <table className="border-collapse border border-brand-cerulean/30 bg-white text-xs shadow-sm mx-auto">
                                    <tbody>
                                        {tableRows.map((row, rIdx) => (
                                            <tr key={rIdx} className={rIdx === 0 ? 'bg-brand-cerulean/10 font-bold' : 'hover:bg-brand-cream/30'}>
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="border border-brand-cerulean/20 px-3 py-1.5 text-center font-body text-brand-ink">
                                                        <MathText text={cell} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                } else if (trimmed.startsWith('>')) {
                    const quoteLines = [];
                    while (i < lines.length && lines[i].trim().startsWith('>')) {
                        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
                        i++;
                    }
                    elements.push(
                        <blockquote key={`${index}_quote_${i}`} className="my-2.5 pl-4 py-2 border-l-4 border-brand-cerulean bg-brand-cerulean/5 italic text-gray-700 font-serif">
                            {quoteLines.map((qLine, qIdx) => (
                                <React.Fragment key={qIdx}>
                                    {parseRichInline(qLine)}
                                    {qIdx < quoteLines.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </blockquote>
                    );
                } else {
                    elements.push(
                        <React.Fragment key={`${index}_line_${i}`}>
                            {parseRichInline(line)}
                            {i < lines.length - 1 && <br />}
                        </React.Fragment>
                    );
                    i++;
                }
            }

            return <span key={index}>{elements}</span>;
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

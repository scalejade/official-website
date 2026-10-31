import { Fragment, type ReactNode } from 'react';

// Blog paragraphs are plain text (they come from /api/posts, often written by an
// agent). Turn bare https:// URLs into links so a "Sources" section is usable.
// Returns React nodes — never HTML — so post text cannot inject markup.
const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+[^\s<>"')\].,;:!?])/g;

export function linkify(text: string): ReactNode {
    const parts = text.split(URL_PATTERN);
    if (parts.length === 1) return text;
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-scalejade-700 underline underline-offset-2 break-words hover:text-scalejade-900"
            >
                {part}
            </a>
        ) : (
            <Fragment key={i}>{part}</Fragment>
        )
    );
}

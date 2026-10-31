"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { isOptimizable } from '@/lib/images';

export type GalleryImage = {
    id: string;
    url: string;
    alt: string;
    caption: string | null;
    kind: string;
};

type Labels = {
    open: string;
    close: string;
    previous: string;
    next: string;
    kinds: Record<string, string>;
};

function Photo({ image, sizes, priority }: { image: GalleryImage; sizes: string; priority?: boolean }) {
    return (
        <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={!isOptimizable(image.url)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
    );
}

export function ProjectGallery({ images, labels }: { images: GalleryImage[]; labels: Labels }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [active, setActive] = useState<number | null>(null);

    const open = (index: number) => {
        setActive(index);
        dialogRef.current?.showModal();
    };
    const close = useCallback(() => dialogRef.current?.close(), []);
    const step = useCallback(
        (delta: number) => setActive((i) => (i === null ? i : (i + delta + images.length) % images.length)),
        [images.length]
    );

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        const onClose = () => setActive(null);
        dialog.addEventListener('keydown', onKey);
        dialog.addEventListener('close', onClose);
        return () => {
            dialog.removeEventListener('keydown', onKey);
            dialog.removeEventListener('close', onClose);
        };
    }, [step]);

    if (images.length === 0) return null;

    const [lead, ...rest] = images;
    const current = active === null ? null : images[active];

    const tile = (image: GalleryImage, index: number, aspect: string, sizes: string, priority = false) => (
        <figure key={image.id}>
            <button
                type="button"
                onClick={() => open(index)}
                aria-label={`${labels.open}: ${image.alt}`}
                className={`group relative block w-full ${aspect} overflow-hidden rounded-xl border border-slate-200 bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-600`}
            >
                <Photo image={image} sizes={sizes} priority={priority} />
            </button>
            {(image.caption || labels.kinds[image.kind]) && (
                <figcaption className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {labels.kinds[image.kind] && (
                        <span className="font-medium text-slate-900">{labels.kinds[image.kind]}</span>
                    )}
                    {labels.kinds[image.kind] && image.caption && ' — '}
                    {image.caption}
                </figcaption>
            )}
        </figure>
    );

    return (
        <>
            <div className="space-y-8">
                {tile(lead, 0, 'aspect-[16/9]', '(max-width: 1024px) 100vw, 1024px', true)}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {rest.map((image, i) => tile(image, i + 1, 'aspect-[4/3]', '(max-width: 640px) 100vw, 512px'))}
                    </div>
                )}
            </div>

            <dialog
                ref={dialogRef}
                aria-label={current?.alt}
                className="m-auto h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink-900/90"
                onClick={(e) => e.target === e.currentTarget && close()}
            >
                {current && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-10" onClick={(e) => e.target === e.currentTarget && close()}>
                        <div className="relative h-[75vh] w-full max-w-6xl">
                            <Image
                                src={current.url}
                                alt={current.alt}
                                fill
                                sizes="100vw"
                                unoptimized={!isOptimizable(current.url)}
                                className="object-contain"
                            />
                        </div>
                        {current.caption && <p className="max-w-3xl text-center text-sm text-white/85">{current.caption}</p>}

                        <button
                            type="button"
                            onClick={close}
                            aria-label={labels.close}
                            autoFocus
                            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => step(-1)}
                                    aria-label={labels.previous}
                                    className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                                >
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => step(1)}
                                    aria-label={labels.next}
                                    className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                                >
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </dialog>
        </>
    );
}

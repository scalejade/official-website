"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { isOptimizable } from '@/lib/images';

export type CoverImage = { id: string; url: string; alt: string };

const INTERVAL_MS = 3000;
const SLIDE_MS = 700;

/**
 * Cover image for a project in the /portfolio list. With several images it
 * advances on its own every 3 s — no controls, swipe or drag by design; the
 * card as a whole links to the project. It only runs while the card is on
 * screen and the tab is visible. With `prefers-reduced-motion` the images
 * cross-fade instead of sliding.
 *
 * Fills its parent: the parent sets the size, aspect ratio and rounding.
 */
export function CoverSlideshow({ images, sizes }: { images: CoverImage[]; sizes: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0); // 0..images.length (the last is a clone of the first)
    const [animate, setAnimate] = useState(true);
    const [visible, setVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const count = images.length;
    const multiple = count > 1;

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    // Run only while the card is in view and the page is visible.
    useEffect(() => {
        if (!multiple || !cardRef.current) return;
        let inView = false;
        const sync = () => setVisible(inView && document.visibilityState === 'visible');
        const observer = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            sync();
        }, { threshold: 0.5 });
        observer.observe(cardRef.current);
        document.addEventListener('visibilitychange', sync);
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
        };
    }, [multiple]);

    useEffect(() => {
        if (!multiple || !visible) return;
        const timer = setInterval(() => {
            setAnimate(true);
            setIndex((i) => (reducedMotion ? (i + 1) % count : i + 1));
        }, INTERVAL_MS);
        return () => clearInterval(timer);
    }, [multiple, visible, reducedMotion, count]);

    // After sliding onto the clone of the first image, jump back to the real
    // first image without animation, so the loop always moves forward.
    useEffect(() => {
        if (index !== count || reducedMotion) return;
        const reset = setTimeout(() => {
            setAnimate(false);
            setIndex(0);
        }, SLIDE_MS);
        return () => clearTimeout(reset);
    }, [index, count, reducedMotion]);

    if (count === 0) return null;

    const active = index % count;
    const photo = (image: CoverImage, alt: string) => (
        <Image
            src={image.url}
            alt={alt}
            fill
            sizes={sizes}
            // Off-screen slides sit beside the card, so lazy loading would
            // leave them blank the first time they slide in.
            loading="eager"
            unoptimized={!isOptimizable(image.url)}
            className="object-cover"
        />
    );

    return (
        <div ref={cardRef} className="relative h-full w-full">
            {reducedMotion || !multiple ? (
                images.map((image, i) => (
                    <div
                        key={image.id}
                        aria-hidden={i !== active}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {photo(image, image.alt)}
                    </div>
                ))
            ) : (
                <div
                    className="flex h-full"
                    style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
                    }}
                >
                    {[...images, images[0]].map((image, i) => {
                        const isClone = i === count;
                        return (
                            <div
                                key={isClone ? `${image.id}-clone` : image.id}
                                aria-hidden={isClone || i !== active}
                                className="relative h-full w-full shrink-0"
                            >
                                {photo(image, isClone ? '' : image.alt)}
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

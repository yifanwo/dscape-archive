// src/components/ChapterSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterConfig, ArchiveItem } from '@/data/archiveConfig';
import ObjectCard from './ObjectCard';

interface Props {
  chapter: ChapterConfig;
  chapterIndex: number;
  onChapterEnter: (bgGradient: string, accentColor: string) => void;
  onInspect: (item: ArchiveItem) => void;
  onScrollActive?: (item: ArchiveItem) => void;
}

export default function ChapterSection({
  chapter,
  chapterIndex,
  onChapterEnter,
  onInspect,
  onScrollActive,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Shift atmospheric gradient when scrolling into this chapter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => onChapterEnter(chapter.bgGradient, chapter.accentColor),
        onEnterBack: () =>
          onChapterEnter(chapter.bgGradient, chapter.accentColor),
      });

      // Reveal chapter title lines
      gsap.from('.chap-title-text', {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [chapter, onChapterEnter]);

  return (
    <div id={chapter.id} ref={sectionRef}>
      {/* CHAPTER BANNER ROW (Level 2) */}
      <section
        className="archive-grid-row"
        style={{ background: 'rgba(24, 22, 21, 0.03)' }}
      >
        {/* Left Edge: Chapter Number & Kanji/Code */}
        <aside className="edge-rail left">
          <div>
            <div className="meta-row">
              <span className="meta-label">CHAPTER</span>
              <span className="meta-value">{chapter.number}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">SEQUENCE</span>
              <span className="meta-value">{chapter.kanjiOrCode}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">ERA SPAN</span>
              <span className="meta-value">{chapter.eraSpan}</span>
            </div>
          </div>
        </aside>

        {/* Center: Chapter One-Word Title & Subline */}
        <div style={{ padding: '56px 40px' }}>
          <div className="line-mask">
            <p
              className="chap-title-text"
              style={{
                fontSize: 12,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: chapter.accentColor,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {chapter.number} — {chapter.subline}
            </p>
          </div>
          <div className="line-mask">
            <h2 className="chapter-display chap-title-text">{chapter.title}</h2>
          </div>
        </div>

        {/* Right Edge: Chapter Curatorial Intro */}
        <aside className="edge-rail right">
          <div className="meta-row">
            <span className="meta-label">NODES</span>
            <span className="meta-value">
              0{chapter.items.length} ARTIFACTS
            </span>
          </div>
          <div style={{ padding: '20px', fontSize: 13, lineHeight: 1.6 }}>
            {chapter.intro}
          </div>
        </aside>
      </section>

      {/* OBJECT sequence WITHIN THIS CHAPTER (Level 3) */}
      {chapter.items.map((item, idx) => (
        <ObjectCard
          key={item.id}
          item={item}
          chapterTitle={chapter.title}
          chapterNumber={chapter.number}
          accentColor={chapter.accentColor}
          sequenceNumber={`0${chapterIndex + 1}.0${idx + 1}`}
          onInspect={onInspect}
          onScrollActive={onScrollActive}
        />
      ))}
    </div>
  );
}

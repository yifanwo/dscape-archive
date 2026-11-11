// src/components/HeaderFrame.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ARCHIVE_METADATA, CHAPTERS } from '@/data/archiveConfig';

interface Props {
  accentColor: string;
  activeChapterId?: string;
}

export default function HeaderFrame({ accentColor, activeChapterId }: Props) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      {/* Left Cell: Archive Title & Live Status Dot */}
      <div className="header-cell">
        <a
          href="#top"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
          }}
        >
          {ARCHIVE_METADATA.title}
        </a>
        <span
          style={{
            color: accentColor,
            fontSize: 14,
            transition: 'color 0.4s ease',
          }}
          title="Active Chapter Signal"
        >
          ●
        </span>
      </div>

      {/* Center Cell: 3 Chapter Jump Links */}
      <nav
        className="header-cell"
        style={{ justifyContent: 'center', gap: '28px' }}
      >
        {CHAPTERS.map((chap) => {
          const isActive = activeChapterId === chap.id;
          return (
            <a
              key={chap.id}
              href={`#${chap.id}`}
              style={{
                textDecoration: 'none',
                color: isActive ? accentColor : 'inherit',
                fontWeight: isActive ? 700 : 400,
                transition: 'color 0.3s ease',
              }}
            >
              {chap.number}: {chap.title}
            </a>
          );
        })}
      </nav>

      {/* Right Cell: Exhibition Subtitle & Timespan */}
      <div className="header-cell">
        <span>RELICS TO NODES</span>
        <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.75 }}>
          [ 1990—2012 ]
        </span>
      </div>
    </header>
  );
}

// src/components/HeroCover.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ARCHIVE_METADATA, CHAPTERS } from '@/data/archiveConfig';

export default function HeroCover() {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.35 },
      });

      tl.from('.cover-title-line', {
        yPercent: 115,
        rotateZ: 1.5,
        stagger: 0.12,
        delay: 0.2,
      })
       
        .from(
          '.cover-intro-box',
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.inOut',
          },
          '-=0.8'
        );
    }, coverRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={coverRef} className="archive-grid-row">
      {/* LEFT EDGE RAIL: Archive Provenance */}
      <aside className="edge-rail left">
        <div>
          <div className="meta-row cover-meta-row">
            <span className="meta-label">Location</span>
            <span className="meta-value">HKUST Library</span>
          </div>
          <div className="meta-row cover-meta-row">
            <span className="meta-label">CURATOR</span>
            <span className="meta-value">{ARCHIVE_METADATA.curator}</span>
          </div>
          <div className="meta-row cover-meta-row">
            <span className="meta-label">VERSION</span>
            <span className="meta-value">v{ARCHIVE_METADATA.version}</span>
          </div>
          <div className="meta-row cover-meta-row">
            <span className="meta-label">TIMESPAN</span>
            <span className="meta-value">1990 — 2012</span>
          </div>
        </div>

        <div className="meta-row cover-meta-row" style={{ borderBottom: 'none' }}>
          <span className="meta-label">TOTAL RELICS</span>
          <span className="meta-value">08 HARDWARE NODES</span>
        </div>
      </aside>

      {/* CENTER STAGE: Split Display Typography & Thesis */}
      <div
        style={{
          padding: '72px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '82vh',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.14em' }}>
          <span>[ PROLOGUE ]</span>
          <span><a href ="https://library.hkust.edu.hk/ds">HKUST LIBRARY DIGITAL SCHOLARSHIP</a></span>
        </div>

        <div style={{ margin: '48px 0' }}>
          <div className="line-mask">
            <h1 className="hero-display cover-title-line">PHYSICAL</h1>
          </div>
          <div className="line-mask">
            <h1
              className="hero-display cover-title-line"
            >
              <span style={{ color: 'var(--accent-active)' }}>RELICS</span> TO
            </h1>
          </div>
          <div className="line-mask">
            <h1 className="hero-display cover-title-line">NETWORKED</h1>
          </div>
          <div className="line-mask">
            <h1 className="hero-display cover-title-line" style={{ color: 'var(--accent-active)' }}>NODES</h1>
          </div>
        </div>

        <div
          className="cover-intro-box"
          style={{
            border: 'var(--hairline)',
            padding: '24px',
            background: 'rgba(255,255,255,0.35)',
            maxWidth: '680px',
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>
            The exhibition is divided into three acts: the age of physical
            distribution (<strong>RECORDS</strong>), the era of local
            infrastructure management (<strong>SYSTEMS</strong>), and the
            transition to connected networks (<strong>NETWORKS</strong>).
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--ink-muted)',
              borderTop: 'var(--hairline)',
              paddingTop: 12,
            }}
          >
            <span>SCROLL TO TRACE EVOLUTION ↓</span>
            <span>3 ACTS // 8 OBJECTS</span>
          </div>
        </div>
      </div>

      {/* RIGHT EDGE RAIL: Chapter Index Jump-Links */}
      <aside className="edge-rail right">
        <div>
          <div className="meta-row cover-meta-row">
            <span className="meta-label">INDEX</span>
            <span className="meta-value">CHAPTER DIRECTORY</span>
          </div>
          {CHAPTERS.map((chap) => (
            <a
              key={chap.id}
              href={`#${chap.id}`}
              className="meta-row cover-meta-row"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
              }}
            >
              <span className="meta-label">{chap.number}</span>
              <span className="meta-value">
                {chap.title} ({chap.items.length}) →
              </span>
            </a>
          ))}
        </div>

        <div style={{ padding: '20px', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-muted)' }}>
          Each artifact is connected by a continuous vertical signal line,
          tracing how library data migrated from half-inch magnetic tape to
          Gigabit NAS appliances.
        </div>
      </aside>
    </section>
  );
}

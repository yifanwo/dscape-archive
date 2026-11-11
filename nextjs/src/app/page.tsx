// src/app/page.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import HeroCover from '@/components/HeroCover';
import ChapterSection from '@/components/ChapterSection';
import ObjectModalDrawer from '../components/ObjectModalDrawer';
import {
  ArchiveItem,
  ARCHIVE_METADATA,
  CHAPTERS,
  GENERAL_RESOURCES,
} from '@/data/archiveConfig';

const ALL_ORDERED_ITEMS: ArchiveItem[] = CHAPTERS.flatMap((c) => c.items);

export default function ArchivePage() {
  const [bgGradient, setBgGradient] = useState<string>(CHAPTERS[0].bgGradient);
  const [accentColor, setAccentColor] = useState<string>(
    CHAPTERS[0].accentColor
  );
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const isProgrammaticScroll = useRef(false);

  const handleSelectObject = useCallback(
    (targetItem: ArchiveItem, shouldScrollPage: boolean) => {
      setSelectedItem(targetItem);
      if (shouldScrollPage) {
        const el = document.getElementById(targetItem.id);
        if (el) {
          isProgrammaticScroll.current = true;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 900);
        }
      }
    },
    []
  );

  const handleScrollActive = useCallback((scrolledItem: ArchiveItem) => {
    if (isProgrammaticScroll.current) return;
    setSelectedItem((prevOpenItem) =>
      prevOpenItem ? scrolledItem : null
    );
  }, []);


  const handleChapterEnter = useCallback(
    (newBg: string, newAccent: string) => {
      setBgGradient(newBg);
      setAccentColor(newAccent);
    },
    []
  );

  return (
    <SmoothScroll>
      {/* Dynamic Ukiyo-e / Archival Atmospheric Gradient Layer */}
      <div
        className="atmosphere-canvas"
        style={{ background: bgGradient }}
      />

      {/* Fixed SVG Paper Grain Overlay */}
      <div className="noise-overlay" />

      {/* Outer 1px Fine-Liner Museum Frame */}
      <div
        id="top"
        className="museum-frame"
        style={{ ['--accent-active' as string]: accentColor }}
      >
        {/* Sticky Top Fine-Line Navigation */}
        <header className="site-header">
          <div className="header-cell">
            <span>{ARCHIVE_METADATA.title}</span>
            <span style={{ color: accentColor }}>●</span>
          </div>
          <div className="header-cell" style={{ justifyContent: 'center', gap: 24 }}>
            {CHAPTERS.map((chap) => (
              <a
                key={chap.id}
                href={`#${chap.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {chap.number}: {chap.title}
              </a>
            ))}
          </div>
          <div className="header-cell">
            <span>RELICS TO NODES</span>
            <span>[ 1990—2012 ]</span>
          </div>
        </header>

        {/* LEVEL 1: Exhibition Cover */}
        <HeroCover />

        {/* LEVEL 2 & LEVEL 3: 3 Chapters & 8 Hardware Artifacts */}
        <main>
          {CHAPTERS.map((chapter, idx) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              chapterIndex={idx}
              onChapterEnter={handleChapterEnter}
              onInspect={(item) => setSelectedItem(item)}
              onScrollActive={handleScrollActive}
            />
          ))}
        </main>

                {/* FOOTER TIER 1: General Resources Bibliography from objects.json */}
        <section className="archive-grid-row" style={{ borderBottom: 'none' }}>
          <div className="edge-rail left">
            <div className="meta-row" style={{ borderBottom: 'none' }}>
              <span className="meta-label">BIBLIOGRAPHY</span>
              <span className="meta-value">GENERAL RESOURCES</span>
            </div>
          </div>

          <div
            style={{
              padding: '32px 40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {GENERAL_RESOURCES.map((res, i) => (
              <div
                key={i}
                style={{
                  border: 'var(--hairline)',
                  padding: 16,
                  background: 'rgba(255,255,255,0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    color: 'var(--ink-muted)',
                  }}
                >
                  [{res.type.toUpperCase()}] — {res.author}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, margin: '6px 0' }}>
                  {res.title}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {res.note}
                </p>
              </div>
            ))}
          </div>

          <div className="edge-rail right">
            <div className="meta-row" style={{ borderBottom: 'none' }}>
              <span className="meta-label">ARCHIVE STATUS</span>
              <span className="meta-value">08 NODES VERIFIED</span>
            </div>
          </div>
        </section>

        {/* FOOTER TIER 2: Copyright, Related Projects & Gemini 4 Argon Disclaimer */}
        <footer className="site-footer-bar">
          {/* Left Edge Cell: Copyright & Institution */}
          <div className="footer-cell">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="meta-label">COPYRIGHT</span>
              <span className="meta-value">© {new Date().getFullYear()} <a href="https://library.hkust.edu.hk" target="_blank" rel="noopener noreferrer">HKUST LIBRARY</a></span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'none' }}>
              <a href="https://library.hkust.edu.hk/privacy-policy">Privacy</a> . <a href="https://forms.cloud.microsoft/pages/responsepage.aspx?id=4vMXySKTJkmbs9rKcwQTyqchSPtacWtHn_7y-6vuXidUM0swRkxZVkdFSjk5S0lER1NXRzJHM0IyRC4u&origin=lprLink&route=shorturl">Contact Us</a>
            </div>
          </div>

          {/* Center Cell: Related Project Links + Gemini 4 Argon Disclaimer */}
          <div className="footer-cell" style={{ padding: '16px 40px' }}>
            <div className="footer-links-row">
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                # Dscape v{ARCHIVE_METADATA.version}
              </span>
              <a
                href="https://library.hkust.edu.hk/ds"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
              >
                Digital Scholarship ↗
              </a>
              <a
                href="https://library.hkust.edu.hk/news-events/news/dscape-an-antiquarian-landscape"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
              >
                what is DScape ↗
              </a>
              <a
                href="https://hkust-lib-ds.github.io/dscape1.0-beta/"
                className="footer-link-item"
              >
                DSCAPE 1.0 Beta ↗
              </a>
            </div>

            <div className="footer-disclaimer">
              <span>
                <strong>Disclaimer:</strong> This curatorial archive was developed with the assistance of <strong>Gemini 4 Argon, DeepSeek-V4.1-Flash-1017, GPT-Image 2.5 Sunburst, and Qwen 3.6</strong>.
              </span>
            </div>
          </div>

          {/* Right Edge Cell: Back to Top & Colophon */}
          <div className="footer-cell">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="meta-label">NAVIGATION</span>
              <a href="#top" className="meta-value">
                RETURN TO TOP ↑
              </a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-muted)' }}>
              <span>STACK</span>
              <span>NEXT.JS // GSAP // LENIS</span>
            </div>
          </div>
        </footer>
      </div>

      <ObjectModalDrawer
        item={selectedItem}
        allItems={ALL_ORDERED_ITEMS}
        accentColor={accentColor}
        onClose={() => setSelectedItem(null)}
        onSelectObject={handleSelectObject}
      />
      
    </SmoothScroll>
  );
}

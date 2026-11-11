// src/components/ObjectCard.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchiveItem } from '../data/archiveConfig';

interface Props {
  item: ArchiveItem;
  chapterTitle: string;
  chapterNumber: string;
  accentColor: string;
  sequenceNumber: string;
  onInspect: (item: ArchiveItem) => void;
  onScrollActive?: (item: ArchiveItem) => void;
}

export default function ObjectCard({
  item,
  chapterTitle,
  chapterNumber,
  accentColor,
  sequenceNumber,
  onInspect,
  onScrollActive,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 72%',
        },
      });

      tl.to(maskRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.35,
        ease: 'expo.inOut',
      }).from(
        imgRef.current,
        {
          scale: 1.22,
          filter: 'blur(6px)',
          duration: 1.6,
          ease: 'expo.out',
        },
        '<'
      );

      gsap.fromTo(
        imgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { strokeDashoffset: 120 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );
      }
      if (onScrollActive) {
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 48%',
          end: 'bottom 48%',
          onEnter: () => onScrollActive(item),
          onEnterBack: () => onScrollActive(item),
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [item, onScrollActive]);

  return (
    <article ref={cardRef} id={item.id} className="archive-grid-row">
      {/* LEFT EDGE RAIL: Provenance & Citation */}
      <aside className="edge-rail left">
        <div className="sticky-rail-box">
          <div
            className="meta-row"
            style={{ background: 'rgba(24, 22, 21, 0.04)' }}
          >
            <span className="meta-label">{chapterNumber}</span>
            <span className="meta-value" style={{ color: accentColor }}>
              {chapterTitle} // {sequenceNumber}
            </span>
          </div>

          <div className="meta-row">
            <span className="meta-label">OBJECT ID</span>
            <span className="meta-value">{item.id}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">ERA</span>
            <span className="meta-value">{item.era}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">CATEGORY</span>
            <span className="meta-value">{item.category}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">MAKER</span>
            <span className="meta-value">{item.citation.manufacturer}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">MODEL</span>
            <span className="meta-value">{item.citation.model}</span>
          </div>
          {item.citation.partNumber && (
            <div className="meta-row">
              <span className="meta-label">PART NO.</span>
              <span className="meta-value">{item.citation.partNumber}</span>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-label">PHYSICAL TAG</span>
            <span className="meta-value">{item.labelNotes}</span>
          </div>
        </div>
      </aside>

      {/* CENTER STAGE: SVG Evolutionary Spine + Artifact Frame */}
      <div className="artwork-stage">
        <svg
          width="2"
          height="56"
          style={{ marginBottom: 12, overflow: 'visible' }}
        >
          <line
            ref={lineRef}
            x1="1"
            y1="0"
            x2="1"
            y2="56"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeDasharray="120"
          />
          <circle cx="1" cy="56" r="3.5" fill={accentColor} />
        </svg>

        <div
          style={{
            width: '100%',
            maxWidth: 620,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <h3 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            {item.title}
          </h3>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            [{item.dateStart}]
          </span>
        </div>

        {/* Clickable Curtain Reveal Image Container */}
        <div
          ref={maskRef}
          className="artwork-mask"
          onClick={() => onInspect(item)}
          style={{ cursor: 'pointer' }}
          title="Click to open Bibliography & 3D Viewport"
        >
          <img
            ref={imgRef}
            src={item.media.image}
            alt={item.title}
            className="artwork-img"
          />
        </div>

        {/* Two-Edge Caption Bar */}
        <div className="edge-caption">
          <span>FUNCTION // {item.function}</span>
          <span>FIG {sequenceNumber}</span>
        </div>

        {/* Interactive Curatorial Banner (Opens Biblio & 3D Drawer on Click) */}
        {item.storyRole && (
          <div
            className="story-role-banner"
            onClick={() => onInspect(item)}
            style={{ cursor: 'pointer' }}
          >
            <span>
              <strong style={{ color: accentColor, marginRight: 8 }}>
                [CURATORIAL NOTE]
              </strong>
              {item.storyRole}
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                padding: '5px 10px',
                border: '1px solid rgba(242, 236, 225, 0.35)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              + Read More ↗
            </span>
          </div>
        )}
      </div>

      {/* RIGHT EDGE RAIL: Technical Specs, Narrative, Biblio Trigger & Bottom-Right Home Button */}
      <aside className="edge-rail right">
        <div className="sticky-rail-box">
          <div
            className="meta-row"
            style={{ background: 'rgba(24, 22, 21, 0.04)' }}
          >
            <span className="meta-label">TECHNICAL SPECS</span>
            <span className="meta-value">HARDWARE DATA</span>
          </div>

          {Object.entries(item.specs).map(([key, val]) => (
            <div key={key} className="meta-row">
              <span className="meta-label">{key}</span>
              <span className="meta-value">
                {Array.isArray(val) ? val.join(' / ') : val}
              </span>
            </div>
          ))}

          <div
            style={{
              padding: '20px 18px',
              borderBottom: 'var(--hairline)',
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--ink-muted)',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              ARCHIVAL NARRATIVE
            </div>
            <p>{item.narrative}</p>
          </div>

        

          {/* Connected Nodes in the Archive */}
          {item.connections.length > 0 && (
            <div style={{ padding: '14px 18px', borderBottom: 'var(--hairline)' }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: 'var(--ink-muted)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                LINKED ARCHIVE NODES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.connections.map((connId) => (
                  <a
                    key={connId}
                    href={`#${connId}`}
                    style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      border: 'var(--hairline)',
                      background: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    ↗ {connId}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom-Right "Back to Home Index" Button inside each Object Card */}
        <a
          href="#top"
          className="meta-row"
          style={{
            borderTop: 'var(--hairline)',
            borderBottom: 'none',
            background: 'rgba(255, 255, 255, 0.35)',
            marginTop: 'auto',
          }}
          title="Return to Exhibition Cover & Chapter Index"
        >
          <span className="meta-label">NAVIGATION</span>
          <span className="meta-value" style={{ color: accentColor }}>
            ↑ HOME INDEX
          </span>
        </a>
      </aside>
    </article>
  );
}

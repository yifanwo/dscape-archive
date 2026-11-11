// src/components/ObjectModalDrawer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Box, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { ArchiveItem, GENERAL_RESOURCES } from '../data/archiveConfig';

interface ReadingEntry {
  title: string;
  type: string;
  note: string;
}

type ExtendedArchiveItem = ArchiveItem & {
  furtherReading?: ReadingEntry[];
  media: ArchiveItem['media'] & {
    model3d?: string | null;
  };
};

interface Props {
  item: ArchiveItem | null;
  allItems: ArchiveItem[];
  accentColor: string;
  onClose: () => void;
  onSelectObject: (targetItem: ArchiveItem, shouldScrollPage: boolean) => void;
}

export default function ObjectModalDrawer({
  item,
  allItems,
  accentColor,
  onClose,
  onSelectObject,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'2.5d' | 'wireframe'>('2.5d');
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0 });

  const currentIndex = item
    ? allItems.findIndex((x) => x.id === item.id)
    : -1;
  const prevItem =
    currentIndex > 0
      ? allItems[currentIndex - 1]
      : allItems[allItems.length - 1];
  const nextItem =
    currentIndex < allItems.length - 1
      ? allItems[currentIndex + 1]
      : allItems[0];

  // Entrance & item-switch subtle animation
  useEffect(() => {
    if (!item || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' }
      );
    });

    // Reset internal scroll position of the floating card when switching objects
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    return () => ctx.revert();
  }, [item]);

  // Keyboard support: ESC to close, Left/Right arrows for Prev/Next object
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevItem) onSelectObject(prevItem, true);
      if (e.key === 'ArrowRight' && nextItem) onSelectObject(nextItem, true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, prevItem, nextItem, onClose, onSelectObject]);

  if (!item) return null;

  const extItem = item as ExtendedArchiveItem;
  const readings: ReadingEntry[] = extItem.furtherReading ?? [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotX: -y * 20, rotY: x * 20 });
  };

  return (
    /* Non-blocking floating container: allows scrolling the main page behind it */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '56px 28px 28px 28px',
      }}
    >
      <aside
        ref={cardRef}
        data-lenis-prevent="true"
        style={{
          pointerEvents: 'auto',
          width: 'min(560px, 92vw)',
          maxHeight: 'calc(100vh - 96px)',
          background: 'rgba(242, 236, 225, 0.97)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(24, 22, 21, 0.28)',
          boxShadow: '0 28px 70px rgba(24, 22, 21, 0.24)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Fine-Liner Card Bar */}
        <div
          className="meta-row"
          style={{
            padding: '13px 20px',
            background: 'rgba(24, 22, 21, 0.04)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 700, color: accentColor }}>
            [ READ MORE // {currentIndex + 1} OF {allItems.length} :{' '}
            {extItem.id.toUpperCase()} ]
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--ink-dark)',
              color: 'var(--bg-parchment)',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <X size={12} />
          </button>
        </div>

        {/* Scrollable Card Body (isolated from page scroll via data-lenis-prevent) */}
        <div
          ref={contentRef}
          data-lenis-prevent="true"
          style={{
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* Artifact Title & Curatorial Role */}
          <div style={{ padding: '20px 22px', borderBottom: 'var(--hairline)' }}>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: '0.12em',
                color: 'var(--ink-muted)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {extItem.category} — {extItem.era}
            </div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              {extItem.title}
            </h2>
            {extItem.storyRole && (
              <p
                style={{
                  padding: '10px 12px',
                  borderLeft: `3px solid ${accentColor}`,
                  background: 'rgba(24,22,21,0.04)',
                  fontSize: 12.5,
                  lineHeight: 1.5,
                }}
              >
                {extItem.storyRole}
              </p>
            )}
          </div>

          {/* Interactive 2.5D / 3D Inspection Stage */}
          <div style={{ padding: '18px 22px', borderBottom: 'var(--hairline)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Box size={13} color={accentColor} /> 3D / 2.5D ARTIFACT VIEWPORT
              </span>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setViewMode('2.5d')}
                  style={{
                    fontSize: 9.5,
                    padding: '4px 9px',
                    border: 'var(--hairline)',
                    background:
                      viewMode === '2.5d' ? 'var(--ink-dark)' : 'transparent',
                    color: viewMode === '2.5d' ? '#fff' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  2.5D TILT INSPECT
                </button>
                <button
                  onClick={() => setViewMode('wireframe')}
                  style={{
                    fontSize: 9.5,
                    padding: '4px 9px',
                    border: 'var(--hairline)',
                    background:
                      viewMode === 'wireframe'
                        ? 'var(--ink-dark)'
                        : 'transparent',
                    color: viewMode === 'wireframe' ? '#fff' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  X-RAY BLUEPRINT
                </button>
              </div>
            </div>

            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ rotX: 0, rotY: 0 })}
              style={{
                height: 230,
                border: 'var(--hairline)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: 900,
                overflow: 'hidden',
                cursor: 'grab',
                background:
                  viewMode === 'wireframe'
                    ? '#141820'
                    : 'radial-gradient(circle, rgba(255,255,255,0.65) 0%, rgba(24,22,21,0.05) 100%)',
                backgroundImage:
                  viewMode === 'wireframe'
                    ? 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)'
                    : undefined,
                backgroundSize:
                  viewMode === 'wireframe' ? '20px 20px' : undefined,
              }}
            >
              <img
                src={extItem.media.image}
                alt={extItem.title}
                style={{
                  maxHeight: '78%',
                  maxWidth: '78%',
                  objectFit: 'contain',
                  transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale(1.04)`,
                  transition: 'transform 0.15s ease-out, filter 0.35s ease',
                  filter:
                    viewMode === 'wireframe'
                      ? 'invert(1) hue-rotate(180deg) contrast(1.4) drop-shadow(0 0 12px rgba(90,160,255,0.5))'
                      : 'drop-shadow(0 18px 28px rgba(24,22,21,0.22))',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 12,
                  right: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 9.5,
                  letterSpacing: '0.1em',
                  color:
                    viewMode === 'wireframe' ? '#9ab4e2' : 'var(--ink-muted)',
                }}
              >
                <span>MOVE CURSOR TO TILT & INSPECT</span>
                <span>
                  3D MESH:{' '}
                  {extItem.media.model3d ? extItem.media.model3d : '2.5D LAYER'}
                </span>
              </div>
            </div>
          </div>

          {/* Further Reading & Scholarly References */}
          <div style={{ padding: '18px 22px' }}>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: '0.12em',
                fontWeight: 700,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <BookOpen size={13} color={accentColor} /> FURTHER READING &
              TECHNICAL LITERATURE
            </div>

            {readings.length > 0 ? (
              readings.map((reading: ReadingEntry, idx: number) => (
                <div
                  key={idx}
                  style={{
                    border: 'var(--hairline)',
                    padding: 14,
                    marginBottom: 10,
                    background: 'rgba(255,255,255,0.5)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9.5,
                      letterSpacing: '0.1em',
                      color: accentColor,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    [{reading.type}]
                  </div>
                  <div
                    style={{ fontSize: 13.5, fontWeight: 700, margin: '4px 0' }}
                  >
                    {reading.title}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: 'var(--ink-muted)',
                    }}
                  >
                    {reading.note}
                  </p>
                </div>
              ))
            ) : (
              <div
                style={{
                  border: 'var(--hairline)',
                  padding: 12,
                  background: 'rgba(255,255,255,0.3)',
                  fontSize: 11.5,
                  color: 'var(--ink-muted)',
                  marginBottom: 10,
                }}
              >
                General archival references for this hardware category:
              </div>
            )}

            {GENERAL_RESOURCES.map((res, i) => (
              <div
                key={i}
                style={{
                  border: 'var(--hairline)',
                  padding: 12,
                  marginTop: 8,
                  background: 'rgba(24,22,21,0.025)',
                }}
              >
                <div style={{ fontSize: 9.5, color: 'var(--ink-muted)' }}>
                  [{res.type.toUpperCase()}] — {res.author}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, margin: '3px 0' }}>
                  {res.title}
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>
                  {res.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Prev / Next Navigation Bar (Hyperlinked to Object Cards on Page) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderTop: 'var(--hairline)',
            background: 'rgba(24, 22, 21, 0.05)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onSelectObject(prevItem, true)}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRight: 'var(--hairline)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textAlign: 'left',
              minWidth: 0,
            }}
            title={`Jump to ${prevItem.title}`}
          >
            <ArrowLeft size={14} color={accentColor} style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  color: 'var(--ink-muted)',
                }}
              >
                PREVIOUS OBJECT
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {prevItem.title}
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectObject(nextItem, true)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              textAlign: 'right',
              minWidth: 0,
            }}
            title={`Jump to ${nextItem.title}`}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  color: 'var(--ink-muted)',
                }}
              >
                NEXT OBJECT
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {nextItem.title}
              </div>
            </div>
            <ArrowRight size={14} color={accentColor} style={{ flexShrink: 0 }} />
          </button>
        </div>
      </aside>
    </div>
  );
}

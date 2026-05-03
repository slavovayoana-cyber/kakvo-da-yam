// Mocked native share sheet — iOS- or Android-flavored bottom modal
// Plus a copy-text preview so designers can see the share string verbatim.

const SHARE_TARGETS = [
  { name: 'Instagram', emoji: '📷', bg: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  { name: 'WhatsApp',  emoji: '💬', bg: '#25D366' },
  { name: 'Viber',     emoji: '☎️', bg: '#7360F2' },
  { name: 'Messenger', emoji: '💭', bg: 'linear-gradient(135deg, #00B2FF, #006AFF)' },
  { name: 'Telegram',  emoji: '✈️', bg: '#229ED9' },
  { name: 'TikTok',    emoji: '🎵', bg: '#000' },
  { name: 'Facebook',  emoji: 'f',  bg: '#1877F2' },
  { name: 'Stories',   emoji: '✨', bg: 'linear-gradient(135deg, #ff5e3a, #ff2a68)' },
];

function ShareSheet({ open, platform, shareText, theme, meal, reason, onClose, tweaks }) {
  const isIOS = platform === 'ios';
  const [copied, setCopied] = React.useState(false);
  const [showCard, setShowCard] = React.useState(tweaks.showShareCardInSheet);

  React.useEffect(() => { if (!open) { setCopied(false); setShowCard(tweaks.showShareCardInSheet); } }, [open, tweaks.showShareCardInSheet]);

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.45)',
      animation: 'kdy-fade-in 200ms ease',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: isIOS ? 'rgba(245, 245, 247, 0.92)' : '#fff',
        backdropFilter: isIOS ? 'blur(30px)' : 'none',
        borderTopLeftRadius: isIOS ? 14 : 28,
        borderTopRightRadius: isIOS ? 14 : 28,
        padding: '14px 16px 24px',
        animation: 'kdy-sheet-rise 280ms cubic-bezier(0.2, 0.9, 0.3, 1)',
        maxHeight: '78%',
        overflow: 'auto',
      }}>
        {!isIOS && (
          <div style={{
            width: 32, height: 4, borderRadius: 2,
            background: '#0001', margin: '0 auto 14px',
          }} />
        )}

        {isIOS && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 4px 14px', borderBottom: '0.5px solid #0001',
          }}>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: '#007AFF',
              fontSize: 16, fontWeight: 400, cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text"',
            }}>Cancel</button>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: '-apple-system' }}>Share</div>
            <div style={{ width: 50 }} />
          </div>
        )}

        {/* Share-card preview row */}
        <div style={{
          margin: isIOS ? '14px 0 16px' : '0 0 14px',
          padding: 14,
          background: isIOS ? '#fff' : '#F7F2EC',
          borderRadius: 14,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 11,
            background: theme.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>{meal.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Geist", system-ui, sans-serif', fontSize: 14, fontWeight: 600,
              color: '#1a1a1a', marginBottom: 2,
            }}>Какво да ям? — {meal.name}</div>
            <div style={{
              fontFamily: '"Geist", system-ui, sans-serif', fontSize: 12,
              color: '#666', overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>„{reason}"</div>
          </div>
          <button onClick={() => setShowCard(!showCard)} style={{
            background: 'none', border: '1px solid #0002', borderRadius: 6,
            padding: '4px 8px', fontSize: 11, cursor: 'pointer',
            fontFamily: 'system-ui',
          }}>{showCard ? 'Hide' : 'Card'}</button>
        </div>

        {/* v1.1 card preview, optional */}
        {showCard && (
          <div style={{ marginBottom: 16, padding: 8, background: '#0008', borderRadius: 12 }}>
            <div style={{
              fontFamily: '"Geist Mono", monospace', fontSize: 9,
              color: '#fff', opacity: 0.7, padding: '0 0 6px', textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>v1.1 preview · 1080×1920</div>
            <ShareCardThumb meal={meal} reason={reason} theme={theme} />
          </div>
        )}

        {/* App row */}
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14,
          marginBottom: 14, borderBottom: isIOS ? '0.5px solid #0001' : '1px solid #0001',
        }}>
          {SHARE_TARGETS.map((t) => (
            <button key={t.name} onClick={onClose} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, background: 'none', border: 'none', cursor: 'pointer',
              minWidth: 64, WebkitTapHighlightColor: 'transparent',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: isIOS ? 13 : 28,
                background: t.bg,
                color: '#fff', fontSize: 24, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'system-ui',
              }}>{t.emoji}</div>
              <div style={{
                fontSize: 11, color: '#1a1a1a',
                fontFamily: isIOS ? '-apple-system' : 'Roboto, system-ui',
              }}>{t.name}</div>
            </button>
          ))}
        </div>

        {/* Actions: copy text */}
        <div style={{
          background: isIOS ? '#fff' : 'transparent',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <button onClick={() => {
            navigator.clipboard?.writeText(shareText).catch(() => {});
            setCopied(true);
            setTimeout(() => onClose(), 700);
          }} style={{
            width: '100%', padding: '14px 16px', textAlign: 'left',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: isIOS ? '-apple-system' : 'Roboto, system-ui',
            fontSize: 15, color: '#1a1a1a',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: isIOS ? '0.5px solid #0001' : 'none',
          }}>
            <span>{copied ? '✓ Copied' : 'Copy'}</span>
            <span style={{ fontSize: 18 }}>{copied ? '✅' : '📋'}</span>
          </button>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px 16px', textAlign: 'left',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: isIOS ? '-apple-system' : 'Roboto, system-ui',
            fontSize: 15, color: '#1a1a1a',
          }}>
            Save Image…
          </button>
        </div>

        {/* Share text preview */}
        <div style={{
          marginTop: 14, padding: 12, background: '#0000000a', borderRadius: 10,
          fontFamily: '"Geist Mono", ui-monospace, monospace', fontSize: 11,
          color: '#333', whiteSpace: 'pre-wrap', lineHeight: 1.5,
        }}>{shareText}</div>
      </div>
    </div>
  );
}

// v1.1 share card preview — small thumbnail rendition of the 1080×1920 Story card
function ShareCardThumb({ meal, reason, theme }) {
  return (
    <div style={{
      width: '100%', aspectRatio: '9 / 16',
      background: theme.bgGradient, borderRadius: 8,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 18, textAlign: 'center',
    }}>
      <MoodDecoration theme={theme} scale={1.2} />
      <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 12, position: 'relative', zIndex: 2 }}>
        {meal.emoji}
      </div>
      <div style={{
        fontFamily: theme.titleFont, fontSize: 22,
        color: theme.ink, ...theme.nameStyle,
        marginBottom: 8, position: 'relative', zIndex: 2,
        lineHeight: 1.05,
      }}>{meal.name}</div>
      <div style={{
        fontFamily: '"Geist", system-ui, sans-serif', fontSize: 10,
        color: theme.ink, opacity: 0.75, fontStyle: 'italic',
        maxWidth: '85%', lineHeight: 1.4, position: 'relative', zIndex: 2,
      }}>„{reason}"</div>
      <div style={{
        position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
        fontFamily: '"Geist Mono", monospace', fontSize: 8, letterSpacing: '0.18em',
        color: theme.ink, opacity: 0.5, textTransform: 'uppercase', zIndex: 2,
      }}>каквоДаЯм<span style={{ color: theme.accent }}>?</span></div>
    </div>
  );
}

window.ShareSheet = ShareSheet;
window.ShareCardThumb = ShareCardThumb;

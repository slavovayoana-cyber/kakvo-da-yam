// Home screen — title, rotating subtitle, big button, 5 mood chips

function HomeScreen({ tweaks, selectedMood, setSelectedMood, onPick, subtitleIdx }) {
  const theme = getTheme(selectedMood);
  const subtitle = SUBTITLES[subtitleIdx % SUBTITLES.length];

  // Title font: when neutral use Geist, when a mood is picked use the mood's titleFont if tweaks allow
  const moodTypeStrength = tweaks.moodTypeStrength; // 'subtle' | 'bold'
  const useMoodType = moodTypeStrength === 'bold' && selectedMood;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: theme.bgGradient,
      transition: 'background 500ms ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 56,
      paddingBottom: 24,
      boxSizing: 'border-box',
    }}>
      <MoodDecoration theme={theme} />

      {/* Header — tiny brand mark */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 24px 0',
      }}>
        <div style={{
          fontFamily: '"Geist Mono", ui-monospace, monospace',
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: theme.ink, opacity: 0.55,
        }}>каквоДаЯм<span style={{ color: theme.accent }}>?</span></div>
        <div style={{
          fontFamily: '"Geist Mono", ui-monospace, monospace',
          fontSize: 11, letterSpacing: '0.18em', color: theme.ink, opacity: 0.45,
        }}>v1.0</div>
      </div>

      {/* Title block */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 28px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: useMoodType ? theme.titleFont : '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 56,
          lineHeight: 0.95,
          color: theme.ink,
          ...(useMoodType ? theme.titleStyle : { fontWeight: 700, letterSpacing: '-0.045em' }),
          marginBottom: 14,
        }}>
          Какво<br />да ям<span style={{ color: theme.accent }}>?</span>
        </div>
        <div key={subtitle} style={{
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 15,
          lineHeight: 1.35,
          color: theme.ink,
          opacity: 0.6,
          maxWidth: 260,
          animation: 'kdy-fade-in 600ms ease',
        }}>
          {subtitle}
        </div>
      </div>

      {/* Mood chips */}
      <div style={{ padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: '"Geist Mono", ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: theme.ink, opacity: 0.5, marginBottom: 12, paddingLeft: 4,
        }}>
          {selectedMood ? 'Настроение' : 'Или избери настроение'}
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22,
        }}>
          {Object.values(MOOD_THEMES).map((m) => {
            const active = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(active ? null : m.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 13px',
                  border: `1.5px solid ${active ? m.colorDeep : 'rgba(0,0,0,0.08)'}`,
                  background: active ? m.color : 'rgba(255,255,255,0.55)',
                  color: active ? '#fff' : theme.ink,
                  borderRadius: 999,
                  fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  position: 'relative',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 15 }}>{m.emoji}</span>
                <span>{m.name}</span>
                {m.isBonus && !active && (
                  <span style={{
                    fontSize: 8, padding: '2px 4px', borderRadius: 4,
                    background: m.color, color: '#fff',
                    marginLeft: 2, fontWeight: 700, letterSpacing: '0.08em',
                  }}>BG</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main button */}
        <button
          onClick={onPick}
          style={{
            width: '100%',
            padding: '20px 24px',
            background: selectedMood ? theme.accent : '#C8645A',
            color: '#fff',
            border: 'none',
            borderRadius: 18,
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${selectedMood ? theme.accent : '#C8645A'}40, 0 2px 0 rgba(0,0,0,0.04) inset`,
            transition: 'all 250ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Избери за мен →
        </button>

        {/* Tagline of selected mood */}
        <div style={{
          textAlign: 'center', marginTop: 14,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12.5, color: theme.ink, opacity: 0.55,
          fontStyle: 'italic',
          minHeight: 18,
        }}>
          {selectedMood ? `„${theme.tagline}"` : 'или random измежду всички 4'}
        </div>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;

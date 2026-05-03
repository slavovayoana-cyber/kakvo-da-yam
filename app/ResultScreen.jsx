// Result screen — emoji, name, reason, reroll, share

function ResultScreen({
  result, rerollCount, onReroll, onShare, onChangeMood, onHome, animKey, tweaks,
}) {
  const { meal, reason, moodId } = result;
  const theme = getTheme(moodId);
  const rerollMsg = getRerollMessage(rerollCount);
  const useMoodType = tweaks.moodTypeStrength === 'bold';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: theme.bgGradient,
      transition: 'background 600ms ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 56,
      paddingBottom: 24,
      boxSizing: 'border-box',
    }}>
      <MoodDecoration theme={theme} scale={1.1} />

      {/* Top bar — back + mood pill */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px 0', position: 'relative', zIndex: 3,
      }}>
        <button onClick={onHome} aria-label="Назад" style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.6)', border: 'none',
          fontSize: 18, color: theme.ink, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>←</button>
        <div style={{
          padding: '7px 12px', borderRadius: 999,
          background: theme.color, color: '#fff',
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5,
          letterSpacing: '-0.005em',
        }}>
          <span>{theme.emoji}</span>
          <span>{theme.name}</span>
        </div>
      </div>

      {/* Result body */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', textAlign: 'center', position: 'relative', zIndex: 2,
      }}>
        <div
          key={animKey + '-emoji'}
          style={{
            fontSize: 130, lineHeight: 1, marginBottom: 18,
            animation: 'kdy-emoji-pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))',
          }}
        >
          {meal.emoji}
        </div>
        <div
          key={animKey + '-name'}
          style={{
            fontFamily: useMoodType ? theme.titleFont : '"Geist", "Inter", system-ui, sans-serif',
            fontSize: meal.name.length > 18 ? 26 : 32,
            color: theme.ink,
            ...(useMoodType ? theme.nameStyle : { fontWeight: 700, letterSpacing: '-0.035em' }),
            marginBottom: 14,
            animation: 'kdy-rise 500ms 100ms ease both',
            lineHeight: 1.05,
            maxWidth: 280,
          }}
        >
          {meal.name}
        </div>
        <div
          key={animKey + '-reason'}
          style={{
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 16, lineHeight: 1.4,
            color: theme.ink, opacity: 0.78,
            fontStyle: 'italic',
            maxWidth: 280,
            animation: 'kdy-rise 500ms 200ms ease both',
            textWrap: 'pretty',
          }}
        >
          „{reason}"
        </div>
      </div>

      {/* Action stack */}
      <div style={{ padding: '0 20px', position: 'relative', zIndex: 3 }}>
        {/* Reroll sass message */}
        {rerollMsg && (
          <div
            key={'sass-' + rerollCount}
            style={{
              textAlign: 'center', marginBottom: 12,
              fontFamily: '"Geist", "Inter", system-ui, sans-serif',
              fontSize: 12.5, color: theme.colorDeep, fontStyle: 'italic',
              animation: 'kdy-fade-in 400ms ease',
              fontWeight: 500,
            }}
          >
            {rerollMsg}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button
            onClick={onReroll}
            style={{
              flex: 1, padding: '17px 18px',
              background: 'rgba(255,255,255,0.65)',
              color: theme.ink,
              border: `1.5px solid ${theme.colorDeep}33`,
              borderRadius: 16,
              fontFamily: '"Geist", "Inter", system-ui, sans-serif',
              fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ↻ Друго
          </button>
          <button
            onClick={onShare}
            style={{
              flex: 1.4, padding: '17px 18px',
              background: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              fontFamily: '"Geist", "Inter", system-ui, sans-serif',
              fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em',
              cursor: 'pointer',
              boxShadow: `0 8px 20px ${theme.accent}40`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ↗ Сподели
          </button>
        </div>

        <button
          onClick={onChangeMood}
          style={{
            display: 'block', margin: '0 auto',
            background: 'transparent', border: 'none',
            fontFamily: '"Geist", "Inter", system-ui, sans-serif',
            fontSize: 13, color: theme.ink, opacity: 0.55,
            cursor: 'pointer', textDecoration: 'underline',
            textDecorationThickness: 1, textUnderlineOffset: 4,
            padding: 8,
          }}
        >
          Промени настроението
        </button>
      </div>
    </div>
  );
}

window.ResultScreen = ResultScreen;

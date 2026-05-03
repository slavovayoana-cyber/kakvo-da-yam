// Per-mood visual personality. Each mood is its own little world.
// Backgrounds, type treatment, accent, micro-decoration, share-card BG.

const MOOD_THEMES = {
  healthy_ish: {
    id: 'healthy_ish',
    emoji: '🥗',
    name: 'Healthy-ish',
    tagline: 'Искам да се чувствам отговорна',
    color: '#9CAF88',
    colorDeep: '#6E8463',
    bg: '#EFF1E5',
    bgGradient: 'radial-gradient(ellipse at 20% 0%, #DDE5C8 0%, #EFF1E5 55%, #E5EAD4 100%)',
    chipBg: '#E2E9D0',
    chipText: '#3D4D33',
    ink: '#2F3A28',
    accent: '#6E8463',
    titleFont: '"Fraunces", "Instrument Serif", Georgia, serif',
    titleStyle: { fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em' },
    nameStyle: { fontWeight: 500, letterSpacing: '-0.03em' },
    decoration: 'leaves',
    voice: 'meко окуражителен',
    captionVerb: 'предлага',
  },
  fancy: {
    id: 'fancy',
    emoji: '💅',
    name: 'Fancy',
    tagline: 'Днес заслужавам нещо по-така',
    color: '#D4A5A5',
    colorDeep: '#A06A6A',
    bg: '#F5E8E5',
    bgGradient: 'radial-gradient(ellipse at 80% 10%, #ECD3D0 0%, #F5E8E5 60%, #EBD5D0 100%)',
    chipBg: '#EED6D2',
    chipText: '#5C3636',
    ink: '#3D2828',
    accent: '#A06A6A',
    titleFont: '"Instrument Serif", "Fraunces", Georgia, serif',
    titleStyle: { fontWeight: 400, letterSpacing: '-0.01em' },
    nameStyle: { fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em' },
    decoration: 'sparkles',
    voice: 'лек снобизъм',
    captionVerb: 'препоръчва',
  },
  honest: {
    id: 'honest',
    emoji: '😂',
    name: 'Honest',
    tagline: 'Кажи ми истината какво ми се яде',
    color: '#B8893D',
    colorDeep: '#8A6529',
    bg: '#F4E8D0',
    bgGradient: 'linear-gradient(180deg, #F4E8D0 0%, #EBDAB6 100%)',
    chipBg: '#EBD8A8',
    chipText: '#4A3614',
    ink: '#2C1F0A',
    accent: '#8A6529',
    titleFont: '"Geist", "Inter", system-ui, sans-serif',
    titleStyle: { fontWeight: 800, letterSpacing: '-0.045em', textTransform: 'uppercase' },
    nameStyle: { fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase' },
    decoration: 'underline',
    voice: 'без филтър',
    captionVerb: 'ти казва',
  },
  comfort: {
    id: 'comfort',
    emoji: '🧸',
    name: 'Comfort',
    tagline: 'Искам нещо уютно и вкусно',
    color: '#B89B7A',
    colorDeep: '#85674A',
    bg: '#F1E6D5',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #F5E8D0 0%, #EFE0CA 60%, #E6D5BB 100%)',
    chipBg: '#E8D6BC',
    chipText: '#4F3B25',
    ink: '#3A2C1B',
    accent: '#85674A',
    titleFont: '"Fraunces", "Instrument Serif", Georgia, serif',
    titleStyle: { fontWeight: 500, letterSpacing: '-0.025em' },
    nameStyle: { fontWeight: 500, letterSpacing: '-0.025em' },
    decoration: 'soft-blob',
    voice: 'топъл и грижовен',
    captionVerb: 'те прегръща с',
  },
  bulgarian: {
    id: 'bulgarian',
    emoji: '🇧🇬',
    name: 'Bulgarian',
    tagline: 'Дай ми нещо родно',
    color: '#A8453F',
    colorDeep: '#7A2E29',
    bg: '#F2DDD0',
    bgGradient: 'linear-gradient(180deg, #F2DDD0 0%, #ECC9B6 100%)',
    chipBg: '#E8C6B5',
    chipText: '#5A2420',
    ink: '#3A1714',
    accent: '#7A2E29',
    titleFont: '"Geist", "Inter", system-ui, sans-serif',
    titleStyle: { fontWeight: 700, letterSpacing: '-0.04em' },
    nameStyle: { fontWeight: 700, letterSpacing: '-0.035em' },
    decoration: 'shevitsa',
    voice: 'нашенски',
    captionVerb: 'праща ти',
    isBonus: true,
  },
};

// Neutral/default theme — when no mood is selected
const NEUTRAL_THEME = {
  id: null,
  emoji: '🍽️',
  name: 'Random',
  tagline: '',
  color: '#C8645A',
  colorDeep: '#9A4239',
  bg: '#FBF7F2',
  bgGradient: 'radial-gradient(ellipse at 50% 0%, #FFFBF5 0%, #FBF7F2 60%, #F4EDE2 100%)',
  chipBg: '#F1EAE0',
  chipText: '#3A3A3A',
  ink: '#2A2A2A',
  accent: '#C8645A',
  titleFont: '"Geist", "Inter", system-ui, sans-serif',
  titleStyle: { fontWeight: 700, letterSpacing: '-0.04em' },
  nameStyle: { fontWeight: 700, letterSpacing: '-0.035em' },
  decoration: 'none',
};

function getTheme(moodId) {
  return MOOD_THEMES[moodId] || NEUTRAL_THEME;
}

// Decoration overlays — small SVG ornaments per mood
function MoodDecoration({ theme, scale = 1 }) {
  if (!theme || theme.decoration === 'none') return null;
  const c = theme.colorDeep;

  if (theme.decoration === 'leaves') {
    return (
      <svg style={{ position: 'absolute', top: 24, right: -10, width: 110 * scale, opacity: 0.18, pointerEvents: 'none' }} viewBox="0 0 100 120">
        <path d="M50 10 Q20 30 25 70 Q30 95 50 110 Q70 95 75 70 Q80 30 50 10 Z" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M50 10 L50 110" stroke={c} strokeWidth="1" />
        <path d="M50 35 Q35 40 30 55" stroke={c} strokeWidth="1" fill="none" />
        <path d="M50 35 Q65 40 70 55" stroke={c} strokeWidth="1" fill="none" />
        <path d="M50 60 Q35 65 30 80" stroke={c} strokeWidth="1" fill="none" />
        <path d="M50 60 Q65 65 70 80" stroke={c} strokeWidth="1" fill="none" />
      </svg>
    );
  }
  if (theme.decoration === 'sparkles') {
    return (
      <svg style={{ position: 'absolute', top: 30, left: -10, width: 90 * scale, opacity: 0.35, pointerEvents: 'none' }} viewBox="0 0 80 120">
        <g fill={c}>
          <path d="M20 20 L22 28 L30 30 L22 32 L20 40 L18 32 L10 30 L18 28 Z" />
          <path d="M55 60 L57 66 L63 68 L57 70 L55 76 L53 70 L47 68 L53 66 Z" opacity="0.7" />
          <path d="M30 90 L31 95 L36 96 L31 97 L30 102 L29 97 L24 96 L29 95 Z" opacity="0.5" />
        </g>
      </svg>
    );
  }
  if (theme.decoration === 'underline') {
    return (
      <svg style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', width: 180 * scale, opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 200 30">
        <path d="M5 20 Q50 5 100 18 T195 15" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (theme.decoration === 'soft-blob') {
    return (
      <svg style={{ position: 'absolute', top: 60, right: -40, width: 200 * scale, opacity: 0.25, pointerEvents: 'none' }} viewBox="0 0 200 200">
        <ellipse cx="100" cy="100" rx="90" ry="75" fill={c} />
      </svg>
    );
  }
  if (theme.decoration === 'shevitsa') {
    // Bulgarian embroidery-inspired pattern
    return (
      <svg style={{ position: 'absolute', top: 20, left: 0, right: 0, width: '100%', height: 28, opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 360 28" preserveAspectRatio="xMidYMid slice">
        <g fill={c}>
          {[...Array(18)].map((_, i) => (
            <g key={i} transform={`translate(${i * 22 + 6}, 6)`}>
              <path d="M8 0 L16 8 L8 16 L0 8 Z" />
              <circle cx="8" cy="8" r="2" fill={theme.bg} />
            </g>
          ))}
        </g>
      </svg>
    );
  }
  return null;
}

window.MOOD_THEMES = MOOD_THEMES;
window.NEUTRAL_THEME = NEUTRAL_THEME;
window.getTheme = getTheme;
window.MoodDecoration = MoodDecoration;

// Top-level KakvoDaYam app — composes Home + Result + ShareSheet inside a phone frame

function KakvoDaYamApp({ platform, tweaks, mealsData }) {
  const [screen, setScreen] = React.useState('home'); // 'home' | 'result'
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [result, setResult] = React.useState(null); // {meal, reason, moodId}
  const [rerollCount, setRerollCount] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [subtitleIdx, setSubtitleIdx] = React.useState(0);

  // Rotate the home subtitle every ~4s
  React.useEffect(() => {
    if (screen !== 'home') return;
    const t = setInterval(() => setSubtitleIdx((i) => i + 1), 4500);
    return () => clearInterval(t);
  }, [screen]);

  const doPick = () => {
    const r = pickMeal(mealsData.meals, selectedMood, null);
    setResult(r);
    setRerollCount(0);
    setAnimKey((k) => k + 1);
    setScreen('result');
  };
  const doReroll = () => {
    const r = pickMeal(mealsData.meals, selectedMood, result?.meal.id);
    setResult(r);
    setRerollCount((c) => c + 1);
    setAnimKey((k) => k + 1);
  };
  const goHome = () => {
    setScreen('home');
    setShareOpen(false);
  };

  const theme = result ? getTheme(result.moodId) : getTheme(selectedMood);
  const shareText = result ? formatShareText(result.meal, result.reason, theme.emoji) : '';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {screen === 'home' && (
        <HomeScreen
          tweaks={tweaks}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          onPick={doPick}
          subtitleIdx={subtitleIdx}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          tweaks={tweaks}
          result={result}
          rerollCount={rerollCount}
          onReroll={doReroll}
          onShare={() => setShareOpen(true)}
          onChangeMood={goHome}
          onHome={goHome}
          animKey={animKey}
        />
      )}

      {result && (
        <ShareSheet
          open={shareOpen}
          platform={platform}
          shareText={shareText}
          theme={theme}
          meal={result.meal}
          reason={result.reason}
          tweaks={tweaks}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}

window.KakvoDaYamApp = KakvoDaYamApp;

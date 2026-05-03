# Какво да ям?

> Мобилно приложение, което ти казва какво да ядеш — със стил, личност и доза brutal honesty.

Едно приложение, четири настроения + български бонус, нула решения за вземане. Натискаш бутон, едно настроение ти казва какво да ядеш — и защо.

## Статус

- ✅ **HTML/React прототип** — пълна интерактивна мокъп версия в iOS + Android рамки
- ✅ **Expo + TypeScript приложение** — работещо нативно приложение за iOS и Android (v1 / MVP)
- ⏳ v1.1 — генерирани share картинки 1080×1920 за Stories
- ⏳ v1.5 — Premium pack с допълнителни настроения (Махмурлия, Hangry, Сърцеразбит, Късно вечер, Студентски)

## Концепция

Пет настроения, всяко със собствена личност, цвят, шрифт и декорация:

| Настроение | Личност | Цвят |
|---|---|---|
| 🥗 **Healthy-ish** | Меко окуражителен. Не е fitfluencer. | маслинено `#9CAF88` |
| 💅 **Fancy** | Лек снобизъм със себеосъзнаване. | dusty rose `#D4A5A5` |
| 😂 **Honest** | Без филтър. Brutal honest. *(viral hook)* | горчица `#B8893D` |
| 🧸 **Comfort** | Топъл, грижовен, лек nostalgia. | топъл бежов `#B89B7A` |
| 🇧🇬 **Bulgarian** *(бонус)* | Класическата българска кухня с локален хумор. | бордо `#A8453F` |

Виж пълния brief в [`BRIEF.md`](./BRIEF.md).

## Структура на проекта

```
.
├── BRIEF.md                  ← пълен product brief
├── data/meals.json           ← 45 ястия, 80+ funny reasons (master copy)
│
├── Какво да ям.html          ← HTML/React прототип (визуален референс)
├── app/                      ← компоненти на прототипа (JSX)
├── frames/                   ← iOS/Android device frames
├── tweaks-panel.jsx          ← floating tweaks панел
│
└── app-expo/                 ← истинското Expo + TypeScript приложение
    ├── App.tsx
    ├── app.json              ← bundle ID com.kakvodayam.app
    ├── data/meals.json       ← същата база, копирана за bundling
    ├── lib/
    │   ├── types.ts
    │   ├── mealPicker.ts     ← random selection + reroll messages + share format
    │   └── moodSystem.ts     ← 5 mood themes (цвят, gradient, шрифт, decoration)
    ├── components/
    │   ├── MoodDecoration.tsx ← SVG декорации (листа, искри, шевица...)
    │   └── MoodGradient.tsx
    └── screens/
        ├── HomeScreen.tsx     ← заглавие, mood chips, главен бутон
        └── ResultScreen.tsx   ← емоджи, име, причина, reroll, share
```

## Стартиране на HTML прототипа

```bash
cd "/path/to/repo"
python3 -m http.server 8000
```

После отвори: <http://localhost:8000/Какво%20да%20ям.html>

## Стартиране на Expo приложението

**Изисква:** Node 18+, [Expo Go](https://expo.dev/go) на телефона (App Store / Google Play).

```bash
cd app-expo
npm install
npx expo start
```

Сканирай QR кода с **Camera** (iPhone) или **Expo Go** (Android). Телефонът трябва да е на същата WiFi мрежа като компютъра.

## Какво работи в v1

- Home екран със заглавие, ротиращо подзаглавие (5 варианта, 4.5s), 5 mood chip-а, primary бутон
- Random selection: random измежду 4-те основни ако няма избрано настроение; BG = бонус
- Result екран: pop animation на емоджито, име, причина в курсив, mood pill, back бутон
- Reroll със сас: 6 различни съобщения, не повтаря последното ястие
- Native share sheet с точния текстов формат от §6.3 на брийфа
- 5 различни визуални свята: цвят + gradient + типография + SVG decoration
- Custom Google Fonts: Geist, Fraunces, Instrument Serif

## Tech stack

**Прототип:** React 18 (UMD) + Babel Standalone, всичко в HTML/JSX, без build step.

**Истинското приложение:**
- Expo SDK 54 + React Native 0.81 + TypeScript
- `expo-linear-gradient` — фонови градиенти
- `react-native-svg` — mood декорации
- `expo-blur` — frosted UI (резерв за share sheet)
- `expo-clipboard` — copy to clipboard
- `@expo-google-fonts/geist` + `fraunces` + `instrument-serif`
- Native `Share` API от React Native — отваря системния share sheet

## Bundle / distribution

- **iOS:** `com.kakvodayam.app` — Apple Developer акаунт ($99/год)
- **Android:** `com.kakvodayam.app` — Google Play Console (еднократно $25)
- Build чрез **EAS Build** (cross-platform от един код)

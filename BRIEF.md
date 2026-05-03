# Какво да ям? — Product Brief (final)

> Мобилно приложение, което ти казва какво да ядеш — със стил, личност и доза brutal honesty.
>
> **Платформи: iOS и Android** (един код чрез Expo / React Native)

---

## 1. Концепция

**Едно приложение, четири настроения + бонус, нула решения за вземане.**
Натискаш бутон, едно настроение ти казва какво да ядеш — и защо. Не оптимално хранене, а развлечение и облекчение от decision fatigue.

---

## 2. Защо ще работи

- **Реален проблем**: 30+ пъти на ден решаваме "какво да ям?"
- **Слаба конкуренция**: повечето "what to eat" приложения са скучни random генератори без личност.
- **Празен BG пазар**: няма локализирано решение с български хумор и кухня.
- **Honest mode = viral hook**: никое друго приложение не казва истината какво искаш да ядеш.
- **Screenshot-friendly**: copy-то е написано да се споделя в Stories.

---

## 3. Име

**"Какво да ям?"**
Bundle ID предложение: `com.kakvodayam.app`

---

## 4. Настроения

### 🥗 Healthy-ish — "Искам да се чувствам отговорна"
Меко окуражителен, балансиран, със самоирония. **НЕ е fitfluencer.** Знае че никой не е перфектен.

*Пример:* 🥗 Салата — "ще я изядеш… и после нещо друго"

### 💅 Fancy — "Днес заслужавам нещо по-така"
Лек снобизъм със себеосъзнаване. Знае че се преструва, и това е чарът.

*Пример:* 🍣 Суши — "защото днес си главният герой… за около час"

### 😂 Honest — "Кажи ми истината какво ми се яде" *(THE viral hook)*
Без филтър. Brutal honest. Леко саркастичен, но не зъл. Мета-самоосъзнат.

*Пример:* 🍕 Пица — "не се лъжи, това беше решението от самото начало"

### 🧸 Comfort — "Искам нещо уютно и вкусно"
Мек, топъл, лек nostalgia. Грижовен без да е сладникав.

*Пример:* 🍝 Паста — "това не е храна, това е терапия"

### 🇧🇬 Bulgarian *(бонус)* — "Дай ми нещо родно"
Класическата българска кухня с локален хумор. Виза̀ва за чужденци, ностaлгия за нашенци.

*Пример:* 🥧 Баница — "защото всяко решение започва с баница"

---

## 5. База данни

**45 ястия, 80+ funny reasons, готови за импорт.** Виж `meals.json` (приложен отделно).

Структура:

```json
{
  "id": "pizza",
  "emoji": "🍕",
  "name": "Пица",
  "moods": ["honest"],
  "reasons": {
    "honest": [
      "не се лъжи, това беше решението от самото начало",
      "защото днес не си човек, който взима добри решения",
      "не се преструвай, че ще избереш нещо друго"
    ]
  }
}
```

Всяко ястие може да принадлежи на 1–3 настроения, с различни reasons за всяко.

---

## 6. Основни механики

### 6.1 Случаен избор
- Filter по избрано настроение (или random измежду всички)
- Random ястие → random reason за избраното настроение
- Не повтаряй последното ястие подред

### 6.2 Reroll със сас

| Натискане | Малък текст под бутона |
|---|---|
| 1-во | (без коментар) |
| 2-ро | "Сериозно? Добре, още един опит..." |
| 3-то | "Не съм твоя майка. Реши се." |
| 4-то | "Това е третият път, в който отказваш." |
| 5-то | "Добре. Този път е финален." |
| 6-то+ | "Просто яж нещо. Каквото и да е. Моля те." |

### 6.3 Share бутон към социални мрежи *(ключова функция)*

**Как работи:**
- Натискаш "Сподели" → отваря native share sheet
- Споделя форматиран текст към Instagram Stories / WhatsApp / Viber / Messenger / Facebook / TikTok / Telegram

**Текстов формат за v1:**

```
😂 Какво да ям? казва:

🍕 Пица
„Не се лъжи, това беше решението от самото начало."

— приложението "Какво да ям?"
#каквоиДаЯм
```

**За v1.1 (важно за viral потенциала):**
Генерира красива картинка (1080x1920 за Stories, 1080x1080 за пост) с:
- Голямото емоджи в центъра
- Името на ястието
- Reason-ът
- Малък brand watermark "Какво да ям?" в долния ъгъл
- Цветен background според настроението

Тази картинка прави screenshot-а излишен и **гарантира** че brand-ът се появява навсякъде където хората я споделят. Безплатен маркетинг.

---

## 7. Екрани

### Екран 1: Home
- Заглавие: **"Какво да ям?"**
- Подзаглавие: ротиращо ("Защото пак не знаеш", "Не съм диетолог, аз съм приятел", "Реши вместо теб")
- Голям бутон: **"Избери за мен"**
- Под бутона: **5 chip-а с настроения** (Healthy-ish / Fancy / Honest / Comfort / 🇧🇬 BG)
- Default: ако не избереш настроение → random измежду всички 4 основни (BG = бонус, само ако се избере)

### Екран 2: Резултат
- Голямо емоджи в центъра (анимирано появяване, ~100px)
- Име на ястието (28px bold)
- Причина (16px regular, italic, max 2 реда)
- Бутон "Друго" → reroll със сас (secondary стил)
- Бутон "Сподели" → native share sheet (primary стил, тераковта)
- Малък link: "Промени настроението" → връща в home

---

## 8. Визуална посока

### Принципи
- **Чисто, не претрупано.** Едно нещо в центъра.
- **Топли, не неонови цветове.**
- **Типография върши работа.** Голямо, sans-serif.
- **Емоджитата носят емоцията.**

### Цветова палитра

**Базови:**
- Background: кремаво `#FBF7F2`
- Primary text: тъмно сиво `#2A2A2A`
- Accent (бутони): тераковта `#C8645A`

**Mood цветове:**

| Настроение | Цвят | Hex |
|---|---|---|
| 🥗 Healthy-ish | маслинено | `#9CAF88` |
| 💅 Fancy | dusty rose | `#D4A5A5` |
| 😂 Honest | горчица | `#B8893D` |
| 🧸 Comfort | топъл бежов | `#B89B7A` |
| 🇧🇬 Bulgarian | бордо/червено | `#A8453F` |

---

## 9. Монетизация

### v1 — безплатно
- 4 основни настроения + Bulgarian бонус, всички ястия, всички функции
- Без реклами (защитава UX и насърчава share-овете)
- Цел: натрупване на потребители и share-ове

### v1.5 — Premium pack: 4.99 лв (one-time)
Допълнителни настроения: 🤕 Махмурлия, 😤 Hangry, 💔 Сърцеразбит, 🌙 Късно вечер, 🎓 Студентски

### v2
- Тематични packs (по 2.99 лв): "PMS mode", "Romantic mode", "Семейство с деца"
- Affiliate с Foodpanda / Glovo — "Поръчай това сега"

---

## 10. Технически стак

### Платформи: iOS + Android (един код)

**Препоръка: Expo (React Native) + TypeScript**

| Защо | |
|---|---|
| Cross-platform | Един код за iOS + Android |
| EAS Build | Build-ва за двете платформи в облака |
| AsyncStorage | Локални данни, без backend |
| Без сървър за v1 | meals.json в приложението — работи offline |
| RevenueCat | In-app purchases с един SDK за двете платформи |
| react-native-share | За native share към социални мрежи |
| react-native-view-shot | За v1.1 — генериране на картинки от UI |

### Distribution
- iOS: Apple Developer акаунт ($99/год)
- Android: Google Play Console (еднократно $25)

### Структура

```
kakvodayam/
├── app/
│   ├── (tabs)/index.tsx       # Home екран
│   ├── result.tsx             # Резултат екран
│   └── _layout.tsx
├── data/
│   └── meals.json             # Базата с ястия
├── components/
│   ├── MoodChip.tsx
│   ├── MealCard.tsx
│   └── ShareButton.tsx
├── lib/
│   ├── mealPicker.ts          # Логиката за избор
│   ├── rerollMessages.ts      # Сас съобщенията
│   ├── shareFormatter.ts      # Форматиране на текста за share
│   └── storage.ts             # AsyncStorage helpers
├── assets/
├── app.json                   # Expo конфигурация
├── meals.json                 # → копирай в data/
└── BRIEF.md
```

---

## 11. Обхват на v1 (MVP)

### Включено
- ✅ Home екран със заглавие, бутон, 5 chip-а
- ✅ Random selection логика (избягва повторение на последното ястие)
- ✅ Резултат екран с емоджи + име + причина
- ✅ Reroll механика със сас (6 различни съобщения)
- ✅ База с 45 ястия и 80+ reasons (от `meals.json`)
- ✅ **Share бутон с native share sheet** (текстов формат)
- ✅ Чист, brand-минималистичен дизайн
- ✅ Работи на iOS и Android от един код

### Отложено за v1.1 / v2
- ⏳ Генерирани share картинки с brand watermark *(приоритет за v1.1)*
- ⏳ История + achievements
- ⏳ Допълнителни настроения (paid pack)
- ⏳ Couple mode
- ⏳ Onboarding flow
- ⏳ Time-of-day awareness

---

## 12. Готов prompt за Claude Code

```
Build a cross-platform mobile app called "Какво да ям?" using Expo and TypeScript.
The app must run on both iOS and Android from a single codebase.

The full project brief is in BRIEF.md — read it fully before starting.
The meal database is in meals.json — already cleaned and ready to import into data/meals.json.

For v1 (MVP), implement only what's listed in section 11.
The app is in Bulgarian — all UI text should match the brief.

There are 4 main moods + 1 bonus, each with its own personality:
🥗 Healthy-ish, 💅 Fancy, 😂 Honest, 🧸 Comfort, 🇧🇬 Bulgarian (bonus)

Start by:
1. Setting up Expo project as outlined in section 10
2. Configuring app.json for both iOS and Android (icons, splash, bundle ID com.kakvodayam.app)
3. Importing the existing meals.json into data/
4. Building the Home screen with title, 5 mood chips, main button
5. Building the Result screen with emoji, name, reason, reroll button, share button
6. Implementing share with react-native-share — native share sheet,
   text format from section 6.3 of the brief

Test on both iOS Simulator and Android Emulator.
Ask before adding new dependencies beyond Expo defaults.
```

---

## 13. Следващи стъпки

1. Финализирай името → купи домейн (`kakvodayam.com` или `.app`)
2. Регистрирай developer accounts (Apple $99/год + Google $25 еднократно)
3. Създай Instagram акаунт `@kakvodayam` за teaser кампания
4. Започни кодинга в Claude Code с този brief + `meals.json`
5. Пускай 3-5 "Honest mode" поста седмично в IG преди launch (organic warmup)
6. Soft launch в български Reddit/Facebook групи преди App Store submission

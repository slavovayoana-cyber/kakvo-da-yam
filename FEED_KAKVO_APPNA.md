# „Какво APPна?" — социален feed за храна (състояние и план)

Хендоф документ: къде сме, какво следва. Работен клон: **`claude/app-mods-no-updates-7in54r`**.

## Какво е

Нова секция в приложението — потребителите качват какво са яли:
- **Заведения**: ястие + заведение (име + град + линк към Google Maps, вариант A, без Places API), **двоен рейтинг** (🍴 ястие 1–5 + 🏠 място 1–5), „струваше ли си", тип място, кухня, снимка, коментар.
- **Вкъщи**: рецепта — време, трудност, порции, съставки, стъпки, снимка, оценка.
- Два изгледа: **Карти** и **Списък** (минимал). Стил #1 „Топло меню" (топли цветове, серифни заглавия).
- Харесвания, докладвай/скрий (модерация), филтри.

Позициониране: *Google Maps казва КЪДЕ; „Какво APPна?" казва КАКВО да поръчаш.*

## Състояние по етапи

- [x] **Етап 1 — база данни (Supabase).** SQL в `supabase/feed_schema.sql`. **ВЕЧЕ Е ПУСНАТ** в проекта (ozjrsivvcgrngvzejbtl). Таблици: `feed_profiles`, `feed_posts`, `feed_likes`, `feed_reports`; view `feed_place_stats`; bucket `feed-photos`; RLS позволяващи (виж бележката за сигурност).
- [x] **Етап 2 — екрани.** `screens/FeedScreen.tsx` (лента, 2 секции, карти/списък, бързи филтри, харесване, докладвай/скрий, pull-to-refresh, празно състояние) и `screens/FeedComposeScreen.tsx` (прякор при първи пост, форма заведение/вкъщи). Данни: `lib/feed.ts` + `lib/feedTypes.ts`. Вход: бутон „🍴 Какво APPна?" в `HomeScreen.tsx`; навигация в `App.tsx` (екрани `feed`, `feed_compose`).
- [x] **Етап 3 — снимки.** `expo-image-picker` (камера/галерия) + разрешения в `app.json`. Версия вдигната на **1.1.0** (нов нативен модул → иска билд).
- [ ] **Билд + TestFlight** ← СЛЕДВА. Виж по-долу.
- [ ] **Пълен филтърен екран** „⚙ Филтри" (сортиране, тип място, повод, цена, разстояние). Само UI + query параметри → **може по OTA** след билда. Сега има само бързи чипове.
- [ ] **Втвърдяване на сигурността** преди голям публичен ръст (виж бележката).

## ⚠️ Важно за OTA vs билд

Приложението има `runtimeVersion: appVersion` + `expo-updates`.
- Кодът сега съдържа **нативен модул** (`expo-image-picker`), който текущите инсталации (v1.0.x) нямат. **НЕ пускай OTA на production от този код към стари версии — ще гръмне.**
- Версията е **1.1.0** → нов runtime. След билда на 1.1.0, бъдещи OTA за feed се пускат за runtime 1.1.0 (стария GitHub Actions workflow `.github/workflows/eas-update.yml`).

## Как да продължиш (билд)

Опция 1 — EAS от терминал (VS Code):
```bash
cd app-expo
eas build --profile production --platform ios --auto-submit   # → TestFlight
# и/или Android:
eas build --profile production --platform android
```
Опция 2 — през GitHub Actions (без терминал): да се добави `build` workflow, аналогичен на `eas-update.yml`, който вика `eas build … --non-interactive`. Изисква secret `EXPO_TOKEN` (вече наличен).

Тествай в **TestFlight / internal** (стига само до теб), после `eas submit` към магазина. Едва тогава feed-ът е публичен.

## Бележка за сигурност (RLS)

Сега RLS правилата са позволяващи (както couples режима: анонимен ключ + `device_id`, без вход). За публичен UGC feed преди ръст: мигрирай към **Supabase Anonymous Auth**, за да заключиш редакция/триене само до автора (`author = auth.uid()`), и добави сървърна модерация. Клиентът вече поддържа докладвай + локално скриване.

## Ключови файлове

| Файл | Роля |
|---|---|
| `supabase/feed_schema.sql` | схема на базата (изпълнена) |
| `app-expo/lib/feed.ts` / `feedTypes.ts` | слой за връзка + типове |
| `app-expo/screens/FeedScreen.tsx` | лентата |
| `app-expo/screens/FeedComposeScreen.tsx` | добавяне на пост |
| `app-expo/App.tsx`, `screens/HomeScreen.tsx` | навигация + вход |
| `.github/workflows/eas-update.yml` | OTA публикуване (копче в GitHub Actions) |

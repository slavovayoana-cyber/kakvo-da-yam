import WidgetKit
import SwiftUI

// MARK: - Helpers

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let (a, r, g, b): (UInt64, UInt64, UInt64, UInt64)
        switch hex.count {
        case 6:  (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: (a, r, g, b) = (255, 200, 100, 90)
        }
        self.init(.sRGB,
                  red: Double(r)/255, green: Double(g)/255,
                  blue: Double(b)/255, opacity: Double(a)/255)
    }
}

private func quoted(_ s: String) -> String {
    "\u{201E}\(s)\u{201D}"
}

// MARK: - Resolved Pick
// A meal + the specific mood/reason chosen for this render. Mirrors how the
// app's mealPicker resolves a meal into (meal, reason, mood).

struct ResolvedMeal {
    let emoji: String
    let name: String
    let reason: String
    let badge: String
    let glow: Color

    /// Which meal-time categories make sense for a given hour of day, so the
    /// widget never suggests wine at 8am or breakfast at midnight.
    private static func timesFor(hour: Int) -> [String] {
        switch hour {
        case 5..<11:   return ["breakfast"]                          // сутрин
        case 11..<15:  return ["lunch_dinner"]                       // обяд
        case 15..<18:  return ["snack", "dessert"]                   // следобед
        case 18..<23:  return ["lunch_dinner", "dessert", "drink"]   // вечер
        default:       return ["snack", "dessert"]                   // нощ
        }
    }

    /// Pick a random meal appropriate for the given date's hour.
    static func random(for date: Date = Date()) -> ResolvedMeal {
        let hour = Calendar.current.component(.hour, from: date)
        let allowed = Set(timesFor(hour: hour))
        let pool = Meals.all.filter { meal in
            meal.times.contains { allowed.contains($0) }
        }
        let meal = (pool.isEmpty ? Meals.all : pool).randomElement() ?? Meals.all[0]
        let mood = meal.moods.randomElement() ?? meal.moods[0]
        let reason = mood.reasons.randomElement() ?? ""
        return ResolvedMeal(
            emoji: meal.emoji,
            name: meal.name,
            reason: reason,
            badge: mood.badge,
            glow: Color(red: mood.glow.0, green: mood.glow.1, blue: mood.glow.2)
        )
    }

    static let placeholder = ResolvedMeal(
        emoji: "🍛", name: "Индийско Butter Chicken",
        reason: "Пиле, плуващо в крем, масло и оправдания.",
        badge: "🧸 Comfort", glow: Color(red: 0.80, green: 0.55, blue: 0.30)
    )
}

// MARK: - Timeline

struct MealEntry: TimelineEntry {
    let date: Date
    let meal: ResolvedMeal
}

struct KakvoProvider: TimelineProvider {
    func placeholder(in context: Context) -> MealEntry {
        MealEntry(date: Date(), meal: .placeholder)
    }
    func getSnapshot(in context: Context, completion: @escaping (MealEntry) -> Void) {
        completion(MealEntry(date: Date(), meal: .random()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<MealEntry>) -> Void) {
        // A fresh meal every hour, each appropriate for the hour it shows at.
        var entries: [MealEntry] = []
        let now = Date()
        for offset in 0..<12 {
            let date = Calendar.current.date(byAdding: .hour, value: offset, to: now) ?? now
            entries.append(MealEntry(date: date, meal: .random(for: date)))
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

// MARK: - Design Tokens

private enum DT {
    static let accent   = Color(hex: "#C8645A")
    static let darkBg   = Color(hex: "#1a1a20")
    static let lightGrad = LinearGradient(
        colors: [Color(hex: "#fdf6ee"), Color(hex: "#f5dfc9"), Color(hex: "#edc4aa")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static func ink(_ cs: ColorScheme) -> Color {
        cs == .dark ? .white : Color(hex: "#3d2318")
    }
}

// MARK: - Shared Views

private struct BrandLabel: View {
    @Environment(\.colorScheme) var cs
    var body: some View {
        Text("какво да ям?")
            .font(.system(size: 9, weight: .bold))
            .tracking(1.8)
            .textCase(.uppercase)
            .foregroundColor(DT.ink(cs).opacity(0.38))
    }
}

/// The full-bleed widget background (gradient + mood glow). Lives in
/// `.containerBackground` so it fills the entire widget with no white border.
private struct WidgetCanvas: View {
    let meal: ResolvedMeal
    var isLarge: Bool = false
    @Environment(\.colorScheme) var cs
    var body: some View {
        ZStack {
            if cs == .dark { DT.darkBg } else { DT.lightGrad }
            RadialGradient(
                colors: [meal.glow.opacity(cs == .dark ? 0.52 : 0.22), .clear],
                center: .topLeading, startRadius: 0, endRadius: isLarge ? 300 : 230
            )
            if isLarge {
                RadialGradient(
                    colors: [Color(red: 0.3, green: 0.2, blue: 0.85).opacity(cs == .dark ? 0.28 : 0.10), .clear],
                    center: .bottomTrailing, startRadius: 0, endRadius: 200
                )
            }
        }
    }
}

private struct MoodBadge: View {
    let text: String
    @Environment(\.colorScheme) var cs
    var body: some View {
        Text(text)
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(DT.ink(cs).opacity(0.5))
            .padding(.horizontal, 9).padding(.vertical, 3)
            .background(DT.ink(cs).opacity(0.07))
            .clipShape(Capsule())
    }
}

// MARK: - Small

struct SmallView: View {
    let meal: ResolvedMeal
    @Environment(\.colorScheme) var cs
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            BrandLabel()
            Spacer(minLength: 6)
            Text(meal.emoji)
                .font(.system(size: 40))
                .lineLimit(1)
                .minimumScaleFactor(0.5)
                .frame(maxWidth: .infinity)
            Spacer(minLength: 6)
            Text(meal.name)
                .font(.system(size: 12.5, weight: .heavy))
                .foregroundColor(DT.ink(cs))
                .lineLimit(2)
                .minimumScaleFactor(0.7)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

// MARK: - Medium

struct MediumView: View {
    let meal: ResolvedMeal
    @Environment(\.colorScheme) var cs
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            BrandLabel()
            HStack(spacing: 12) {
                Text(meal.emoji)
                    .font(.system(size: 38))
                    .lineLimit(1)
                    .frame(width: 50, alignment: .leading)
                VStack(alignment: .leading, spacing: 4) {
                    Text(meal.name)
                        .font(.system(size: 15, weight: .heavy))
                        .foregroundColor(DT.ink(cs))
                        .lineLimit(2)
                        .minimumScaleFactor(0.8)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(quoted(meal.reason))
                        .font(.system(size: 11))
                        .foregroundColor(DT.ink(cs).opacity(0.55))
                        .italic()
                        .lineLimit(3)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .layoutPriority(1)
            }
            .frame(maxHeight: .infinity)
            HStack {
                Text("Натисни за да отвориш")
                    .font(.system(size: 9, weight: .semibold))
                    .tracking(0.8)
                    .textCase(.uppercase)
                    .foregroundColor(DT.ink(cs).opacity(0.2))
                    .lineLimit(1)
                Spacer()
                MoodBadge(text: meal.badge)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

// MARK: - Large

struct LargeView: View {
    let meal: ResolvedMeal
    @Environment(\.colorScheme) var cs
    private let moods = ["🥗 Healthy", "💅 Fancy", "😂 Honest", "🧸 Comfort", "🇧🇬 BG"]
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            BrandLabel()
            HStack(spacing: 4) {
                ForEach(moods, id: \.self) { m in
                    let active = meal.badge == m
                    Text(m)
                        .font(.system(size: 9.5, weight: .semibold))
                        .lineLimit(1)
                        .fixedSize()
                        .foregroundColor(active ? DT.accent : DT.ink(cs).opacity(0.38))
                        .padding(.horizontal, 7).padding(.vertical, 3)
                        .background(active ? DT.accent.opacity(0.15) : DT.ink(cs).opacity(0.06))
                        .clipShape(Capsule())
                        .overlay(Capsule().stroke(active ? DT.accent.opacity(0.35) : Color.clear, lineWidth: 1))
                }
            }
            .padding(.top, 10)
            Spacer()
            Text(meal.emoji)
                .font(.system(size: 76))
                .frame(maxWidth: .infinity)
            Spacer()
            Text(meal.name)
                .font(.system(size: 22, weight: .black))
                .foregroundColor(DT.ink(cs))
                .frame(maxWidth: .infinity, alignment: .center)
                .lineLimit(1)
                .minimumScaleFactor(0.68)
            Text(quoted(meal.reason))
                .font(.system(size: 13))
                .foregroundColor(DT.ink(cs).opacity(0.5))
                .italic()
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .frame(maxWidth: .infinity)
                .padding(.top, 6)
                .padding(.bottom, 14)
            Text("Избери за мен \u{2192}")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(cs == .dark ? .white : DT.accent)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 13)
                .background(DT.ink(cs).opacity(0.07))
                .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .padding(18)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

// MARK: - Lock Screen

struct LockView: View {
    let meal: ResolvedMeal
    var body: some View {
        HStack(spacing: 12) {
            Text(meal.emoji).font(.system(size: 34))
            VStack(alignment: .leading, spacing: 2) {
                Text("какво да ям?")
                    .font(.system(size: 9, weight: .bold))
                    .tracking(1.5)
                    .textCase(.uppercase)
                    .foregroundColor(.secondary)
                Text(meal.name)
                    .font(.system(size: 15, weight: .bold))
                    .lineLimit(1)
                Text(quoted(meal.reason))
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .italic()
                    .lineLimit(1)
            }
            Spacer()
        }
        .padding(.horizontal, 16)
    }
}

// MARK: - Entry View

struct KakvoWidgetEntryView: View {
    let entry: MealEntry
    @Environment(\.widgetFamily) var family
    var body: some View {
        Group {
            switch family {
            case .systemSmall:  SmallView(meal: entry.meal)
            case .systemLarge:  LargeView(meal: entry.meal)
            #if os(iOS)
            case .accessoryRectangular: LockView(meal: entry.meal)
            #endif
            default:            MediumView(meal: entry.meal)
            }
        }
        .containerBackground(for: .widget) {
            #if os(iOS)
            if family == .accessoryRectangular {
                Color.clear
            } else {
                WidgetCanvas(meal: entry.meal, isLarge: family == .systemLarge)
            }
            #else
            WidgetCanvas(meal: entry.meal, isLarge: family == .systemLarge)
            #endif
        }
    }
}

// MARK: - Widget

struct KakvoWidget: Widget {
    let kind = "KakvoWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: KakvoProvider()) { entry in
            KakvoWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Какво да ям?")
        .description("Избира ястие за теб когато не можеш да решиш.")
        #if os(iOS)
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryRectangular])
        #else
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        #endif
    }
}

// MARK: - Previews

#Preview(as: .systemSmall)  { KakvoWidget() } timeline: { MealEntry(date: .now, meal: .placeholder) }
#Preview(as: .systemMedium) { KakvoWidget() } timeline: { MealEntry(date: .now, meal: .placeholder) }
#Preview(as: .systemLarge)  { KakvoWidget() } timeline: { MealEntry(date: .now, meal: .placeholder) }

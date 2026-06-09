// AUTO-GENERATED from data/meals.json — do not edit by hand.
// Regenerate with: python3 scripts/gen-widget-meals.py

import SwiftUI

struct WidgetMoodOption {
    let badge: String
    let glow: (Double, Double, Double)
    let reasons: [String]
}

struct WidgetMeal {
    let emoji: String
    let name: String
    let times: [String]
    let moods: [WidgetMoodOption]
}

enum Meals {
    static let all: [WidgetMeal] = [
        WidgetMeal(emoji: "🍲", name: "Супа", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["звучи здравословно, дори когато не си"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топло и без драма (рядко)", "защото знаеш, че имаш нужда"]),
        ]),
        WidgetMeal(emoji: "🥗", name: "Салата", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["за да се почувстваш добре, докато поръчваш десерт", "явно наказваш себе си за нещо", "ще я изядеш… и после ще си поръчаш истинска храна", "опит за баланс, който никога не завършва с баланс", "изглежда като решение, усеща се като наказание"]),
        ]),
        WidgetMeal(emoji: "🥒", name: "Таратор", times: ["lunch_dinner", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["защото или е жега, или се преструваш, че е", "класика. Студено, бяло, безопасно."]),
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["перфектен… за точно 40 минути", "лято в купа, без гаранция за засищане", "освежаващ и напълно недостатъчен"]),
        ]),
        WidgetMeal(emoji: "🥦", name: "Печени зеленчуци", times: ["lunch_dinner", "snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["това е моментът, в който се правиш на човек с дисциплина", "Pinterest те гледа и кима одобрително", "защото днес си нов човек (до 18:00)"]),
        ]),
        WidgetMeal(emoji: "🍳", name: "Яйца", times: ["breakfast", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["защото нямаш план, но се държиш сякаш имаш", "класика за хора, които нямат план", "нямаш план, но имаш тиган"]),
        ]),
        WidgetMeal(emoji: "🤏", name: "Нещо „леко\"", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["което ще се превърне в тежко след 20 минути"]),
        ]),
        WidgetMeal(emoji: "🍣", name: "Суши", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["днес сме classy, поне на теория"]),
        ]),
        WidgetMeal(emoji: "💸", name: "Нещо скъпо", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["за да съжаляваш по-късно"]),
        ]),
        WidgetMeal(emoji: "💎", name: "Ресторант, който не можеш да си позволиш", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["за да погледаш менюто и да си тръгнеш"]),
        ]),
        WidgetMeal(emoji: "🍕", name: "Пица", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["защото днес не си човек, който взима добри решения"]),
        ]),
        WidgetMeal(emoji: "🍔", name: "Бургер", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["вече е избрано, просто чакаш одобрение", "защото вътрешното ти аз вече е взело решение", "американска мечта между две хлебчета — холестеролът ти ръкопляска"]),
        ]),
        WidgetMeal(emoji: "🍫", name: "Шоколад", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["не е вечеря, но и не те интересува"]),
        ]),
        WidgetMeal(emoji: "🥪", name: "Сандвич", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["хляб + каквото има. Готово."]),
        ]),
        WidgetMeal(emoji: "😶", name: "Нищо", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["ще отвориш хладилника още 4 пъти", "отвори пак хладилника след 5 минути, знаеш как става", "не от глад. От скука."]),
        ]),
        WidgetMeal(emoji: "🛒", name: "Всичко", times: ["lunch_dinner", "snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["поръчай 4 неща, изяж 1.5"]),
        ]),
        WidgetMeal(emoji: "🧊", name: "Отваряне на хладилника", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["и ти знаеш, че няма нищо вътре", "ще го отвориш, ще го затвориш, повтори", "няма нищо ново, но пак проверяваш", "магията не се е случила", "затвори и повтори"]),
        ]),
        WidgetMeal(emoji: "🍆", name: "Мусака", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["класика без подгласници"]),
        ]),
        WidgetMeal(emoji: "🥞", name: "Палачинки", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["защото защо не закуска за вечеря?", "с конфитюр от баба, ако имаш", "вечеря, маскирана като закуска"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["захар, маскирана като lifestyle", "десерт, който се преструва на закуска"]),
        ]),
        WidgetMeal(emoji: "🍅🍞", name: "Лютеница с хляб", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["минимализъм, но с характер", "три съставки, цяло детство", "нищо fancy, всичко необходимо"]),
        ]),
        WidgetMeal(emoji: "🥪", name: "Топъл сандвич", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["малко усилие, голяма награда", "разтопеният кашкавал е любов"]),
        ]),
        WidgetMeal(emoji: "🍛", name: "Храна от мама", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["ако имаш достъп, не мисли", "обади се на мама", "никой ресторант не може да го повтори"]),
        ]),
        WidgetMeal(emoji: "🍞🧀", name: "Попара", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["защото вътрешното ти дете има мнение"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["хляб, сирене, чай. Толкова просто."]),
        ]),
        WidgetMeal(emoji: "🍖🍟", name: "Кебапчета с пържени картофи", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["класика, не философствай", "не сме в Париж, ние сме тук"]),
        ]),
        WidgetMeal(emoji: "🍅🧀", name: "Шопска салата", times: ["lunch_dinner", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["за да има нещо „здравословно\" до ракията", "сирене на върха = задължително", "националното знаме в чиния", "туристите я ядат с вилица, ние — с хляб"]),
        ]),
        WidgetMeal(emoji: "🍗", name: "Скара", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["защото днес си в режим „ще ям като човек\"", "на въглища, не на тиган. Има значение.", "тук не се мисли, тук се яде"]),
        ]),
        WidgetMeal(emoji: "🌶️", name: "Пълнени чушки", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["защото някой някога е имал време да готви"]),
        ]),
        WidgetMeal(emoji: "🫘", name: "Боб чорба", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["утре ще съжаляваш, но днес е вкусно", "топло, евтино, перфектно"]),
        ]),
        WidgetMeal(emoji: "🥛", name: "Айрян + нещо", times: ["drink", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["защото айрянът е константа", "не питай защо. Просто айрян.", "кисело мляко с вода и сол — звучи странно, спасява живот", "с дюнер задължително. Със скара — препоръчително."]),
        ]),
        WidgetMeal(emoji: "🍕", name: "Пица от кварталната", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["разяжда душата ти, но с добра цена", "няма романтика, има пица"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["избираш я, защото знаеш менюто наизуст", "два пъти месечно е стандарт, призни си"]),
        ]),
        WidgetMeal(emoji: "🍦🌙", name: "Сладолед за вечеря", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["цялата кофичка, без да броиш лъжиците"]),
        ]),
        WidgetMeal(emoji: "🥑🍞", name: "Авокадо тост", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["30 лева за хляб със зелено", "защото го видя в Instagram", "класически brunch ход"]),
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["за да имаш какво да публикуваш в сторитата", "мазнини, но „добри\". Все същата работа."]),
        ]),
        WidgetMeal(emoji: "🌭⛽", name: "Хот дог от бензиностанция", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["никой не пита от къде. Всички знаят.", "вкусът е съмнителен, желанието — не"]),
        ]),
        WidgetMeal(emoji: "🍵", name: "Matcha latte", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["вкусът е странен, но цветът е перфектен за снимка", "плащаш за зелено, получаваш самоуважение", "лек горчив подтон, точно като живота ти"]),
        ]),
        WidgetMeal(emoji: "🥣", name: "Овесена каша", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["ще те държи точно до 10:30, после катастрофа", "звучи като отговорно решение в 7 сутринта"]),
        ]),
        WidgetMeal(emoji: "🥘", name: "Гювеч", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["като че ли някой се грижи за теб"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["каквото намериш в хладилника + гърне = вечеря", "импровизация, която винаги работи"]),
        ]),
        WidgetMeal(emoji: "🍲", name: "Шкембе чорба", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["лекарство, маскирано като храна", "след снощи. Не питай какво стана.", "оцет, чесън, и едно прозрение", "лекарство за махмурлук от 1922 г. до ден днешен"]),
        ]),
        WidgetMeal(emoji: "❄️🍕", name: "Замразена пица", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["и ще се престориш, че готвиш", "20 минути във фурната, 4 минути в стомаха"]),
        ]),
        WidgetMeal(emoji: "🍱", name: "Поке боул", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["много съставки, малко калории, много снимки", "японската версия на „здравословен лукс\""]),
        ]),
        WidgetMeal(emoji: "🌮", name: "Тако", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["три на бройка, ще поръчаш още", "падна една съставка, изяде се все пак"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["сос на брадата = хубава вечер"]),
        ]),
        WidgetMeal(emoji: "🫔", name: "Бурито", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["увиваш проблемите си в тортила", "ще пиеш и литър вода след това"]),
        ]),
        WidgetMeal(emoji: "🥟", name: "Дъмплинги", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["ядеш с пръчки, светът е по-голям", "точно 8 на чиния, защо да броиш", "соев сос е твоят парфюм за вечерта"]),
        ]),
        WidgetMeal(emoji: "🍜", name: "Истински рамен", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["5 часа бульон, ти не го заслужаваш, но го яж", "точна дисциплина на чужд народ"]),
        ]),
        WidgetMeal(emoji: "🍚", name: "Ризото", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["някой го е бъркал 25 минути за теб"]),
        ]),
        WidgetMeal(emoji: "🥗", name: "Цезар салата", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["салата с дресинг колкото пица"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["класика, която никога не става модерна или старомодна"]),
        ]),
        WidgetMeal(emoji: "🍛🌶️", name: "Тайландско къри", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["екзотика в добре климатизиран ресторант", "бамбук, кокос, и нота снобизъм"]),
        ]),
        WidgetMeal(emoji: "🥡", name: "Кутия с китайско", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["ще ядеш направо от кутията", "ориз + нещо + соев сос = обяд"]),
        ]),
        WidgetMeal(emoji: "🥚🍞", name: "Eggs Benedict", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["закуска в 13:00 = lifestyle", "холандезе с твърде много букви, твърде много яйца", "brunch — защото обикновената закуска не звучи достатъчно"]),
        ]),
        WidgetMeal(emoji: "🌶️", name: "Чушки бюрек", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["пържено и нелогично, точно както трябва"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["пълнени чушки в тесто — закуска, която изисква умения и уважение"]),
        ]),
        WidgetMeal(emoji: "🥒🧄", name: "Снежанка", times: ["snack", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["звучи като салата, държи се като дип"]),
        ]),
        WidgetMeal(emoji: "🍮", name: "Крем карамел", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["карамел отгоре, носталгия отдолу"]),
        ]),
        WidgetMeal(emoji: "🍳", name: "Сач", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["докато стигне, всички вече гледат"]),
        ]),
        WidgetMeal(emoji: "🍲", name: "Пилешка супа с фиде", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["от баба или от тенджера, важното е да е горещо", "лекува настинка, махмурлук и разбито сърце"]),
        ]),
        WidgetMeal(emoji: "🥯", name: "Геврек със сусам", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["от количката на гарата = автентично", "топъл, мазен, на хартия", "класика за хора в движение"]),
        ]),
        WidgetMeal(emoji: "🐟", name: "Цаца", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["пържени с пръсти, по плажа или в кварталното", "хапва се на бройки, броиш до забрава"]),
        ]),
        WidgetMeal(emoji: "🥔", name: "Руска салата", times: ["snack", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["няма парти без нея, и ти го знаеш", "майонеза + всичко = коктейл-мезе", "трае точно до края на ракията"]),
        ]),
        WidgetMeal(emoji: "🍯🍰", name: "Тулумба / кадаиф", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["захарен сироп, който не питаш колко калории е", "детство в захарта"]),
        ]),
        WidgetMeal(emoji: "🍞", name: "Пържени филийки", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["от стария хляб, който никога не изхвърляш"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["10 минути, 30 години детство"]),
        ]),
        WidgetMeal(emoji: "🥩🥬", name: "Капама", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["часове в пещ, минути в чинията"]),
        ]),
        WidgetMeal(emoji: "🥤", name: "Smoothie", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["ще си казваш че се храниш здраво… до първия глад", "изглежда като живот в ред… не е", "зелено чудо, което мирише на трева и самодисциплина"]),
        ]),
        WidgetMeal(emoji: "🍝", name: "Паста", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["калории с емоционална стойност"]),
        ]),
        WidgetMeal(emoji: "🌯", name: "Дюнер", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["бързо решение на дълбоки проблеми", "няма въпроси, няма съжаление"]),
        ]),
        WidgetMeal(emoji: "🥐", name: "Баница", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["няма лошо време за баница", "това не е избор, това е традиция"]),
        ]),
        WidgetMeal(emoji: "🍷", name: "„Само едно\"", times: ["drink", "snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["няма да е едно", "никога не е едно", "започваш с намерение, свършваш с история"]),
        ]),
        WidgetMeal(emoji: "🍬", name: "Само малко сладко", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["ще стане много", "няма да спреш, знаеш го", "започва като идея, свършва като пакет"]),
        ]),
        WidgetMeal(emoji: "☕🥂", name: "Кафе + мимоза", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["кафе за събуждане, мимоза за баланс", "алкохол преди 14:00, но е socially acceptable"]),
        ]),
        WidgetMeal(emoji: "🥐☕", name: "Brunch", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["отивате за кафе, тръгвате си с 60 лв сметка", "2 часа говорене, 10 минути ядене", "защото „закуска\" звучи твърде бедно", "денят още не е започнал, но парите вече ги няма", "всички снимат, никой не яде"]),
        ]),
        WidgetMeal(emoji: "🍸☀️", name: "Brunch + алкохол", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["пиеш на светло и се чувстваш законно", "това е socially acceptable грешка", "излизаш за кафе, излизаш с обяд и малка финансова травма"]),
        ]),
        WidgetMeal(emoji: "🍩", name: "Мекици", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["ще изядеш 2… ще станат 6", "баба одобрява, нутриционистът не"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["диетата ти те гледа и плаче"]),
        ]),
        WidgetMeal(emoji: "🧀🍅", name: "Сирене + домат", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["ако доматът е хубав, денят е спасен", "български минимализъм"]),
        ]),
        WidgetMeal(emoji: "🏠", name: "Каквото има", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["което реално е нищо"]),
        ]),
        WidgetMeal(emoji: "🫐", name: "Боровинки", times: ["snack", "breakfast", "dessert"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["малки, скъпи и изчезват за 30 секунди", "купуваш ги за здраве, ядеш ги като бонбони"]),
        ]),
        WidgetMeal(emoji: "🧄", name: "Чесън", times: [], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["здраве за теб, проблем за всички около теб"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["лекува всичко, освен социалния ти живот"]),
        ]),
        WidgetMeal(emoji: "🍌", name: "Банан", times: ["snack", "breakfast", "dessert"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["купуваш 5, ядеш 1, останалите стават на каша"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["купуваш 5, ядеш 1, останалите стават на каша"]),
        ]),
        WidgetMeal(emoji: "🥤🌿", name: "Green juice", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["трева, но в бутилка за 12 €"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["една глътка здраве, три глътки съжаление"]),
        ]),
        WidgetMeal(emoji: "🐟", name: "Сьомга", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["омега-3, о! мега-цена"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["омега-3, о! мега-цена"]),
        ]),
        WidgetMeal(emoji: "🫛", name: "Едамаме", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["соя, която е учила в чужбина"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["соя, която е учила в чужбина"]),
        ]),
        WidgetMeal(emoji: "🌾🥛", name: "Овесено мляко", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["вода с овес, която струва колкото вино"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["вода с овес, която струва колкото вино"]),
        ]),
        WidgetMeal(emoji: "🥯🥑", name: "Bagel с авокадо", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["кръгъл хляб с дупка по средата — като бюджета ти след това"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["кръгъл хляб с дупка по средата — като бюджета ти след това"]),
        ]),
        WidgetMeal(emoji: "🍠", name: "Чипс от кейл", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["хрускаш въздух с вкус на градина"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["листа, изпечени до смърт, продадени като лукс"]),
        ]),
        WidgetMeal(emoji: "🧈", name: "Гхи", times: [], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["масло, което е ходило на ретрит", "масло 2.0 — същото, ама духовно"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["масло, което е ходило на ретрит", "масло 2.0 — същото, ама духовно"]),
        ]),
        WidgetMeal(emoji: "🥜", name: "Тахан", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["сусамено масло за хора, които са приключили с фъстъченото"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["здравословно, докато не изядеш буркана с лъжица в 23:47"]),
        ]),
        WidgetMeal(emoji: "🥖", name: "Sourdough", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["хляб, който е по-стар от връзката ти"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["хляб, който е по-стар от връзката ти"]),
        ]),
        WidgetMeal(emoji: "🍫", name: "Тъмен шоколад 85%", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["шоколад, който се обижда, ако го наречеш десерт"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["шоколад, който се обижда, ако го наречеш десерт"]),
        ]),
        WidgetMeal(emoji: "💧", name: "Алкална вода", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["вода с pH и его", "H2O, но с маркетинг отдел"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["вода с pH и его", "H2O, но с маркетинг отдел"]),
        ]),
        WidgetMeal(emoji: "🦴", name: "Бульон от кости", times: ["drink", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["чорба за 18 лв, защото е „възстановяваща\"", "баба ти го правеше безплатно, но без хаштаг"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["чорба за 18 лв, защото е „възстановяваща\"", "баба ти го правеше безплатно, но без хаштаг"]),
        ]),
        WidgetMeal(emoji: "🥥", name: "Кокосова вода", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["потта на кокоса, бутилирана за 6 лв", "електролити с акцент"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["потта на кокоса, бутилирана за 6 лв", "електролити с акцент"]),
        ]),
        WidgetMeal(emoji: "🥚", name: "Яйца от свободно отглеждани кокошки", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["яйце с биография", "кокошката е била щастлива, ти плащаш 12 лв за 6 броя"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["яйце с биография", "кокошката е била щастлива, ти плащаш 12 лв за 6 броя"]),
        ]),
        WidgetMeal(emoji: "💊", name: "Колаген на прах", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["2 месеца по-късно: същото лице, празен портфейл"]),
        ]),
        WidgetMeal(emoji: "🍪", name: "Протеинови бисквити", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["суха като лекция по счетоводство"]),
        ]),
        WidgetMeal(emoji: "🧀", name: "Cottage cheese", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["извара, но 2026 edition"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["извара, но 2026 edition"]),
        ]),
        WidgetMeal(emoji: "🍫🐪", name: "Dubai шоколад", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["шоколад с тесто и фъстъчена паста за 35 лв"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["хапваш веднъж за снимка, плащаш като за вечеря"]),
        ]),
        WidgetMeal(emoji: "🥪", name: "Сандвич с лютеница и сирене", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["диетолог плаче, душата пее"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["диетолог плаче, душата пее"]),
        ]),
        WidgetMeal(emoji: "🫙🥒", name: "Кисела краставичка от буркана", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["никой не те гледа, всичко е позволено"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["никой не те гледа, всичко е позволено"]),
        ]),
        WidgetMeal(emoji: "🍖", name: "Кебапчета и кюфтета", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["поръчваш 2, ядеш 6, лъжеш че са били малки"]),
        ]),
        WidgetMeal(emoji: "🥃", name: "Ракия и салата", times: ["drink", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["първо ракията, после салатата, после философията"]),
        ]),
        WidgetMeal(emoji: "🫙", name: "Туршия", times: ["snack"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["зимни витамини в буркан"]),
        ]),
        WidgetMeal(emoji: "🐑🔥", name: "Чеверме", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["агне, което се върти 6 часа и обединява 40 души"]),
        ]),
        WidgetMeal(emoji: "🥚🌶️", name: "Миш-маш", times: ["breakfast", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["бъркани яйца с чушки и сирене — лятна вечеря на 5 минути", "вечеря, когато не ти се готви, но я искаш българска"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["вечеря, когато не ти се готви, но я искаш българска"]),
        ]),
        WidgetMeal(emoji: "🍣🛒", name: "Суши от супермаркет", times: ["lunch_dinner", "snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["авантюра, която или ще успее, или ще те прати в спешното"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["авантюра, която или ще успее, или ще те прати в спешното"]),
        ]),
        WidgetMeal(emoji: "🍿", name: "Пуканки в кино", times: ["snack"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["плащаш 11€ за царевица и въздух"]),
        ]),
        WidgetMeal(emoji: "🥐🍳", name: "Закуска от хотелски бюфет", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["започваш с плодове, завършваш с 4 кроасана и наденички", "ядеш сякаш утре няма закуска. Има, но все пак."]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["започваш с плодове, завършваш с 4 кроасана и наденички", "ядеш сякаш утре няма закуска. Има, но все пак."]),
        ]),
        WidgetMeal(emoji: "🦞", name: "Омар", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["вечеря, която изисква лигавник и бърз кредит", "червеният цар на морето, който струва колкото месечната ти заплата", "ядеш го веднъж в живота в Миконос и после говориш за него следващите 12 години"]),
        ]),
        WidgetMeal(emoji: "🍤", name: "Скариди на тиган", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["белиш ги 10 минути, ядеш ги за 30 секунди"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["пръстите ти миришат до утре"]),
        ]),
        WidgetMeal(emoji: "🍝", name: "Спагети болонезе", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["соса по тениската — задължителна част от изживяването"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["италиански класик за всеки, който няма време да измисля"]),
        ]),
        WidgetMeal(emoji: "🍛", name: "Пиле с къри", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["индийско ястие, което всички български менюта имат, но никое не прави еднакво"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["лъжеш се, че знаеш разликата между мадрас и тика масала"]),
        ]),
        WidgetMeal(emoji: "🍟", name: "Картофки трюфел и пармезан", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["картофки, които са ходили в чужбина"]),
        ]),
        WidgetMeal(emoji: "🥩", name: "Рибай стек", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["поръчваш медиум, идва well-done, мълчиш стоически"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["на грил, без сложности — както трябва"]),
        ]),
        WidgetMeal(emoji: "🥖", name: "Брускета", times: ["snack", "breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["италианско извинение за филия с лютеница"]),
        ]),
        WidgetMeal(emoji: "🍖", name: "Агнешки бут", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["ястие, което изисква 4 часа готвене и 4 минути ядене"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["вечерята на семейството, за която никой не помага в кухнята"]),
        ]),
        WidgetMeal(emoji: "🍕", name: "Пица „Хавай\"", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["поръчваш я, италианец някъде получава инфаркт"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["ананасът в пицата е твоят малък бунт"]),
        ]),
        WidgetMeal(emoji: "🍗", name: "Бъфало крилца", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["ядеш ги с целина, за да си кажеш „имах и зеленчук\""]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["лютиво и мазно — без преструвки"]),
        ]),
        WidgetMeal(emoji: "🍷", name: "Бутилка вино от сомелиера", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["пиеш я и не усещаш разликата от тази за 25 лв, но мълчиш"]),
        ]),
        WidgetMeal(emoji: "🍰", name: "Бананов кейк", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["извинение да не изхвърлиш черни банани"]),
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["„без захар\" — само три зрели банана и кленов сироп"]),
        ]),
        WidgetMeal(emoji: "🥣", name: "Корнфлейкс с мляко", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["закуска на хора, които „нямат време\" — но имат време да гледат телефона 25 минути"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["детска класика, която още работи"]),
        ]),
        WidgetMeal(emoji: "🌾", name: "Мюсли", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["ядки, плодове, овес и 47% захар, която не виждаш"]),
        ]),
        WidgetMeal(emoji: "🌯", name: "Гирос", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["дюнер, който е учил в Атина"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топъл, мазен, идеален за след среднощно прибиране"]),
        ]),
        WidgetMeal(emoji: "🥒", name: "Дзадзики", times: ["snack", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["краставица, кисело мляко, чесън — толкова просто, че се срамуваш да го наречеш ястие"]),
        ]),
        WidgetMeal(emoji: "🥃", name: "Узо", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["анасонова терапия с ледче и щипка лимон"]),
        ]),
        WidgetMeal(emoji: "🥐", name: "Кроасан", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["ядеш го в Париж — романтика. ядеш го в България — данък внос"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["френско тестено, което се рони повече от обещанията на бившия (или бившата)"]),
        ]),
        WidgetMeal(emoji: "🧇", name: "Гофрета", times: ["snack", "breakfast", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["една гофрета и три дни мислиш защо ти е тясно в дънките"]),
        ]),
        WidgetMeal(emoji: "🍡", name: "Макарон", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["френски сладкиши, които изглеждат като цветни копчета и струват колкото златни"]),
        ]),
        WidgetMeal(emoji: "🥩", name: "Плескавица", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["скара и хляб — нищо повече не ти трябва"]),
        ]),
        WidgetMeal(emoji: "🍯", name: "Баклава", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["100 грама филкова кора и още 100 грама захарен сироп"]),
        ]),
        WidgetMeal(emoji: "🍶", name: "Ракия", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["балканската терапия в бутилка. първата – „наздраве\". третата – „къде ми е селото бе\"", "ракия и салата = решение на проблеми, които иначе не съществуваха"]),
        ]),
        WidgetMeal(emoji: "🍳", name: "Менемен", times: ["breakfast", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["ядеш го на закуска и се чувстваш като османски султан… докато не видиш сметката"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["яйца, домати, чушки — закуска без грешка"]),
        ]),
        WidgetMeal(emoji: "🍬", name: "Локум", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["с кафе или сам по себе си — лепкаво щастие"]),
        ]),
        WidgetMeal(emoji: "🐟", name: "Сашими", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["сурова риба, която изглежда по-добре от повечето ти срещи"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["скъпа сурова риба — поне не се преструва на нещо друго"]),
        ]),
        WidgetMeal(emoji: "🥩", name: "Японски Wagyu", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["говеждо, което е живяло по-добре от теб"]),
        ]),
        WidgetMeal(emoji: "🦆", name: "Патица по пекински", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["патица, която е живяла по-добре от теб"]),
        ]),
        WidgetMeal(emoji: "🍝🍄", name: "Паста с трюфели", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["мирише на пари, които нямаш"]),
        ]),
        WidgetMeal(emoji: "🫓", name: "Турски Lahmacun", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["тънка пица с кайма, която се яде на ръка и без вина"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["уличната храна, която никога не те разочарова"]),
        ]),
        WidgetMeal(emoji: "🥘", name: "Корейски Bibimbap", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["купа, която изглежда красиво, преди да я разбъркаш като живота си"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["и след разбъркването — пак е добра"]),
        ]),
        WidgetMeal(emoji: "🍖", name: "Пилешки крилца BBQ", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["месо, което се лепи по пръстите и по душата"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["пръстите се мият — угризенията остават"]),
        ]),
        WidgetMeal(emoji: "🎃🍲", name: "Крем супа от тиква", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["оранжева прегръдка, която те кара да забравиш, че е есен"]),
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["тиква с претенции за здравословност"]),
        ]),
        WidgetMeal(emoji: "🍗🍍", name: "Китайски Sweet & Sour Chicken", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["пиле, което е сладко-кисело като живота ти"]),
        ]),
        WidgetMeal(emoji: "🍛", name: "Индийско Butter Chicken", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["пиле, плуващо в крем, масло и оправдания"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["индийски comfort food, който не иска обяснения"]),
        ]),
        WidgetMeal(emoji: "🥒", name: "Пържени тиквички с чеснов сос", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["тиквички, които плуват в олио и не съжаляват"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["веган по паспорт, comfort по душа"]),
        ]),
        WidgetMeal(emoji: "🫘🥗", name: "Хумус с печени зеленчуци", times: ["snack", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["нахутова паста, която ти прощава, че вчера си ял баница"]),
        ]),
        WidgetMeal(emoji: "☕🍰", name: "Тирамису", times: ["snack", "dessert"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["десерт, който те убеждава, че заслужаваш кафе и алкохол в едно"]),
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["италиански десерт с достойнство и espresso"]),
        ]),
        WidgetMeal(emoji: "🥗🌱", name: "Салата с киноа и нар", times: ["lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["киноа, която ти напомня, че имаш 30+ и все още не си „пораснал\""]),
        ]),
        WidgetMeal(emoji: "☕", name: "Еспресо", times: ["drink"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["два глътка горчивина в малка чашка. Точно като повечето ти решения."]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["бързо, горещо, без обяснения"]),
        ]),
        WidgetMeal(emoji: "☕", name: "Капучино", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["порция пяна с малко кафе вътре — за да изглежда, че имаш бавно утро"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топла чашка с повод да седнеш малко"]),
        ]),
        WidgetMeal(emoji: "☕🧊", name: "Фрапе", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["изобретен по случайност в Гърция, приет като религия в България — студено кафе с пяна и нула угризения"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["без него българското лято технически не съществува"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["символ на българското лято — ако не си пил фрапе, не си бил тук"]),
        ]),
        WidgetMeal(emoji: "🧊☕", name: "Фредо Капучино", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["поръчваш го, за да покажеш, че си бил в Гърция. Или поне да се преструваш."]),
        ]),
        WidgetMeal(emoji: "🍋🥤", name: "Лимонада", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["животът ти дава лимони — добавяш захар и се правиш, че всичко е наред"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["кисела, сладка, освежаваща — поне нещо тук е наред"]),
        ]),
        WidgetMeal(emoji: "🍷", name: "Вино", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["защото е четвъртък и вече го заслужаваш"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["грозде с характер и лека вина"]),
        ]),
        WidgetMeal(emoji: "🥂", name: "Просеко", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["шампанско за хора с амбиции и реалистичен бюджет"]),
        ]),
        WidgetMeal(emoji: "🍹", name: "Мохито", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["мента, лайм и оправданието, че е 'почти здравословно'"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["алкохол с декорация"]),
        ]),
        WidgetMeal(emoji: "🍸", name: "Gin & Tonic", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["джинът е само билкова медицина. Тоникът е по лекарско предписание."]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["британски отговор на всеки проблем"]),
        ]),
        WidgetMeal(emoji: "🥃", name: "Текила", times: ["drink"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["започва с 'само едно' и завършва с извинения към хора, които не са тук"]),
        ]),
        WidgetMeal(emoji: "🫙", name: "Боза", times: ["drink"], moods: [
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["гъста, кисела, непреводима — истинско българско преживяване, което никой чужденец не разбира"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["традиция в чаша, без да питаш от какво е"]),
        ]),
        WidgetMeal(emoji: "🫖", name: "Чай", times: ["drink", "breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["избираш чай, когато искаш да изглеждаш по-спокоен, отколкото си"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топла вода с листа — и пак се чувстваш sophisticated"]),
        ]),
        WidgetMeal(emoji: "🧋", name: "Bubble Tea", times: ["drink"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["не знаеш дали да го пиеш или дъвчеш — и това е цялата идея"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["тайвански десерт, преструващ се на напитка"]),
        ]),
        WidgetMeal(emoji: "🍳", name: "Омлет", times: ["breakfast", "lunch_dinner"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["три яйца, малко сирене и претенцията, че знаеш да готвиш"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["бързо, топло, без драма — точно каквото трябва"]),
        ]),
        WidgetMeal(emoji: "🥣", name: "Гранола с кисело мляко", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["хрупкава, сладка и ти казва 'имам живот в ред' — поне до обяд"]),
        ]),
        WidgetMeal(emoji: "🧁", name: "Мъфин", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["торта за закуска с официалното оправдание, че е само 'мъфин'"]),
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["сладко, меко, без да се налага да готвиш"]),
        ]),
        WidgetMeal(emoji: "🥐", name: "Pain au chocolat", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "💅 Fancy", glow: (0.85, 0.45, 0.55), reasons: ["кроасан с шоколад вътре — защото обикновеният кроасан е за хора без амбиции"]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топло, маслено, с шоколад — утрото не може да е лошо"]),
        ]),
        WidgetMeal(emoji: "🫙", name: "Overnight oats", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["приготвил си го снощи — значи имаш бъдеще"]),
        ]),
        WidgetMeal(emoji: "🥓", name: "Бейкън и яйца", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "😂 Honest", glow: (0.85, 0.55, 0.15), reasons: ["британски стандарт за добро утро. Холестеролът е включен."]),
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["мазно, солено, топло — и животът изглежда малко по-добре"]),
        ]),
        WidgetMeal(emoji: "🥐", name: "Кифла от фурната", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["топла, мека, 0.45€ — единственото нещо, което не е поскъпнало"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["квартална класика, която обединява нацията всяка сутрин"]),
        ]),
        WidgetMeal(emoji: "🍞", name: "Козунак", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["официално е за Великден. Неофициално — за всяка сутрин след него."]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["плетен, сладък, с любов — традиция в тесто"]),
        ]),
        WidgetMeal(emoji: "🍞", name: "Погача", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["кръгъл хляб с масло, правен с любов — обикновено от някой друг"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["кръгла, топла, традиционна — без нея трапезата не е пълна"]),
        ]),
        WidgetMeal(emoji: "🥬", name: "Зелник", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🥗 Healthy", glow: (0.3, 0.72, 0.32), reasons: ["спанак в тесто — закуска, при която дори диетологът кима одобрително"]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["зеленчук, тесто и традиция — баба го прави по-добре от всички"]),
        ]),
        WidgetMeal(emoji: "🎃", name: "Тиквеник", times: ["breakfast", "snack"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["баницата по-здравословната сестра. Пак е с масло, но поне има тиква."]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["тиква, захар, тесто — есенна класика по всяко време на годината"]),
        ]),
        WidgetMeal(emoji: "🥐🥛", name: "Баница с айран", times: ["breakfast"], moods: [
            WidgetMoodOption(badge: "🧸 Comfort", glow: (0.8, 0.55, 0.3), reasons: ["националният дует. Опитай да намериш нещо по-правилно в 8 сутринта."]),
            WidgetMoodOption(badge: "🇧🇬 BG", glow: (0.8, 0.25, 0.2), reasons: ["баницата сама е добра. С айран — е религия."]),
        ]),
    ]
}

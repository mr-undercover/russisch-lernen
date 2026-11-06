// Kursstruktur und Lektionen für Russisch Lernen
const DEFAULT_COURSE_DATA = {
  units: [
    {
      id: "unit_1",
      number: 1,
      title: "Das russische Alphabet",
      subtitle: "Schrift, Aussprache & erste Wörter lesen",
      color: "#10B981", // Emerald
      icon: "🔤",
      lessons: [
        {
          id: "lesson_1_1",
          unitId: "unit_1",
          title: "Die ersten Buchstaben & Echte Freunde",
          description: "Lerne die vertrauten Buchstaben А, О, М, Т, К",
          xpReward: 25,
          theory: {
            title: "Vertraute Klänge: Die 'echten Freunde'",
            concept: "Das kyrillische Alphabet sieht anfangs fremd aus, aber einige Buchstaben sehen genauso aus wie im lateinischen Alphabet und klingen auch fast identisch! Wir nennen sie 'echte Freunde'.",
            points: [
              "А а – Klingt wie das deutsche 'a' in 'Apfel'.",
              "О о – Klingt betont wie 'o' in 'Ofen'. Unbetont klingt es etwas abgeschwächter wie 'a'.",
              "М м – Identisch mit dem deutschen 'm' in 'Mama'.",
              "Т т – Identisch mit dem deutschen 't' in 'Tee'.",
              "К к – Identisch mit dem deutschen 'k' in 'Kaffee'."
            ],
            tip: "Schon mit diesen 5 Buchstaben kannst du erste echte russische Wörter wie 'МАМА' (Mama) oder 'КОТ' (Kater) lesen!"
          },
          exercises: [
            {
              id: "ex_1_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet das Wort 'Мама' auf Deutsch?",
              audioText: "Мама",
              options: ["Mama", "Papa", "Katze", "Wasser"],
              correctIndex: 0,
              explanation: "М = M, А = A. 'Мама' bedeutet Mama / Mutter."
            },
            {
              id: "ex_1_1_2",
              type: "choice_de_ru",
              question: "Welches russische Wort bedeutet 'Kater / Katze'?",
              options: ["Кот", "Мама", "Такси", "Том"],
              correctIndex: 0,
              explanation: "К = K, О = O, Т = T -> Кот (Kot) = Kater."
            },
            {
              id: "ex_1_1_3",
              type: "letter_sound",
              question: "Wie wird der kyrillische Buchstabe 'Т' ausgesprochen?",
              letter: "Т",
              audioText: "Т",
              options: ["Wie das deutsche 'T'", "Wie ein deutsches 'M'", "Wie ein 'S'", "Wie ein 'R'"],
              correctIndex: 0,
              explanation: "Т ist ein 'echter Freund' und klingt genau wie das deutsche T."
            },
            {
              id: "ex_1_1_4",
              type: "matching",
              question: "Verbinde die Buchstaben mit ihrer Aussprache:",
              pairs: [
                { left: "А", right: "Laut 'A'" },
                { left: "М", right: "Laut 'M'" },
                { left: "К", right: "Laut 'K'" },
                { left: "Т", right: "Laut 'T'" }
              ]
            },
            {
              id: "ex_1_1_5",
              type: "listening",
              question: "Höre genau hin: Welches Wort wird gesprochen?",
              audioText: "Кот",
              options: ["Кот", "Ток", "Мама", "Акт"],
              correctIndex: 0,
              explanation: "Du hast 'Кот' (Kot = Kater) gehört."
            }
          ]
        },
        {
          id: "lesson_1_2",
          unitId: "unit_1",
          title: "Vorsicht: Falsche Freunde!",
          description: "Buchstaben, die lateinisch aussehen, aber völlig anders klingen",
          xpReward: 30,
          theory: {
            title: "Die berüchtigten 'Falschen Freunde'",
            concept: "Hier stolpern fast alle Anfänger: Diese Buchstaben sehen vertraut aus, werden im Russischen aber ganz anders ausgesprochen!",
            points: [
              "В в – Sieht aus wie ein deutsches 'B', wird aber wie ein deutsches 'W' ausgesprochen! (z.B. Вода = Wada = Wasser).",
              "Н н – Sieht aus wie ein deutsches 'H', ist aber der Buchstabe 'N'! (z.B. Ночь = Notsch = Nacht).",
              "Р р – Sieht aus wie ein deutsches 'P', ist aber ein gerolltes 'R'! (z.B. Россия = Rassija).",
              "С с – Sieht aus wie ein deutsches 'C', ist aber immer ein scharfes 'S' wie in Kuss! (z.B. Спасибо = Spasiba).",
              "У у – Sieht aus wie ein lateinisches 'Y', ist aber der Vokal 'U'!",
              "Х х – Sieht aus wie ein deutsches 'X', ist aber der kratzige 'CH'-Laut wie in 'Bach'!"
            ],
            tip: "Merke dir: 'B' ist 'W', 'H' ist 'N', 'P' ist 'R', 'C' ist 'S'!"
          },
          exercises: [
            {
              id: "ex_1_2_1",
              type: "letter_sound",
              question: "Achtung falscher Freund: Wie klingt der Buchstabe 'В'?",
              letter: "В",
              audioText: "В",
              options: ["Wie deutsches 'W'", "Wie deutsches 'B'", "Wie deutsches 'V'", "Wie deutsches 'P'"],
              correctIndex: 0,
              explanation: "Das kyrillische 'В' klingt wie deutsches 'W' (z.B. Вода = Wada = Wasser)."
            },
            {
              id: "ex_1_2_2",
              type: "letter_sound",
              question: "Welchem deutschen Laut entspricht der kyrillische Buchstabe 'Н'?",
              letter: "Н",
              audioText: "Н",
              options: ["Laut 'N'", "Laut 'H'", "Laut 'M'", "Laut 'P'"],
              correctIndex: 0,
              explanation: "Kyrillisches 'Н' sieht aus wie ein H, ist aber der Buchstabe 'N'!"
            },
            {
              id: "ex_1_2_3",
              type: "choice_ru_de",
              question: "Lies das Wort: 'Ресторан'. Was bedeutet es?",
              audioText: "Ресторан",
              options: ["Restaurant", "Pestoran", "Station", "Reparatur"],
              correctIndex: 0,
              explanation: "Р=R, Е=Je, С=S, Т=T, О=O, Р=R, А=A, Н=N -> Restarán (Restaurant)!"
            },
            {
              id: "ex_1_2_4",
              type: "matching",
              question: "Ordne die falschen Freunde ihrem echten Klang zu:",
              pairs: [
                { left: "В", right: "Klang 'W'" },
                { left: "Н", right: "Klang 'N'" },
                { left: "Р", right: "Klang 'R'" },
                { left: "С", right: "Klang 'S'" }
              ]
            },
            {
              id: "ex_1_2_5",
              type: "listening",
              question: "Höre das Wort und wähle die richtige kyrillische Schreibweise:",
              audioText: "Нос",
              options: ["Нос", "Хос", "Рос", "Вос"],
              correctIndex: 0,
              explanation: "Du hast 'Нос' (Nos = Nase) gehört."
            }
          ]
        },
        {
          id: "lesson_1_3",
          unitId: "unit_1",
          title: "Neue kyrillische Schriftzeichen",
          description: "Lerne Б, Г, Д, П, И, Л und bilde erste Wörter",
          xpReward: 30,
          theory: {
            title: "Die einzigartigen kyrillischen Buchstaben",
            concept: "Diese Buchstaben stammen oft aus dem griechischen Alphabet und haben ein unverwechselbares Aussehen.",
            points: [
              "Б б – Das echte russische 'B' (sieht aus wie eine '6' mit Kappe oben).",
              "Г г – Hartes 'G' wie in Garten (abgeleitet vom griechischen Gamma Γ).",
              "Д д – Das 'D' (sieht aus wie ein kleines Häuschen mit zwei Füßen Δ).",
              "П п – Das russische 'P' (abgeleitet vom griechischen Pi π).",
              "И и – Das 'I' (sieht aus wie ein spiegelverkehrtes 'N').",
              "Л л – Das 'L' (abgeleitet vom griechischen Lambda Λ)."
            ],
            tip: "Vergleiche: 'Б' ist B, während 'В' ein W ist! 'П' ist P, während 'Р' ein R ist!"
          },
          exercises: [
            {
              id: "ex_1_3_1",
              type: "choice_ru_de",
              question: "Lies das Wort: 'Друг'. Was bedeutet es?",
              audioText: "Друг",
              options: ["Freund", "Bruder", "Weg", "Tür"],
              correctIndex: 0,
              explanation: "Д=D, Р=R, У=U, Г=G -> Drug = Freund."
            },
            {
              id: "ex_1_3_2",
              type: "choice_de_ru",
              question: "Welcher Buchstabe ist das russische 'P' (wie in Park)?",
              options: ["П", "Р", "Б", "В"],
              correctIndex: 0,
              explanation: "П entspricht dem deutschen P (Р ist dagegen ein gerolltes R!)."
            },
            {
              id: "ex_1_3_3",
              type: "letter_sound",
              question: "Wie klingt der Buchstabe 'И'?",
              letter: "И",
              audioText: "И",
              options: ["Wie ein langes deutsches 'I'", "Wie ein 'N'", "Wie ein 'U'", "Wie ein 'E'"],
              correctIndex: 0,
              explanation: "И sieht aus wie ein gespiegeltes N, klingt aber wie ein klares 'I'."
            },
            {
              id: "ex_1_3_4",
              type: "matching",
              question: "Verbinde die Buchstabenpaare:",
              pairs: [
                { left: "Б", right: "Laut 'B'" },
                { left: "Д", right: "Laut 'D'" },
                { left: "П", right: "Laut 'P'" },
                { left: "Г", right: "Laut 'G'" }
              ]
            },
            {
              id: "ex_1_3_5",
              type: "listening",
              question: "Welches russische Wort hast du gehört?",
              audioText: "Город",
              options: ["Город", "Дорог", "Борщ", "Парк"],
              correctIndex: 0,
              explanation: "Das Wort war 'Город' (Górod = Stadt)."
            }
          ]
        },
        {
          id: "lesson_1_4",
          unitId: "unit_1",
          title: "Zischlaute & Sonderzeichen",
          description: "Beherrsche Ж, Ш, Щ, Ч, Ц, Ы, Ъ und Ь",
          xpReward: 35,
          theory: {
            title: "Die Zischlaute und das Weichheitszeichen",
            concept: "Das Russische hat wunderbare, ausdrucksstarke Zischlaute und zwei ganz besondere stumme Zeichen.",
            points: [
              "Ж ж – Klingt wie das weiche 'j' in 'Journalist' oder französisch 'bonjour'.",
              "Ш ш – Hartes, dumpfes 'SCH' wie in Schule.",
              "Щ щ – Sehr weiches, gezischtes 'SCHTSCH' (wie in Borschtsch).",
              "Ч ч – 'TSCH' wie in Tschechien.",
              "Ц ц – 'Z' oder 'TS' wie in Zug oder Katze.",
              "Ы ы – Der typisch russische dumpfe Vokal zwischen 'i' und 'u'.",
              "Ь ь – Das Weichheitszeichen: Es hat keinen eigenen Klang, macht aber den vorangehenden Konsonanten weich!"
            ],
            tip: "Das 'Ч' sieht fast wie eine arabische Ziffer 4 aus – ein toller Merksatz!"
          },
          exercises: [
            {
              id: "ex_1_4_1",
              type: "choice_ru_de",
              question: "Was bedeutet das Wort 'Чай' auf Deutsch?",
              audioText: "Чай",
              options: ["Tee", "Kaffee", "Milch", "Saft"],
              correctIndex: 0,
              explanation: "Ч = Tsch, А = A, Й = J -> Tschaj = Tee."
            },
            {
              id: "ex_1_4_2",
              type: "letter_sound",
              question: "Welcher Buchstabe macht den Konsonanten davor weich?",
              options: ["Ь (Weichheitszeichen)", "Ъ (Härtezeichen)", "Ж", "Ы"],
              correctIndex: 0,
              explanation: "Das Weichheitszeichen Ь (мягкий знак) palatalisiert den vorangehenden Konsonanten."
            },
            {
              id: "ex_1_4_3",
              type: "choice_ru_de",
              question: "Lies das berühmte Wort: 'Борщ'. Was ist das?",
              audioText: "Борщ",
              options: ["Borschtsch (Rote-Bete-Suppe)", "Brot", "Käse", "Wurst"],
              correctIndex: 0,
              explanation: "Б-О-Р-Щ = Borschtsch, die traditionsreiche Rote-Bete-Suppe."
            },
            {
              id: "ex_1_4_4",
              type: "matching",
              question: "Verbinde die Zischlaute mit der Aussprache:",
              pairs: [
                { left: "Ж", right: "Weiches 'Sch' wie in Genie" },
                { left: "Ч", right: "Laut 'Tsch'" },
                { left: "Ц", right: "Laut 'Z / Ts'" },
                { left: "Ш", right: "Hartes 'Sch'" }
              ]
            },
            {
              id: "ex_1_4_5",
              type: "listening",
              question: "Höre genau hin: Welcher Zischlaut wird gesprochen?",
              audioText: "Жизнь",
              options: ["Жизнь", "Школа", "Чай", "Царь"],
              correctIndex: 0,
              explanation: "Gesprochen wurde 'Жизнь' (Schisn = Leben) mit dem stimmhaften Laut 'Ж'."
            }
          ]
        },
        {
          id: "lesson_1_5",
          unitId: "unit_1",
          title: "Buchstaben Stufe 5: Jotierte Vokale & Sonderzeichen (Sehr schwer)",
          description: "Beherrsche Ё, Ю, Я, Ы und die stummen Zeichen Ь & Ъ",
          xpReward: 35,
          theory: {
            title: "Die Königsdisziplin: Jotierte Vokale & Stumme Zeichen",
            concept: "Diese Buchstaben machen das Russische klangvoll, erfordern aber höchste Aufmerksamkeit.",
            points: [
              "Я я – 'JA' wie in Jacke. Bedeutet alleine das Wort 'Ich'!",
              "Ю ю – 'JU' wie in Juni.",
              "Ё ё – 'JO' wie in Joghurt. Trägt im Russischen IMMER die Wortbetonung!",
              "Ы ы – Der tiefe Kehllaut zwischen 'i' und 'u' (Zunge nach hinten ziehen).",
              "Ь ь – Weichheitszeichen: Macht den vorigen Konsonanten weich (palatalisiert).",
              "Ъ ъ – Härtezeichen: Trennt Konsonant hart vom folgenden Vokal ab."
            ],
            tip: "Ein weicher Konsonant mit Ь klingt wie mit an den Gaumen geschmiegter Zunge (wie 'gn' im Französischen oder Italienischen)!"
          },
          exercises: [
            {
              id: "ex_1_5_1",
              type: "choice_ru_de",
              question: "Welcher Buchstabe trägt im Russischen IMMER die Betonung?",
              audioText: "Ёлка",
              options: ["Ё (jo)", "Е (je)", "О (o)", "А (a)"],
              correctIndex: 0,
              explanation: "Der Buchstabe Ё trägt im Russischen ausnahmslos immer den Hauptakzent."
            },
            {
              id: "ex_1_5_2",
              type: "letter_sound",
              question: "Wie wird der Buchstabe 'Я' ausgesprochen?",
              letter: "Я",
              audioText: "Я",
              options: ["Wie 'ja' in Jacke", "Wie 'r'", "Wie 'sch'", "Wie 'ch'"],
              correctIndex: 0,
              explanation: "Я sieht aus wie ein gespiegeltes R, klingt aber wie deutsches 'JA'."
            },
            {
              id: "ex_1_5_3",
              type: "choice_ru_de",
              question: "Lies das Wort: 'Юг'. Was bedeutet es?",
              audioText: "Юг",
              options: ["Süden", "Norden", "Zug", "Tag"],
              correctIndex: 0,
              explanation: "Ю = Ju, Г = G -> Juk (Süden)."
            },
            {
              id: "ex_1_5_4",
              type: "matching",
              question: "Verbinde die jotierten Vokale und Laute:",
              pairs: [
                { left: "Я", right: "Laut 'JA'" },
                { left: "Ю", right: "Laut 'JU'" },
                { left: "Ё", right: "Laut 'JO'" },
                { left: "Ы", right: "Laut 'Y'" }
              ]
            },
            {
              id: "ex_1_5_5",
              type: "listening",
              question: "Welches Wort mit Weichheitszeichen hörst du?",
              audioText: "Мать",
              options: ["Мать (Mutter)", "Мат (Matte)", "Мама (Mama)", "Мы (Wir)"],
              correctIndex: 0,
              explanation: "Du hast 'Мать' (Mutter) mit weichem T am Ende gehört."
            }
          ]
        },
        {
          id: "lesson_1_6",
          unitId: "unit_1",
          title: "Buchstaben Stufe 6: Die Große Meisterprüfung (Meisterklasse)",
          description: "Prüfe dein Können an echten russischen Zungenbrechern & Wörtern",
          xpReward: 40,
          theory: {
            title: "Die Meisterprüfung des kyrillischen Alphabets",
            concept: "Jetzt kombinieren wir alle 33 Buchstaben. Du bist nun bereit, jedes echte russische Wort zu lesen!",
            points: [
              "Falsche Freunde blitzschnell entlarven (В ≠ B, Н ≠ H, Р ≠ P).",
              "Zischlaute sauber trennen (Ш dumpf vs. Щ gezischt).",
              "Wörter im Ganzen flüssig erfassen."
            ],
            tip: "Lies nicht Buchstabe für Buchstabe, sondern versuche, Silben wie 'Ма-ма', 'Во-да', 'Го-род' im Ganzen zu sehen!"
          },
          exercises: [
            {
              id: "ex_1_6_exam_1",
              type: "choice_ru_de",
              question: "Meisterprüfung: Lies das Wort 'Щи'. Was ist das?",
              audioText: "Щи",
              options: ["Russische Kohlsuppe (Schtschi)", "Tee", "Brot", "Käse"],
              correctIndex: 0,
              explanation: "Щи = traditionelle russische Kohlsuppe mit weichem Щ."
            },
            {
              id: "ex_1_6_exam_2",
              type: "choice_de_ru",
              question: "Welches Wort ist richtig geschrieben für 'Wasser'?",
              options: ["Вода", "Бода", "Нода", "Рода"],
              correctIndex: 0,
              explanation: "Wasser = Вода (mit 'В' für W, nicht mit 'Б'!)."
            },
            {
              id: "ex_1_6_exam_3",
              type: "listening",
              question: "Höre genau hin: Hartes Ш oder weiches gezischtes Щ?",
              audioText: "Школа",
              options: ["Школа (Hartes Dumpfes Sch)", "Щи (Weiches Gezischtes Schtsch)", "Чай", "Жизнь"],
              correctIndex: 0,
              explanation: "Du hast 'Школа' mit dem harten Laut Ш gehört."
            },
            {
              id: "ex_1_6_exam_4",
              type: "matching",
              question: "Verbinde die Buchstaben-Herausforderungen:",
              pairs: [
                { left: "В", right: "Klang 'W' (nicht B!)" },
                { left: "Н", right: "Klang 'N' (nicht H!)" },
                { left: "Р", right: "Klang 'R' (nicht P!)" },
                { left: "Х", right: "Klang 'CH' (nicht X!)" }
              ]
            },
            {
              id: "ex_1_6_exam_5",
              type: "choice_ru_de",
              question: "Lies das russische Wort: 'Объект'. Wofür steht das 'ъ'?",
              audioText: "Объект",
              options: ["Härtezeichen (trennt 'Об' hart von 'ект')", "Weichheitszeichen", "Vokal", "Zischlaut"],
              correctIndex: 0,
              explanation: "ъ ist das Härtezeichen: Es trennt den Konsonanten hart vom Vokal ab."
            }
          ]
        }
      ]
    },
    {
      id: "unit_2",
      number: 2,
      title: "Erste Wörter & Höflichkeit",
      subtitle: "Begrüßung, Verabschiedung & Pronomen",
      color: "#3B82F6", // Blue
      icon: "👋",
      lessons: [
        {
          id: "lesson_2_1",
          unitId: "unit_2",
          title: "Begrüßung & Verabschiedung",
          description: "Lerne Привет, Здравствуйте, Пока und До свидания",
          xpReward: 25,
          theory: {
            title: "Hallo und Auf Wiedersehen auf Russisch",
            concept: "Im Russischen unterscheidet man sehr klar zwischen formeller Höflichkeit und lockerer Begrüßung unter Freunden.",
            points: [
              "Привет (Priwét) – 'Hallo' unter Freunden, Gleichaltrigen und in der Familie.",
              "Здравствуйте (Sdrástwuytye) – 'Guten Tag' förmlich und respektvoll zu Fremden, Älteren oder im Beruf.",
              "Пока (Paká) – 'Tschüss' / 'Bis dann' im Freundeskreis.",
              "До свидания (Da swidánija) – 'Auf Wiedersehen' (wörtlich: 'Bis zum Wiedersehen').",
              "Доброе утро (Dóbroje útra) – 'Guten Morgen'."
            ],
            tip: "Bei 'Здравствуйте' wird das erste 'в' oft verschluckt, man spricht es wie 'Sdrástwuytye'."
          },
          exercises: [
            {
              id: "ex_2_1_1",
              type: "choice_ru_de",
              question: "Was sagst du zu einem guten Freund zur Begrüßung?",
              audioText: "Привет",
              options: ["Привет (Hallo)", "Здравствуйте (Guten Tag)", "До свидания (Auf Wiedersehen)", "Спасибо (Danke)"],
              correctIndex: 0,
              explanation: "Привет ist das lockere 'Hallo' unter Freunden."
            },
            {
              id: "ex_2_1_2",
              type: "choice_de_ru",
              question: "Wie sagst du formell 'Guten Tag'?",
              options: ["Здравствуйте", "Привет", "Пока", "Доброе утро"],
              correctIndex: 0,
              explanation: "Здравствуйте ist die respektvolle, formelle Begrüßung."
            },
            {
              id: "ex_2_1_3",
              type: "choice_ru_de",
              question: "Was bedeutet 'До свидания'?",
              audioText: "До свидания",
              options: ["Auf Wiedersehen", "Guten Abend", "Gute Nacht", "Bitte schön"],
              correctIndex: 0,
              explanation: "До свидания = Auf Wiedersehen."
            },
            {
              id: "ex_2_1_4",
              type: "matching",
              question: "Verbinde die russischen Begrüßungen mit der Bedeutung:",
              pairs: [
                { left: "Привет", right: "Hallo (informell)" },
                { left: "Здравствуйте", right: "Guten Tag (formell)" },
                { left: "Пока", right: "Tschüss" },
                { left: "До свидания", right: "Auf Wiedersehen" }
              ]
            },
            {
              id: "ex_2_1_5",
              type: "listening",
              question: "Welche Begrüßung hörst du?",
              audioText: "Доброе утро",
              options: ["Доброе утро", "Добрый вечер", "До свидания", "Привет"],
              correctIndex: 0,
              explanation: "Du hast 'Доброе утро' (Dóbroje útra = Guten Morgen) gehört."
            }
          ]
        },
        {
          id: "lesson_2_2",
          unitId: "unit_2",
          title: "Höflichkeitsformen: Bitte & Danke",
          description: "Спасибо, Пожалуйста und Извините sicher anwenden",
          xpReward: 30,
          theory: {
            title: "Die Zauberwörter der Höflichkeit",
            concept: "Mit diesen drei Wörtern kommst du in Russland überall sympathisch und höflich durch den Alltag.",
            points: [
              "Спасибо (Spasíba) – 'Danke'. Achte auf das unbetonte 'o' am Ende, es klingt wie 'a'.",
              "Большое спасибо (Balshóje spasíba) – 'Vielen Dank!'.",
              "Пожалуйста (Paschálujsta) – Hat zwei Bedeutungen: 'Bitte' (beim Bestellen) und 'Gern geschehen' (als Antwort auf Danke).",
              "Извините (Iswinítye) – 'Entschuldigung' / 'Verzeihung' (um Aufmerksamkeit zu bitten oder sich zu entschuldigen)."
            ],
            tip: "Genau wie im Deutschen bedeutet 'Пожалуйста' sowohl Bitte als auch Bitte sehr / Gern geschehen!"
          },
          exercises: [
            {
              id: "ex_2_2_1",
              type: "choice_ru_de",
              question: "Wie bedankst du dich auf Russisch?",
              audioText: "Спасибо",
              options: ["Спасибо (Danke)", "Пожалуйста (Bitte)", "Извините (Entschuldigung)", "Пока (Tschüss)"],
              correctIndex: 0,
              explanation: "Спасибо heißt Danke."
            },
            {
              id: "ex_2_2_2",
              type: "choice_de_ru",
              question: "Jemand sagt 'Спасибо!'. Was antwortest du freundlich?",
              options: ["Пожалуйста", "Привет", "Нет", "Извините"],
              correctIndex: 0,
              explanation: "Пожалуйста bedeutet auch 'Gern geschehen' bzw. 'Bitte sehr'."
            },
            {
              id: "ex_2_2_3",
              type: "choice_ru_de",
              question: "Du möchtest im Zug an jemandem vorbei. Welches Wort nutzt du?",
              audioText: "Извините",
              options: ["Извините (Entschuldigung)", "Хорошо (Gut)", "Привет (Hallo)", "Да (Ja)"],
              correctIndex: 0,
              explanation: "Извините bedeutet Entschuldigung / Verzeihen Sie."
            },
            {
              id: "ex_2_2_4",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Einen Kaffee, bitte.'",
              targetSentence: "Кофе, пожалуйста.",
              words: ["Кофе,", "пожалуйста.", "чай,", "спасибо."],
              explanation: "Кофе, пожалуйста = Einen Kaffee, bitte."
            },
            {
              id: "ex_2_2_5",
              type: "matching",
              question: "Ordne die Höflichkeitswörter zu:",
              pairs: [
                { left: "Спасибо", right: "Danke" },
                { left: "Пожалуйста", right: "Bitte / Gern geschehen" },
                { left: "Извините", right: "Entschuldigung" },
                { left: "Большое спасибо", right: "Vielen Dank" }
              ]
            }
          ]
        },
        {
          id: "lesson_2_3",
          unitId: "unit_2",
          title: "Ja, Nein & Wie geht's?",
          description: "Antworten geben & nach dem Wohlbefinden fragen",
          xpReward: 30,
          theory: {
            title: "Einfache Alltagsantworten",
            concept: "Schnelle Antworten und die wichtigste Frage im Gespräch: 'Как дела?' (Wie geht's?).",
            points: [
              "Да (Da) – Ja.",
              "Нет (Njet) – Nein.",
              "Как дела? (Kak delá?) – Wie geht's? Wie steht's?",
              "Хорошо (Charashó) – Gut / In Ordnung.",
              "Отлично (Atlítschna) – Ausgezeichnet / Super!",
              "Плохо (Plócha) – Schlecht."
            ],
            tip: "Ein klassischer Kurzdialog: 'Привет! Как дела?' — 'Спасибо, хорошо! А у тебя?' (Hallo! Wie geht's? — Danke, gut! Und bei dir?)"
          },
          exercises: [
            {
              id: "ex_2_3_1",
              type: "choice_ru_de",
              question: "Was bedeutet die Frage 'Как дела?'?",
              audioText: "Как дела?",
              options: ["Wie geht's?", "Wer bist du?", "Wo bist du?", "Wie spät ist es?"],
              correctIndex: 0,
              explanation: "Как дела? bedeutet wörtlich 'Wie (stehen) die Dinge?' = Wie geht's?"
            },
            {
              id: "ex_2_3_2",
              type: "choice_de_ru",
              question: "Wie sagst du 'Nein, danke' auf Russisch?",
              options: ["Нет, спасибо", "Да, пожалуйста", "Хорошо, пока", "Привет, нет"],
              correctIndex: 0,
              explanation: "Нет, спасибо = Nein danke."
            },
            {
              id: "ex_2_3_3",
              type: "cloze",
              question: "Vervollständige die Antwort: 'Привет! Как дела?' — 'Спасибо, ___!'",
              options: ["хорошо", "нет", "извините", "что"],
              correctIndex: 0,
              explanation: "Спасибо, хорошо! (Danke, gut!) ist die gängigste Antwort."
            },
            {
              id: "ex_2_3_4",
              type: "listening",
              question: "Welches Wort hörst du?",
              audioText: "Хорошо",
              options: ["Хорошо", "Плохо", "Отлично", "Пока"],
              correctIndex: 0,
              explanation: "Du hast 'Хорошо' (Charashó = Gut) gehört."
            },
            {
              id: "ex_2_3_5",
              type: "matching",
              question: "Verbinde die gegensätzlichen Paare:",
              pairs: [
                { left: "Да", right: "Ja" },
                { left: "Нет", right: "Nein" },
                { left: "Хорошо", right: "Gut" },
                { left: "Плохо", right: "Schlecht" }
              ]
            }
          ]
        },
        {
          id: "lesson_2_4",
          unitId: "unit_2",
          title: "Persönliche Pronomen",
          description: "Ich, Du, Er, Sie, Wir, Ihr & Sie im Russischen",
          xpReward: 35,
          theory: {
            title: "Wer spricht mit wem? Die Personalpronomen",
            concept: "Pronomen sind die Bausteine aller Sätze.",
            points: [
              "Я (Ja) – Ich. (Erinnere dich: Das ist auch der letzte Buchstabe des Alphabets!)",
              "Ты (Ty) – Du (für Freunde und Familie).",
              "Он (On) – Er.",
              "Она (Aná) – Sie (weiblich Einzahl).",
              "Оно (Anó) – Es (sächlich).",
              "Мы (My) – Wir.",
              "Вы (Wy) – Ihr (Mehrzahl) oder höfliches 'Sie' (Einzahl großgeschrieben).",
              "Они (Aní) – Sie (Mehrzahl)."
            ],
            tip: "Im Russischen wird das Höflichkeits-'Sie' mit 'Вы' ausgedrückt – genau wie im Französischen 'vous'!"
          },
          exercises: [
            {
              id: "ex_2_4_1",
              type: "choice_ru_de",
              question: "Welches russische Wort bedeutet 'Ich'?",
              audioText: "Я",
              options: ["Я", "Ты", "Мы", "Он"],
              correctIndex: 0,
              explanation: "Я (gesprochen: Ja) bedeutet 'Ich'."
            },
            {
              id: "ex_2_4_2",
              type: "choice_de_ru",
              question: "Was bedeutet 'Мы' auf Deutsch?",
              audioText: "Мы",
              options: ["Wir", "Ihr", "Sie", "Ich"],
              correctIndex: 0,
              explanation: "Мы (gesprochen: My) bedeutet 'Wir'."
            },
            {
              id: "ex_2_4_3",
              type: "choice_ru_de",
              question: "Welches Pronomen nutzt du für die höfliche Anrede (Sie)?",
              options: ["Вы", "Ты", "Они", "Она"],
              correctIndex: 0,
              explanation: "Вы ist die respektvolle Höflichkeitsform für 'Sie'."
            },
            {
              id: "ex_2_4_4",
              type: "matching",
              question: "Ordne die Pronomen ihren Übersetzungen zu:",
              pairs: [
                { left: "Я", right: "Ich" },
                { left: "Ты", right: "Du" },
                { left: "Он", right: "Er" },
                { left: "Она", right: "Sie (Einzahl)" }
              ]
            },
            {
              id: "ex_2_4_5",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Ich und du'",
              targetSentence: "Я и ты",
              words: ["Я", "и", "ты", "мы"],
              explanation: "Я и ты = Ich und du."
            }
          ]
        }
      ]
    },
    {
      id: "unit_3",
      number: 3,
      title: "Zahlen und Alltag",
      subtitle: "Zahlen von 0 bis 100 & Kalender",
      color: "#F59E0B", // Amber
      icon: "🔢",
      lessons: [
        {
          id: "lesson_3_1",
          unitId: "unit_3",
          title: "Zahlen von 1 bis 10",
          description: "Zählen von eins bis zehn auf Russisch",
          xpReward: 30,
          theory: {
            title: "Die russischen Grundzahlen (1 bis 10)",
            concept: "Zahlen begegnen dir überall: beim Bezahlen, Bestellen und bei Uhrzeiten.",
            points: [
              "1 – Один (Adín)",
              "2 – Два (Dwa)",
              "3 – Три (Tri)",
              "4 – Четыре (Tschetýrje)",
              "5 – Пять (Pjat)",
              "6 – Шесть (Schest)",
              "7 – Семь (Sem)",
              "8 – Восемь (Wósem)",
              "9 – Девять (Déwjat)",
              "10 – Десять (Désjat)"
            ],
            tip: "Beachte: 'Один' klingt wegen des unbetonten O wie 'Adín'."
          },
          exercises: [
            {
              id: "ex_3_1_1",
              type: "choice_ru_de",
              question: "Welche Zahl ist 'Три'?",
              audioText: "Три",
              options: ["3 (Drei)", "2 (Zwei)", "4 (Vier)", "5 (Fünf)"],
              correctIndex: 0,
              explanation: "Три = 3 (Drei)."
            },
            {
              id: "ex_3_1_2",
              type: "choice_de_ru",
              question: "Wie heißt die Zahl 'Eins (1)' auf Russisch?",
              options: ["Один", "Два", "Пять", "Десять"],
              correctIndex: 0,
              explanation: "1 = Один (Adín)."
            },
            {
              id: "ex_3_1_3",
              type: "listening",
              question: "Welche Zahl hast du gehört?",
              audioText: "Пять",
              options: ["5 (Пять)", "9 (Девять)", "10 (Десять)", "1 (Один)"],
              correctIndex: 0,
              explanation: "Du hast 'Пять' (Pjat = 5) gehört."
            },
            {
              id: "ex_3_1_4",
              type: "matching",
              question: "Verbinde die Zahlen:",
              pairs: [
                { left: "Один", right: "1" },
                { left: "Два", right: "2" },
                { left: "Четыре", right: "4" },
                { left: "Десять", right: "10" }
              ]
            },
            {
              id: "ex_3_1_5",
              type: "sentence_build",
              question: "Bilde den russischen Ausdruck: 'Zwei Kaffees, bitte'",
              targetSentence: "Два кофе, пожалуйста.",
              words: ["Два", "кофе,", "пожалуйста.", "три"],
              explanation: "Два кофе, пожалуйста. = Zwei Kaffee, bitte."
            }
          ]
        },
        {
          id: "lesson_3_2",
          unitId: "unit_3",
          title: "Zahlen bis 100",
          description: "Zwanzig, Fünfzig, Hundert & Tausend",
          xpReward: 30,
          theory: {
            title: "Größere Zahlen & Geldbeträge",
            concept: "Perfekt für Preise im Laden und im Taxi.",
            points: [
              "0 – Ноль (Nol)",
              "20 – Двадцать (Dwátsat)",
              "30 – Тридцать (Trítsat)",
              "50 – Пятьдесят (Pjadissját)",
              "100 – Сто (Sto)",
              "1000 – Тысяча (Týsjatscha)"
            ],
            tip: "'Сто' bedeutet 100 – sehr kurz und einprägsam!"
          },
          exercises: [
            {
              id: "ex_3_2_1",
              type: "choice_ru_de",
              question: "Was bedeutet die russische Zahl 'Сто'?",
              audioText: "Сто",
              options: ["100 (Hundert)", "10 (Zehn)", "1000 (Tausend)", "20 (Zwanzig)"],
              correctIndex: 0,
              explanation: "Сто = 100."
            },
            {
              id: "ex_3_2_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Zwanzig (20)' auf Russisch?",
              options: ["Двадцать", "Десять", "Сто", "Два"],
              correctIndex: 0,
              explanation: "20 = Двадцать."
            },
            {
              id: "ex_3_2_3",
              type: "listening",
              question: "Welche Zahl hörst du?",
              audioText: "Двадцать",
              options: ["20 (Двадцать)", "12 (Двенадцать)", "30 (Тридцать)", "2 (Два)"],
              correctIndex: 0,
              explanation: "Du hast 'Двадцать' (20) gehört."
            },
            {
              id: "ex_3_2_4",
              type: "matching",
              question: "Ordne die Zahlen ihren Werten zu:",
              pairs: [
                { left: "Ноль", right: "0" },
                { left: "Двадцать", right: "20" },
                { left: "Пятьдесят", right: "50" },
                { left: "Сто", right: "100" }
              ]
            },
            {
              id: "ex_3_2_5",
              type: "choice_ru_de",
              question: "Was kostet es: 'Сто рублей'?",
              audioText: "Сто рублей",
              options: ["Hundert Rubel", "Zehn Rubel", "Zwanzig Rubel", "Tausend Rubel"],
              correctIndex: 0,
              explanation: "Сто рублей = Hundert Rubel."
            }
          ]
        },
        {
          id: "lesson_3_3",
          unitId: "unit_3",
          title: "Tageszeiten & Wochentage",
          description: "Heute, morgen, Tag, Nacht und Wochentage",
          xpReward: 35,
          theory: {
            title: "Zeit im Alltag",
            concept: "So planst du deinen Tag und Verabredungen auf Russisch.",
            points: [
              "Время (Wrémja) – Zeit.",
              "Сегодня (Sewódnja) – Heute. (Achtung: Das 'г' wird hier wie ein 'w' gesprochen: sewódnja!).",
              "Завтра (Sáwtra) – Morgen (der nächste Tag).",
              "Утро (Útra) – Morgen (Tageszeit) / Вечер (Wétscher) – Abend.",
              "Понедельник (Panedjéljnik) – Montag.",
              "Пятница (Pjátnitsa) – Freitag (von 'пять' = 5, der 5. Tag!).",
              "Воскресенье (Waskresénje) – Sonntag."
            ],
            tip: "Freitag heißt 'Пятница', weil es der 5. Wochentag ist (von 'пять' = fünf)!"
          },
          exercises: [
            {
              id: "ex_3_3_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Сегодня'?",
              audioText: "Сегодня",
              options: ["Heute", "Gestern", "Morgen", "Jetzt"],
              correctIndex: 0,
              explanation: "Сегодня = Heute."
            },
            {
              id: "ex_3_3_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Freitag' auf Russisch?",
              options: ["Пятница", "Понедельник", "Воскресенье", "Суббота"],
              correctIndex: 0,
              explanation: "Freitag = Пятница (abgeleitet von fünf = пять)."
            },
            {
              id: "ex_3_3_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Gute Nacht!'",
              targetSentence: "Спокойной ночи!",
              words: ["Спокойной", "ночи!", "Доброе", "утро!"],
              explanation: "Спокойной ночи! = Gute Nacht! (wörtlich: Ruhige Nacht)."
            },
            {
              id: "ex_3_3_4",
              type: "matching",
              question: "Verbinde die Tageszeiten:",
              pairs: [
                { left: "Утро", right: "Morgen" },
                { left: "День", right: "Tag" },
                { left: "Вечер", right: "Abend" },
                { left: "Ночь", right: "Nacht" }
              ]
            },
            {
              id: "ex_3_3_5",
              type: "listening",
              question: "Welchen Gruß hörst du?",
              audioText: "Добрый вечер",
              options: ["Добрый вечер (Guten Abend)", "Доброе утро (Guten Morgen)", "Добрый день (Guten Tag)", "Спокойной ночи"],
              correctIndex: 0,
              explanation: "Du hast 'Добрый вечер' (Guten Abend) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_4",
      number: 4,
      title: "Essen und Trinken",
      subtitle: "Lebensmittel, Café & Restaurant",
      color: "#EC4899", // Pink
      icon: "🍽️",
      lessons: [
        {
          id: "lesson_4_1",
          unitId: "unit_4",
          title: "Grundnahrungsmittel & Getränke",
          description: "Brot, Wasser, Milch, Tee, Kaffee & Suppe",
          xpReward: 30,
          theory: {
            title: "Auf dem Tisch",
            concept: "Die wichtigsten Lebensmittel und Getränke auf Russisch.",
            points: [
              "Хлеб (Chlep) – Brot.",
              "Вода (Wadá) – Wasser.",
              "Чай (Tschaj) – Tee (traditionell aus dem Samowar getrunken).",
              "Кофе (Kófe) – Kaffee.",
              "Молоко (Malakó) – Milch.",
              "Суп (Sup) – Suppe.",
              "Сыр (Syr) – Käse."
            ],
            tip: "Wusstest du? Russland ist eine große Teetrinker-Nation. Bei fast jedem Treffen wird 'чай' serviert!"
          },
          exercises: [
            {
              id: "ex_4_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Хлеб'?",
              audioText: "Хлеб",
              options: ["Brot", "Suppe", "Fleisch", "Käse"],
              correctIndex: 0,
              explanation: "Хлеб = Brot."
            },
            {
              id: "ex_4_1_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Wasser' auf Russisch?",
              options: ["Вода", "Чай", "Кофе", "Молоко"],
              correctIndex: 0,
              explanation: "Wasser = Вода (Wadá)."
            },
            {
              id: "ex_4_1_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Tee mit Zitrone'",
              targetSentence: "Чай с лимоном",
              words: ["Чай", "с", "лимоном", "кофе", "молоком"],
              explanation: "Чай с лимоном = Tee mit Zitrone."
            },
            {
              id: "ex_4_1_4",
              type: "matching",
              question: "Verbinde die Getränke und Speisen:",
              pairs: [
                { left: "Вода", right: "Wasser" },
                { left: "Кофе", right: "Kaffee" },
                { left: "Сыр", right: "Käse" },
                { left: "Суп", right: "Suppe" }
              ]
            },
            {
              id: "ex_4_1_5",
              type: "listening",
              question: "Welches Getränk hörst du?",
              audioText: "Молоко",
              options: ["Молоко (Milch)", "Вода (Wasser)", "Чай (Tee)", "Кофе (Kaffee)"],
              correctIndex: 0,
              explanation: "Du hast 'Молоко' (Malakó = Milch) gehört."
            }
          ]
        },
        {
          id: "lesson_4_2",
          unitId: "unit_4",
          title: "Im Restaurant bestellen & bezahlen",
          description: "Bestellen, nach Preisen fragen & die Rechnung verlangen",
          xpReward: 35,
          theory: {
            title: "Erfolgreich im Restaurant",
            concept: "So bestellst du entspannt in einem russischen Lokal.",
            points: [
              "Счёт, пожалуйста! (Schtschot, paschálujsta!) – Die Rechnung, bitte!",
              "Сколько это стоит? (Skólka éta stóit?) – Wie viel kostet das?",
              "Меню (Menjú) – Speisekarte.",
              "Официант (Afitsyánt) – Kellner.",
              "Очень вкусно! (Ótschen wkúsna!) – Sehr lecker!"
            ],
            tip: "Nach dem Essen kannst du loben: 'Всё было очень вкусно, спасибо!' (Alles war sehr lecker, danke!)."
          },
          exercises: [
            {
              id: "ex_4_2_1",
              type: "choice_ru_de",
              question: "Wie rufst du den Kellner für die Rechnung?",
              audioText: "Счёт, пожалуйста!",
              options: ["Счёт, пожалуйста! (Die Rechnung, bitte!)", "Привет, пока!", "Где меню?", "Как дела?"],
              correctIndex: 0,
              explanation: "Счёт, пожалуйста! = Die Rechnung, bitte!"
            },
            {
              id: "ex_4_2_2",
              type: "choice_ru_de",
              question: "Was bedeutet die Frage 'Сколько это стоит?'?",
              audioText: "Сколько это стоит?",
              options: ["Wie viel kostet das?", "Was ist das?", "Wo ist das?", "Wer bezahlt das?"],
              correctIndex: 0,
              explanation: "Сколько это стоит? = Wie viel kostet das?"
            },
            {
              id: "ex_4_2_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Sehr lecker, danke!'",
              targetSentence: "Очень вкусно, спасибо!",
              words: ["Очень", "вкусно,", "спасибо!", "плохо,"],
              explanation: "Очень вкусно, спасибо! = Sehr lecker, danke!"
            },
            {
              id: "ex_4_2_4",
              type: "matching",
              question: "Ordne die Redewendungen zu:",
              pairs: [
                { left: "Счёт", right: "Rechnung" },
                { left: "Сколько", right: "Wie viel" },
                { left: "Вкусно", right: "Lecker" },
                { left: "Официант", right: "Kellner" }
              ]
            },
            {
              id: "ex_4_2_5",
              type: "listening",
              question: "Was hörst du?",
              audioText: "Очень вкусно",
              options: ["Очень вкусно", "Очень плохо", "Большое спасибо", "Сколько стоит"],
              correctIndex: 0,
              explanation: "Du hast 'Очень вкусно' (Sehr lecker) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_5",
      number: 5,
      title: "Menschen und Familie",
      subtitle: "Familienmitglieder, Freunde & Berufe",
      color: "#8B5CF6", // Purple
      icon: "👨‍👩‍👦",
      lessons: [
        {
          id: "lesson_5_1",
          unitId: "unit_5",
          title: "Meine Familie & Freunde",
          description: "Mama, Papa, Bruder, Schwester, Sohn & Tochter",
          xpReward: 30,
          theory: {
            title: "Die Familie (Семья)",
            concept: "Familie spielt im russischen Alltag eine zentrale Rolle.",
            points: [
              "Семья (Semjá) – Familie.",
              "Мама (Máma) / Папа (Pápa) – Mama / Papa.",
              "Брат (Brat) – Bruder.",
              "Сестра (Sestrá) – Schwester.",
              "Сын (Syn) – Sohn / Дочь (Dotsch) – Tochter.",
              "Друг (Drug) – Freund / Подруга (Padrúga) – Freundin."
            ],
            tip: "Das russische Wort für Freund ('Друг') klingt fast wie das deutsche 'Draht' oder 'Freund' auf Slowakisch/Polnisch."
          },
          exercises: [
            {
              id: "ex_5_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Сестра'?",
              audioText: "Сестра",
              options: ["Schwester", "Mutter", "Bruder", "Freundin"],
              correctIndex: 0,
              explanation: "Сестра = Schwester."
            },
            {
              id: "ex_5_1_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Bruder' auf Russisch?",
              options: ["Брат", "Папа", "Сын", "Друг"],
              correctIndex: 0,
              explanation: "Bruder = Брат (Brat)."
            },
            {
              id: "ex_5_1_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Das ist mein bester Freund'",
              targetSentence: "Это мой лучший друг",
              words: ["Это", "мой", "лучший", "друг", "брат"],
              explanation: "Это мой лучший друг = Das ist mein bester Freund."
            },
            {
              id: "ex_5_1_4",
              type: "matching",
              question: "Verbinde die Familienmitglieder:",
              pairs: [
                { left: "Мама", right: "Mama" },
                { left: "Папа", right: "Papa" },
                { left: "Брат", right: "Bruder" },
                { left: "Сестра", right: "Schwester" }
              ]
            },
            {
              id: "ex_5_1_5",
              type: "listening",
              question: "Welches Familienmitglied hörst du?",
              audioText: "Семья",
              options: ["Семья (Familie)", "Сестра (Schwester)", "Сын (Sohn)", "Мама (Mama)"],
              correctIndex: 0,
              explanation: "Du hast 'Семья' (Familie) gehört."
            }
          ]
        },
        {
          id: "lesson_5_2",
          unitId: "unit_5",
          title: "Berufe & Tätigkeiten",
          description: "Arzt, Lehrer, Ingenieur & Student",
          xpReward: 30,
          theory: {
            title: "Wer arbeitet was?",
            concept: "So stellst du deinen Beruf vor.",
            points: [
              "Врач (Wratsch) – Arzt.",
              "Учитель (Utschítjel) – Lehrer.",
              "Инженер (Inschenér) – Ingenieur.",
              "Студент (Studjént) – Student.",
              "Водитель (Wadítjel) – Fahrer."
            ],
            tip: "Um zu sagen 'Ich bin Student', sagst du einfach: 'Я студент' (ohne das Wörtchen 'bin'!)."
          },
          exercises: [
            {
              id: "ex_5_2_1",
              type: "choice_ru_de",
              question: "Was ist ein 'Врач'?",
              audioText: "Врач",
              options: ["Arzt", "Lehrer", "Fahrer", "Ingenieur"],
              correctIndex: 0,
              explanation: "Врач = Arzt / Ärztin."
            },
            {
              id: "ex_5_2_2",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Ich bin Student'",
              targetSentence: "Я студент",
              words: ["Я", "студент", "он", "врач"],
              explanation: "Im Russischen wird das Hilfsverb 'sein' in der Gegenwart weggelassen: Я студент = Ich bin Student."
            },
            {
              id: "ex_5_2_3",
              type: "matching",
              question: "Ordne die Berufe zu:",
              pairs: [
                { left: "Врач", right: "Arzt" },
                { left: "Учитель", right: "Lehrer" },
                { left: "Инженер", right: "Ingenieur" },
                { left: "Студент", right: "Student" }
              ]
            },
            {
              id: "ex_5_2_4",
              type: "listening",
              question: "Welchen Beruf hörst du?",
              audioText: "Учитель",
              options: ["Учитель (Lehrer)", "Врач (Arzt)", "Студент (Student)", "Инженер (Ingenieur)"],
              correctIndex: 0,
              explanation: "Du hast 'Учитель' (Lehrer) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_6",
      number: 6,
      title: "Reisen und Orientierung",
      subtitle: "Verkehrsmittel, Orte & Richtungen",
      color: "#06B6D4", // Cyan
      icon: "✈️",
      lessons: [
        {
          id: "lesson_6_1",
          unitId: "unit_6",
          title: "Verkehrsmittel & Unterwegs",
          description: "Metro, Bus, Zug, Flugzeug & Taxi",
          xpReward: 30,
          theory: {
            title: "Unterwegs in der Stadt",
            concept: "Verkehrsmittel auf Russisch – viele klingen sehr international!",
            points: [
              "Метро (Metró) – U-Bahn (die Moskauer Metro ist weltberühmt für ihre Paläste im Untergrund!).",
              "Автобус (Awtóbus) – Bus.",
              "Поезд (Pójesd) – Zug.",
              "Самолёт (Samaljót) – Flugzeug (wörtlich: 'Selbst-Flieger'!).",
              "Такси (Taksí) – Taxi.",
              "Билет (Bilét) – Fahrkarte / Ticket."
            ],
            tip: "Das Wort 'Самолёт' setzt sich aus 'сам' (selbst) und 'лёт' (Flug) zusammen!"
          },
          exercises: [
            {
              id: "ex_6_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Самолёт'?",
              audioText: "Самолёт",
              options: ["Flugzeug", "Zug", "U-Bahn", "Bus"],
              correctIndex: 0,
              explanation: "Самолёт = Flugzeug."
            },
            {
              id: "ex_6_1_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Zug' auf Russisch?",
              options: ["Поезд", "Метро", "Самолёт", "Такси"],
              correctIndex: 0,
              explanation: "Zug = Поезд (Pójesd)."
            },
            {
              id: "ex_6_1_3",
              type: "sentence_build",
              question: "Bilde den Ausdruck: 'Ein Ticket, bitte'",
              targetSentence: "Один билет, пожалуйста.",
              words: ["Один", "билет,", "пожалуйста.", "два"],
              explanation: "Один билет, пожалуйста. = Ein Ticket, bitte."
            },
            {
              id: "ex_6_1_4",
              type: "matching",
              question: "Verbinde die Verkehrsmittel:",
              pairs: [
                { left: "Метро", right: "U-Bahn" },
                { left: "Поезд", right: "Zug" },
                { left: "Самолёт", right: "Flugzeug" },
                { left: "Автобус", right: "Bus" }
              ]
            },
            {
              id: "ex_6_1_5",
              type: "listening",
              question: "Welches Verkehrsmittel hörst du?",
              audioText: "Метро",
              options: ["Метро", "Такси", "Поезд", "Автобус"],
              correctIndex: 0,
              explanation: "Du hast 'Метро' (Metró = U-Bahn) gehört."
            }
          ]
        },
        {
          id: "lesson_6_2",
          unitId: "unit_6",
          title: "Nach dem Weg fragen",
          description: "Wo ist...?, links, rechts, geradeaus",
          xpReward: 35,
          theory: {
            title: "Die Richtungen angeben",
            concept: "So fragst du in jeder russischen Stadt nach dem Weg.",
            points: [
              "Где...? (Gde...?) – Wo ist...?",
              "Слева (Sléwa) – Links.",
              "Справа (Spráwa) – Rechts.",
              "Прямо (Prjáma) – Geradeaus.",
              "Вокзал (Wakzál) – Bahnhof.",
              "Аэропорт (Aerapórt) – Flughafen."
            ],
            tip: "Kombiniere 'Где' mit 'Извините': 'Извините, где метро?' (Entschuldigung, wo ist die U-Bahn?)."
          },
          exercises: [
            {
              id: "ex_6_2_1",
              type: "choice_ru_de",
              question: "Was bedeutet das Fragewort 'Где'?",
              audioText: "Где",
              options: ["Wo", "Wann", "Warum", "Wer"],
              correctIndex: 0,
              explanation: "Где = Wo."
            },
            {
              id: "ex_6_2_2",
              type: "sentence_build",
              question: "Bilde die Frage: 'Entschuldigung, wo ist das Hotel?'",
              targetSentence: "Извините, где отель?",
              words: ["Извините,", "где", "отель?", "вокзал?"],
              explanation: "Извините, где отель? = Entschuldigung, wo ist das Hotel?"
            },
            {
              id: "ex_6_2_3",
              type: "matching",
              question: "Ordne die Richtungen zu:",
              pairs: [
                { left: "Прямо", right: "Geradeaus" },
                { left: "Слева", right: "Links" },
                { left: "Справа", right: "Rechts" },
                { left: "Вокзал", right: "Bahnhof" }
              ]
            },
            {
              id: "ex_6_2_4",
              type: "listening",
              question: "Welche Richtung hörst du?",
              audioText: "Прямо",
              options: ["Прямо (Geradeaus)", "Слева (Links)", "Справа (Rechts)", "Назад (Zurück)"],
              correctIndex: 0,
              explanation: "Du hast 'Прямо' (Prjáma = Geradeaus) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_7",
      number: 7,
      title: "Erste Sätze & Grammatik",
      subtitle: "Das Wörtchen 'Это', Verben & Sich vorstellen",
      color: "#6366F1", // Indigo
      icon: "💬",
      lessons: [
        {
          id: "lesson_7_1",
          unitId: "unit_7",
          title: "Das Wörtchen 'Это' & Sätze ohne 'ist'",
          description: "Einfache russische Aussagen kinderleicht formulieren",
          xpReward: 30,
          theory: {
            title: "Das russische Geheimnis: Kein Hilfsverb 'ist'",
            concept: "Im Deutschen sagen wir: 'Das IST mein Haus'. Im Russischen lässt man das 'ist' im Präsens einfach weg!",
            points: [
              "Это (Éta) – Bedeutet 'Das ist' oder 'Dies ist'.",
              "Это мой дом. – Das ist mein Haus.",
              "Это книга. – Das ist ein Buch.",
              "Это вкусно. – Das ist lecker.",
              "Кто это? – Wer ist das? / Что это? – Was ist das?"
            ],
            tip: "Einfach 'Это' + Substantiv, und schon hast du einen vollständigen Satz!"
          },
          exercises: [
            {
              id: "ex_7_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet der Satz: 'Это мой друг.'?",
              audioText: "Это мой друг.",
              options: ["Das ist mein Freund.", "Wo ist mein Freund?", "Wer ist mein Freund?", "Das ist mein Bruder."],
              correctIndex: 0,
              explanation: "Это = Das ist, мой = mein, друг = Freund."
            },
            {
              id: "ex_7_1_2",
              type: "choice_de_ru",
              question: "Wie sagst du: 'Was ist das?' auf Russisch?",
              options: ["Что это?", "Кто это?", "Где это?", "Как это?"],
              correctIndex: 0,
              explanation: "Что это? = Was ist das? ('Кто это?' fragt nach Personen: 'Wer ist das?')."
            },
            {
              id: "ex_7_1_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Das ist Moskau'",
              targetSentence: "Это Москва",
              words: ["Это", "Москва", "Берлин", "город"],
              explanation: "Это Москва = Das ist Moskau."
            },
            {
              id: "ex_7_1_4",
              type: "matching",
              question: "Verbinde die Fragesätze:",
              pairs: [
                { left: "Что это?", right: "Was ist das?" },
                { left: "Кто это?", right: "Wer ist das?" },
                { left: "Где это?", right: "Wo ist das?" },
                { left: "Это мой дом", right: "Das ist mein Haus" }
              ]
            },
            {
              id: "ex_7_1_5",
              type: "listening",
              question: "Welche Frage hast du gehört?",
              audioText: "Что это?",
              options: ["Что это? (Was ist das?)", "Кто это? (Wer ist das?)", "Где это? (Wo ist das?)", "Это я"],
              correctIndex: 0,
              explanation: "Du hast 'Что это?' (Was ist das?) gehört."
            }
          ]
        },
        {
          id: "lesson_7_2",
          unitId: "unit_7",
          title: "Sich vorstellen & Dialoge",
          description: "Name, Herkunft und Sprachen",
          xpReward: 35,
          theory: {
            title: "Sich auf Russisch vorstellen",
            concept: "So machst du bei einer Begegnung sofort einen sympathischen Eindruck.",
            points: [
              "Меня зовут... (Menjá sawút...) – Ich heiße... (wörtlich: 'Mich nennen sie...').",
              "Очень приятно! (Ótschen prijátna!) – Sehr erfreut / Freut mich!",
              "Я говорю по-русски. (Ja gawarjú pa-rússki.) – Ich spreche Russisch.",
              "Я понимаю. (Ja panimáju.) – Ich verstehe.",
              "Я не понимаю. (Ja ne panimáju.) – Ich verstehe nicht."
            ],
            tip: "Wenn du ein Wort nicht verstehst, sagst du einfach: 'Повторите, пожалуйста' (Wiederholen Sie bitte)!"
          },
          exercises: [
            {
              id: "ex_7_2_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Очень приятно'?",
              audioText: "Очень приятно",
              options: ["Sehr erfreut / Freut mich!", "Guten Tag", "Auf Wiedersehen", "Vielen Dank"],
              correctIndex: 0,
              explanation: "Очень приятно sagt man bei einer Vorstellung = Freut mich, Sie kennenzulernen."
            },
            {
              id: "ex_7_2_2",
              type: "sentence_build",
              question: "Bilde den Satz: 'Ich verstehe nicht'",
              targetSentence: "Я не понимаю",
              words: ["Я", "не", "понимаю", "знаю", "говорю"],
              explanation: "Я не понимаю = Ich verstehe nicht."
            },
            {
              id: "ex_7_2_3",
              type: "choice_de_ru",
              question: "Wie sagst du: 'Ich spreche Russisch'?",
              options: ["Я говорю по-русски", "Я не знаю", "Меня зовут Анна", "Я учу немецкий"],
              correctIndex: 0,
              explanation: "Я говорю по-русски = Ich spreche Russisch."
            },
            {
              id: "ex_7_2_4",
              type: "matching",
              question: "Ordne die Redewendungen zu:",
              pairs: [
                { left: "Меня зовут", right: "Ich heiße" },
                { left: "Очень приятно", right: "Sehr erfreut" },
                { left: "Я понимаю", right: "Ich verstehe" },
                { left: "Я не понимаю", right: "Ich verstehe nicht" }
              ]
            },
            {
              id: "ex_7_2_5",
              type: "listening",
              question: "Welchen Satz hörst du?",
              audioText: "Я понимаю по-русски",
              options: ["Я понимаю по-русски", "Я не говорю по-русски", "Меня зовут Иван", "Очень приятно"],
              correctIndex: 0,
              explanation: "Du hast 'Я понимаю по-русски' (Ich verstehe Russisch) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_8",
      number: 8,
      title: "Fahrzeuge & Motorsport",
      subtitle: "Rennsport, Autos, Motoren & Geschwindigkeit",
      color: "#EF4444", // Red
      icon: "🏎️",
      lessons: [
        {
          id: "lesson_8_1",
          unitId: "unit_8",
          title: "Auf der Rennstrecke",
          description: "Rennen, Strecke, Geschwindigkeit & Ziellinie",
          xpReward: 30,
          theory: {
            title: "Adrenalin und Rennsport (Автоспорт)",
            concept: "Für Motorsport-Begeisterte: Die wichtigsten Begriffe rund um die Rennstrecke und packende Rennen.",
            points: [
              "Гонка (Gónka) – Das Rennen.",
              "Трасса (Trássa) – Die Rennstrecke / Piste.",
              "Скорость (Skórast) – Geschwindigkeit / Speed.",
              "Старт (Start) – Start / Финиш (Fínisch) – Ziel / Ziellinie.",
              "Чемпион (Tschempión) – Der Champion / Weltmeister.",
              "Гонщик (Gónshschik) – Rennfahrer / Pilot."
            ],
            tip: "Viele Fachbegriffe im Motorsport wie 'Старт' und 'Финиш' erkennst du sofort wieder!"
          },
          exercises: [
            {
              id: "ex_8_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet das russische Wort 'Гонка'?",
              audioText: "Гонка",
              options: ["Rennen", "Auto", "Straße", "Motor"],
              correctIndex: 0,
              explanation: "Гонка = Rennen."
            },
            {
              id: "ex_8_1_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Geschwindigkeit' auf Russisch?",
              options: ["Скорость", "Трасса", "Финиш", "Гонщик"],
              correctIndex: 0,
              explanation: "Geschwindigkeit = Скорость (Skórast)."
            },
            {
              id: "ex_8_1_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Das Formel-1-Rennen'",
              targetSentence: "Гонка Формулы-1",
              words: ["Гонка", "Формулы-1", "трасса", "старт"],
              explanation: "Гонка Формулы-1 = Formel-1-Rennen."
            },
            {
              id: "ex_8_1_4",
              type: "matching",
              question: "Verbinde die Motorsport-Begriffe:",
              pairs: [
                { left: "Трасса", right: "Rennstrecke" },
                { left: "Скорость", right: "Geschwindigkeit" },
                { left: "Гонщик", right: "Rennfahrer" },
                { left: "Финиш", right: "Ziellinie" }
              ]
            },
            {
              id: "ex_8_1_5",
              type: "listening",
              question: "Welchen Begriff hörst du?",
              audioText: "Чемпион",
              options: ["Чемпион (Champion)", "Гонщик (Rennfahrer)", "Скорость (Speed)", "Трасса (Strecke)"],
              correctIndex: 0,
              explanation: "Du hast 'Чемпион' (Champion / Meister) gehört."
            }
          ]
        },
        {
          id: "lesson_8_2",
          unitId: "unit_8",
          title: "Fahrzeugtechnik & Cockpit",
          description: "Motor, Bremse, Lenkrad, Räder & Motorrad",
          xpReward: 35,
          theory: {
            title: "Technik unter der Haube",
            concept: "So heißen die wichtigsten Fahrzeugkomponenten auf Russisch.",
            points: [
              "Машина (Maschína) / Автомобиль (Awtamabíl) – Auto / Automobil.",
              "Двигатель (Dwígatjel) – Motor / Triebwerk.",
              "Тормоз (Tórmas) – Bremse.",
              "Руль (Rul) – Lenkrad / Steuer.",
              "Колесо (Kalesó) – Rad / Reifen.",
              "Мотоцикл (Matatsíkl) – Motorrad."
            ],
            tip: "Das Wort 'Руль' (Rul) ist kurz und leitet sich vom altholländischen Steuerwort ab – Seefahrer brachten es nach Russland!"
          },
          exercises: [
            {
              id: "ex_8_2_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Двигатель'?",
              audioText: "Двигатель",
              options: ["Motor", "Bremse", "Rad", "Lenkrad"],
              correctIndex: 0,
              explanation: "Двигатель = Motor (vom Verb двигать = bewegen)."
            },
            {
              id: "ex_8_2_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Lenkrad' auf Russisch?",
              options: ["Руль", "Тормоз", "Колесо", "Машина"],
              correctIndex: 0,
              explanation: "Lenkrad = Руль (Rul)."
            },
            {
              id: "ex_8_2_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Das Auto fährt sehr schnell'",
              targetSentence: "Машина едет очень быстро",
              words: ["Машина", "едет", "очень", "быстро", "медленно"],
              explanation: "Машина едет очень быстро = Das Auto fährt sehr schnell."
            },
            {
              id: "ex_8_2_4",
              type: "matching",
              question: "Ordne die Fahrzeugteile zu:",
              pairs: [
                { left: "Двигатель", right: "Motor" },
                { left: "Тормоз", right: "Bremse" },
                { left: "Руль", right: "Lenkrad" },
                { left: "Колесо", right: "Rad" }
              ]
            },
            {
              id: "ex_8_2_5",
              type: "listening",
              question: "Welches Fahrzeugteil hast du gehört?",
              audioText: "Тормоз",
              options: ["Тормоз (Bremse)", "Двигатель (Motor)", "Руль (Lenkrad)", "Колесо (Rad)"],
              correctIndex: 0,
              explanation: "Du hast 'Тормоз' (Bremse) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_9",
      number: 9,
      title: "Freizeit, Sport und Musik",
      subtitle: "Hobbys, Unterhaltung & Kultur",
      color: "#14B8A6", // Teal
      icon: "🎵",
      lessons: [
        {
          id: "lesson_9_1",
          unitId: "unit_9",
          title: "Sport & Lieblingshobbys",
          description: "Fußball, Musik hören, Spazieren & Sport treiben",
          xpReward: 30,
          theory: {
            title: "Freizeit genießen",
            concept: "Über deine Freizeitaktivitäten und Interessen sprechen.",
            points: [
              "Спорт (Sport) – Sport.",
              "Футбол (Futból) – Fußball.",
              "Музыка (Músyka) – Musik.",
              "Парк (Park) – Park.",
              "Я люблю... (Ja ljubljú...) – Ich liebe / mag..."
            ],
            tip: "Kombiniere 'Я люблю' mit deinem Hobby: 'Я люблю спорт!' (Ich liebe Sport!)."
          },
          exercises: [
            {
              id: "ex_9_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet 'Я люблю музыку'?",
              audioText: "Я люблю музыку",
              options: ["Ich liebe Musik.", "Ich mache Sport.", "Ich spiele Fußball.", "Ich gehe in den Park."],
              correctIndex: 0,
              explanation: "Я люблю музыку = Ich liebe Musik."
            },
            {
              id: "ex_9_1_2",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Ich liebe Sport'",
              targetSentence: "Я люблю спорт",
              words: ["Я", "люблю", "спорт", "парк", "музыку"],
              explanation: "Я люблю спорт = Ich liebe Sport."
            },
            {
              id: "ex_9_1_3",
              type: "matching",
              question: "Verbinde die Begriffe:",
              pairs: [
                { left: "Футбол", right: "Fußball" },
                { left: "Музыка", right: "Musik" },
                { left: "Спорт", right: "Sport" },
                { left: "Парк", right: "Park" }
              ]
            },
            {
              id: "ex_9_1_4",
              type: "listening",
              question: "Welches Hobby hörst du?",
              audioText: "Футбол",
              options: ["Футбол (Fußball)", "Музыка (Musik)", "Театр (Theater)", "Кино (Kino)"],
              correctIndex: 0,
              explanation: "Du hast 'Футбол' (Fußball) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_10",
      number: 10,
      title: "Einkaufen und Alltag",
      subtitle: "Im Geschäft, Farben & Stadtleben",
      color: "#84CC16", // Lime
      icon: "🛍️",
      lessons: [
        {
          id: "lesson_10_1",
          unitId: "unit_10",
          title: "Farben & Beschreibungen",
          description: "Rot, Blau, Grün, Gelb, Weiß & Schwarz",
          xpReward: 30,
          theory: {
            title: "Die Welt der Farben",
            concept: "Mit Farben beschreibst du Gegenstände, Kleidung und Autos präzise.",
            points: [
              "Красный (Krásny) – Rot (Im Altrussischen bedeutete 'красный' auch 'schön' – daher der 'Rote Platz'!).",
              "Синий (Síniy) – Dunkelblau.",
              "Зелёный (Seljóny) – Grün.",
              "Белый (Bély) – Weiß.",
              "Чёрный (Tschórny) – Schwarz.",
              "Жёлтый (Schólty) – Gelb."
            ],
            tip: "Der 'Rote Platz' in Moskau (Красная площадь) bedeutet geschichtlich 'Schöner Platz'!"
          },
          exercises: [
            {
              id: "ex_10_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet die Farbe 'Красный'?",
              audioText: "Красный",
              options: ["Rot", "Blau", "Grün", "Gelb"],
              correctIndex: 0,
              explanation: "Красный = Rot."
            },
            {
              id: "ex_10_1_2",
              type: "choice_de_ru",
              question: "Wie heißt 'Grün' auf Russisch?",
              options: ["Зелёный", "Белый", "Синий", "Чёрный"],
              correctIndex: 0,
              explanation: "Grün = Зелёный (Seljóny)."
            },
            {
              id: "ex_10_1_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Das weiße Auto'",
              targetSentence: "Белая машина",
              words: ["Белая", "машина", "красная", "синяя"],
              explanation: "Белая машина = Weißes Auto."
            },
            {
              id: "ex_10_1_4",
              type: "matching",
              question: "Ordne die Farben zu:",
              pairs: [
                { left: "Белый", right: "Weiß" },
                { left: "Чёрный", right: "Schwarz" },
                { left: "Синий", right: "Blau" },
                { left: "Жёлтый", right: "Gelb" }
              ]
            },
            {
              id: "ex_10_1_5",
              type: "listening",
              question: "Welche Farbe hörst du?",
              audioText: "Красный",
              options: ["Красный (Rot)", "Зелёный (Grün)", "Белый (Weiß)", "Чёрный (Schwarz)"],
              correctIndex: 0,
              explanation: "Du hast 'Красный' (Rot) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_11",
      number: 11,
      title: "Echte Straßensprache & Slang",
      subtitle: "Street Talk, Umgangssprache & Reaktionen",
      color: "#EA580C", // Vibrant Orange
      icon: "🕶️",
      lessons: [
        {
          id: "lesson_11_1",
          unitId: "unit_11",
          title: "Street Talk & Spontane Reaktionen",
          description: "Lerne Круто, Офигеть, Жесть, Да ладно und Чё?",
          xpReward: 35,
          theory: {
            title: "Wie Russen wirklich auf der Straße sprechen",
            concept: "Im echten Alltag in Moskau, Petersburg oder im Freundeskreis spricht fast niemand wie im staubigen Lehrbuch! Diese Ausdrücke wirst du in jedem Film, YouTube-Video und Gespräch hören.",
            points: [
              "Круто (Krúta) – 'Cool', 'krass', 'mega!'. Die universelle Zustimmung.",
              "Офигеть (Afigét) – 'Wahnsinn!', 'Krass!', 'Nicht zu fassen!'. Drückt fassungslose Begeisterung oder Schock aus.",
              "Жесть (Schest) – Wörtlich 'Weißblech', bedeutet aber 'Heftig!', 'Übel!' oder 'Krass!'.",
              "Да ладно? (Da ládna?) – 'Echt jetzt?!', 'Nicht dein Ernst?!'. Unverzichtbar bei Überraschung.",
              "Чё? (Tschjo?) – Die umgangssprachliche Form von 'Что?' (Was?). Klingt frech und direkt wie deutsches 'Häh? / Was?'.",
              "Нифига себе! (Nifigá sebé!) – 'Boah krass!', 'Heilige Sch...!'. Riesiges Erstaunen."
            ],
            tip: "Wenn ein Freund dir etwas Unglaubliches erzählt, rufe einfach: 'Да ладно?! Офигеть!' – du klingst sofort wie ein Einheimischer!"
          },
          exercises: [
            {
              id: "ex_11_1_1",
              type: "choice_ru_de",
              question: "Dein russischer Kumpel sagt: 'Это очень круто!'. Was meint er?",
              audioText: "Это очень круто!",
              options: ["Das ist echt mega cool!", "Das ist sehr teuer.", "Das ist total langweilig.", "Wo ist das Auto?"],
              correctIndex: 0,
              explanation: "Круто = Cool / Mega."
            },
            {
              id: "ex_11_1_2",
              type: "choice_de_ru",
              question: "Wie reagierst du auf Russisch mit 'Echt jetzt?! Nicht dein Ernst?!'?",
              options: ["Да ладно?", "До свидания", "Здравствуйте", "Пожалуйста"],
              correctIndex: 0,
              explanation: "Да ладно? = Echt jetzt? Nicht dein Ernst?"
            },
            {
              id: "ex_11_1_3",
              type: "choice_ru_de",
              question: "Was bedeutet der Straßenausdruck 'Жесть'?",
              audioText: "Жесть",
              options: ["Heftig / Krass / Übel", "Guten Tag", "Danke schön", "Auf Wiedersehen"],
              correctIndex: 0,
              explanation: "Жесть drückt aus, dass etwas extrem heftig oder krass ist."
            },
            {
              id: "ex_11_1_4",
              type: "matching",
              question: "Verbinde die Slang-Reaktionen:",
              pairs: [
                { left: "Круто", right: "Cool / Mega" },
                { left: "Офигеть", right: "Wahnsinn! Krass!" },
                { left: "Жесть", right: "Heftig / Übel" },
                { left: "Чё?", right: "Was? / Häh?" }
              ]
            },
            {
              id: "ex_11_1_5",
              type: "listening",
              question: "Welchen Slang-Ausdruck hörst du?",
              audioText: "Офигеть",
              options: ["Офигеть (Wahnsinn!)", "Спасибо (Danke)", "Привет (Hallo)", "Хорошо (Gut)"],
              correctIndex: 0,
              explanation: "Du hast 'Офигеть' (Afigét = Wahnsinn!) gehört."
            }
          ]
        },
        {
          id: "lesson_11_2",
          unitId: "unit_11",
          title: "Mit Kumpels unterwegs",
          description: "Чувак, Пацан, Движуха, Тусовка & Шарить",
          xpReward: 35,
          theory: {
            title: "Mit der Clique abhängen",
            concept: "Wörter für Freunde, Partys und das Nachtleben.",
            points: [
              "Чувак (Tschuwák) – 'Dude', 'Kumpel', 'Typ', 'Bro'.",
              "Пацан (Patsán) – 'Junge', 'Kerl', 'Bursche' (bekannt aus Serien & Hip-Hop).",
              "Движуха (Dwischúcha) – 'Action', 'Trubel', 'Da geht was ab!'.",
              "Тусовка (Tusówka) – 'Party', 'Hangout', 'Feier'.",
              "Шарить (Schárit) – 'Ahnung haben', 'den Durchblick haben' ('Я шарю' = Ich blick da voll durch!).",
              "Забей (Sabéj) – 'Vergiss es!', 'Schwamm drüber!', 'Lass gut sein!'."
            ],
            tip: "'Движуха' kommt vom Wort 'движение' (Bewegung). Wenn irgendwo Action ist, gibt es 'классная движуха'!"
          },
          exercises: [
            {
              id: "ex_11_2_1",
              type: "choice_ru_de",
              question: "Was bedeutet die Anrede 'Здорово, чувак!'?",
              audioText: "Здорово, чувак!",
              options: ["Servus Kumpel! / Hi Bro!", "Guten Abend Herr Professor!", "Wer sind Sie?", "Auf Wiedersehen!"],
              correctIndex: 0,
              explanation: "Чувак = Kumpel / Dude / Bro."
            },
            {
              id: "ex_11_2_2",
              type: "choice_de_ru",
              question: "Wie sagst du lässig 'Vergiss es! / Schwamm drüber!' auf Russisch?",
              options: ["Забей", "Спасибо", "Пожалуйста", "Привет"],
              correctIndex: 0,
              explanation: "Забей = Vergiss es / Schwamm drüber."
            },
            {
              id: "ex_11_2_3",
              type: "sentence_build",
              question: "Bilde den russischen Slang-Satz: 'Er hat echt Ahnung'",
              targetSentence: "Он реально шарит",
              words: ["Он", "реально", "шарит", "забей", "чувак"],
              explanation: "Он реально шарит = Er hat echt Ahnung / blickt voll durch."
            },
            {
              id: "ex_11_2_4",
              type: "matching",
              question: "Verbinde die Slang-Begriffe:",
              pairs: [
                { left: "Чувак", right: "Dude / Kumpel" },
                { left: "Тусовка", right: "Party / Feier" },
                { left: "Движуха", right: "Action / Was los ist" },
                { left: "Забей", right: "Vergiss es" }
              ]
            },
            {
              id: "ex_11_2_5",
              type: "listening",
              question: "Welches Slang-Wort hörst du?",
              audioText: "Тусовка",
              options: ["Тусовка (Party)", "Машина (Auto)", "Город (Stadt)", "Отель (Hotel)"],
              correctIndex: 0,
              explanation: "Du hast 'Тусовка' (Tusówka = Party / Feier) gehört."
            }
          ]
        },
        {
          id: "lesson_11_3",
          unitId: "unit_11",
          title: "Action, Kohle & Essen",
          description: "Погнали!, Красавчик, Бабки und Хавать",
          xpReward: 35,
          theory: {
            title: "Umgangssprache im Alltag",
            concept: "Über Geld, Essen und Loben im lockeren Ton sprechen.",
            points: [
              "Погнали! (Pagnáli!) – 'Los geht's!', 'Auf geht's!', 'Gas geben!'.",
              "Красавчик (Krasáwtschik) – Wörtlich 'Hübscher', bedeutet im Slang: 'Ehrenmann!', 'Super gemacht!', 'Klasse Typ!'.",
              "Бабки (Bápki) – 'Kohle', 'Knete', 'Asche' (Geld).",
              "Хавать (Cháwat) – 'Mampfen', 'futtern', 'essen'.",
              "Пофиг (Pófig) – 'Mir völlig egal', 'schnuppe'."
            ],
            tip: "Wenn ein Freund dir einen Gefallen getan oder etwas Geniales geschafft hat, sagst du stolz: 'Красавчик!'"
          },
          exercises: [
            {
              id: "ex_11_3_1",
              type: "choice_ru_de",
              question: "Jemand ruft 'Время не ждёт — погнали!'. Was bedeutet das?",
              audioText: "Погнали!",
              options: ["Keine Zeit verlieren — los geht's!", "Warten wir hier.", "Ich habe Hunger.", "Wo ist das Geld?"],
              correctIndex: 0,
              explanation: "Погнали! = Los geht's! / Gas geben!"
            },
            {
              id: "ex_11_3_2",
              type: "choice_ru_de",
              question: "Was bedeutet das russische Wort 'Бабки' im Slang?",
              audioText: "Бабки",
              options: ["Kohle / Knete (Geld)", "Fahrkarten", "Autos", "Schuhe"],
              correctIndex: 0,
              explanation: "Бабки = Kohle / Knete / Geld."
            },
            {
              id: "ex_11_3_3",
              type: "sentence_build",
              question: "Bilde den russischen Satz: 'Lass uns mampfen gehen!'",
              targetSentence: "Пойдём хавать!",
              words: ["Пойдём", "хавать!", "погнали", "бабки"],
              explanation: "Пойдём хавать! = Lass uns mampfen / futtern gehen!"
            },
            {
              id: "ex_11_3_4",
              type: "matching",
              question: "Ordne die Slang-Wörter zu:",
              pairs: [
                { left: "Погнали!", right: "Auf geht's!" },
                { left: "Красавчик", right: "Ehrenmann / Super Typ" },
                { left: "Бабки", right: "Kohle / Geld" },
                { left: "Хавать", right: "Mampfen / Futtern" }
              ]
            },
            {
              id: "ex_11_3_5",
              type: "listening",
              question: "Welches Lob hörst du?",
              audioText: "Красавчик",
              options: ["Красавчик (Ehrenmann / Gut gemacht!)", "Спасибо", "Пожалуйста", "До свидания"],
              correctIndex: 0,
              explanation: "Du hast 'Красавчик' (Krasáwtschik = Ehrenmann) gehört."
            }
          ]
        }
      ]
    },
    {
      id: "unit_12",
      number: 12,
      title: "Chat, Memes & Social Media",
      subtitle: "Russische Chat-Kürzel & Smiley-Klammern",
      color: "#0284C7", // Sky Blue
      icon: "💬",
      lessons: [
        {
          id: "lesson_12_1",
          unitId: "unit_12",
          title: "Chat-Kürzel & Online-Talk",
          description: "СПС, ПЖ, Го, Кринж & die russischen Klammern )))",
          xpReward: 35,
          theory: {
            title: "Wie Russen auf Telegram, WhatsApp & VK tippen",
            concept: "Russische Chats haben ganz eigene Konventionen, die für Ausländer zunächst rätselhaft wirken.",
            points: [
              "СПС (Sps) – Kurzform für 'Спасибо' (Danke / thx).",
              "ПЖ (Pzh) oder Плз – Kurzform für 'Пожалуйста' (Bitte / pls).",
              "Го (Go) – 'Lass uns!', 'Let's go!' (z. B. 'Го в кафе' = Lass ins Café gehen!).",
              "Кринж (Krindzh) – 'Cringe' / Fremdscham.",
              "Рофл (Rofl) – Aus dem Englischen 'ROFL', bedeutet Witz, Spaß oder Lachflash.",
              "))) (Klammern) – DAS Erkennungsmerkmal im russischen Internet! Auf der russischen Tastatur erfordert ein Doppelpunkt die Shift-Taste. Daher tippen Russen einfach nur Klammern: ')' = Lächeln, ')))' = lautes Lachen!"
            ],
            tip: "Wundere dich nicht, wenn eine Nachricht mit 'Привет)))' endet – das ist ein freundliches breites Lächeln!"
          },
          exercises: [
            {
              id: "ex_12_1_1",
              type: "choice_ru_de",
              question: "Was bedeutet das russische Chat-Kürzel 'СПС'?",
              audioText: "Спасибо",
              options: ["Danke (thx)", "Bitte", "Hallo", "Tschüss"],
              correctIndex: 0,
              explanation: "СПС steht für Спасибо = Danke."
            },
            {
              id: "ex_12_1_2",
              type: "choice_ru_de",
              question: "Warum schreiben Russen im Chat oft ')))' am Satzende?",
              options: ["Als Smileys / Lächeln (ohne Doppelpunkt getippt)", "Als Satzende-Zeichen", "Als Fragezeichen", "Weil die Tastatur kaputt ist"],
              correctIndex: 0,
              explanation: "Klammern ')))' sind im russischen Internet die universellen Lächeln-Smileys."
            },
            {
              id: "ex_12_1_3",
              type: "sentence_build",
              question: "Bilde die typische Chat-Nachricht: 'Thx für die Hilfe Bro)))'",
              targetSentence: "Спс за помощь бро)))",
              words: ["Спс", "за", "помощь", "бро)))", "пж"],
              explanation: "Спс за помощь бро))) = Thx für die Hilfe Bro)))"
            },
            {
              id: "ex_12_1_4",
              type: "matching",
              question: "Verbinde die Chat-Kürzel mit der Bedeutung:",
              pairs: [
                { left: "СПС", right: "Danke (thx)" },
                { left: "ПЖ", right: "Bitte (pls)" },
                { left: "Го", right: "Lass uns / Go!" },
                { left: "Кринж", right: "Cringe / Fremdscham" }
              ]
            },
            {
              id: "ex_12_1_5",
              type: "listening",
              question: "Welchen modernen Internet-Begriff hörst du?",
              audioText: "Кринж",
              options: ["Кринж (Cringe)", "Рофл (ROFL)", "Го (Go)", "СПС (Danke)"],
              correctIndex: 0,
              explanation: "Du hast 'Кринж' (Cringe / Fremdscham) gehört."
            }
          ]
        }
      ]
    }
  ]
};

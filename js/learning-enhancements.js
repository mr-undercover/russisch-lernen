// Additive course expansion and adaptive review support.
// This module preserves the original course and appends units 13–22.
const ADVANCED_UNIT_SPECS = [
  { n:13, title:"Wohnen & Zuhause", icon:"🏠", color:"#0F766E", lessons:[
    { title:"Zimmer und Möbel", words:[["комната","Zimmer"],["квартира","Wohnung"],["дом","Haus"],["кухня","Küche"],["спальня","Schlafzimmer"],["гостиная","Wohnzimmer"],["ванная","Badezimmer"],["коридор","Flur"],["стол","Tisch"],["стул","Stuhl"],["кровать","Bett"],["диван","Sofa"]] },
    { title:"Haushalt und Geräte", words:[["окно","Fenster"],["дверь","Tür"],["шкаф","Schrank"],["полка","Regal"],["лампа","Lampe"],["холодильник","Kühlschrank"],["плита","Herd"],["стиральная машина","Waschmaschine"],["пылесос","Staubsauger"],["зеркало","Spiegel"],["пол","Boden"],["ключ","Schlüssel"]] },
    { title:"Die Wohnung beschreiben", words:[["жить","wohnen"],["снимать","mieten"],["уютный","gemütlich"],["просторный","geräumig"],["маленький","klein"],["большой","groß"],["светлый","hell"],["рядом","in der Nähe"],["здесь","hier"],["там","dort"],["мой","mein (m.)"],["моя","meine (f.)"]] }
  ]},
  { n:14, title:"Uhrzeit & Tagesablauf", icon:"⏰", color:"#D97706", lessons:[
    { title:"Uhrzeit und Tageszeiten", words:[["час","Stunde / Uhr"],["минута","Minute"],["утро","Morgen"],["день","Tag"],["вечер","Abend"],["ночь","Nacht"],["сегодня","heute"],["завтра","morgen"],["вчера","gestern"],["рано","früh"],["поздно","spät"],["сейчас","jetzt"],["который час?","wie spät ist es?"],["без четверти восемь","Viertel vor acht"]] },
    { title:"Wochentage und Monate", words:[["понедельник","Montag"],["вторник","Dienstag"],["среда","Mittwoch"],["четверг","Donnerstag"],["пятница","Freitag"],["суббота","Samstag"],["воскресенье","Sonntag"],["январь","Januar"],["февраль","Februar"],["март","März"],["апрель","April"],["май","Mai"],["июнь","Juni"],["июль","Juli"],["август","August"],["сентябрь","September"],["октябрь","Oktober"],["ноябрь","November"],["декабрь","Dezember"],["седьмое мая","der siebte Mai"],["первого января","am ersten Januar"]] },
    { title:"Routine und Datum", words:[["просыпаться","aufwachen"],["вставать","aufstehen"],["завтракать","frühstücken"],["работать","arbeiten"],["учиться","lernen"],["отдыхать","sich ausruhen"],["ужинать","zu Abend essen"],["спать","schlafen"],["каждый день","jeden Tag"],["обычно","gewöhnlich"],["дата","Datum"],["число","Kalendertag"]] }
  ]},
  { n:15, title:"Wichtige Verben", icon:"🔤", color:"#7C3AED", lessons:[
    { title:"Sein, haben und können", words:[["быть","sein"],["есть","haben / es gibt"],["мочь","können"],["хотеть","wollen"],["знать","wissen / kennen"],["понимать","verstehen"],["говорить","sprechen"],["думать","denken"],["нужно","man muss / braucht"],["можно","man darf / kann"],["нельзя","man darf nicht"],["любить","lieben / mögen"]] },
    { title:"Tun und Bewegung", words:[["делать","machen"],["идти","gehen (zu Fuß, gerade)"],["ходить","gehen (regelmäßig)"],["ехать","fahren (gerade)"],["ездить","fahren (regelmäßig)"],["приходить","ankommen / kommen"],["уходить","weggehen"],["брать","nehmen"],["давать","geben"],["покупать","kaufen"],["открывать","öffnen"],["закрывать","schließen"]] },
    { title:"Alltagsverben und Konjugation", words:[["я читаю","ich lese"],["ты читаешь","du liest"],["он читает","er liest"],["мы читаем","wir lesen"],["вы читаете","ihr lest / Sie lesen"],["они читают","sie lesen"],["писать","schreiben"],["смотреть","schauen"],["слушать","zuhören"],["есть","essen"],["пить","trinken"],["ждать","warten"]] }
  ]},
  { n:16, title:"Russische Grammatik I", icon:"📚", color:"#2563EB", lessons:[
    { title:"Personalpronomen", words:[["я","ich"],["ты","du"],["он","er"],["она","sie"],["оно","es"],["мы","wir"],["вы","ihr / Sie"],["они","sie (Plural)"],["мой","mein"],["твой","dein"],["наш","unser"],["ваш","euer / Ihr"]] },
    { title:"Satzbau und Aussagen", words:[["это","das ist / dies"],["я студент","ich bin Student"],["она дома","sie ist zu Hause"],["мы друзья","wir sind Freunde"],["он читает","er liest"],["я знаю","ich weiß"],["новая книга","neues Buch"],["хороший день","guter Tag"],["очень","sehr"],["тоже","auch"],["и","und"],["но","aber"]] },
    { title:"Fragen und Verneinung", words:[["кто?","wer?"],["что?","was?"],["где?","wo?"],["куда?","wohin?"],["когда?","wann?"],["почему?","warum?"],["как?","wie?"],["ли","Fragepartikel"],["не","nicht"],["нет","nein / es gibt nicht"],["Это не дом.","Das ist kein Haus."],["Ты дома?","Bist du zu Hause?"]] }
  ]},
  { n:17, title:"Russische Fälle", icon:"🧩", color:"#BE123C", lessons:[
    { title:"Nominativ und Akkusativ", words:[["студент","Student (Nom.)"],["студента","Studenten (Akk.)"],["книга","Buch (Nom.)"],["книгу","Buch (Akk.)"],["Я читаю книгу.","Ich lese ein Buch."],["Он видит брата.","Er sieht den Bruder."],["кто?","wer? (Nominativ)"],["что?","was? (Nominativ / Akkusativ)"],["кого?","wen? (Akkusativ)"],["вода","Wasser (Nom.)"],["воду","Wasser (Akk.)"]], concept:"Der Nominativ benennt das Subjekt (wer oder was handelt?). Der Akkusativ bezeichnet häufig das direkte Objekt. Bei belebten männlichen Nomen ähnelt der Akkusativ oft dem Genitiv: студент → студента. Weibliche Wörter auf -а wechseln häufig zu -у: книга → книгу." },
    { title:"Genitiv und Dativ", words:[["нет брата","kein Bruder (Genitiv)"],["из города","aus der Stadt (Genitiv)"],["чашка чая","eine Tasse Tee (Genitiv)"],["без сахара","ohne Zucker (Genitiv)"],["брату","dem Bruder (Dativ)"],["маме","der Mutter (Dativ)"],["дать другу","einem Freund geben"],["помогать сестре","der Schwester helfen"],["кого? чего?","wessen? (Genitiv)"],["кому? чему?","wem? (Dativ)"],["у меня есть","ich habe (wörtlich: bei mir ist)"],["мне нужно","ich brauche / muss"]], concept:"Der Genitiv steht oft nach нет, без, из und für Zugehörigkeit oder Mengen. Der Dativ markiert Empfänger und Personen, denen etwas hilft oder gefällt: дать другу – einem Freund geben; мне нравится – mir gefällt." },
    { title:"Instrumental, Präpositiv und Wiederholung", words:[["с другом","mit einem Freund (Instrumental)"],["работать врачом","als Arzt arbeiten (Instrumental)"],["с книгой","mit einem Buch (Instrumental)"],["о Москве","über Moskau (Präpositiv)"],["в школе","in der Schule (Präpositiv)"],["на работе","bei der Arbeit (Präpositiv)"],["кем? чем?","mit wem? womit? (Instrumental)"],["о ком? о чём?","über wen? worüber? (Präpositiv)"],["город","Stadt (Nom.)"],["в городе","in der Stadt (Präp.)"],["стол","Tisch (Nom.)"],["на столе","auf dem Tisch (Präp.)"]], concept:"Der Instrumental steht oft nach с (mit), nach быть im Sinn von „als“ und bei bestimmten Verben. Der Präpositiv erscheint nach в/на für einen Ort und nach о/об für ein Thema. Endungen hängen von Geschlecht, Zahl und Belebtheit ab; lerne sie zuerst in häufigen Mustern." }
  ]},
  { n:18, title:"Vergangenheit & Zukunft", icon:"🕒", color:"#4F46E5", lessons:[
    { title:"Gegenwart", words:[["я работаю","ich arbeite"],["ты работаешь","du arbeitest"],["он работает","er arbeitet"],["мы работаем","wir arbeiten"],["вы работаете","ihr arbeitet / Sie arbeiten"],["они работают","sie arbeiten"],["сейчас читаю","ich lese gerade"],["каждый день","jeden Tag"],["говорить","sprechen"],["писать","schreiben"],["учиться","lernen"],["жить","leben"]] },
    { title:"Vergangenheit", words:[["я работал","ich arbeitete (m.)"],["я работала","ich arbeitete (f.)"],["он читал","er las"],["она читала","sie las"],["мы были","wir waren"],["они были","sie waren"],["вчера","gestern"],["недавно","kürzlich"],["уже","schon"],["ещё не","noch nicht"],["пришёл","kam (m.)"],["пришла","kam (f.)"]] },
    { title:"Zukunft und Zeitformen", words:[["буду читать","ich werde lesen"],["будешь работать","du wirst arbeiten"],["будет учиться","er/sie wird lernen"],["будем говорить","wir werden sprechen"],["завтра","morgen"],["на следующей неделе","nächste Woche"],["позже","später"],["скоро","bald"],["сделаю","ich werde erledigen"],["поедем","wir werden fahren"],["встречаться","sich treffen"],["планировать","planen"]] }
  ]},
  { n:19, title:"Wetter & Natur", icon:"🌍", color:"#16A34A", lessons:[
    { title:"Wetter und Temperaturen", words:[["погода","Wetter"],["солнце","Sonne"],["дождь","Regen"],["снег","Schnee"],["ветер","Wind"],["облако","Wolke"],["жарко","heiß (Wetter)"],["холодно","kalt"],["тепло","warm"],["идёт дождь","es regnet"],["градус","Grad"],["температура","Temperatur"]] },
    { title:"Jahreszeiten und Landschaft", words:[["весна","Frühling"],["лето","Sommer"],["осень","Herbst"],["зима","Winter"],["лес","Wald"],["гора","Berg"],["река","Fluss"],["озеро","See"],["море","Meer"],["земля","Erde / Land"],["небо","Himmel"],["природа","Natur"]] },
    { title:"Tiere, Pflanzen und Umwelt", words:[["собака","Hund"],["кошка","Katze"],["птица","Vogel"],["медведь","Bär"],["дерево","Baum"],["цветок","Blume"],["трава","Gras"],["лист","Blatt"],["защищать","schützen"],["чистый воздух","saubere Luft"],["окружающая среда","Umwelt"],["мусор","Müll"]] }
  ]},
  { n:20, title:"Gesundheit & Körper", icon:"🏥", color:"#DB2777", lessons:[
    { title:"Körper und Wohlbefinden", words:[["голова","Kopf"],["глаз","Auge"],["ухо","Ohr"],["нос","Nase"],["горло","Hals / Rachen"],["рука","Hand / Arm"],["нога","Bein / Fuß"],["спина","Rücken"],["сердце","Herz"],["болеть","weh tun / krank sein"],["здоровый","gesund"],["усталый","müde"]] },
    { title:"Beim Arzt", words:[["врач","Arzt"],["больница","Krankenhaus"],["приём","Sprechstunde"],["записаться","einen Termin vereinbaren"],["У меня болит голова.","Ich habe Kopfschmerzen."],["У меня температура.","Ich habe Fieber."],["кашель","Husten"],["насморк","Schnupfen"],["аллергия","Allergie"],["лекарство","Medikament"],["рецепт","Rezept"],["помогите","Helfen Sie!"]] },
    { title:"Apotheke und Behandlung", words:[["аптека","Apotheke"],["таблетка","Tablette"],["мазь","Salbe"],["витамины","Vitamine"],["принимать","einnehmen"],["два раза в день","zweimal täglich"],["до еды","vor dem Essen"],["после еды","nach dem Essen"],["боль","Schmerz"],["медицинская страховка","Krankenversicherung"],["вызвать скорую","einen Krankenwagen rufen"],["выздоравливать","genesen"]] }
  ]},
  { n:21, title:"Schule & Beruf", icon:"💼", color:"#0891B2", lessons:[
    { title:"Schule und Unterricht", words:[["школа","Schule"],["урок","Unterrichtsstunde"],["учитель","Lehrer"],["ученица","Schülerin"],["класс","Klasse / Klassenraum"],["домашнее задание","Hausaufgabe"],["экзамен","Prüfung"],["предмет","Schulfach"],["математика","Mathematik"],["история","Geschichte"],["язык","Sprache"],["оценка","Note / Bewertung"]] },
    { title:"Ausbildung und Berufe", words:[["университет","Universität"],["студент","Student"],["образование","Ausbildung / Bildung"],["профессия","Beruf"],["врач","Arzt"],["инженер","Ingenieur"],["программист","Programmierer"],["учёный","Wissenschaftler"],["опыт","Erfahrung"],["навык","Fähigkeit"],["диплом","Abschlusszeugnis"],["стажировка","Praktikum"]] },
    { title:"Arbeitsplatz und Bewerbung", words:[["работа","Arbeit / Stelle"],["офис","Büro"],["коллега","Kollege"],["начальник","Chef"],["зарплата","Gehalt"],["собеседование","Vorstellungsgespräch"],["резюме","Lebenslauf"],["вакансия","Stellenausschreibung"],["отправить заявку","Bewerbung senden"],["Я ищу работу.","Ich suche Arbeit."],["Я говорю по-немецки.","Ich spreche Deutsch."],["полный рабочий день","Vollzeit"]] }
  ]},
  { n:22, title:"Urlaub & Unterkunft", icon:"✈️", color:"#0284C7", lessons:[
    { title:"Reiseplanung und Flughafen", words:[["отпуск","Urlaub"],["путешествие","Reise"],["билет","Fahrkarte / Ticket"],["паспорт","Reisepass"],["аэропорт","Flughafen"],["самолёт","Flugzeug"],["рейс","Flug"],["багаж","Gepäck"],["регистрация","Check-in"],["посадка","Boarding"],["задержка","Verspätung"],["таможня","Zoll"]] },
    { title:"Hotel und Reservierung", words:[["гостиница","Hotel"],["номер","Zimmer / Nummer"],["бронирование","Reservierung"],["забронировать","reservieren"],["свободный номер","freies Zimmer"],["на одну ночь","für eine Nacht"],["завтрак включён","Frühstück inbegriffen"],["ключ-карта","Schlüsselkarte"],["ресепшен","Rezeption"],["выселиться","auschecken"],["полотенце","Handtuch"],["кондиционер","Klimaanlage"]] },
    { title:"Unterwegs und Reiseprobleme", words:[["поезд","Zug"],["автобус","Bus"],["метро","U-Bahn"],["такси","Taxi"],["остановка","Haltestelle"],["станция","Bahnhof / Station"],["Где находится вокзал?","Wo ist der Bahnhof?"],["Я потерял багаж.","Ich habe mein Gepäck verloren. (m.)"],["Мне нужна помощь.","Ich brauche Hilfe."],["Можно оплатить картой?","Kann ich mit Karte zahlen?"],["поверните направо","biegen Sie rechts ab"],["сколько стоит?","wie viel kostet es?"]] }
  ]}
];

function shuffleLearningItems(items) {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}

const ADVANCED_EXAMPLES = {
  13:[[["Это моя квартира.","Das ist meine Wohnung."],["На кухне стоит стол.","In der Küche steht ein Tisch."],["В спальне есть кровать.","Im Schlafzimmer gibt es ein Bett."]],[["Холодильник стоит рядом с плитой.","Der Kühlschrank steht neben dem Herd."],["Открой окно, пожалуйста.","Öffne bitte das Fenster."],["Где мой ключ?","Wo ist mein Schlüssel?"]],[["Я живу в светлой квартире.","Ich wohne in einer hellen Wohnung."],["Наша гостиная очень уютная.","Unser Wohnzimmer ist sehr gemütlich."],["Мы снимаем большой дом.","Wir mieten ein großes Haus."]]],
  14:[[["Сейчас семь часов утра.","Jetzt ist es sieben Uhr morgens."],["Вечером я читаю.","Abends lese ich."],["Завтра будет новый день.","Morgen wird ein neuer Tag sein."]],[["Сегодня понедельник.","Heute ist Montag."],["Летом мы отдыхаем в июле.","Im Sommer machen wir im Juli Urlaub."],["Мой день рождения в мае.","Mein Geburtstag ist im Mai."]],[["Я встаю рано каждый день.","Ich stehe jeden Tag früh auf."],["После работы мы ужинаем.","Nach der Arbeit essen wir zu Abend."],["Обычно я ложусь спать в одиннадцать.","Gewöhnlich gehe ich um elf schlafen."]]],
  15:[[["У меня есть время.","Ich habe Zeit."],["Я хочу говорить по-русски.","Ich möchte Russisch sprechen."],["Она может помочь нам.","Sie kann uns helfen."]],[["Мы идём домой пешком.","Wir gehen zu Fuß nach Hause."],["Он делает завтрак.","Er macht Frühstück."],["Я покупаю воду в магазине.","Ich kaufe Wasser im Geschäft."]],[["Я читаю, а ты пишешь.","Ich lese und du schreibst."],["Они смотрят новый фильм.","Sie schauen einen neuen Film."],["Ты хорошо понимаешь меня.","Du verstehst mich gut."]]],
  16:[[["Я студент, а она учитель.","Ich bin Student und sie ist Lehrerin."],["Мы друзья.","Wir sind Freunde."],["Это моя книга.","Das ist mein Buch."]],[["Сегодня хороший день.","Heute ist ein guter Tag."],["Мой брат читает книгу.","Mein Bruder liest ein Buch."],["Она тоже говорит по-русски.","Sie spricht auch Russisch."]],[["Где ты живёшь?","Wo wohnst du?"],["Я не знаю.","Ich weiß es nicht."],["Ты уже дома?","Bist du schon zu Hause?"]]],
  17:[[["Студент читает книгу.","Der Student liest ein Buch."],["Я вижу брата.","Ich sehe den Bruder."],["Она пьёт воду.","Sie trinkt Wasser."]],[["У меня нет сахара.","Ich habe keinen Zucker."],["Я даю книгу другу.","Ich gebe einem Freund ein Buch."],["Мы помогаем маме.","Wir helfen der Mutter."]],[["Он работает врачом.","Er arbeitet als Arzt."],["Мы говорим о Москве.","Wir sprechen über Moskau."],["Книга лежит на столе.","Das Buch liegt auf dem Tisch."]]],
  18:[[["Я работаю в офисе.","Ich arbeite im Büro."],["Они учатся каждый день.","Sie lernen jeden Tag."],["Ты хорошо говоришь.","Du sprichst gut."]],[["Вчера он читал дома.","Gestern las er zu Hause."],["Она была в школе.","Sie war in der Schule."],["Мы недавно приехали.","Wir sind kürzlich angekommen."]],[["Завтра я буду работать.","Morgen werde ich arbeiten."],["На следующей неделе мы поедем в Берлин.","Nächste Woche fahren wir nach Berlin."],["Вечером она будет читать.","Abends wird sie lesen."]]],
  19:[[["Сегодня идёт дождь.","Heute regnet es."],["Зимой здесь холодно.","Im Winter ist es hier kalt."],["На улице плюс десять градусов.","Draußen sind es plus zehn Grad."]],[["Летом мы отдыхаем у моря.","Im Sommer erholen wir uns am Meer."],["Рядом с домом есть лес.","Neben dem Haus gibt es einen Wald."],["Река проходит между горами.","Der Fluss verläuft zwischen den Bergen."]],[["В лесу живут медведи.","Im Wald leben Bären."],["Весной цветут цветы.","Im Frühling blühen Blumen."],["Мы защищаем окружающую среду.","Wir schützen die Umwelt."]]],
  20:[[["У меня болит спина.","Mein Rücken tut weh."],["Она здорова и полна сил.","Sie ist gesund und voller Energie."],["Мне нужно отдохнуть.","Ich muss mich ausruhen."]],[["Мне нужно записаться к врачу.","Ich muss einen Arzttermin vereinbaren."],["У ребёнка высокая температура.","Das Kind hat hohes Fieber."],["Доктор, у меня кашель.","Doktor, ich habe Husten."]],[["Эти таблетки нужно принимать после еды.","Diese Tabletten soll man nach dem Essen einnehmen."],["Аптека находится рядом.","Die Apotheke ist in der Nähe."],["Вызовите скорую помощь!","Rufen Sie den Krankenwagen!"]]],
  21:[[["У нас сегодня урок истории.","Wir haben heute Geschichtsunterricht."],["Учитель объясняет новое правило.","Der Lehrer erklärt eine neue Regel."],["Я готовлюсь к экзамену.","Ich bereite mich auf die Prüfung vor."]],[["Моя сестра учится в университете.","Meine Schwester studiert an der Universität."],["Он работает инженером.","Er arbeitet als Ingenieur."],["У неё большой опыт.","Sie hat viel Erfahrung."]],[["Я отправил резюме на вакансию.","Ich habe meinen Lebenslauf auf die Stelle geschickt."],["Завтра у меня собеседование.","Morgen habe ich ein Vorstellungsgespräch."],["Я ищу работу программистом.","Ich suche eine Stelle als Programmierer."]]],
  22:[[["Наш рейс задерживается.","Unser Flug hat Verspätung."],["Где выдача багажа?","Wo ist die Gepäckausgabe?"],["Покажите, пожалуйста, ваш паспорт.","Zeigen Sie bitte Ihren Reisepass."]],[["У меня забронирован номер на две ночи.","Ich habe ein Zimmer für zwei Nächte gebucht."],["Завтрак включён в стоимость.","Das Frühstück ist im Preis inbegriffen."],["Ключ-карта не работает.","Die Schlüsselkarte funktioniert nicht."]],[["Где находится ближайшая остановка?","Wo ist die nächste Haltestelle?"],["Можно оплатить картой?","Kann ich mit Karte bezahlen?"],["Я потерял багаж.","Ich habe mein Gepäck verloren."]]]
};

const ADVANCED_VOCAB_IDS = new Set();
const ADVANCED_CATEGORY_META = ADVANCED_UNIT_SPECS.map(spec => ({
  id:`unit_${spec.n}`, label:`Einheit ${spec.n}: ${spec.title}`, icon:spec.icon
}));
const VOCAB_ID_SET = new Set(VOCAB_DATA.map(vocab => vocab.id));
const VOCAB_RUSSIAN_LOOKUP = new Map(VOCAB_DATA.map(vocab => [vocab.russian.normalize("NFC").toLocaleLowerCase("ru-RU"),vocab.id]));
ADVANCED_CATEGORY_META.forEach(category => {
  if (!VOCAB_CATEGORIES.some(existing => existing.id === category.id)) VOCAB_CATEGORIES.push(category);
});
ADVANCED_UNIT_SPECS.forEach(spec => spec.lessons.forEach((lesson,lessonIndex) => {
  lesson.words.forEach(([russian,german],wordIndex) => {
    const id=`u${spec.n}_${lessonIndex}_${wordIndex}`;
    if (ADVANCED_VOCAB_IDS.has(id)) return;
    ADVANCED_VOCAB_IDS.add(id);
    const enrichment = window.ADVANCED_VOCAB_ENRICHMENTS?.[id] || [];
    VOCAB_DATA.push({ id, russian, german, translit:enrichment[0] || "", ipa:"", exampleRu:enrichment[1] || "", exampleDe:enrichment[2] || "", category:`unit_${spec.n}`, sourceUnit:spec.n, sourceLesson:lessonIndex });
  });
}));

function makeAdvancedLesson(unitNumber, lessonIndex, lessonSpec) {
  const lessonId = `lesson_${unitNumber}_${lessonIndex + 1}`;
  const exercises = [];
  const vocab = lessonSpec.words;
  const makeOptions = (idx, reverse = false) => {
    const correct = reverse ? vocab[idx][0] : vocab[idx][1];
    const distractors = vocab.filter((_, i) => i !== idx).map(row => reverse ? row[0] : row[1]);
    const unique = [...new Set([correct, ...distractors])];
    // Nearby items make useful distractors while keeping every answer unique.
    return shuffleLearningItems([correct, ...unique.filter(x => x !== correct).slice(0, 3)]);
  };
  vocab.forEach(([ru, de], idx) => {
    const ruToDe = makeOptions(idx);
    exercises.push({ id:`${lessonId}_ru_${idx}`, type:"choice_ru_de", learningItemId:`u${unitNumber}_${lessonIndex}_${idx}`, question:"Was bedeutet dieser russische Ausdruck?", audioText:ru, options:ruToDe, distractorPool:vocab.map(row=>row[1]), correctIndex:ruToDe.indexOf(de), explanation:`${ru} bedeutet „${de}“.`, difficulty:1 + Math.min(3, Math.floor(idx / 4)) });
    if (idx % 5 === 3) exercises.push({ id:`${lessonId}_free_${idx}`, type:"translation_input", learningItemId:`u${unitNumber}_${lessonIndex}_${idx}`, question:`Übersetze ins Russische: „${de}“`, audioText:ru, translationTarget:ru, explanation:`„${de}“ heißt auf Russisch ${ru}.`, difficulty:4 });
    if (idx % 2 === 0) {
      const deToRu = makeOptions(idx, true);
      exercises.push({ id:`${lessonId}_de_${idx}`, type:"choice_de_ru", learningItemId:`u${unitNumber}_${lessonIndex}_${idx}`, question:`Wie heißt „${de}“ auf Russisch?`, options:deToRu, distractorPool:vocab.map(row=>row[0]), correctIndex:deToRu.indexOf(ru), explanation:`„${de}“ heißt auf Russisch ${ru}.`, difficulty:2 + Math.min(2, Math.floor(idx / 5)) });
    }
  });
  for (let offset = 0; offset < vocab.length; offset += 4) {
    const part = vocab.slice(offset, offset + 4);
    if (part.length > 1) exercises.push({ id:`${lessonId}_match_${offset}`, type:"matching", learningItemId:`u${unitNumber}_${lessonIndex}_match_${offset}`, question:"Ordne die russischen Wörter ihren deutschen Bedeutungen zu:", pairs:part.map(([left,right])=>({left,right})), explanation:"Achte auf Wortstamm und Bedeutung." });
  }
  const builds = vocab.filter(([ru]) => ru.includes(" ") && ru.split(" ").length >= 3 && /[.!?]$/.test(ru));
  builds.forEach(([ru,de], idx) => {
    const words = ru.replace(/[.!?]$/,'').split(" ");
    exercises.push({ id:`${lessonId}_build_${idx}`, type:"sentence_build", learningItemId:`u${unitNumber}_${lessonIndex}_sentence_${idx}`, question:`Bringe die Wörter in die richtige Reihenfolge: „${de}“`, targetSentence:words.join(" "), words:[...words, vocab[(idx+2)%vocab.length][0]], explanation:`${ru} bedeutet „${de}“.`, difficulty:3 });
  });
  const examples=(ADVANCED_EXAMPLES[unitNumber]||[])[lessonIndex]||[];
  examples.forEach(([ru,de],idx)=>{
    exercises.push({id:`${lessonId}_sentence_${idx}`,type:"translation_input",learningItemId:`u${unitNumber}_${lessonIndex}_example_${idx}`,question:`Übersetze den ganzen Satz ins Russische: „${de}“`,audioText:ru,inputLanguage:"Russisch",translationTarget:ru,explanation:`${ru} = ${de}`,difficulty:4});
  });
  const sampleSentence = vocab.find(([ru]) => ru.includes(" ") && /[.!?]$/.test(ru));
  if (sampleSentence) {
    const [sentence, translation] = sampleSentence;
    const tokens = sentence.replace(/[.!?]$/, "").split(" ");
    if (tokens.length >= 3) {
      const blankAt = Math.floor(tokens.length / 2);
      const target = tokens[blankAt];
      const choices = shuffleLearningItems([...new Set([target, ...vocab.filter(([ru]) => ru !== sentence).map(([ru]) => ru.split(" ")[0])])].slice(0, 4));
      exercises.push({ id:`${lessonId}_cloze`, type:"cloze", learningItemId:`u${unitNumber}_${lessonIndex}_cloze`, question:`Ergänze den russischen Satz: ${tokens.map((w,i)=>i===blankAt?"_____":w).join(" ")}. („${translation}“ )`, audioText:sentence, options:choices, correctIndex:choices.indexOf(target), explanation:`${sentence} — ${translation}`, difficulty:3 });
    }
  }
  if (lessonSpec.concept) exercises.push({ id:`${lessonId}_grammar`, type:"choice_ru_de", learningItemId:`u${unitNumber}_${lessonIndex}_grammar`, question:"Welche Aussage passt zur Grammatikerklärung?", options:["Der Fall zeigt die Funktion eines Nomens im Satz.","Russisch verwendet keine Endungen.","Die Wortstellung ersetzt alle Formen.","Verben verändern sich nie."], correctIndex:0, explanation:lessonSpec.concept, difficulty:4 });
  const vocabEntries = vocab.map((_, wordIndex) => VOCAB_DATA.find(entry => entry.id === `u${unitNumber}_${lessonIndex}_${wordIndex}`)).filter(Boolean);
  return { id:lessonId, unitId:`unit_${unitNumber}`, title:lessonSpec.title, description:`Wortschatz, Beispiele und Übungen zu ${lessonSpec.title.toLowerCase()}.`, xpReward:55, theory:{title:lessonSpec.title, concept:lessonSpec.concept || `Lerne wichtige russische Wörter und wende sie in Alltagssituationen an. Achte auf Betonung, Wortform und den Zusammenhang des Satzes.`, points:vocab.map(([ru,de])=>`${ru} — ${de}`), vocabulary:vocabEntries, examples:examples.map(([ru,de])=>({ru,de})), tip:"Sprich jedes neue Wort laut mit. Bilde danach einen eigenen kurzen Satz und wiederhole schwierige Wörter morgen noch einmal."}, exercises };
}

ADVANCED_UNIT_SPECS.forEach(spec => {
  DEFAULT_COURSE_DATA.units.push({ id:`unit_${spec.n}`, number:spec.n, title:spec.title, subtitle:`Wortschatz, Erklärungen und Übungen: ${spec.lessons.map(x=>x.title).join(" · ")}`, color:spec.color, icon:spec.icon, lessons:spec.lessons.map((lesson,i)=>makeAdvancedLesson(spec.n,i,lesson)) });
});

// Local, durable skill and spaced-repetition records per vocabulary-item/task-type.
class AdaptiveLearningEngine {
  constructor() {
    this.key = "russisch_adaptive_learning_v1";
    try { this.data = JSON.parse(localStorage.getItem(this.key) || "{}"); } catch (_) { this.data = {}; }
    if (storage.userData.adaptiveLearning && typeof storage.userData.adaptiveLearning === "object") this.data = storage.userData.adaptiveLearning;
  }
  loadFromUserData() {
    this.data = storage.userData.adaptiveLearning && typeof storage.userData.adaptiveLearning === "object" ? storage.userData.adaptiveLearning : {};
  }
  keyFor(ex) { return `${ex.learningItemId || ex.id}::${ex.type}`; }
  get(ex) { return this.data[this.keyFor(ex)] || { mastery:0.25, correct:0, wrong:0, repetitions:0, interval:0, due:0, difficulty:ex.difficulty || 1, history:[] }; }
  reset() { this.data={}; try { localStorage.removeItem(this.key); } catch (_) {} }
  score(ex) {
    const s=this.get(ex); const due=s.due && s.due<=Date.now() ? 2 : 0;
    return 1 + Math.max(0, 1-s.mastery)*4 + (s.wrong/(s.repetitions+1))*2 + due + Math.max(0,(ex.difficulty||1)-s.mastery*4)*.08;
  }
  choose(exercises, limit=exercises.length) {
    const pool=[...exercises]; const picked=[]; const seen=new Set();
    // Weighted draw without replacement prioritizes due/weak material, but retains variation.
    while(pool.length && picked.length<limit) {
      const candidates=pool.filter(ex=>!seen.has(ex.learningItemId || ex.id));
      const source=candidates.length ? candidates : pool;
      const weights=source.map(ex=>this.score(ex)); const sum=weights.reduce((a,b)=>a+b,0);
      let roll=Math.random()*sum, idx=weights.findIndex(w=>(roll-=w)<=0); if(idx<0) idx=source.length-1;
      const ex=source[idx]; picked.push(ex); seen.add(ex.learningItemId || ex.id); pool.splice(pool.indexOf(ex),1);
    }
    return picked;
  }
  record(ex, correct) {
    const k=this.keyFor(ex), s=this.get(ex), now=Date.now();
    s.repetitions++; s.history.push({at:now, correct:!!correct, difficulty:ex.difficulty||1});
    if(s.history.length>40) s.history=s.history.slice(-40);
    if(correct) { s.correct++; s.mastery=Math.min(1,s.mastery + .08 + (ex.difficulty||1)*.018); s.interval=s.interval ? Math.min(60,Math.round(s.interval*2.1)) : 1; }
    else { s.wrong++; s.mastery=Math.max(0,s.mastery-.16); s.interval=0; }
    s.due=now + (correct ? s.interval*86400000 : 10*60000); s.lastReviewed=now; s.difficulty=ex.difficulty||1;
    this.data[k]=s;
    storage.userData.adaptiveLearning = this.data;
    if (!(window.accountSync?.user && !storage.demoMode)) {
      try { localStorage.setItem(this.key,JSON.stringify(this.data)); } catch(e) { console.warn("Adaptive progress could not be saved",e); }
    }
    storage.saveUserData();
    return s;
  }
  getSummary() { const rows=Object.values(this.data); const mastered=rows.filter(x=>x.mastery>=.8).length; const avgMastery=rows.reduce((a,x)=>a+x.mastery,0)/Math.max(1,rows.length); const weakest=Object.entries(this.data).filter(([,x])=>x.wrong>=2 && x.mastery<.45).sort((a,b)=>a[1].mastery-b[1].mastery).slice(0,5); const labels=new Map(VOCAB_DATA.map(vocab=>[vocab.id,vocab.russian])); DEFAULT_COURSE_DATA.units.forEach(unit=>(unit.lessons||[]).forEach(lesson=>(lesson.exercises||[]).forEach(ex=>labels.set(ex.learningItemId||ex.id,ex.audioText||ex.targetSentence||ex.question)))); const trend=rows.flatMap(item=>item.history||[]).sort((a,b)=>a.at-b.at).slice(-14); return {items:rows.length, mastered, difficult:rows.filter(x=>x.wrong>=2 && x.mastery<.45).length, difficultWords:weakest.map(([key])=>labels.get(key.split("::")[0])||key.split("::")[0]), attempts:rows.reduce((a,x)=>a+x.repetitions,0), correct:rows.reduce((a,x)=>a+x.correct,0), wrong:rows.reduce((a,x)=>a+x.wrong,0), avgMastery, trend, level:Math.max(1,Math.min(10,1+Math.floor(avgMastery*9)))}; }
}
window.adaptiveLearning = new AdaptiveLearningEngine();

// Wrap the existing quiz flow without replacing its interface or other exercise modes.
const installAdaptiveHooks = () => {
  if (!window.app || window.app._adaptiveHooksInstalled) return;
  window.app._adaptiveHooksInstalled = true;
  const originalStart = window.app.startQuiz;
  window.app.startQuiz = function(exercises, options={}) {
    const summary=window.adaptiveLearning.getSummary();
    const vocabLinked=exercises.map(source=>{
      const linkedId = source.learningItemId || source.learningQuestions?.[0]?.id?.match(/^vocab:(.+):/)?.[1] || source.id?.match(/^vocab:(.+):/)?.[1];
      const linkedVocab = VOCAB_DATA.find(item => item.id === linkedId);
      if(source.learningItemId) return linkedVocab ? {...source,vocabularyInfo:linkedVocab} : source;
      const candidates=[source.audioText,source.correctIndex!==undefined?source.options?.[source.correctIndex]:null,source.targetSentence];
      const match=candidates.map(value=>typeof value==="string"?value.split(" (")[0].trim().normalize("NFC").toLocaleLowerCase("ru-RU"):"").map(value=>VOCAB_RUSSIAN_LOOKUP.get(value)).find(Boolean);
      const vocab=match?VOCAB_DATA.find(item=>item.id===match):linkedVocab;
      return vocab?{...source,learningItemId:match||vocab.id,vocabularyInfo:vocab}:source;
    });
    const scheduled=window.adaptiveLearning.choose(vocabLinked).map(source => {
      const ex={...source};
      // As the learner becomes more secure, some recognition tasks become typed recall.
      const mastery=Math.max(window.adaptiveLearning.get(ex).mastery,window.adaptiveLearning.get({...ex,type:"translation_input"}).mastery);
      if(ex.distractorPool && ex.options && mastery>=.45) {
        const correct=ex.options[ex.correctIndex];
        const distractors=shuffleLearningItems(ex.distractorPool.filter(answer=>answer!==correct));
        ex.options=shuffleLearningItems([correct,...distractors.slice(0,3)]);
        ex.correctIndex=ex.options.indexOf(correct);
      }
      const freeRecallRate=Math.max(0,Math.min(.55,(summary.avgMastery-.42)*.8));
      if(["choice_de_ru","choice_ru_de"].includes(ex.type) && mastery>=.5 && Math.random()<freeRecallRate) {
        const sourceType=ex.type;
        ex.type="translation_input";
        ex.translationTarget=ex.options[ex.correctIndex].split(" (")[0];
        ex.inputLanguage=sourceType==="choice_ru_de" ? "Deutsch" : "Russisch";
        if(sourceType==="choice_ru_de") ex.question=`Übersetze ins Deutsche: „${ex.audioText}“`;
        else ex.audioText=undefined;
        ex.explanation=`Richtig: ${ex.translationTarget}. ${ex.explanation || ""}`;
      }
      return ex;
    });
    this._adaptiveCurrent=null;
    return originalStart.call(this, scheduled, options);
  };
  const originalCheck = window.app.handleQuizCheck;
  window.app.handleQuizCheck = function() {
    const q=this.currentQuiz; const before=q && q.currentIndex; const already=q && q.isAnswerChecked;
    const result=originalCheck.call(this);
    if(q && !already && q.currentIndex===before && q.isAnswerChecked) {
      const ex=q.exercises[q.currentIndex];
      let correct=false;
      if(["choice_ru_de","choice_de_ru","listening","letter_sound","cloze"].includes(ex.type)) correct=q.selectedAnswer===ex.correctIndex;
      else if(ex.type==="translation_input") correct=(q.selectedAnswer||"").normalize('NFC').replace(/[.,?!]/g,"").replace(/ё/g,"е").replace(/\s+/g," ").trim().toLocaleLowerCase('ru-RU')===(ex.translationTarget||"").normalize('NFC').replace(/[.,?!]/g,"").replace(/ё/g,"е").replace(/\s+/g," ").trim().toLocaleLowerCase('ru-RU');
      else if(ex.type==="matching") correct=q.selectedAnswer===true;
      else if(ex.type==="sentence_build") correct=(q.selectedAnswer||"").replace(/[.,?!]/g,"").replace(/\s+/g," ").trim().toLowerCase()===(ex.targetSentence||"").replace(/[.,?!]/g,"").replace(/\s+/g," ").trim().toLowerCase();
      window.adaptiveLearning.record(ex,correct);
      if (ex.learningItemId && VOCAB_ID_SET.has(ex.learningItemId)) storage.markVocabLearned(ex.learningItemId,correct);
    }
    return result;
  };
  const originalProfile=window.app.renderProfile;
  window.app.renderProfile=function() {
    const result=originalProfile.call(this);
    const summary=window.adaptiveLearning.getSummary();
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
    set("adaptiveMastered",summary.mastered);
    set("adaptiveAttempts",summary.attempts);
    set("adaptiveAccuracy",summary.attempts ? `${Math.round(summary.correct/summary.attempts*100)}%` : "—");
    set("adaptiveCorrect",summary.correct);
    set("adaptiveWrong",summary.wrong);
    set("adaptiveLevel",summary.level);
    const legacyLearned=Object.values(storage.userData.learnedVocab||{}).filter(item=>item.learned).length;
    const masteredNewWords=new Set(Object.entries(window.adaptiveLearning.data).filter(([key,item])=>item.mastery>=.8 && /^u(?:1[3-9]|2[0-2])_\d+_\d+::/.test(key)).map(([key])=>key.split("::")[0])).size;
    set("statLearnedVocab",legacyLearned+masteredNewWords);
    const trend=document.getElementById("adaptiveTrend");
    if(trend) {
      trend.replaceChildren();
      trend.setAttribute("aria-label",summary.trend.length ? `${summary.trend.filter(x=>x.correct).length} richtige von ${summary.trend.length} letzten Antworten` : "Noch keine Antwortdaten");
      summary.trend.forEach((item,index)=>{const bar=document.createElement("span");bar.className=item.correct?"trend-correct":"trend-wrong";bar.style.height=item.correct?"88%":"34%";bar.title=`Antwort ${index+1}: ${item.correct?"richtig":"falsch"}`;trend.appendChild(bar);});
    }
    const note=document.getElementById("adaptiveReviewNote");
    if(note) note.textContent=summary.difficult ? `${summary.difficult} schwierige Einträge werden bevorzugt wiederholt${summary.difficultWords.length ? `: ${summary.difficultWords.join(", ")}` : ""}. Jede Wort-Aufgabentyp-Kombination wird getrennt gespeichert.` : "Wörter und Aufgabentypen werden getrennt bewertet und passend zum Wiederholungszeitpunkt eingeplant.";
    return result;
  };
  const originalPath=window.app.renderLearningPath;
  if (typeof originalPath === "function") {
    window.app.renderLearningPath=function() {
      const result=originalPath.call(this);
      const units=storage.getCourseData().units;
      const banners=document.querySelectorAll("#learningPathContainer .unit-banner");
      banners.forEach((banner,index)=>{
        const unit=units[index]; if(!unit) return;
        const done=(unit.lessons||[]).filter(lesson=>storage.isLessonCompleted(lesson.id)).length;
        const total=(unit.lessons||[]).length;
        const summary=document.createElement("div"); summary.className="unit-progress-label";
        summary.textContent=`${done} von ${total} Lektionen abgeschlossen`;
        banner.appendChild(summary);
      });
      return result;
    };
    window.app.renderLearningPath();
  }
  window.app.renderVocabCategories();
  window.app.renderVocabList();
  const originalReset=storage.resetAllProgress;
  storage.resetAllProgress=function() { const result=originalReset.call(this); window.adaptiveLearning.reset(); this.userData.adaptiveLearning={}; this.saveUserData(); return result; };
  // The base app renders on construction, before this additive file loads.
  window.app.renderProfile();
};
if (window.app) installAdaptiveHooks();
else document.addEventListener("DOMContentLoaded", installAdaptiveHooks, { once:true });

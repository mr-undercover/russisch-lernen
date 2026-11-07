// Speicherverwaltung (localStorage), Gamification, XP-Shop & Fortschritts-Logik
const STORAGE_KEYS = {
  USER_DATA: 'russisch_user_progress_v1',
  COURSE_DATA: 'russisch_course_data_v1',
  CUSTOM_VOCAB: 'russisch_custom_vocab_v1',
  CUSTOM_CATEGORIES: 'russisch_custom_categories_v1'
};

const DEFAULT_USER_DATA = {
  xp: 0,
  todayXp: 0,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegen: Date.now(),
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  completedLessons: {}, // { lessonId: { completed: true, score: 100, completedAt: '...' } }
  unlockedLessons: ['lesson_1_1'],
  learnedVocab: {}, // { vocabId: { learned: true, repetitions: 1, mistakes: 0, lastReview: '...' } }
  learnedAlphabet: {}, // { letterId: { score: 1, mastered: false } }
  favoriteVocab: [],
  inventory: {
    streakFreezes: 0,
    shieldActive: false,
    activeBoosterUntil: 0,
    unlockedTitles: ["Novize (Новичок)"],
    activeTitle: "Novize (Новичок)"
  },
  settings: {
    soundEffects: true,
    speechAudio: true,
    speechRate: 0.85,
    dailyGoalXP: 200, // Ausbalanciert auf ca. 12-15 Minuten echtes Lernen!
    darkMode: false
  },
  stats: {
    totalExercisesSolved: 0,
    totalPracticeTimeSeconds: 0,
    perfectLessonsCount: 0,
    itemsBoughtCount: 0
  },
  achievements: []
};

// 20 motivierende Errungenschaften
const ACHIEVEMENTS_LIST = [
  { id: "first_lesson", title: "Erster Schritt", desc: "Schließe deine allererste Lektion ab", icon: "🌱" },
  { id: "perfect_lesson", title: "Perfektionist", desc: "Beende eine Lektion ohne einen einzigen Fehler", icon: "⭐" },
  { id: "streak_3", title: "3-Tage-Flamme", desc: "Lerne an 3 aufeinanderfolgenden Tagen", icon: "🔥" },
  { id: "streak_7", title: "Wochen-Champion", desc: "Erreiche einen 7-Tage-Streak", icon: "🏆" },
  { id: "streak_14", title: "14-Tage-Titan", desc: "Halte 2 volle Wochen am Stück durch", icon: "⚡" },
  { id: "streak_30", title: "30-Tage-Legende", desc: "Ein ganzer Monat tägliches Russischlernen!", icon: "👑" },
  { id: "vocab_10", title: "Wortsammler", desc: "Lerne deine ersten 10 Vokabeln", icon: "📖" },
  { id: "vocab_50", title: "Wortschatz-Meister", desc: "Beherrsche 50 russische Vokabeln", icon: "🧠" },
  { id: "vocab_100", title: "Wort-Gigant", desc: "Meistere 100 russische Vokabeln", icon: "📚" },
  { id: "vocab_150", title: "Wort-Titan", desc: "Beherrsche stolze 150 russische Wörter", icon: "🏛️" },
  { id: "alphabet_master", title: "Kyrillisch-Profi", desc: "Trainiere alle 33 Buchstaben des Alphabets", icon: "🔤" },
  { id: "letter_grandmaster", title: "Buchstaben-Großmeister", desc: "Schließe alle Stufen des Buchstabentrainings ab", icon: "🎓" },
  { id: "daily_goal", title: "Zielstrebig", desc: "Erreiche dein tägliches XP-Lernziel (ca. 10-15 Min)", icon: "🎯" },
  { id: "motorsport_fan", title: "Motorsport-Rennfahrer", desc: "Schließe Einheit über Rennsport ab", icon: "🏎️" },
  { id: "slang_master", title: "Straßen-Kenner", desc: "Meistere die Einheit über echten russischen Slang", icon: "🕶️" },
  { id: "heart_healer", title: "Unverwüstlich", desc: "Fülle verlorene Herzen durch Wiederholen auf", icon: "❤️" },
  { id: "shop_buyer", title: "Kaufrausch", desc: "Kaufe dein erstes Upgrade im XP-Belohnungsshop", icon: "🛍️" },
  { id: "night_owl", title: "Nachteule", desc: "Lerne zu später Stunde nach 22:00 Uhr", icon: "🦉" },
  { id: "early_bird", title: "Frühaufsteher", desc: "Lerne vor 08:00 Uhr morgens", icon: "🌅" },
  { id: "custom_category", title: "Kategorie-Schöpfer", desc: "Erstelle deine eigene Vokabel-Kategorie", icon: "💡" }
];

class StorageManager {
  constructor() {
    this.userData = this.loadUserData();
    this.checkDayReset();
    this.applySettingsToApp();
  }

  loadUserData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_USER_DATA,
          ...parsed,
          inventory: { ...DEFAULT_USER_DATA.inventory, ...(parsed.inventory || {}) },
          settings: { ...DEFAULT_USER_DATA.settings, ...(parsed.settings || {}) },
          stats: { ...DEFAULT_USER_DATA.stats, ...(parsed.stats || {}) }
        };
      }
    } catch (e) {
      console.error("Error loading user data from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
  }

  saveUserData() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  }

  getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  checkDayReset() {
    const today = this.getTodayString();
    if (this.userData.lastActiveDate !== today) {
      this.userData.todayXp = 0;
      if (this.userData.hearts < this.userData.maxHearts) {
        this.userData.hearts = this.userData.maxHearts;
      }
      this.saveUserData();
    }
  }

  isBoosterActive() {
    return (this.userData.inventory?.activeBoosterUntil || 0) > Date.now();
  }

  getBoosterRemainingMinutes() {
    if (!this.isBoosterActive()) return 0;
    return Math.ceil((this.userData.inventory.activeBoosterUntil - Date.now()) / (60 * 1000));
  }

  recordActivity() {
    const today = this.getTodayString();
    const last = this.userData.lastActiveDate;

    // Zeitbasierte Erfolge
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) this.unlockAchievement("night_owl");
    if (hour >= 5 && hour < 8) this.unlockAchievement("early_bird");

    if (!last) {
      this.userData.streak = 1;
      this.userData.longestStreak = 1;
    } else if (last === today) {
      // Bereits heute gelernt
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yYear = yesterday.getFullYear();
      const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
      const yDay = String(yesterday.getDate()).padStart(2, '0');
      const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

      if (last === yesterdayStr) {
        this.userData.streak += 1;
        if (this.userData.streak > this.userData.longestStreak) {
          this.userData.longestStreak = this.userData.streak;
        }
      } else {
        // Tag verpasst! Prüfe Streak-Freeze aus dem Inventar
        if ((this.userData.inventory?.streakFreezes || 0) > 0) {
          this.userData.inventory.streakFreezes -= 1;
          this.userData.streak += 1; // Streak gerettet!
          if (window.app) window.app.showToast("🧊 Streak-Freeze eingesetzt! Dein Streak wurde gerettet.", "🛡️");
        } else {
          this.userData.streak = 1;
        }
      }
    }

    this.userData.lastActiveDate = today;

    // Streak-Erfolge prüfen
    if (this.userData.streak >= 3) this.unlockAchievement("streak_3");
    if (this.userData.streak >= 7) this.unlockAchievement("streak_7");
    if (this.userData.streak >= 14) this.unlockAchievement("streak_14");
    if (this.userData.streak >= 30) this.unlockAchievement("streak_30");

    this.saveUserData();
  }

  addXp(baseAmount) {
    let finalAmount = baseAmount;
    if (this.isBoosterActive()) {
      finalAmount = baseAmount * 2;
    }

    this.userData.xp += finalAmount;
    this.userData.todayXp = (this.userData.todayXp || 0) + finalAmount;
    this.userData.stats.totalExercisesSolved = (this.userData.stats.totalExercisesSolved || 0) + 1;
    this.recordActivity();

    // Tagesziel erreicht?
    if (this.userData.todayXp >= this.userData.settings.dailyGoalXP) {
      this.unlockAchievement("daily_goal");
    }

    this.saveUserData();
    return { earned: finalAmount, isBoosted: this.isBoosterActive() };
  }

  loseHeart() {
    // Prüfe Herz-Schutzschild
    if (this.userData.inventory?.shieldActive) {
      this.userData.inventory.shieldActive = false;
      this.saveUserData();
      if (window.app) window.app.showToast("🛡️ Schutzschild aktiviert! Herzverlust abgewendet.", "✨");
      if (window.sfx) window.sfx.playCorrect();
      return this.userData.hearts;
    }

    if (this.userData.hearts > 0) {
      this.userData.hearts -= 1;
      this.userData.lastHeartRegen = Date.now();
      this.saveUserData();
    }
    return this.userData.hearts;
  }

  refillHearts(amount = 5) {
    this.userData.hearts = Math.min(this.userData.maxHearts, this.userData.hearts + amount);
    this.saveUserData();
    this.unlockAchievement("heart_healer");
    return this.userData.hearts;
  }

  completeLesson(lessonId, score = 100, isPerfect = false) {
    const completedAt = new Date().toISOString();
    this.userData.completedLessons[lessonId] = {
      completed: true,
      score,
      completedAt
    };

    if (isPerfect) {
      this.userData.stats.perfectLessonsCount = (this.userData.stats.perfectLessonsCount || 0) + 1;
      this.unlockAchievement("perfect_lesson");
    }

    this.unlockAchievement("first_lesson");

    if (lessonId.startsWith("lesson_13_") || lessonId.includes("motor")) {
      this.unlockAchievement("motorsport_fan");
    }
    if (lessonId.startsWith("lesson_16_") || lessonId.includes("slang")) {
      this.unlockAchievement("slang_master");
    }
    if (lessonId.startsWith("lesson_6_") && lessonId.includes("exam")) {
      this.unlockAchievement("letter_grandmaster");
    }

    this.unlockNextLesson(lessonId);
    this.saveUserData();
  }

  unlockNextLesson(currentLessonId) {
    const courseData = this.getCourseData();
    let allLessonIds = [];
    courseData.units.forEach(unit => {
      (unit.lessons || []).forEach(les => {
        allLessonIds.push(les.id);
      });
    });

    const currIdx = allLessonIds.indexOf(currentLessonId);
    if (currIdx !== -1 && currIdx < allLessonIds.length - 1) {
      const nextId = allLessonIds[currIdx + 1];
      if (!this.userData.unlockedLessons.includes(nextId)) {
        this.userData.unlockedLessons.push(nextId);
      }
    }
  }

  isLessonUnlocked(lessonId) {
    if (lessonId === 'lesson_1_1') return true;
    return this.userData.unlockedLessons.includes(lessonId) || !!this.userData.completedLessons[lessonId];
  }

  isLessonCompleted(lessonId) {
    return !!this.userData.completedLessons[lessonId];
  }

  // XP-Belohnungsshop Kaufen
  buyShopItem(itemId, cost) {
    if (this.userData.xp < cost) {
      return { success: false, reason: "Nicht genügend XP vorhanden!" };
    }

    this.userData.xp -= cost;
    this.userData.stats.itemsBoughtCount = (this.userData.stats.itemsBoughtCount || 0) + 1;
    this.unlockAchievement("shop_buyer");

    if (itemId === 'shield') {
      this.userData.inventory.shieldActive = true;
    } else if (itemId === 'freeze') {
      this.userData.inventory.streakFreezes = (this.userData.inventory.streakFreezes || 0) + 1;
    } else if (itemId === 'booster') {
      this.userData.inventory.activeBoosterUntil = Date.now() + 15 * 60 * 1000; // 15 Minuten
    } else if (itemId === 'hearts_refill') {
      this.userData.hearts = this.userData.maxHearts;
    } else if (itemId.startsWith('title_')) {
      const titleName = itemId.replace('title_', '');
      if (!this.userData.inventory.unlockedTitles.includes(titleName)) {
        this.userData.inventory.unlockedTitles.push(titleName);
      }
      this.userData.inventory.activeTitle = titleName;
    }

    this.saveUserData();
    return { success: true };
  }

  setActiveTitle(titleName) {
    if (this.userData.inventory.unlockedTitles.includes(titleName)) {
      this.userData.inventory.activeTitle = titleName;
      this.saveUserData();
    }
  }

  // Vokabel-Lernstatus
  markVocabLearned(vocabId, success = true) {
    if (!this.userData.learnedVocab[vocabId]) {
      this.userData.learnedVocab[vocabId] = {
        learned: false,
        repetitions: 0,
        mistakes: 0,
        lastReview: new Date().toISOString()
      };
    }
    const item = this.userData.learnedVocab[vocabId];
    item.lastReview = new Date().toISOString();
    item.repetitions += 1;
    if (success) {
      item.learned = true;
    } else {
      item.mistakes += 1;
    }

    const learnedCount = Object.values(this.userData.learnedVocab).filter(v => v.learned).length;
    if (learnedCount >= 10) this.unlockAchievement("vocab_10");
    if (learnedCount >= 50) this.unlockAchievement("vocab_50");
    if (learnedCount >= 100) this.unlockAchievement("vocab_100");
    if (learnedCount >= 150) this.unlockAchievement("vocab_150");

    this.saveUserData();
  }

  toggleFavorite(vocabId) {
    const idx = this.userData.favoriteVocab.indexOf(vocabId);
    if (idx === -1) {
      this.userData.favoriteVocab.push(vocabId);
    } else {
      this.userData.favoriteVocab.splice(idx, 1);
    }
    this.saveUserData();
    return this.userData.favoriteVocab.includes(vocabId);
  }

  isFavorite(vocabId) {
    return this.userData.favoriteVocab.includes(vocabId);
  }

  // Alphabet-Fortschritt
  updateAlphabetProgress(letterId, success = true) {
    if (!this.userData.learnedAlphabet[letterId]) {
      this.userData.learnedAlphabet[letterId] = { score: 0, mastered: false };
    }
    const item = this.userData.learnedAlphabet[letterId];
    if (success) {
      item.score = Math.min(5, (item.score || 0) + 1);
      if (item.score >= 3) item.mastered = true;
    } else {
      item.score = Math.max(0, (item.score || 0) - 1);
    }

    const masteredCount = Object.values(this.userData.learnedAlphabet).filter(a => a.mastered).length;
    if (masteredCount >= 33) {
      this.unlockAchievement("alphabet_master");
    }

    this.saveUserData();
  }

  unlockAchievement(achId) {
    if (!this.userData.achievements.includes(achId)) {
      this.userData.achievements.push(achId);
      this.saveUserData();
      if (window.showAchievementToast) {
        const ach = ACHIEVEMENTS_LIST.find(a => a.id === achId);
        if (ach) window.showAchievementToast(ach);
      }
    }
  }

  getUserLevel() {
    const xp = this.userData.xp;
    if (xp < 150) return { level: 1, title: this.userData.inventory.activeTitle || "Novize (Новичок)", nextXp: 150, minXp: 0 };
    if (xp < 400) return { level: 2, title: this.userData.inventory.activeTitle || "Entdecker (Исследователь)", nextXp: 400, minXp: 150 };
    if (xp < 800) return { level: 3, title: this.userData.inventory.activeTitle || "Wortfinder (Искатель)", nextXp: 800, minXp: 400 };
    if (xp < 1400) return { level: 4, title: this.userData.inventory.activeTitle || "Kenner (Знаток)", nextXp: 1400, minXp: 800 };
    if (xp < 2200) return { level: 5, title: this.userData.inventory.activeTitle || "Straßen-Kenner (Уличный Эксперт)", nextXp: 2200, minXp: 1400 };
    if (xp < 3200) return { level: 6, title: this.userData.inventory.activeTitle || "Meister (Мастер)", nextXp: 3200, minXp: 2200 };
    return { level: 7, title: this.userData.inventory.activeTitle || "Zarengrad (Царь Русского Языка)", nextXp: 6000, minXp: 3200 };
  }

  applySettingsToApp() {
    if (window.sfx) {
      window.sfx.enabled = this.userData.settings.soundEffects;
    }
    if (window.speech) {
      window.speech.enabled = this.userData.settings.speechAudio;
      window.speech.rate = this.userData.settings.speechRate || 0.85;
    }
    if (this.userData.settings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  updateSettings(newSettings) {
    this.userData.settings = { ...this.userData.settings, ...newSettings };
    this.applySettingsToApp();
    this.saveUserData();
  }

  resetAllProgress() {
    this.userData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
    this.userData.unlockedLessons = ['lesson_1_1'];
    this.saveUserData();
    this.applySettingsToApp();
  }

  // --- Eigene Kategorien ---
  getCustomCategories() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading custom categories:", e);
    }
    return [];
  }

  addCustomCategory(label, icon = "📁") {
    const categories = this.getCustomCategories();
    const id = `cat_${Date.now()}`;
    const newCat = { id, label, icon };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
    this.unlockAchievement("custom_category");
    return newCat;
  }

  getAllCategories() {
    const custom = this.getCustomCategories();
    return [...VOCAB_CATEGORIES, ...custom];
  }

  // --- Kursinhalte (CMS) ---
  getCourseData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COURSE_DATA);
      if (stored) {
        const data = JSON.parse(stored);
        if (!data || !Array.isArray(data.units)) return DEFAULT_COURSE_DATA;
        const known = new Set(data.units.map(unit => unit.id));
        // Merge newly shipped lessons into existing CMS data without replacing user edits.
        DEFAULT_COURSE_DATA.units.forEach(unit => {
          if (!known.has(unit.id)) data.units.push(unit);
        });
        return data;
      }
    } catch (e) {
      console.error("Error reading stored course data:", e);
    }
    return DEFAULT_COURSE_DATA;
  }

  saveCourseData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSE_DATA, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Error saving course data:", e);
      return false;
    }
  }

  resetCourseDataToDefault() {
    localStorage.removeItem(STORAGE_KEYS.COURSE_DATA);
    return DEFAULT_COURSE_DATA;
  }

  getCustomVocab() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_VOCAB);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading custom vocab:", e);
    }
    return [];
  }

  saveCustomVocab(vocabList) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(vocabList));
  }

  getAllVocab() {
    const custom = this.getCustomVocab();
    // IDs are the stable key across imports and built-in course additions.
    return [...new Map([...VOCAB_DATA, ...custom].map(vocab => [vocab.id, vocab])).values()];
  }
}

const storage = new StorageManager();

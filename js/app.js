// Russisch Lernen - Haupt-Applikationslogik & UI-Controller
function makeDistinctAnswerOptions(correct, pool, count = 4) {
  const normalize = value => String(value).normalize('NFC').trim().toLocaleLowerCase();
  const choices = [correct];
  const seen = new Set([normalize(correct)]);
  for (const value of [...pool].sort(() => Math.random() - 0.5)) {
    const key = normalize(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    choices.push(value);
    if (choices.length >= count) break;
  }
  return choices.sort(() => Math.random() - 0.5);
}

class AppController {
  constructor() {
    this.currentView = 'learn';
    this.activeLesson = null;
    this.currentQuiz = null;
    this.flashcards = [];
    this.currentFlashcardIdx = 0;
    this.currentAlphabetFilter = 'all';
    this.currentVocabCategory = 'all';
    this.onlyFavorites = false;

    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupAlphabetTrainer();
    this.setupVocabTrainer();
    this.setupPracticeCenter();
    this.setupProfileAndSettings();
    this.setupCourseEditor();
    this.setupModals();
    this.renderAll();

    // Begrüßung basierend auf Tageszeit
    this.updateGreeting();

    // Prüfe Sprachausgabe nach kurzer Ladezeit
    setTimeout(() => {
      if (window.speech && !window.speech.hasRussianVoice) {
        console.log("Hinweis: Kein russisches Sprachpaket ru-RU im Browser gefunden. Deutsche Lautschrift hilft!");
      }
    }, 1500);
  }

  // =========================================================================
  // 1. NAVIGATION & HEADER
  // =========================================================================
  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchView(targetTab);
        if (window.sfx) window.sfx.playClick();
      });
    });

    // "Weiterlernen" Quick Button auf dem Dashboard
    const btnContinue = document.getElementById('btnContinueLearning');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        this.startNextRecommendedLesson();
      });
    }
  }

  switchView(tabId) {
    this.currentView = tabId;

    // Nav-Buttons aktualisieren
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Views umschalten
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`view-${tabId}`);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // View-spezifische Updates
    if (tabId === 'learn') this.renderLearningPath();
    if (tabId === 'alphabet') this.renderAlphabetGrid();
    if (tabId === 'vocab') this.renderVocabList();
    if (tabId === 'profile') this.renderProfile();
  }

  updateHeaderStats() {
    const streakVal = document.getElementById('headerStreakVal');
    const xpVal = document.getElementById('headerXpVal');
    const heartsVal = document.getElementById('headerHeartsVal');

    if (streakVal) streakVal.textContent = storage.userData.streak;
    if (xpVal) {
      if (storage.isBoosterActive()) {
        xpVal.innerHTML = `${storage.userData.xp} <span style="font-size: 0.75em; color: #F59E0B; font-weight: 800;">(2x!)</span>`;
      } else {
        xpVal.textContent = storage.userData.xp;
      }
    }
    if (heartsVal) heartsVal.textContent = storage.userData.hearts;

    // Daily Goal im Dashboard (ca. 10-15 Min Lernzeit bei 200 XP Standard)
    const dailyGoalBar = document.getElementById('dailyGoalBar');
    const dailyGoalText = document.getElementById('dailyGoalText');
    const targetGoal = storage.userData.settings.dailyGoalXP || 200;
    const currentTodayXp = storage.userData.todayXp || 0;

    if (dailyGoalText) {
      dailyGoalText.textContent = `${currentTodayXp} / ${targetGoal} XP`;
    }
    if (dailyGoalBar) {
      const pct = Math.min(100, Math.round((currentTodayXp / targetGoal) * 100));
      dailyGoalBar.style.width = `${pct}%`;
    }
  }

  updateGreeting() {
    const greetingEl = document.getElementById('welcomeGreeting');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    const userTitle = storage.userData.inventory?.activeTitle ? storage.userData.inventory.activeTitle.split(' ')[0] : 'Lerner';
    let msg = `Привет, ${userTitle}!`;
    if (hour >= 5 && hour < 12) msg = `Доброе утро, ${userTitle}! (Guten Morgen)`;
    else if (hour >= 12 && hour < 18) msg = `Добрый день, ${userTitle}! (Guten Tag)`;
    else msg = `Добрый вечер, ${userTitle}! (Guten Abend)`;
    greetingEl.textContent = msg;
  }

  renderAll() {
    this.updateHeaderStats();
    this.renderLearningPath();
    this.renderAlphabetGrid();
    this.renderVocabList();
    this.renderProfile();
  }

  // =========================================================================
  // 2. LERNPFAD (Winding Duolingo Path)
  // =========================================================================
  renderLearningPath() {
    const container = document.getElementById('learningPathContainer');
    if (!container) return;

    const courseData = storage.getCourseData();
    container.innerHTML = '';

    courseData.units.forEach((unit, unitIdx) => {
      // 1. Einheiten-Banner
      const unitBanner = document.createElement('div');
      unitBanner.className = 'unit-banner';
      unitBanner.style.setProperty('--unit-color', unit.color || '#4F46E5');
      unitBanner.innerHTML = `
        <div class="unit-info">
          <h2><span>${unit.icon || '📖'}</span> Einheit ${unit.number || (unitIdx + 1)}: ${unit.title}</h2>
          <p>${unit.subtitle || ''}</p>
        </div>
        <div class="unit-badge">${unit.icon || '⭐'}</div>
      `;
      container.appendChild(unitBanner);

      // 2. Lektionen-Track (Zickzack)
      const track = document.createElement('div');
      track.className = 'lessons-track';

      (unit.lessons || []).forEach((lesson, lesIdx) => {
        const isUnlocked = storage.isLessonUnlocked(lesson.id);
        const isCompleted = storage.isLessonCompleted(lesson.id);
        const isCurrentActive = isUnlocked && !isCompleted;

        const wrapper = document.createElement('div');
        wrapper.className = 'lesson-node-wrapper';

        const btn = document.createElement('button');
        btn.className = `lesson-node-btn ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''} ${isCurrentActive ? 'active-pulse' : ''}`;
        btn.style.setProperty('--node-color', unit.color || '#4F46E5');

        let iconContent = isCompleted ? '✓' : (isUnlocked ? '★' : '🔒');
        btn.innerHTML = `<span class="node-icon">${iconContent}</span>`;
        const manuallyUnlocked = (storage.userData.manualUnlocks || []).includes(lesson.id);

        btn.addEventListener('click', () => {
          if (!isUnlocked) {
            if (storage.userData.settings.freeLessonSelection) {
              storage.unlockLessonManually(lesson.id);
              this.renderLearningPath();
              this.showToast('Einheit manuell freigeschaltet.', '🔓');
            } else {
              this.showConfirmDialog('Einheit direkt freischalten?', 'Die normale Reihenfolge bleibt erhalten. Diese Lektion wird zusätzlich manuell verfügbar.', () => {
                storage.unlockLessonManually(lesson.id);
                this.renderLearningPath();
                this.showToast('Einheit manuell freigeschaltet.', '🔓');
              });
              return;
            }
            this.openLessonTheory(lesson, unit);
            return;
          }
          if (window.sfx) window.sfx.playClick();
          this.openLessonTheory(lesson, unit);
        });

        const label = document.createElement('div');
        label.className = 'lesson-label';
        label.textContent = `${lesson.title}${manuallyUnlocked ? ' · manuell' : ''}`;

        wrapper.appendChild(btn);
        wrapper.appendChild(label);
        track.appendChild(wrapper);
      });

      container.appendChild(track);
    });
  }

  startNextRecommendedLesson() {
    const courseData = storage.getCourseData();
    let targetLesson = null;
    let targetUnit = null;

    for (const unit of courseData.units) {
      for (const lesson of (unit.lessons || [])) {
        if (storage.isLessonUnlocked(lesson.id) && !storage.isLessonCompleted(lesson.id)) {
          targetLesson = lesson;
          targetUnit = unit;
          break;
        }
      }
      if (targetLesson) break;
    }

    // Wenn alle abgeschlossen, nimm die erste Lektion
    if (!targetLesson && courseData.units.length > 0 && courseData.units[0].lessons.length > 0) {
      targetLesson = courseData.units[0].lessons[0];
      targetUnit = courseData.units[0];
    }

    if (targetLesson) {
      this.openLessonTheory(targetLesson, targetUnit);
    }
  }

  // =========================================================================
  // 3. THEORIE & LEKTIONSEINFÜHRUNG
  // =========================================================================
  openLessonTheory(lesson, unit) {
    this.activeLesson = lesson;
    const overlay = document.getElementById('theoryModalOverlay');
    const unitTag = document.getElementById('theoryUnitTag');
    const titleEl = document.getElementById('theoryTitle');
    const contentEl = document.getElementById('theoryContent');
    const tipBox = document.getElementById('theoryTipBox');

    unitTag.textContent = `${unit ? unit.title.toUpperCase() : 'LEKTION'} • ${lesson.title}`;
    titleEl.textContent = lesson.theory ? lesson.theory.title : lesson.title;

    let html = '';
    if (lesson.theory) {
      html += `<p style="margin-bottom: 12px; font-weight: 500;">${lesson.theory.concept || ''}</p>`;
      if (lesson.theory.points && lesson.theory.points.length > 0) {
        html += `<ul>`;
        lesson.theory.points.forEach(pt => {
          html += `<li>${pt}</li>`;
        });
        html += `</ul>`;
      }
    } else {
      html += `<p>${lesson.description || 'Lerne neue russische Wörter und grammatikalische Grundlagen.'}</p>`;
    }
    contentEl.innerHTML = html;

    if (lesson.theory && lesson.theory.examples && lesson.theory.examples.length) {
      const examplesBox = document.createElement('div');
      examplesBox.className = 'lesson-examples';
      const examplesTitle = document.createElement('strong');
      examplesTitle.textContent = 'Beispielsätze';
      examplesBox.appendChild(examplesTitle);
      lesson.theory.examples.forEach(example => {
        const row = document.createElement('div');
        row.className = 'lesson-example-row';
        const text = document.createElement('span');
        text.innerHTML = `<span lang="ru">${example.ru}</span><br><span>${example.de}</span>`;
        const speakButton = document.createElement('button');
        speakButton.type = 'button';
        speakButton.className = 'btn-speaker lesson-example-speaker';
        speakButton.textContent = '🔊';
        speakButton.setAttribute('aria-label', `Beispielsatz auf Russisch anhören: ${example.ru}`);
        speakButton.onclick = () => window.speech && window.speech.speak(example.ru);
        row.append(text, speakButton);
        examplesBox.appendChild(row);
      });
      contentEl.appendChild(examplesBox);
    }

    if (lesson.theory && lesson.theory.tip) {
      tipBox.style.display = 'block';
      tipBox.innerHTML = `<strong>💡 Lerntipp:</strong> ${lesson.theory.tip}`;
    } else {
      tipBox.style.display = 'none';
    }

    overlay.classList.add('active');
  }

  closeLessonTheory() {
    const overlay = document.getElementById('theoryModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  // =========================================================================
  // 4. INTERAKTIVES QUIZ & ÜBUNGS-ENGINE
  // =========================================================================
  startQuiz(exerciseList, options = {}) {
    if (storage.userData.hearts <= 0 && !options.isHeartRefill) {
      this.showNoHeartsModal();
      return;
    }

    this.closeLessonTheory();
    this.currentQuiz = {
      exercises: exerciseList,
      currentIndex: 0,
      correctCount: 0,
      mistakeCount: 0,
      selectedAnswer: null,
      isAnswerChecked: false,
      lessonId: options.lessonId || null,
      xpReward: options.xpReward || 25,
      isHeartRefill: options.isHeartRefill || false,
      title: options.title || "Lektion"
    };

    const quizModal = document.getElementById('quizModal');
    quizModal.classList.add('active');
    this.renderCurrentQuizExercise();
  }

  showNoHeartsModal() {
    this.showConfirmDialog(
      "Keine Herzen mehr!",
      "Du hast alle Herzen aufgebraucht. Möchtest du eine kurze Übungseinheit starten, um deine Herzen wieder aufzufüllen?",
      () => {
        this.startHeartRefillPractice();
      }
    );
  }

  renderCurrentQuizExercise() {
    const quiz = this.currentQuiz;
    if (!quiz || quiz.currentIndex >= quiz.exercises.length) {
      this.finishQuiz();
      return;
    }

    const ex = quiz.exercises[quiz.currentIndex];
    const quizBody = document.getElementById('quizBody');
    const quizProgressFill = document.getElementById('quizProgressFill');
    const quizHeartsVal = document.getElementById('quizHeartsVal');
    const quizFooter = document.getElementById('quizFooter');
    const feedbackMsg = document.getElementById('feedbackMsg');
    const btnAction = document.getElementById('btnQuizAction');
    const actionText = document.getElementById('quizActionText');

    // Reset Footer State
    quizFooter.className = 'quiz-footer';
    feedbackMsg.style.display = 'none';
    quiz.isAnswerChecked = false;
    quiz.selectedAnswer = null;
    actionText.textContent = "Überprüfen";
    btnAction.className = 'btn-3d btn-primary';

    // Progress Bar
    const pct = Math.round((quiz.currentIndex / quiz.exercises.length) * 100);
    quizProgressFill.style.width = `${pct}%`;
    quizHeartsVal.textContent = storage.userData.hearts;

    // Body Render nach Übungstyp
    quizBody.innerHTML = '';

    const titleEl = document.createElement('h3');
    titleEl.className = 'exercise-question-title';
    titleEl.textContent = ex.question || "Wähle die richtige Antwort:";
    quizBody.appendChild(titleEl);

    // Audio Vorlesen bei Bedarf
    if (ex.audioText && window.speech) {
      // Automatisch sprechen bei Höraufgaben
      if (ex.type === 'listening') {
        setTimeout(() => window.speech.speak(ex.audioText), 200);
      }
    }

    // A. Multiple Choice (RU -> DE oder DE -> RU oder Listening)
    if (ex.type === 'choice_ru_de' || ex.type === 'choice_de_ru' || ex.type === 'listening' || ex.type === 'letter_sound' || ex.type === 'cloze') {
      if (ex.audioText) {
        const audioBox = document.createElement('div');
        audioBox.className = 'prompt-audio-box';
        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'btn-speaker';
        speakerBtn.innerHTML = '🔊';
        speakerBtn.onclick = () => window.speech.speak(ex.audioText);

        const promptText = document.createElement('span');
        promptText.className = 'prompt-audio-text';
        promptText.textContent = ex.type === 'listening' ? '🎧 Klicke zum Anhören' : ex.audioText;

        audioBox.appendChild(speakerBtn);
        audioBox.appendChild(promptText);
        quizBody.appendChild(audioBox);
      }

      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'options-grid';

      ex.options.forEach((optText, optIdx) => {
        const optionRow = document.createElement('div');
        optionRow.className = 'option-choice-row';
        const optBtn = document.createElement('button');
        optBtn.className = 'option-btn';
        const number = document.createElement('span');
        number.style.opacity = '0.6';
        number.style.fontSize = '0.85rem';
        number.textContent = String(optIdx + 1);
        const answerText = document.createElement('span');
        answerText.textContent = optText;
        optBtn.append(number, answerText);

        optBtn.onclick = () => {
          if (quiz.isAnswerChecked) return;
          if (window.sfx) window.sfx.playClick();
          optionsGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          optBtn.classList.add('selected');
          quiz.selectedAnswer = optIdx;
        };

        optionRow.appendChild(optBtn);
        if (/[А-Яа-яЁё]/.test(optText) && window.speech) {
          const russianOptionText = optText.split(/\s*[\(–—]/)[0].trim();
          const optionSpeaker = document.createElement('button');
          optionSpeaker.type = 'button';
          optionSpeaker.className = 'btn-speaker option-speaker';
          optionSpeaker.textContent = '🔊';
          optionSpeaker.title = `Russisch anhören: ${russianOptionText}`;
          optionSpeaker.setAttribute('aria-label', `Russisch anhören: ${russianOptionText}`);
          optionSpeaker.onclick = event => { event.stopPropagation(); window.speech.speak(russianOptionText); };
          optionRow.appendChild(optionSpeaker);
        }
        optionsGrid.appendChild(optionRow);
      });

      quizBody.appendChild(optionsGrid);
    }
    else if (ex.type === 'translation_input') {
      if (ex.inputLanguage === 'Deutsch' && ex.audioText && window.speech) {
        const audioBox = document.createElement('div');
        audioBox.className = 'prompt-audio-box';
        const speakerBtn = document.createElement('button');
        speakerBtn.type = 'button';
        speakerBtn.className = 'btn-speaker';
        speakerBtn.textContent = '🔊';
        speakerBtn.setAttribute('aria-label', 'Russischen Ausdruck anhören');
        speakerBtn.onclick = () => window.speech.speak(ex.audioText);
        const promptText = document.createElement('span');
        promptText.className = 'prompt-audio-text';
        promptText.lang = 'ru';
        promptText.textContent = ex.audioText;
        audioBox.append(speakerBtn, promptText);
        quizBody.appendChild(audioBox);
      }
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'editor-input translation-answer-input';
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.spellcheck = false;
      input.placeholder = `${ex.inputLanguage || 'Russisch'}-Übersetzung eingeben`;
      input.setAttribute('aria-label', `${ex.inputLanguage || 'Russische'} Übersetzung`);
      input.addEventListener('input', () => { quiz.selectedAnswer = input.value; });
      input.addEventListener('keydown', event => { if (event.key === 'Enter' && !quiz.isAnswerChecked) this.handleQuizCheck(); });
      quizBody.appendChild(input);
      setTimeout(() => input.focus(), 0);
    }
    // B. Matching (Wortpaare verbinden)
    else if (ex.type === 'matching') {
      const matchContainer = document.createElement('div');
      matchContainer.className = 'matching-container';

      const leftCol = document.createElement('div');
      leftCol.className = 'matching-column';
      const rightCol = document.createElement('div');
      rightCol.className = 'matching-column';

      // Mische rechte Spalte
      const pairs = ex.pairs;
      let leftItems = pairs.map((p, i) => ({ text: p.left, pairId: i }));
      let rightItems = pairs.map((p, i) => ({ text: p.right, pairId: i }));
      rightItems.sort(() => Math.random() - 0.5);

      let selectedLeft = null;
      let selectedRight = null;
      let matchedPairsCount = 0;

      const checkMatch = () => {
        if (!selectedLeft || !selectedRight) return;
        const leftPairId = parseInt(selectedLeft.getAttribute('data-pair-id'));
        const rightPairId = parseInt(selectedRight.getAttribute('data-pair-id'));

        if (leftPairId === rightPairId) {
          // Richtig
          if (window.sfx) window.sfx.playCorrect();
          selectedLeft.classList.remove('selected');
          selectedRight.classList.remove('selected');
          selectedLeft.classList.add('matched');
          selectedRight.classList.add('matched');
          matchedPairsCount++;

          if (matchedPairsCount === pairs.length) {
            quiz.selectedAnswer = true;
            this.handleQuizCheck();
          }
        } else {
          // Falsch
          if (window.sfx) window.sfx.playWrong();
          if (!ex.matchingMistakeRecorded) {
            ex.matchingMistakeRecorded = true;
            quiz.mistakeCount++;
            if (!quiz.isHeartRefill) {
              storage.loseHeart();
              this.updateHeaderStats();
              const quizHeartsVal = document.getElementById('quizHeartsVal');
              if (quizHeartsVal) quizHeartsVal.textContent = storage.userData.hearts;
            }
            if (window.adaptiveLearning) window.adaptiveLearning.record(ex, false);
          }
          const el1 = selectedLeft;
          const el2 = selectedRight;
          el1.classList.add('error-shake');
          el2.classList.add('error-shake');
          setTimeout(() => {
            el1.classList.remove('error-shake', 'selected');
            el2.classList.remove('error-shake', 'selected');
          }, 450);
        }
        selectedLeft = null;
        selectedRight = null;
      };

      leftItems.forEach(item => {
        const chip = document.createElement('button');
        chip.className = 'match-chip';
        chip.setAttribute('data-pair-id', item.pairId);
        chip.textContent = item.text;
        chip.onclick = () => {
          if (chip.classList.contains('matched')) return;
          if (window.sfx) window.sfx.playClick();
          leftCol.querySelectorAll('.match-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selectedLeft = chip;
          checkMatch();
        };
        leftCol.appendChild(chip);
      });

      rightItems.forEach(item => {
        const chip = document.createElement('button');
        chip.className = 'match-chip';
        chip.setAttribute('data-pair-id', item.pairId);
        chip.textContent = item.text;
        chip.onclick = () => {
          if (chip.classList.contains('matched')) return;
          if (window.sfx) window.sfx.playClick();
          rightCol.querySelectorAll('.match-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selectedRight = chip;
          checkMatch();
        };
        rightCol.appendChild(chip);
      });

      matchContainer.appendChild(leftCol);
      matchContainer.appendChild(rightCol);
      quizBody.appendChild(matchContainer);

      // Bei Matching wird automatisch validiert
      quiz.selectedAnswer = false;
    }
    // C. Satzbau (Wort-Bubbles ordnen)
    else if (ex.type === 'sentence_build') {
      const dropzone = document.createElement('div');
      dropzone.className = 'sentence-dropzone';
      dropzone.id = 'sentenceDropzone';

      const wordBank = document.createElement('div');
      wordBank.className = 'word-bank';

      let chosenWords = [];
      const scrambledWords = [...ex.words].sort(() => Math.random() - 0.5);

      const updateDropzone = () => {
        dropzone.innerHTML = '';
        chosenWords.forEach((wordObj, idx) => {
          const chip = document.createElement('button');
          chip.className = 'word-chip';
          chip.textContent = wordObj.text;
          chip.onclick = () => {
            if (quiz.isAnswerChecked) return;
            // Zurück in Bank
            wordObj.bankElement.classList.remove('used');
            chosenWords.splice(idx, 1);
            updateDropzone();
            quiz.selectedAnswer = chosenWords.map(w => w.text).join(' ');
          };
          dropzone.appendChild(chip);
        });
        quiz.selectedAnswer = chosenWords.map(w => w.text).join(' ');
      };

      scrambledWords.forEach(wordText => {
        const chip = document.createElement('button');
        chip.className = 'word-chip';
        chip.textContent = wordText;
        chip.onclick = () => {
          if (chip.classList.contains('used') || quiz.isAnswerChecked) return;
          if (window.sfx) window.sfx.playClick();
          chip.classList.add('used');
          chosenWords.push({ text: wordText, bankElement: chip });
          updateDropzone();
        };
        wordBank.appendChild(chip);
      });

      quizBody.appendChild(dropzone);
      quizBody.appendChild(wordBank);
    }
  }

  handleQuizAction() {
    const quiz = this.currentQuiz;
    if (!quiz) return;

    if (!quiz.isAnswerChecked) {
      this.handleQuizCheck();
    } else {
      this.handleQuizNext();
    }
  }

  handleQuizCheck() {
    const quiz = this.currentQuiz;
    if (!quiz) return;

    const ex = quiz.exercises[quiz.currentIndex];
    const quizFooter = document.getElementById('quizFooter');
    const feedbackMsg = document.getElementById('feedbackMsg');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackExplanation = document.getElementById('feedbackExplanation');
    const actionText = document.getElementById('quizActionText');
    const btnAction = document.getElementById('btnQuizAction');

    let isCorrect = false;

    // Auswertung je nach Aufgabentyp
    if (ex.type === 'choice_ru_de' || ex.type === 'choice_de_ru' || ex.type === 'listening' || ex.type === 'letter_sound' || ex.type === 'cloze') {
      if (quiz.selectedAnswer === null || quiz.selectedAnswer === undefined) {
        this.showToast("Wähle bitte zuerst eine Antwort aus!", "👆");
        return;
      }
      isCorrect = (quiz.selectedAnswer === ex.correctIndex);
    } else if (ex.type === 'translation_input') {
      if (!quiz.selectedAnswer || !quiz.selectedAnswer.trim()) {
        this.showToast("Gib bitte eine Übersetzung ein.", "⌨️");
        return;
      }
      const normalize = value => value.normalize('NFC').replace(/[.,?!]/g, '').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim().toLocaleLowerCase('ru-RU');
      isCorrect = normalize(quiz.selectedAnswer) === normalize(ex.translationTarget);
    } else if (ex.type === 'matching') {
      if (quiz.selectedAnswer !== true) {
        this.showToast("Bitte verbinde zuerst alle Wortpaare!", "👆");
        return;
      }
      isCorrect = true; // Wurde im Matching-Handler bereits geprüft
    } else if (ex.type === 'sentence_build') {
      if (!quiz.selectedAnswer || quiz.selectedAnswer.trim() === '') {
        this.showToast("Bilde bitte einen Satz aus den Wörtern!", "👆");
        return;
      }
      const cleanInput = quiz.selectedAnswer.replace(/[\.\,\?\!]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      const cleanTarget = ex.targetSentence.replace(/[\.\,\?\!]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      isCorrect = (cleanInput === cleanTarget);
    }

    quiz.isAnswerChecked = true;

    if (isCorrect) {
      quiz.correctCount++;
      if (window.sfx) window.sfx.playCorrect();
      quizFooter.className = 'quiz-footer correct';
      feedbackIcon.textContent = '✅';
      feedbackTitle.textContent = 'Hervorragend! Richtig!';
      feedbackExplanation.textContent = ex.explanation || "Sehr gut gemacht!";
      btnAction.className = 'btn-3d btn-success';
    } else {
      quiz.mistakeCount++;
      if (window.sfx) {
        window.sfx.playWrong();
        window.sfx.playHeartLost();
      }

      // Herz abziehen (außer im Herzen-Auffrischungsmodus)
      if (!quiz.isHeartRefill) {
        storage.loseHeart();
        this.updateHeaderStats();
        const quizHeartsVal = document.getElementById('quizHeartsVal');
        if (quizHeartsVal) quizHeartsVal.textContent = storage.userData.hearts;
      }

      quizFooter.className = 'quiz-footer wrong';
      feedbackIcon.textContent = '❌';
      feedbackTitle.textContent = 'Leider nicht ganz richtig';

      let solutionText = "";
      if (ex.options && ex.correctIndex !== undefined) {
        solutionText = `Richtige Antwort: ${ex.options[ex.correctIndex]}`;
      } else if (ex.targetSentence) {
        solutionText = `Richtige Lösung: ${ex.targetSentence}`;
      } else if (ex.translationTarget) {
        solutionText = `Richtige Lösung: ${ex.translationTarget}`;
      }
      feedbackExplanation.textContent = `${solutionText}. ${ex.explanation || ''}`;
      btnAction.className = 'btn-3d btn-danger';
    }
    storage.recordAnswer(isCorrect);

    feedbackMsg.style.display = 'flex';
    actionText.textContent = "Weiter";
  }

  handleQuizNext() {
    const quiz = this.currentQuiz;
    if (!quiz) return;

    // Prüfe, ob noch Herzen vorhanden sind
    if (storage.userData.hearts <= 0 && !quiz.isHeartRefill) {
      this.closeQuizModal();
      this.showNoHeartsModal();
      return;
    }

    quiz.currentIndex++;
    this.renderCurrentQuizExercise();
  }

  finishQuiz() {
    const quiz = this.currentQuiz;
    if (!quiz) return;

    this.closeQuizModal();

    const isPerfect = (quiz.mistakeCount === 0);
    // Ausbalancierte XP: 5 XP pro richtiger Antwort + 10 Abschluss-Bonus + 10 für Fehlerfrei
    let baseEarnedXp = (quiz.correctCount * 5) + 10;
    if (isPerfect) baseEarnedXp += 10;

    // Herzen auffüllen im Refill-Modus
    if (quiz.isHeartRefill) {
      storage.refillHearts(5);
      baseEarnedXp = 20;
    }

    // Fortschritt speichern (berücksichtigt ggf. 2x Booster)
    const xpResult = storage.addXp(baseEarnedXp);

    if (quiz.lessonId) {
      storage.completeLesson(quiz.lessonId, isPerfect ? 100 : 80, isPerfect);
    }
    if (quiz.title === 'Blitz-Quiz (10 Fragen)') {
      storage.userData.stats.quickQuizzesCompleted = (storage.userData.stats.quickQuizzesCompleted || 0) + 1;
      if (storage.userData.stats.quickQuizzesCompleted >= 10) storage.unlockAchievement('quiz_10');
      storage.saveUserData();
    }

    this.updateHeaderStats();

    // Celebration Modal
    this.showCelebrationModal(xpResult.earned, isPerfect, quiz.isHeartRefill, xpResult.isBoosted);
  }

  closeQuizModal() {
    const quizModal = document.getElementById('quizModal');
    if (quizModal) quizModal.classList.remove('active');
    this.currentQuiz = null;
  }

  showCelebrationModal(earnedXp, isPerfect, isHeartRefill, isBoosted = false) {
    const modal = document.getElementById('celebrationModal');
    const titleEl = document.getElementById('celebTitle');
    const subEl = document.getElementById('celebSubtitle');
    const rewardEl = document.getElementById('celebRewardXp');
    const accuracyEl = document.getElementById('celebAccuracy');
    const celebIcon = document.getElementById('celebIcon');

    if (isHeartRefill) {
      celebIcon.textContent = '❤️';
      titleEl.textContent = 'Herzen wieder voll!';
      subEl.textContent = 'Alle 5 Herzen wurden erfolgreich regeneriert. Du bist wieder voll einsatzbereit!';
    } else if (isPerfect) {
      celebIcon.textContent = '🌟';
      titleEl.textContent = 'Perfekte Lektion!';
      subEl.textContent = 'Fehlerfrei abgeschlossen! Du machst beeindruckende Fortschritte!';
    } else {
      celebIcon.textContent = '🎉';
      titleEl.textContent = 'Lektion gemeistert!';
      subEl.textContent = 'Super Fortschritt! Übung macht den Meister.';
    }

    rewardEl.textContent = `+${earnedXp} XP ${isBoosted ? '⚡ (2x!)' : ''}`;
    accuracyEl.textContent = isPerfect ? '100%' : '80%';

    modal.classList.add('active');

    if (window.sfx) window.sfx.playCelebration();
    this.launchConfetti();
  }

  closeCelebrationModal() {
    const modal = document.getElementById('celebrationModal');
    if (modal) modal.classList.remove('active');
    this.renderAll();
  }

  // =========================================================================
  // 5. ALPHABET-TRAINER (33 Buchstaben & Modi)
  // =========================================================================
  setupAlphabetTrainer() {
    const filterChips = document.querySelectorAll('#alphabetFilterBar .filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentAlphabetFilter = chip.getAttribute('data-filter');
        this.renderAlphabetGrid();
        if (window.sfx) window.sfx.playClick();
      });
    });

    // 4 Trainings-Buttons
    document.getElementById('btnAlphaQuizRecognize').onclick = () => this.startAlphabetQuiz('recognize');
    document.getElementById('btnAlphaQuizSounds').onclick = () => this.startAlphabetQuiz('sounds');
    document.getElementById('btnAlphaQuizMatchCase').onclick = () => this.startAlphabetQuiz('match_case');
    document.getElementById('btnAlphaQuizReadWords').onclick = () => this.startAlphabetQuiz('read_words');
  }

  renderAlphabetGrid() {
    const grid = document.getElementById('alphabetGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filter = this.currentAlphabetFilter;
    const filteredLetters = ALPHABET_DATA.filter(item => {
      if (filter === 'all') return true;
      return item.category === filter;
    });

    filteredLetters.forEach(letter => {
      const card = document.createElement('div');
      card.className = `letter-card category-${letter.category}`;

      let badgeHtml = '';
      if (letter.category === 'falscher_freund') {
        badgeHtml = `<span class="letter-badge-tag tag-freund">Falle!</span>`;
      } else if (letter.category === 'identisch') {
        badgeHtml = `<span class="letter-badge-tag tag-identisch">Freund</span>`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <div class="letter-big">${letter.upper} ${letter.lower}</div>
        <div class="letter-sound">${letter.name}</div>
        <div class="letter-word">${letter.exampleWord} (${letter.exampleTranslation})</div>
      `;

      card.onclick = () => {
        if (window.sfx) window.sfx.playClick();
        if (window.speech) window.speech.speak(letter.upper);
        this.openLetterDetailModal(letter);
      };

      grid.appendChild(card);
    });
  }

  openLetterDetailModal(letter) {
    const modal = document.getElementById('letterDetailModal');
    document.getElementById('letterModalCategory').textContent = letter.category.toUpperCase().replace('_', ' ');
    document.getElementById('letterModalBig').textContent = `${letter.upper} ${letter.lower}`;
    document.getElementById('letterModalName').textContent = letter.name;
    document.getElementById('letterModalIpa').textContent = `IPA: ${letter.ipa}`;
    document.getElementById('letterModalPhonetic').textContent = letter.germanPhonetic;
    document.getElementById('letterModalExplanation').textContent = letter.explanation;
    document.getElementById('letterModalWordRu').textContent = letter.exampleWord;
    document.getElementById('letterModalWordTranslit').textContent = `(${letter.exampleTranslit})`;
    document.getElementById('letterModalWordDe').textContent = letter.exampleTranslation;

    document.getElementById('btnLetterModalAudio').onclick = () => {
      if (window.speech) window.speech.speak(letter.upper);
    };
    document.getElementById('btnLetterModalWordAudio').onclick = () => {
      if (window.speech) window.speech.speak(letter.exampleWord);
    };

    document.getElementById('btnTrainThisLetter').onclick = () => {
      modal.classList.remove('active');
      this.trainSingleLetter(letter);
    };

    modal.classList.add('active');
  }

  trainSingleLetter(letter) {
    const exercises = [
      {
        id: `train_let_${letter.id}_1`,
        type: "choice_ru_de",
        question: `Wie wird der Buchstabe '${letter.upper}' ausgesprochen?`,
        audioText: letter.upper,
        options: [letter.germanPhonetic, "Wie ein deutsches 'Z'", "Stummes Zeichen", "Wie langes 'U'"],
        correctIndex: 0,
        explanation: letter.explanation
      },
      {
        id: `train_let_${letter.id}_2`,
        type: "choice_ru_de",
        question: `Welches deutsche Wort entspricht dem Beispielwort '${letter.exampleWord}'?`,
        audioText: letter.exampleWord,
        options: [letter.exampleTranslation, "Wasser", "Haus", "Stadt"],
        correctIndex: 0,
        explanation: `${letter.exampleWord} bedeutet ${letter.exampleTranslation}.`
      }
    ];

    this.startQuiz(exercises, { title: `Training Buchstabe ${letter.upper}`, xpReward: 15 });
  }

  startAlphabetQuiz(mode) {
    let exercises = [];
    const letters = [...ALPHABET_DATA].sort(() => Math.random() - 0.5);

    if (mode === 'recognize') {
      letters.slice(0, 5).forEach((letItem, i) => {
        const others = ALPHABET_DATA.filter(l => l.id !== letItem.id).sort(() => Math.random() - 0.5).slice(0, 3);
        const allOpts = [letItem.name, ...others.map(o => o.name)].sort(() => Math.random() - 0.5);
        exercises.push({
          id: `alpha_rec_${i}`,
          type: "choice_ru_de",
          question: `Welcher Name/Laut gehört zum Buchstaben '${letItem.upper}'?`,
          audioText: letItem.upper,
          options: allOpts,
          correctIndex: allOpts.indexOf(letItem.name),
          explanation: `${letItem.upper}: ${letItem.germanPhonetic}`
        });
      });
    } else if (mode === 'sounds') {
      letters.slice(0, 5).forEach((letItem, i) => {
        const others = ALPHABET_DATA.filter(l => l.id !== letItem.id).sort(() => Math.random() - 0.5).slice(0, 3);
        const allOpts = [letItem.upper, ...others.map(o => o.upper)].sort(() => Math.random() - 0.5);
        exercises.push({
          id: `alpha_sound_${i}`,
          type: "choice_ru_de",
          question: `Welcher Buchstabe erzeugt diesen Laut: "${letItem.germanPhonetic}"?`,
          audioText: letItem.upper,
          options: allOpts,
          correctIndex: allOpts.indexOf(letItem.upper),
          explanation: `${letItem.upper} entspricht ${letItem.germanPhonetic}.`
        });
      });
    } else if (mode === 'match_case') {
      const selected = letters.slice(0, 4);
      exercises.push({
        id: "alpha_match_1",
        type: "matching",
        question: "Verbinde die Großbuchstaben mit den passenden Kleinbuchstaben:",
        pairs: selected.map(l => ({ left: l.upper, right: l.lower }))
      });
    } else if (mode === 'read_words') {
      letters.slice(0, 5).forEach((letItem, i) => {
        const others = ALPHABET_DATA.filter(l => l.id !== letItem.id).sort(() => Math.random() - 0.5).slice(0, 3);
        const allOpts = [letItem.exampleTranslation, ...others.map(o => o.exampleTranslation)].sort(() => Math.random() - 0.5);
        exercises.push({
          id: `alpha_read_${i}`,
          type: "choice_ru_de",
          question: `Lies das Wort: '${letItem.exampleWord}' (${letItem.exampleTranslit}). Was bedeutet es?`,
          audioText: letItem.exampleWord,
          options: allOpts,
          correctIndex: allOpts.indexOf(letItem.exampleTranslation),
          explanation: `${letItem.exampleWord} = ${letItem.exampleTranslation}.`
        });
      });
    }

    this.startQuiz(exercises, { title: "Alphabet-Training", xpReward: 20 });
  }

  // =========================================================================
  // 6. VOKABELTRAINER (Wörterbuch & Karteikarten)
  // =========================================================================
  setupVocabTrainer() {
    // Modus-Tabs (Wörterliste vs. Karteikarten)
    const tabList = document.getElementById('tabVocabList');
    const tabCards = document.getElementById('tabVocabCards');
    const listContainer = document.getElementById('vocabListContainer');
    const cardsContainer = document.getElementById('vocabFlashcardsContainer');

    tabList.onclick = () => {
      tabList.classList.add('active');
      tabCards.classList.remove('active');
      listContainer.style.display = 'block';
      cardsContainer.style.display = 'none';
      if (window.sfx) window.sfx.playClick();
    };

    tabCards.onclick = () => {
      tabCards.classList.add('active');
      tabList.classList.remove('active');
      listContainer.style.display = 'none';
      cardsContainer.style.display = 'block';
      this.initFlashcards();
      if (window.sfx) window.sfx.playClick();
    };

    // Suchleiste
    const searchInput = document.getElementById('vocabSearchInput');
    const searchClear = document.getElementById('vocabSearchClear');
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'block' : 'none';
      this.renderVocabList();
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      this.renderVocabList();
    });

    // Favoriten-Filter
    const btnFavs = document.getElementById('btnFilterFavorites');
    btnFavs.onclick = () => {
      this.onlyFavorites = !this.onlyFavorites;
      btnFavs.style.color = this.onlyFavorites ? 'var(--primary)' : 'inherit';
      btnFavs.textContent = this.onlyFavorites ? '❤️ Alle anzeigen' : '❤️ Nur Favoriten';
      this.renderVocabList();
    };

    // Eigene Kategorie anlegen Button
    const btnAddCat = document.getElementById('btnAddCategoryBtn');
    if (btnAddCat) {
      btnAddCat.onclick = () => {
        const modal = document.getElementById('addCategoryModalOverlay');
        if (modal) modal.classList.add('active');
        if (window.sfx) window.sfx.playClick();
      };
    }

    const btnCloseAddCat = document.getElementById('btnCloseAddCategoryModal');
    if (btnCloseAddCat) {
      btnCloseAddCat.onclick = () => {
        document.getElementById('addCategoryModalOverlay').classList.remove('active');
      };
    }

    const btnSaveCat = document.getElementById('btnSaveCategory');
    if (btnSaveCat) {
      btnSaveCat.onclick = () => {
        const label = document.getElementById('newCatLabel').value.trim();
        const icon = document.getElementById('newCatIcon').value.trim() || '📁';
        if (!label) {
          this.showToast('Bitte gib einen Kategorie-Namen ein!', '⚠️');
          return;
        }
        storage.addCustomCategory(label, icon);
        document.getElementById('newCatLabel').value = '';
        document.getElementById('addCategoryModalOverlay').classList.remove('active');
        this.renderVocabCategories();
        this.showToast(`Kategorie "${label}" erfolgreich angelegt!`, icon);
        if (window.sfx) window.sfx.playCorrect();
      };
    }

    // Kategorien Bar aufbauen
    this.renderVocabCategories();

    // Karteikarten Flip & Buttons
    const activeCard = document.getElementById('activeFlashcard');
    activeCard.onclick = () => {
      activeCard.classList.toggle('flipped');
      if (window.sfx) window.sfx.playClick();
    };

    document.getElementById('cardFrontSpeaker').onclick = (e) => {
      e.stopPropagation();
      const currentVocab = this.flashcards[this.currentFlashcardIdx];
      if (currentVocab && window.speech) window.speech.speak(currentVocab.russian);
    };

    document.getElementById('btnCardMistake').onclick = () => {
      const currentVocab = this.flashcards[this.currentFlashcardIdx];
      if (currentVocab) storage.markVocabLearned(currentVocab.id, false);
      if (window.sfx) window.sfx.playWrong();
      this.nextFlashcard();
    };

    document.getElementById('btnCardMastered').onclick = () => {
      const currentVocab = this.flashcards[this.currentFlashcardIdx];
      if (currentVocab) storage.markVocabLearned(currentVocab.id, true);
      if (window.sfx) window.sfx.playCorrect();
      this.nextFlashcard();
    };
  }

  renderVocabCategories() {
    const catBar = document.getElementById('vocabCategoryFilterBar');
    if (!catBar) return;
    catBar.innerHTML = '';
    const allCategories = storage.getAllCategories();
    allCategories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `filter-chip ${cat.id === this.currentVocabCategory ? 'active' : ''}`;
      chip.textContent = `${cat.icon} ${cat.label}`;
      chip.onclick = () => {
        catBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentVocabCategory = cat.id;
        this.renderVocabList();
        if (window.sfx) window.sfx.playClick();
      };
      catBar.appendChild(chip);
    });

    // Aktualisiere auch CMS-Kategorie-Auswahl
    const cmsSelect = document.getElementById('newVocabCategory');
    if (cmsSelect) {
      cmsSelect.innerHTML = '';
      allCategories.filter(c => c.id !== 'all').forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.icon} ${c.label}`;
        cmsSelect.appendChild(opt);
      });
    }
  }

  getFilteredVocab() {
    const all = storage.getAllVocab();
    const searchVal = (document.getElementById('vocabSearchInput')?.value || '').toLowerCase().trim();
    const category = this.currentVocabCategory;

    return all.filter(v => {
      if (this.onlyFavorites && !storage.isFavorite(v.id)) return false;
      if (category !== 'all' && v.category !== category) return false;
      if (searchVal) {
        const inRu = v.russian.toLowerCase().includes(searchVal);
        const inDe = v.german.toLowerCase().includes(searchVal);
        const inTranslit = (v.translit || '').toLowerCase().includes(searchVal);
        if (!inRu && !inDe && !inTranslit) return false;
      }
      return true;
    });
  }

  renderVocabList() {
    const container = document.getElementById('vocabListItems');
    const countLabel = document.getElementById('vocabCountLabel');
    if (!container) return;

    const filtered = this.getFilteredVocab();
    if (countLabel) countLabel.textContent = `${filtered.length} Vokabeln gefunden`;

    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">Keine Vokabeln für diesen Filter gefunden.</div>`;
      return;
    }

    filtered.forEach(vocab => {
      const isFav = storage.isFavorite(vocab.id);
      const isLearned = storage.userData.learnedVocab[vocab.id]?.learned || false;

      const card = document.createElement('div');
      card.className = 'vocab-card';

      card.innerHTML = `
        <div class="vocab-card-header">
          <div>
            <div class="vocab-ru-word">
              <span>${vocab.russian}</span>
              <button class="btn-ghost icon-action-btn btn-play-audio" title="Anhören">🔊</button>
            </div>
            <div class="vocab-phonetic">${vocab.translit || ''}</div>
          </div>
          <div class="vocab-actions">
            <button class="icon-action-btn btn-fav ${isFav ? 'active-favorite' : ''}" title="Zu Favoriten">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
        <div class="vocab-de-word">${vocab.german}</div>
        ${vocab.exampleRu ? `
          <div class="vocab-example">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div style="font-weight: 600; font-family: var(--font-cyrillic);">${vocab.exampleRu}</div><button class="btn-ghost icon-action-btn btn-play-example" type="button" title="Beispielsatz anhören">🔊</button></div>
            <div>${vocab.exampleDe || ''}</div>
          </div>
        ` : ''}
      `;

      card.querySelector('.btn-play-audio').onclick = (e) => {
        e.stopPropagation();
        if (window.speech) window.speech.speak(vocab.russian);
      };
      card.querySelector('.btn-play-example')?.addEventListener('click', e => {
        e.stopPropagation();
        if (window.speech && vocab.exampleRu) window.speech.speak(vocab.exampleRu);
      });

      card.querySelector('.btn-fav').onclick = (e) => {
        e.stopPropagation();
        const fav = storage.toggleFavorite(vocab.id);
        const btn = card.querySelector('.btn-fav');
        btn.innerHTML = fav ? '❤️' : '🤍';
        btn.classList.toggle('active-favorite', fav);
        if (window.sfx) window.sfx.playClick();
      };

      container.appendChild(card);
    });
  }

  initFlashcards() {
    this.flashcards = this.getFilteredVocab().sort(() => Math.random() - 0.5);
    this.currentFlashcardIdx = 0;
    this.renderCurrentFlashcard();
  }

  renderCurrentFlashcard() {
    const cardEl = document.getElementById('activeFlashcard');
    cardEl.classList.remove('flipped');

    if (this.flashcards.length === 0) {
      document.getElementById('cardFrontRussian').textContent = "Keine Vokabeln";
      document.getElementById('cardFrontTranslit').textContent = "Passe deine Filter an";
      document.getElementById('cardBackGerman').textContent = "–";
      return;
    }

    const vocab = this.flashcards[this.currentFlashcardIdx];
    document.getElementById('flashcardProgressLabel').textContent = `Karte ${this.currentFlashcardIdx + 1} von ${this.flashcards.length}`;
    document.getElementById('cardFrontCategory').textContent = vocab.category.toUpperCase();
    document.getElementById('cardFrontRussian').textContent = vocab.russian;
    document.getElementById('cardFrontTranslit').textContent = vocab.translit || '';
    document.getElementById('cardBackGerman').textContent = vocab.german;
    document.getElementById('cardBackExampleRu').textContent = vocab.exampleRu || vocab.russian;
    document.getElementById('cardBackExampleDe').textContent = vocab.exampleDe || vocab.german;
  }

  nextFlashcard() {
    if (this.flashcards.length === 0) return;
    this.currentFlashcardIdx = (this.currentFlashcardIdx + 1) % this.flashcards.length;
    this.renderCurrentFlashcard();
  }

  // =========================================================================
  // 7. ÜBUNGSZENTRUM (Trainingsmodi)
  // =========================================================================
  setupPracticeCenter() {
    // 1. Herzen auffrischen
    document.getElementById('btnPracticeHearts').onclick = () => this.startHeartRefillPractice();

    // 2. 10-Fragen Blitz-Quiz
    document.getElementById('btnPracticeQuickQuiz').onclick = () => this.startQuickQuiz();

    // 3. Reines Hörverstehen
    document.getElementById('btnPracticeListening').onclick = () => this.startListeningPractice();

    // 4. Wort-Paare verbinden
    document.getElementById('btnPracticeMatching').onclick = () => this.startMatchingPractice();

    // 5. Schwierige Wörter wiederholen
    document.getElementById('btnPracticeDifficult').onclick = () => this.startDifficultWordsPractice();

    // 6. Fahrzeuge & Motorsport Spezial
    document.getElementById('btnPracticeMotorsport').onclick = () => this.startMotorsportPractice();
  }

  startHeartRefillPractice() {
    const vocabList = storage.getAllVocab().sort(() => Math.random() - 0.5).slice(0, 5);
    const exercises = vocabList.map((v, idx) => {
      const options = makeDistinctAnswerOptions(v.german, storage.getAllVocab().filter(o => o.id !== v.id).map(o => o.german));
      return {
        id: `refill_${idx}`,
        type: "choice_ru_de",
        question: `Was bedeutet: '${v.russian}'?`,
        audioText: v.russian,
        options,
        correctIndex: options.indexOf(v.german),
        explanation: `${v.russian} = ${v.german} (${v.translit})`
      };
    });

    this.startQuiz(exercises, {
      title: "Herzen auffrischen",
      isHeartRefill: true,
      xpReward: 20
    });
  }

  startQuickQuiz() {
    const vocabList = storage.getAllVocab().sort(() => Math.random() - 0.5).slice(0, 10);
    const exercises = vocabList.map((v, idx) => {
      const isRuToDe = (idx % 2 === 0);
      if (isRuToDe) {
        const options = makeDistinctAnswerOptions(v.german, storage.getAllVocab().filter(o => o.id !== v.id).map(o => o.german));
        return {
          id: `quick_${idx}`,
          type: "choice_ru_de",
          question: `Was bedeutet '${v.russian}'?`,
          audioText: v.russian,
          options,
          correctIndex: options.indexOf(v.german),
          explanation: `${v.russian} (${v.translit}) = ${v.german}`
        };
      } else {
        const options = makeDistinctAnswerOptions(v.russian, storage.getAllVocab().filter(o => o.id !== v.id).map(o => o.russian));
        return {
          id: `quick_${idx}`,
          type: "choice_de_ru",
          question: `Wie heißt '${v.german}' auf Russisch?`,
          // Never place the target Russian word in the prompt for German → Russian.
          audioText: undefined,
          options,
          correctIndex: options.indexOf(v.russian),
          explanation: `${v.german} = ${v.russian}`
        };
      }
    });

    this.startQuiz(exercises, { title: "Blitz-Quiz (10 Fragen)", xpReward: 35 });
  }

  startListeningPractice() {
    const vocabList = storage.getAllVocab().sort(() => Math.random() - 0.5).slice(0, 6);
    const exercises = vocabList.map((v, idx) => {
      const options = makeDistinctAnswerOptions(v.german, storage.getAllVocab().filter(o => o.id !== v.id).map(o => o.german));
      return {
        id: `listen_${idx}`,
        type: "listening",
        question: "Welches russische Wort hast du gehört?",
        audioText: v.russian,
        options,
        correctIndex: options.indexOf(v.german),
        explanation: `Du hast '${v.russian}' (${v.translit} = ${v.german}) gehört.`
      };
    });

    this.startQuiz(exercises, { title: "Hörverstehen", xpReward: 25 });
  }

  startMatchingPractice() {
    const allVocab = storage.getAllVocab().sort(() => Math.random() - 0.5);
    const set1 = allVocab.slice(0, 4);
    const set2 = allVocab.slice(4, 8);

    const exercises = [
      {
        id: "match_set_1",
        type: "matching",
        question: "Verbinde die russischen und deutschen Wörter:",
        pairs: set1.map(v => ({ left: v.russian, right: v.german }))
      },
      {
        id: "match_set_2",
        type: "matching",
        question: "Verbinde Runde 2:",
        pairs: set2.map(v => ({ left: v.russian, right: v.german }))
      }
    ];

    this.startQuiz(exercises, { title: "Wortpaare verbinden", xpReward: 25 });
  }

  startDifficultWordsPractice() {
    const allVocab = storage.getAllVocab();
    // Priorisiere Vokabeln mit Fehlern
    const difficult = allVocab.filter(v => {
      const stat = storage.userData.learnedVocab[v.id];
      return stat && stat.mistakes > 0;
    });

    const pool = (difficult.length >= 4 ? difficult : allVocab).sort(() => Math.random() - 0.5).slice(0, 6);
    const exercises = pool.map((v, idx) => {
      const others = allVocab.filter(o => o.id !== v.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [v.german, ...others.map(o => o.german)].sort(() => Math.random() - 0.5);
      return {
        id: `diff_${idx}`,
        type: "choice_ru_de",
        question: `Wiederhole: Was bedeutet '${v.russian}'?`,
        audioText: v.russian,
        options,
        correctIndex: options.indexOf(v.german),
        explanation: `${v.russian} (${v.translit}) = ${v.german}`
      };
    });

    this.startQuiz(exercises, { title: "Schwierige Wörter wiederholen", xpReward: 30 });
  }

  startMotorsportPractice() {
    const motorsportVocab = storage.getAllVocab().filter(v => v.category === 'vehicles').sort(() => Math.random() - 0.5);
    const exercises = motorsportVocab.slice(0, 6).map((v, idx) => {
      const others = motorsportVocab.filter(o => o.id !== v.id).slice(0, 3);
      const options = [v.german, ...others.map(o => o.german)].sort(() => Math.random() - 0.5);
      return {
        id: `motor_${idx}`,
        type: "choice_ru_de",
        question: `Motorsport-Vokabel: '${v.russian}'?`,
        audioText: v.russian,
        options,
        correctIndex: options.indexOf(v.german),
        explanation: `${v.russian} (${v.translit}) = ${v.german}`
      };
    });

    this.startQuiz(exercises, { title: "Fahrzeuge & Motorsport", xpReward: 30 });
  }

  // =========================================================================
  // 8. PROFIL & EINSTELLUNGEN
  // =========================================================================
  setupProfileAndSettings() {
    const freeChoice = document.getElementById('settingFreeLessonSelection');
    if (freeChoice) {
      freeChoice.checked = !!storage.userData.settings.freeLessonSelection;
      freeChoice.onchange = () => storage.updateSettings({ freeLessonSelection: freeChoice.checked });
    }
    const demoButton = document.getElementById('btnDemoMode');
    if (demoButton) demoButton.onclick = () => {
      if (storage.demoMode) {
        storage.endDemoMode();
        demoButton.textContent = 'Demo starten';
        this.showToast('Demo beendet. Dein eigener Lernstand ist wiederhergestellt.', '↩️');
      } else {
        storage.startDemoMode();
        demoButton.textContent = 'Demo verlassen';
        this.showToast('Demo gestartet. Änderungen bleiben nur bis zum Verlassen erhalten.', '🧪');
      }
      this.renderAll();
    };
    // SFX Toggle
    const settingSfx = document.getElementById('settingSfx');
    settingSfx.checked = storage.userData.settings.soundEffects;
    settingSfx.onchange = () => {
      storage.updateSettings({ soundEffects: settingSfx.checked });
    };

    // TTS Toggle
    const settingSpeech = document.getElementById('settingSpeech');
    settingSpeech.checked = storage.userData.settings.speechAudio;
    settingSpeech.onchange = () => {
      storage.updateSettings({ speechAudio: settingSpeech.checked });
    };

    // Dark Mode Toggle
    const settingDarkMode = document.getElementById('settingDarkMode');
    settingDarkMode.checked = storage.userData.settings.darkMode;
    settingDarkMode.onchange = () => {
      storage.updateSettings({ darkMode: settingDarkMode.checked });
    };

    // Speech Rate
    const settingSpeechRate = document.getElementById('settingSpeechRate');
    settingSpeechRate.value = String(storage.userData.settings.speechRate || 0.85);
    settingSpeechRate.onchange = () => {
      storage.updateSettings({ speechRate: parseFloat(settingSpeechRate.value) });
    };

    // Daily Goal
    const settingDailyGoal = document.getElementById('settingDailyGoal');
    settingDailyGoal.value = String(storage.userData.settings.dailyGoalXP || 200);
    settingDailyGoal.onchange = () => {
      storage.updateSettings({ dailyGoalXP: parseInt(settingDailyGoal.value) });
      this.updateHeaderStats();
    };

    // Delegated handler also supports catalog items rendered into the shop.
    const shop = document.getElementById('profileXpShop');
    if (shop) shop.addEventListener('click', event => {
      const btn = event.target.closest('.btn-buy-item');
      if (btn) {
        const itemId = btn.getAttribute('data-item');
        if (XP_SHOP_ITEMS.some(item => item.id === itemId) && (storage.userData.inventory.purchasedItems || []).includes(itemId)) {
          storage.equipShopItem(itemId);
          this.showToast('Gegenstand ausgerüstet.', '✨');
          this.renderProfile();
          return;
        }
        const cost = parseInt(btn.getAttribute('data-cost')) || 100;
        const res = storage.buyShopItem(itemId, cost);
        if (res.success) {
          if (window.sfx) window.sfx.playCelebration();
          this.showToast('Erfolgreich im XP-Shop gekauft!', '🛍️');
          this.updateHeaderStats();
          this.renderProfile();
        } else {
          if (window.sfx) window.sfx.playWrong();
          this.showToast(res.reason || 'Nicht genügend XP vorhanden!', '⚠️');
        }
      }
    });

    // Profil-Titel Wähler
    const selectTitle = document.getElementById('selectActiveTitle');
    if (selectTitle) {
      selectTitle.onchange = () => {
        storage.setActiveTitle(selectTitle.value);
        this.renderProfile();
        this.showToast(`Titel gewechselt: ${selectTitle.value}`, '👑');
      };
    }

    // Sprachausgabe Test-Button
    const btnTestVoice = document.getElementById('btnTestVoice');
    if (btnTestVoice) {
      btnTestVoice.onclick = () => {
        if (window.speech) {
          const started = window.speech.speak("Здравствуйте! Привет, друг!");
          if (started) this.showToast("Sprachausgabe: 'Здравствуйте! Привет, друг!'", "🔊");
        }
      };
    }

    // Fortschritt zurücksetzen
    document.getElementById('btnResetProgress').onclick = () => {
      this.showConfirmDialog(
        "Lernfortschritt zurücksetzen?",
        "Möchtest du all deine gesammelten XP, Streaks und freigeschalteten Lektionen wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        () => {
          storage.resetAllProgress();
          this.renderAll();
          this.showToast("Fortschritt erfolgreich zurückgesetzt", "🔄");
        }
      );
    };
  }

  renderProfile() {
    const userLevel = storage.getUserLevel();
    const activeTitle = storage.userData.inventory?.activeTitle || userLevel.title;
    document.getElementById('profileLevelTitle').textContent = `Stufe ${userLevel.level}: ${activeTitle}`;
    const accountName = window.accountSync?.user?.user_metadata?.username;
    document.getElementById('profileUsername').textContent = accountName ? `${accountName} • ${activeTitle}` : `Lerner • ${activeTitle}`;

    const xpInLevel = storage.userData.xp - userLevel.minXp;
    const xpNeededInLevel = userLevel.nextXp - userLevel.minXp;
    const pct = Math.min(100, Math.round((xpInLevel / xpNeededInLevel) * 100));

    document.getElementById('profileXpProgressText').textContent = `${storage.userData.xp} / ${userLevel.nextXp} XP`;
    document.getElementById('profileXpProgressBar').style.width = `${pct}%`;

    // 4 Boxen
    document.getElementById('statTotalXp').textContent = storage.userData.xp;
    document.getElementById('statLongestStreak').textContent = `${storage.userData.longestStreak || 0} Tage`;
    document.getElementById('statCompletedLessons').textContent = Object.keys(storage.userData.completedLessons).length;
    document.getElementById('statLearnedVocab').textContent = Object.values(storage.userData.learnedVocab).filter(v => v.learned).length;
    const shopBalance = document.getElementById('shopXpBalance');
    if (shopBalance) shopBalance.textContent = `${storage.userData.xp} XP`;
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
      const equipped = storage.userData.inventory?.equippedItems || {};
      avatar.textContent = equipped.avatar || '👨‍🚀';
      avatar.dataset.frame = equipped.frame || '';
    }
    const inv = storage.userData.inventory || {};
    const shopGrid = document.querySelector('#profileXpShop .shop-grid');
    if (shopGrid) {
      shopGrid.querySelectorAll('.shop-extra').forEach(node => node.remove());
      let lastCategory = '';
      XP_SHOP_ITEMS.forEach(item => {
        if (item.category !== lastCategory) {
          lastCategory = item.category;
          const heading = document.createElement('h4'); heading.className = 'shop-category-heading shop-extra'; heading.textContent = item.category;
          shopGrid.appendChild(heading);
        }
        const owned = (inv.purchasedItems || []).includes(item.id);
        const equipped = inv.equippedItems?.[item.key] === item.value;
        const card = document.createElement('div'); card.className = 'shop-card shop-extra';
        card.innerHTML = `<div class="shop-card-icon">${item.icon}</div><div class="shop-card-info"><h4>${item.title}</h4><p>${item.desc}</p></div><button class="btn-3d btn-primary btn-buy-item" data-item="${item.id}" data-cost="${item.cost}"><span>${owned ? (equipped ? 'Ausgerüstet ✓' : 'Ausrüsten') : `${item.cost} ⚡`}</span></button>`;
        shopGrid.appendChild(card);
      });
    }

    // Inventar-Status
    const shieldEl = document.getElementById('invShieldStatus');
    if (shieldEl) {
      shieldEl.textContent = inv.shieldActive ? '🛡️ Schild: Aktiv (1x)' : '🛡️ Schild: Inaktiv';
      shieldEl.style.color = inv.shieldActive ? 'var(--primary)' : 'inherit';
    }
    const freezeEl = document.getElementById('invFreezeStatus');
    if (freezeEl) {
      freezeEl.textContent = `🧊 Freezes: ${inv.streakFreezes || 0}`;
      freezeEl.style.color = (inv.streakFreezes > 0) ? '#0284C7' : 'inherit';
    }
    const boosterEl = document.getElementById('invBoosterStatus');
    if (boosterEl) {
      const isBooster = storage.isBoosterActive();
      boosterEl.textContent = isBooster ? `⚡ 2x XP: Aktiv (${storage.getBoosterRemainingMinutes()} Min)` : '⚡ 2x XP: Inaktiv';
      boosterEl.style.color = isBooster ? '#F59E0B' : 'inherit';
    }

    // Titel-Auswahl befüllen
    const selectTitle = document.getElementById('selectActiveTitle');
    if (selectTitle) {
      const currentSelected = inv.activeTitle || "Novize (Новичок)";
      selectTitle.innerHTML = '';
      (inv.unlockedTitles || ["Novize (Новичок)"]).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        if (t === currentSelected) opt.selected = true;
        selectTitle.appendChild(opt);
      });
    }
    document.querySelectorAll('.btn-buy-item').forEach(btn => {
      const itemId = btn.dataset.item;
      const permanent = !['shield','freeze','booster','hearts_refill'].includes(itemId);
      const owned = (inv.purchasedItems || []).includes(itemId) || (itemId.startsWith('title_') && (inv.unlockedTitles || []).includes(itemId.slice(6)));
      btn.disabled = permanent && owned && !XP_SHOP_ITEMS.some(item => item.id === itemId);
      if (owned) {
        const shopItem = XP_SHOP_ITEMS.find(item => item.id === itemId);
        btn.querySelector('span').textContent = shopItem ? (inv.equippedItems?.[shopItem.key] === shopItem.value ? 'Ausgerüstet ✓' : 'Ausrüsten') : 'Im Besitz ✓';
      }
    });

    // Erfolge (20 Abzeichen)
    const achList = document.getElementById('profileAchievementsList');
    if (!achList) return;
    achList.innerHTML = '';

    const unlockedCount = ACHIEVEMENTS_LIST.filter(a => storage.userData.achievements.includes(a.id)).length;
    const achHeading = document.querySelector('#profileAchievementsList')?.previousElementSibling;
    if (achHeading) achHeading.textContent = `🏆 Erfolge & Abzeichen (${unlockedCount} freigeschaltet · ${ACHIEVEMENTS_LIST.length-unlockedCount} gesperrt)`;
    ACHIEVEMENTS_LIST.forEach(ach => {
      const isUnlocked = storage.userData.achievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? '' : 'locked'} rarity-${ach.rarity || 'gewöhnlich'}`;
      card.innerHTML = `
        <div class="achievement-icon">${isUnlocked ? ach.icon : '🔒'}</div>
        <div>
          <div style="font-weight: 800; font-size: 0.95rem;">${isUnlocked ? ach.title : 'Geheime Errungenschaft'} ${isUnlocked ? '✓' : ''}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${isUnlocked ? `${ach.desc} · ${ach.rarity || 'gewöhnlich'}` : 'Bedingung wird nach dem Freischalten enthüllt.'}</div>
        </div>
      `;
      achList.appendChild(card);
    });

    // Voice Status
    const voiceStatusText = document.getElementById('voiceStatusText');
    if (voiceStatusText) {
      if (window.speech && window.speech.hasRussianVoice) {
        voiceStatusText.textContent = "🇷🇺 ru-RU-Stimme verfügbar";
        voiceStatusText.style.color = "var(--success-dark)";
      } else {
        voiceStatusText.textContent = window.speech && window.speech.synth ? "ru-RU-Systemstimme wird versucht" : "Sprachausgabe nicht verfügbar";
        voiceStatusText.style.color = "var(--warning)";
      }
    }
  }

  // =========================================================================
  // 9. KURS-EDITOR (CMS)
  // =========================================================================
  setupCourseEditor() {
    const editorModal = document.getElementById('courseEditorModal');
    document.getElementById('btnOpenCourseEditor').onclick = () => {
      this.openCourseEditor();
    };
    document.getElementById('btnCloseEditor').onclick = () => {
      editorModal.classList.remove('active');
    };

    // Tabs im Editor
    const tabOverview = document.getElementById('editorTabOverview');
    const tabAddVocab = document.getElementById('editorTabAddVocab');
    const tabAddLesson = document.getElementById('editorTabAddLesson');
    const viewOverview = document.getElementById('editorContentOverview');
    const viewAddVocab = document.getElementById('editorContentAddVocab');
    const viewAddLesson = document.getElementById('editorContentAddLesson');

    const switchEditorTab = (activeTab, activeView) => {
      [tabOverview, tabAddVocab, tabAddLesson].forEach(t => t.classList.remove('active'));
      [viewOverview, viewAddVocab, viewAddLesson].forEach(v => v.style.display = 'none');
      activeTab.classList.add('active');
      activeView.style.display = 'block';
    };

    tabOverview.onclick = () => switchEditorTab(tabOverview, viewOverview);
    tabAddVocab.onclick = () => switchEditorTab(tabAddVocab, viewAddVocab);
    tabAddLesson.onclick = () => switchEditorTab(tabAddLesson, viewAddLesson);

    // JSON Export
    document.getElementById('btnExportCourseJson').onclick = () => {
      const courseData = storage.getCourseData();
      const customVocab = storage.getCustomVocab();
      const exportBundle = { courseData, customVocab, exportDate: new Date().toISOString() };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "russisch_kurs_daten.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast("Kursdaten als JSON heruntergeladen!", "💾");
    };

    // JSON Import
    const fileInput = document.getElementById('inputImportJsonFile');
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.courseData && parsed.courseData.units) {
            storage.saveCourseData(parsed.courseData);
            if (parsed.customVocab) storage.saveCustomVocab(parsed.customVocab);
            this.showToast("Kursinhalte erfolgreich importiert!", "✅");
            this.renderAll();
            this.renderEditorUnits();
          } else {
            this.showToast("Ungültiges Kurs-JSON Format!", "❌");
          }
        } catch (err) {
          this.showToast("Fehler beim Lesen der JSON-Datei", "❌");
        }
      };
      reader.readAsText(file);
    };

    // Kurs auf Standard zurücksetzen
    document.getElementById('btnResetCourseToDefault').onclick = () => {
      this.showConfirmDialog(
        "Kurs auf Standard zurücksetzen?",
        "Möchtest du alle Lektionen und Einheiten auf die Standard-Inhalte zurücksetzen? Dein persönlicher Fortschritt bleibt erhalten.",
        () => {
          storage.resetCourseDataToDefault();
          this.renderAll();
          this.renderEditorUnits();
          this.showToast("Kursinhalte auf Standard zurückgesetzt", "🔄");
        }
      );
    };

    // Neue Vokabel speichern
    document.getElementById('btnSaveNewVocab').onclick = () => {
      const ru = document.getElementById('newVocabRu').value.trim();
      const de = document.getElementById('newVocabDe').value.trim();
      const translit = document.getElementById('newVocabTranslit').value.trim();
      const cat = document.getElementById('newVocabCategory').value;
      const exRu = document.getElementById('newVocabExampleRu').value.trim();
      const exDe = document.getElementById('newVocabExampleDe').value.trim();

      if (!ru || !de || !translit) {
        this.showToast("Bitte fülle die Pflichtfelder aus!", "⚠️");
        return;
      }

      const custom = storage.getCustomVocab();
      const newVocab = {
        id: `custom_v_${Date.now()}`,
        russian: ru,
        german: de,
        translit: translit,
        category: cat,
        exampleRu: exRu,
        exampleDe: exDe
      };
      custom.push(newVocab);
      storage.saveCustomVocab(custom);

      // Formular leeren
      document.getElementById('newVocabRu').value = '';
      document.getElementById('newVocabDe').value = '';
      document.getElementById('newVocabTranslit').value = '';
      document.getElementById('newVocabExampleRu').value = '';
      document.getElementById('newVocabExampleDe').value = '';

      this.showToast("Vokabel erfolgreich gespeichert!", "✅");
      this.renderVocabList();
    };

    // Neue Lektion speichern
    document.getElementById('btnSaveNewLesson').onclick = () => {
      const unitId = document.getElementById('newLessonUnitSelect').value;
      const title = document.getElementById('newLessonTitle').value.trim();
      const desc = document.getElementById('newLessonDesc').value.trim();
      const theory = document.getElementById('newLessonTheory').value.trim();
      const xp = parseInt(document.getElementById('newLessonXp').value) || 30;

      if (!title || !desc) {
        this.showToast("Bitte Titel und Beschreibung ausfüllen!", "⚠️");
        return;
      }

      const courseData = storage.getCourseData();
      const unit = courseData.units.find(u => u.id === unitId);
      if (!unit) return;

      const newLessonId = `lesson_${unit.number}_${(unit.lessons || []).length + 1}`;
      const newLesson = {
        id: newLessonId,
        unitId: unitId,
        title: title,
        description: desc,
        xpReward: xp,
        theory: {
          title: title,
          concept: theory,
          points: []
        },
        exercises: [
          {
            id: `ex_${newLessonId}_1`,
            type: "choice_ru_de",
            question: `Übungsfrage zu ${title}: Was bedeutet dieses Wort?`,
            audioText: "Да",
            options: ["Ja", "Nein", "Danke", "Bitte"],
            correctIndex: 0,
            explanation: "Richtige Antwort."
          }
        ]
      };

      unit.lessons.push(newLesson);
      storage.saveCourseData(courseData);

      document.getElementById('newLessonTitle').value = '';
      document.getElementById('newLessonDesc').value = '';
      document.getElementById('newLessonTheory').value = '';

      this.showToast("Neue Lektion hinzugefügt & im Lernpfad aktiviert!", "✅");
      this.renderLearningPath();
      this.renderEditorUnits();
    };
  }

  openCourseEditor() {
    const modal = document.getElementById('courseEditorModal');
    modal.classList.add('active');

    // Befülle Kategorien im Vocab-Formular
    const catSelect = document.getElementById('newVocabCategory');
    catSelect.innerHTML = '';
    VOCAB_CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.label}`;
      catSelect.appendChild(opt);
    });

    // Befülle Einheiten im Lektions-Formular
    const unitSelect = document.getElementById('newLessonUnitSelect');
    unitSelect.innerHTML = '';
    const courseData = storage.getCourseData();
    courseData.units.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `Einheit ${u.number}: ${u.title}`;
      unitSelect.appendChild(opt);
    });

    this.renderEditorUnits();
  }

  renderEditorUnits() {
    const container = document.getElementById('editorUnitsList');
    if (!container) return;
    container.innerHTML = '';

    const courseData = storage.getCourseData();
    courseData.units.forEach(unit => {
      const card = document.createElement('div');
      card.style.cssText = 'background-color: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;';
      card.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; display: flex; justify-content: space-between;">
          <span>${unit.icon || '📖'} Einheit ${unit.number}: ${unit.title}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">${(unit.lessons || []).length} Lektionen</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">${unit.subtitle || ''}</div>
      `;
      container.appendChild(card);
    });
  }

  // =========================================================================
  // 10. MODALS, TOASTS & KONFETTI
  // =========================================================================
  setupModals() {
    // Theorie Modal Close & Start
    document.getElementById('btnCloseTheory').onclick = () => this.closeLessonTheory();
    document.getElementById('btnStartLessonExercises').onclick = () => {
      if (this.activeLesson) {
        this.startQuiz(this.activeLesson.exercises, {
          lessonId: this.activeLesson.id,
          xpReward: this.activeLesson.xpReward,
          title: this.activeLesson.title
        });
      }
    };

    // Quiz Buttons
    document.getElementById('btnQuitQuiz').onclick = () => {
      this.showConfirmDialog(
        "Lektion abbrechen?",
        "Bist du sicher, dass du die Lektion verlassen möchtest? Dein ungespeicherter Fortschritt in dieser Sitzung geht verloren.",
        () => this.closeQuizModal()
      );
    };
    document.getElementById('btnQuizAction').onclick = () => this.handleQuizAction();

    // Celebration Continue
    document.getElementById('btnCelebrationContinue').onclick = () => this.closeCelebrationModal();

    // Letter Detail Modal Close
    document.getElementById('btnCloseLetterDetail').onclick = () => {
      document.getElementById('letterDetailModal').classList.remove('active');
    };
  }

  showToast(message, icon = "ℹ️") {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  showConfirmDialog(title, desc, onOk) {
    const overlay = document.getElementById('confirmOverlay');
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmDesc').textContent = desc;

    const btnOk = document.getElementById('btnConfirmOk');
    const btnCancel = document.getElementById('btnConfirmCancel');

    const cleanUp = () => {
      overlay.classList.remove('active');
      btnOk.onclick = null;
      btnCancel.onclick = null;
    };

    btnOk.onclick = () => {
      cleanUp();
      if (onOk) onOk();
    };

    btnCancel.onclick = () => {
      cleanUp();
    };

    overlay.classList.add('active');
  }

  launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Schwerkraft
        p.vx *= 0.98;
        p.rotation += p.vr;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    };

    render();
  }
}

// Global Toast Callback für Achievements
window.showAchievementToast = (achievement) => {
  if (window.app) {
    window.app.showToast(`Erfolg freigeschaltet: ${achievement.title}!`, achievement.icon);
    if (window.sfx) window.sfx.playStreak();
  }
};

// Initialisiere die Applikation, sobald das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});

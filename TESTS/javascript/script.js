// Answers object - populated dynamically by renderFromPlainText from sourceA
const answers = {};
// Short answer key - populated dynamically by renderFromPlainText from sourceB
const shortAnswerKey = {};
// Blanks answer key for Medium Test
const blanksAnswerKey = {};

// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
  const arr = [...array]; // Create a copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Lenient normalization for comparing answers (case/spacing/punctuation)
function normalizeAnswer(text) {
  if (text == null) return '';
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/&/g, ' and ') // treat & as 'and'
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ') // collapse punctuation to spaces
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

// Conservative synonyms for blanks to accept common variations
const RAW_SYNONYMS = {
  Authentication: ['auth', 'authenticate', 'authentication'],
  Encryption: ['encrypt', 'encrypted', 'encryption', 'crypto'],
  Availability: ['uptime', 'available', 'availability'],
  Maintainability: ['maintainable', 'maintenance', 'maintainability'],
  Portability: ['portable', 'portability'],
  Performance: ['speed', 'throughput', 'performance'],
  Reliability: ['reliable', 'reliability'],
  Usability: ['user friendly', 'usable', 'usability'],
  Security: ['secure', 'security'],
  Data: ['data', 'information', 'info'],
  Consistency: ['consistent', 'consistency'],
  Results: ['outcomes', 'results'],
  Backlog: ['backlog', 'product backlog'],
  Change: ['change', 'change control', 'change management'],
  Cost: ['cost', 'budget'],
  Time: ['time', 'schedule'],
  Scope: ['scope', 'requirements scope'],
};
const SYN_MAP = (() => {
  const m = {};
  for (const [k, arr] of Object.entries(RAW_SYNONYMS)){
    const nk = normalizeAnswer(k);
    m[nk] = new Set(arr.map(normalizeAnswer).concat(nk));
  }
  return m;
})();
function isEquivalentAnswer(user, expected){
  const u = normalizeAnswer(user);
  const e = normalizeAnswer(expected);
  if (u === e) return true;
  const set = SYN_MAP[e];
  return set ? set.has(u) : false;
}

    function toggleTest(test) {
      // Hide all forms including results page
      const testA = document.getElementById('testA');
      const testB = document.getElementById('testB');
      const testC = document.getElementById('testC');
      const resultsPage = document.getElementById('resultsPage');
      
      if (testA) testA.classList.add('hidden');
      if (testB) testB.classList.add('hidden');
      if (testC) testC.classList.add('hidden');
      if (resultsPage) resultsPage.classList.add('hidden');
      
      // Hide intro page once a test is selected
      const intro = document.getElementById('introPage');
      if (intro) intro.style.display = 'none';
      // No toggle bar or start buttons present
      
      // Reset the selected test
      const formId = 'test' + test;
      // Re-randomize questions each time a test is started
      if (window.rerandomizeTest) {
        window.rerandomizeTest(test);
      }
      resetForm(test);
      
      // Show the selected test and reset to first question
      document.getElementById(formId).classList.remove('hidden');
      if (window.currentIndex && window.showQuestion) {
        window.currentIndex[formId] = 0;
        window.showQuestion(formId, 0);
      }
      // Update backdrop to new layout
      if (window.requestBackdropUpdate) { window.requestBackdropUpdate(); }
    }

    function submitTest(test) {
      const form = document.getElementById('test' + test);
      if (!form) return;
      const questions = form.querySelectorAll('.question');
      let correctCount = 0;
      let totalCount = questions.length;
      const details = [];

      questions.forEach((q, idx) => {
        const firstInput = q.querySelector('input');
        const inputName = firstInput ? firstInput.name : null;
        const questionText = q.querySelector('p')?.textContent || `Question ${idx+1}`;
        let correctAnswer = null;
        let explanation = '';
        if (test === 'C') {
          // Derive qId from first input (e.g., q1-b1 -> q1)
          const baseName = inputName ? String(inputName).split('-')[0] : null;
          const key = baseName;
          const entry = key ? blanksAnswerKey[key] : null;
          if (entry) {
            correctAnswer = Array.isArray(entry.answers) ? entry.answers.join(', ') : '';
            explanation = entry.explanation || '';
          }
        } else {
          const rawAnswer = inputName ? (test === 'B' ? shortAnswerKey[inputName] : answers[inputName]) : null;
          correctAnswer = rawAnswer ? String(rawAnswer).split('|')[0].trim() : null;
          if (rawAnswer) {
            const parts = String(rawAnswer).split('|');
            explanation = parts.length > 1 ? parts.slice(1).join('|').trim() : (test === 'B' ? String(rawAnswer).trim() : '');
          }
        }
        let userAnswer = "";
        let isCorrect = false;

        if (q.querySelector('input[type="radio"]')) {
          const selected = q.querySelector('input[type="radio"]:checked');
          if (selected) userAnswer = selected.value;
          isCorrect = userAnswer === correctAnswer;
        } else if (test !== 'C') {
          const textInput = q.querySelector('input[type="text"]');
          userAnswer = textInput ? textInput.value.trim() : "";
          isCorrect = userAnswer.toLowerCase() === (correctAnswer || '').toLowerCase();
        } else {
          // blanks: compare each blank with expected (order-independent)
          const blanks = Array.from(q.querySelectorAll('input[type="text"].blank'));
          const baseName = inputName ? String(inputName).split('-')[0] : null;
          const entry = baseName ? blanksAnswerKey[baseName] : null;
          const expected = entry && Array.isArray(entry.answers) ? entry.answers : [];
          const answersGiven = blanks.map(inp => (inp.value || '').trim());
          userAnswer = answersGiven.join(', ');
          
          // Check if answers match regardless of order
          if (expected.length === answersGiven.length) {
            const expectedCopy = [...expected];
            const givenCopy = [...answersGiven];
            isCorrect = givenCopy.every(givenAns => {
              const matchIndex = expectedCopy.findIndex(expAns => isEquivalentAnswer(givenAns, expAns));
              if (matchIndex !== -1) {
                expectedCopy.splice(matchIndex, 1); // Remove matched answer
                return true;
              }
              return false;
            });
          } else {
            isCorrect = false;
          }
        }

        if (isCorrect) correctCount++;
        details.push({
          num: idx + 1,
          question: questionText,
          userAnswer: userAnswer || '(no answer)',
          correctAnswer: correctAnswer,
          explanation: explanation,
          isCorrect: isCorrect
        });
      });

      showResults(test, correctCount, totalCount, details);
    }

    function resetForm(test) {
      const form = document.getElementById('test' + test);
      if (!form) return;
      form.reset();
      // hide and clear answer boxes
      const answersEls = form.querySelectorAll('.answer');
      answersEls.forEach(a => {
        a.classList.add('hidden');
        a.textContent = '';
        a.style.display = 'none';
      });
    }

    let lastTest = 'A';
    function showResults(test, correctCount, totalCount, details) {
      lastTest = test;
      // Hide tests, show results
      document.getElementById('testA').classList.add('hidden');
      document.getElementById('testB').classList.add('hidden');
      document.getElementById('testC').classList.add('hidden');
      document.getElementById('resultsPage').classList.remove('hidden');
      // Ensure results page can capture key events: set focus
      const rp = document.getElementById('resultsPage');
      if (rp) { rp.setAttribute('tabindex','0'); try { rp.focus({ preventScroll: true }); } catch(_) { rp.focus(); } }
      
      // No toggle bar; only Try Again at top
      // Update backdrop for results layout
      if (window.requestBackdropUpdate) { window.requestBackdropUpdate(); }

      // Update title with friendly test name
      const testName = (test === 'A') ? 'Easy Test' : (test === 'B' ? 'Hard Test' : 'Medium Test');
      document.getElementById('resultsTitle').textContent = `${testName} Results`;
      // Avoid focusing the title to prevent a visible focus rectangle; resultsPage has focus.

      // Calculate percentage
      const percentage = Math.round((correctCount / totalCount) * 100);

      // Update score display
      document.getElementById('scoreNumber').textContent = `${correctCount}/${totalCount}`;
      document.getElementById('scorePercentage').textContent = `${percentage}%`;

      // Set message based on score
      const messageEl = document.getElementById('resultsMessage');
      if (percentage >= 90) {
        messageEl.textContent = 'Excellent work! 🎉';
        messageEl.style.color = '#2ecc71';
      } else if (percentage >= 80) {
        messageEl.textContent = 'Great job! 👍';
        messageEl.style.color = '#27ae60';
      } else if (percentage >= 70) {
        messageEl.textContent = 'Good effort! 💪';
        messageEl.style.color = '#f39c12';
      } else if (percentage >= 60) {
        messageEl.textContent = 'Keep practicing! 📚';
        messageEl.style.color = '#e67e22';
      } else {
        messageEl.textContent = 'Review and try again! 📖';
        messageEl.style.color = '#e74c3c';
      }

      // Build detailed results
      const detailsEl = document.getElementById('resultsDetails');
      let detailsHtml = '<h3>Question Review</h3>';
      details.forEach(d => {
        const icon = d.isCorrect ? '✓' : '✗';
        const statusClass = d.isCorrect ? 'correct' : 'incorrect';
        detailsHtml += `
          <div class="result-item ${statusClass}">
            <div class="result-header">
              <span class="result-icon">${icon}</span>
              <span class="result-num">Question ${d.num}</span>
            </div>
            <div class="result-question">${d.question}</div>
            <div class="result-answer">Your answer: <strong>${d.userAnswer}</strong></div>
            ${!d.isCorrect ? `<div class="result-correct">Correct answer: <strong>${d.correctAnswer}</strong></div>` : ''}
            ${d.explanation ? `<div class="result-explanation">${d.explanation}</div>` : ''}
          </div>
        `;
      });
      detailsEl.innerHTML = detailsHtml;
    }

    // Attach event listeners to buttons (replace inline onclicks)
    document.addEventListener('DOMContentLoaded', function() {
      // Factory functions to build question HTML
      function createTFQuestion(qId, text){
        const qNum = qId.replace(/^q/, '');
        const idTrue = `${qId}-t`;
        const idFalse = `${qId}-f`;
        return `\n<div class="question" role="group" aria-labelledby="lbl-${qId}">\n  <p id="lbl-${qId}"><span class="qnum">Q${qNum}.</span> ${text}</p>\n  <label for="${idTrue}"><input id="${idTrue}" type="radio" name="${qId}" value="True"> True</label>\n  <label for="${idFalse}"><input id="${idFalse}" type="radio" name="${qId}" value="False"> False</label>\n  <div class="answer hidden" id="ans-${qId}" aria-live="polite"></div>\n</div>`;
      }
      function createMCQuestion(qId, text, options){
        const qNum = qId.replace(/^q/, '');
        // Shuffle the options for multiple choice questions
        const shuffledOptions = shuffleArray(options);
        const optionsHtml = shuffledOptions.map((val, i) => {
          const oid = `${qId}-o${i+1}`;
          return `  <label for="${oid}"><input id="${oid}" type="radio" name="${qId}" value="${val}"> ${val}</label>`;
        }).join('\n');
        return `\n<div class="question" role="group" aria-labelledby="lbl-${qId}">\n  <p id="lbl-${qId}"><span class="qnum">Q${qNum}.</span> ${text}</p>\n${optionsHtml}\n  <div class="answer hidden" id="ans-${qId}" aria-live="polite"></div>\n</div>`;
      }
      function createShortQuestion(qId, text){
        const qNum = qId.replace(/^q/, '');
        const inId = `${qId}-txt`;
        return `\n<div class="question" role="group" aria-labelledby="lbl-${qId}">\n  <p id="lbl-${qId}"><span class="qnum">Q${qNum}.</span> ${text}</p>\n  <input id="${inId}" type="text" name="${qId}" style="width:100%" aria-describedby="ans-${qId}">\n  <div class="answer hidden" id="ans-${qId}" aria-live="polite"></div>\n</div>`;
      }
      function createBlanksQuestion(qId, text){
        // Replace each occurrence of ___ with a text input
        let idx = 1;
        const replaced = text.replace(/_{3,}/g, () => {
          const name = `${qId}-b${idx}`;
          const inId = `${qId}-b${idx}-id`;
          const html = `<span class="blank-wrap"><input id="${inId}" type="text" class="blank" name="${name}" style="min-width:120px" aria-describedby="ans-${qId}"></span>`;
          idx += 1;
          return html;
        });
        const qNum = qId.replace(/^q/, '');
        return `\n<div class="question" role="group" aria-labelledby="lbl-${qId}">\n  <p id="lbl-${qId}"><span class="qnum">Q${qNum}.</span> ${replaced}</p>\n  <div class="answer hidden" id="ans-${qId}" aria-live="polite"></div>\n</div>`;
      }
            // If plain-text sources exist, render questions from them for easy editing
            function renderFromPlainText(formId, sourceId, type){
              const sourceEl = document.getElementById(sourceId);
              const form = document.getElementById(formId);
              if (!sourceEl || !form) return false;
              // Prevent double rendering of the same form
              if (form.dataset.rendered === '1') return true;
              const raw = (sourceEl.textContent || '').trim();
              if (!raw) return false;
              const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
              // Strip Q#: and A#: prefixes from lines
              const cleanedLines = lines.map(line => line.replace(/^[QA]\d+:\s*/, ''));
              if (!cleanedLines.length) return false;
              // Preserve header, progress, actions
              const headerHtml = form.querySelector('h2')?.outerHTML || '';
              const progressHtml = form.querySelector('.progress')?.outerHTML || '';
              const actionsEl = form.querySelector('.form-actions');
              let html = `${headerHtml}\n${progressHtml}`;
              
              let qNum = 0;
              let skipNext = false;
              for (let i = 0; i < cleanedLines.length; i++) {
                if (skipNext) {
                  skipNext = false;
                  continue;
                }
                const text = cleanedLines[i];
                // Check if this line contains question options (has multiple | separators)
                const pipeCount = (text.match(/\|/g) || []).length;
                
                // Determine question line by type
                const hasBlanks = /_{3,}/.test(text);
                const isQuestion = (type === 'choice' && pipeCount >= 1)
                                  || (type === 'text' && pipeCount === 0 && text.length > 0)
                                  || (type === 'blanks' && hasBlanks);
                
                if (isQuestion) {
                  // This is a question line
                  qNum++;
                  const qId = `q${qNum}`;
                  
                  if (type === 'choice'){
                    const parts = text.split('|').map(s => s.trim()).filter(Boolean);
                    const questionText = parts[0] || text;
                    const optsRaw = parts.slice(1);
                    const opts = optsRaw.length ? optsRaw : ['True','False'];
                    
                    html += opts.length === 2 && opts[0]==='True' && opts[1]==='False'
                      ? createTFQuestion(qId, questionText)
                      : createMCQuestion(qId, questionText, opts);
                    
                    // Check next line for answer
                    if (i + 1 < cleanedLines.length) {
                      const nextLine = cleanedLines[i + 1];
                      const nextPipeCount = (nextLine.match(/\|/g) || []).length;
                      // If next line has 1 pipe, it's the answer line
                      if (nextPipeCount === 1) {
                        const answerParts = nextLine.split('|').map(s => s.trim());
                        if (answerParts.length === 2) {
                          answers[qId] = answerParts[0] + ' | ' + answerParts[1];
                          skipNext = true; // Skip the answer line in next iteration
                        }
                      }
                    }
                  } else if (type === 'text') {
                    // Short answer question
                    html += createShortQuestion(qId, text);
                    // Check next line for answer
                    if (i + 1 < cleanedLines.length) {
                      const nextLine = cleanedLines[i + 1];
                      // Next line with content is the answer
                      if (nextLine.trim().length > 0) {
                        shortAnswerKey[qId] = nextLine;
                        skipNext = true; // Skip the answer line
                      }
                    }
                  } else if (type === 'blanks') {
                    // Fill-in-the-blanks question: text contains ___ placeholders
                    html += createBlanksQuestion(qId, text);
                    if (i + 1 < cleanedLines.length) {
                      const nextLine = cleanedLines[i + 1];
                      const parts = nextLine.split('|').map(s => s.trim());
                      // Count blanks to map expected answers
                      const blanksCount = (text.match(/_{3,}/g) || []).length;
                      if (parts.length >= blanksCount) {
                        const answersArr = parts.slice(0, blanksCount);
                        const explanation = parts.slice(blanksCount).join('|').trim();
                        blanksAnswerKey[qId] = { answers: answersArr, explanation };
                        skipNext = true;
                      }
                    }
                  }
                }
              }
              
              html += `\n${actionsEl ? actionsEl.outerHTML : ''}`;
              form.innerHTML = html;
              // Mark as rendered to avoid duplicates on subsequent calls
              form.dataset.rendered = '1';
              return true;
            }

            // Try to render from text sources; fallback to existing markup if not present
            // If sourceA is empty, extract Test A questions from existing HTML and collapse markup
            function migrateTestAIfNeeded(){
              const srcA = document.getElementById('sourceA');
              if (!srcA) return;
              const hasContent = (srcA.textContent||'').trim().length > 0;
              if (hasContent) return;
              const formA = document.getElementById('testA');
              if (!formA) return;
              const qEls = Array.from(formA.querySelectorAll('.question'));
              if (!qEls.length) return;
              const lines = qEls.map(q => {
                const text = (q.querySelector('p')?.textContent || '').replace(/^\s*\d+\.?\s*/, '').trim();
                const radios = Array.from(q.querySelectorAll('input[type="radio"]'));
                if (radios.length){
                  const opts = radios.map(r => (r.value||'').trim());
                  return [text, ...opts].join(' | ');
                } else {
                  return text;
                }
              });
              srcA.textContent = lines.join('\n');
            }
            migrateTestAIfNeeded();
            // Minimize both forms, then render from sources to remove static markup
            (function(){
              const formIds = ['testA','testB','testC'];
              formIds.forEach(fid => {
                const form = document.getElementById(fid);
                if (!form) return;
                const headerHtml = form.querySelector('h2')?.outerHTML || '';
                const progressHtml = form.querySelector('.progress')?.outerHTML || '';
                const actionsHtml = form.querySelector('.form-actions')?.outerHTML || '';
                form.innerHTML = `${headerHtml}\n${progressHtml}\n${actionsHtml}`;
              });
            })();
            renderFromPlainText('testA','sourceA','choice');
            renderFromPlainText('testB','sourceB','text');
            renderFromPlainText('testC','sourceC','blanks');
      
      // Use event delegation on document to catch all button clicks
      document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.id === 'btnSubmitA' || target.closest('#btnSubmitA')) {
          e.preventDefault();
          e.stopPropagation();
          submitTest('A');
          return false;
        }
        
        if (target.id === 'btnSubmitB' || target.closest('#btnSubmitB')) {
          e.preventDefault();
          e.stopPropagation();
          submitTest('B');
          return false;
        }
        if (target.id === 'btnSubmitC' || target.closest('#btnSubmitC')) {
          e.preventDefault();
          e.stopPropagation();
          submitTest('C');
          return false;
        }
        // Clear current question buttons
        function clearCurrentQuestion(formId){
          const form = document.getElementById(formId);
          if (!form) return;
          const idx = window.currentIndex ? window.currentIndex[formId] : 0;
          const questions = Array.from(form.querySelectorAll('.question'));
          const q = questions[idx];
          if (!q) return;
          // Clear radios and text inputs
          q.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
          q.querySelectorAll('input[type="text"]').forEach(t => { t.value = ''; });
          // Hide any answer feedback
          const ansDiv = q.querySelector('.answer');
          if (ansDiv){ ansDiv.classList.add('hidden'); ansDiv.style.display='none'; ansDiv.textContent=''; }
        }
        if (target.id === 'btnResetB' || target.closest('#btnResetB')) { e.preventDefault(); clearCurrentQuestion('testB'); return false; }
        if (target.id === 'btnResetC' || target.closest('#btnResetC')) { e.preventDefault(); clearCurrentQuestion('testC'); return false; }
      }, true); // Use capture phase
      
      // Removed toggle bar start buttons
      // Intro page start buttons
      const startA = document.getElementById('startTestA');
      if (startA) startA.addEventListener('click', function(){ toggleTest('A'); });
      const startB = document.getElementById('startTestB');
      if (startB) startB.addEventListener('click', function(){ toggleTest('B'); });
      const startC = document.getElementById('startTestC');
      if (startC) startC.addEventListener('click', function(){ toggleTest('C'); });
      // Results page button
      const btnTryAgain = document.getElementById('btnTryAgain');
      if (btnTryAgain) btnTryAgain.addEventListener('click', function() {
        location.reload();
      });

      // Disable Esc behavior on results page
      const resultsPage = document.getElementById('resultsPage');
      if (resultsPage) {
        resultsPage.addEventListener('keydown', function(ev){
          if (ev.key === 'Escape') {
            ev.preventDefault();
            ev.stopPropagation();
          }
          if (ev.key === 'Enter') {
            ev.preventDefault();
            const btn = document.getElementById('btnTryAgain');
            if (btn) btn.click();
          }
        });
      }

      // Paging: show one question at a time per form
      const currentIndex = { testA: 0, testB: 0, testC: 0 };
      const autoAdvance = false; // auto-advance disabled: user must press Next to continue

      function showQuestion(formId, index){
        const form = document.getElementById(formId);
        if (!form) return;
        const questions = Array.from(form.querySelectorAll('.question'));
        const total = questions.length;
        if (!total) return;
        if (index < 0) index = 0;
        if (index >= total) index = total - 1;
        currentIndex[formId] = index;
        questions.forEach((q,i) => q.style.display = (i === index ? '' : 'none'));
        const prev = document.getElementById(formId === 'testA' ? 'btnPrevA' : (formId === 'testB' ? 'btnPrevB' : 'btnPrevC'));
        const next = document.getElementById(formId === 'testA' ? 'btnNextA' : (formId === 'testB' ? 'btnNextB' : 'btnNextC'));
        const check = document.getElementById(formId === 'testA' ? 'btnCheckA' : (formId === 'testB' ? 'btnCheckB' : 'btnCheckC'));
        const isLast = index === total - 1;
        if (prev) { prev.disabled = index === 0; prev.onclick = function(){ prevQuestion(formId); }; }
        if (next) {
          const testLetter = (formId === 'testA' ? 'A' : (formId === 'testB' ? 'B' : 'C'));
          if (isLast) {
            next.textContent = 'Submit';
            next.disabled = false;
            next.onclick = function(){ submitTest(testLetter); };
          } else {
            next.textContent = 'Next';
            next.onclick = function(){ nextQuestion(formId); };
            next.disabled = false;
          }
        }
          if (check) {
              // Always show the Show/Hide Answer button, even on the last question
              check.style.display = '';
              // Set initial label based on current question's answer visibility
              const current = questions[index];
              const ansDiv = current ? current.querySelector('.answer') : null;
              const isShown = ansDiv && !ansDiv.classList.contains('hidden') && ansDiv.style.display !== 'none' && ansDiv.textContent.trim() !== '';
              check.textContent = isShown ? 'Hide Answer' : 'Show Answer';
              check.onclick = function(){
                // Recompute current visibility at click time
                const currentQ = questions[currentIndex[formId]];
                const aDiv = currentQ ? currentQ.querySelector('.answer') : null;
                const visible = aDiv && !aDiv.classList.contains('hidden') && aDiv.style.display !== 'none' && aDiv.textContent.trim() !== '';
                const nowShown = toggleAnswer(formId, !visible);
                // Update button label after action
                check.textContent = nowShown ? 'Hide Answer' : 'Show Answer';
              };
            }
        const submitBtn = document.getElementById(formId === 'testA' ? 'btnSubmitA' : (formId === 'testB' ? 'btnSubmitB' : 'btnSubmitC'));
        if (submitBtn) {
          // Hide the separate Submit button since Next becomes Submit on the last question
          submitBtn.style.display = 'none';
          submitBtn.disabled = false;
        }
        // progress bar
        const suffix = formId === 'testA' ? 'A' : (formId === 'testB' ? 'B' : 'C');
        const progressFill = document.getElementById('progressFill' + suffix);
        const progressText = document.getElementById('progressText' + suffix);
        const pct = total > 0 ? Math.round(((index+1)/total) * 100) : 0;
        if (progressFill) progressFill.style.width = pct + '%';
        if (progressText) progressText.textContent = `${index+1} / ${total}`;
        // Auto-focus first control for current question (debounced, prevent scroll)
        const current = questions[index];
        const firstControl = current ? (current.querySelector('input.blank, input[type="radio"], input[type="text"]')) : null;
        if (firstControl) {
          clearTimeout(showQuestion._ft || 0);
          showQuestion._ft = setTimeout(() => {
            try { firstControl.focus({ preventScroll: true }); } catch(_) { firstControl.focus(); }
          }, 0);
        }
      }
      // Expose paging helpers for global calls (e.g., from toggleTest)
      window.currentIndex = currentIndex;
      window.showQuestion = showQuestion;

      function prevQuestion(formId) {
        const idx = currentIndex[formId];
        const newIdx = Math.max(0, idx - 1);
        showQuestion(formId, newIdx);
      }

      function nextQuestion(formId) {
        const form = document.getElementById(formId);
        const questions = Array.from(form.querySelectorAll('.question'));
        const idx = currentIndex[formId];
        const newIdx = Math.min(questions.length - 1, idx + 1);
        showQuestion(formId, newIdx);
      }

      function checkQuestion(formId) {
        // Legacy: kept for Enter key mapping; now delegates to show suggested answer
        toggleAnswer(formId, true);
      }

      function toggleAnswer(formId, show){
        // Show or hide the suggested/correct answer for the current question
        const form = document.getElementById(formId);
        const idx = currentIndex[formId];
        const questions = Array.from(form.querySelectorAll('.question'));
        const q = questions[idx];
        if (!q) return;
        const ansDiv = q.querySelector('.answer');
        const firstInput = q.querySelector('input');
        const inputName = firstInput ? firstInput.name : null;
        let correctAnswer = null;
        let explanation = '';
        let isBlanks = (formId === 'testC');
        let expected = [];
        if (isBlanks) {
          const baseName = inputName ? String(inputName).split('-')[0] : null;
          const entry = baseName ? blanksAnswerKey[baseName] : null;
          if (entry) {
            expected = Array.isArray(entry.answers) ? entry.answers : [];
            correctAnswer = expected.join(', ');
            explanation = entry.explanation || '';
          }
        } else {
          const rawAnswer = formId === 'testB' ? shortAnswerKey[inputName] : answers[inputName];
          correctAnswer = rawAnswer ? String(rawAnswer).split('|')[0].trim() : null;
          if (rawAnswer) {
            const parts = String(rawAnswer).split('|');
            explanation = parts.length > 1 ? parts.slice(1).join('|').trim() : (formId === 'testB' ? String(rawAnswer).trim() : '');
          }
        }
        if (!ansDiv) return false;
        if (show) {
          const isChoice = !!q.querySelector('input[type="radio"]');
          const isText = !isChoice && !isBlanks;
          if (isBlanks) {
            ansDiv.textContent = "Suggested Answers: " + (expected.length ? expected.join(', ') : (correctAnswer || '')) + (explanation ? " — " + explanation : "");
          } else if (isText) {
            ansDiv.textContent = "Suggested Answer: " + (correctAnswer || "") + (explanation ? " — " + explanation : "");
          } else {
            ansDiv.textContent = "Correct Answer: " + (correctAnswer || "") + (explanation ? " — " + explanation : "");
          }
          ansDiv.className = "answer";
          ansDiv.classList.remove('hidden'); ansDiv.style.display = 'block';
          return true;
        } else {
          ansDiv.classList.add('hidden'); ansDiv.style.display='none'; ansDiv.textContent='';
          return false;
        }
      }

      function initPagingFor(id) {
        const form = document.getElementById(id);
        if (!form) return;
        let questions = Array.from(form.querySelectorAll('.question'));
        // Dedupe any accidental duplicate question cards (same text)
        const seen = new Set();
        questions.forEach(q => {
          const t = (q.querySelector('p')?.textContent || '').trim();
          if (t && seen.has(t)) { q.remove(); }
          else if (t) { seen.add(t); }
        });
        // Refresh questions list after possible removals
        questions = Array.from(form.querySelectorAll('.question'));
        // 1) Strip leading numbers from question text (e.g., "1. ")
        //    Skip questions that contain inputs (e.g., Medium blanks) to avoid removing the inputs.
        questions.forEach(q => {
          const p = q.querySelector('p');
          if (!p) return;
          const hasInputs = !!p.querySelector('input');
          if (hasInputs) return; // keep blanks inputs intact
          p.textContent = (p.textContent || '').replace(/^\s*\d+\.?\s*/, '');
        });
        // 2) Randomize and select a subset of 10 questions
        const shuffled = questions.map(q => ({ q, sort: Math.random() }))
                                  .sort((a,b) => a.sort - b.sort)
                                  .map(({q}) => q);
        const subset = shuffled.slice(0, 10);
        const actions = form.querySelector('.form-actions');
        // Remove non-selected questions from DOM
        questions.forEach(q => { if (!subset.includes(q)) q.remove(); });
        // Append selected in chosen order
        subset.forEach(q => form.insertBefore(q, actions));
        // hide all initially
        subset.forEach(q => q.style.display = 'none');
        // show first
        showQuestion(id, 0);
        // Keyboard shortcuts: N for Next, C for Check, Enter -> Check
        // Toast utility
        const toastEl = document.getElementById('shortcutToast');
        let toastTimer = null;
        function showToast(msg){
          if (!toastEl) return;
          toastEl.textContent = msg;
          toastEl.classList.add('show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, 1200);
        }

        // Ensure only one keyboard handler is attached per form (avoid double-advance)
        if (form._kbHandler) {
          form.removeEventListener('keydown', form._kbHandler);
        }
        form._kbHandler = function(ev){
          const key = ev.key.toLowerCase();
          // Only enable home/end shortcuts for Easy Test (testA)
          if (id === 'testA') {
            if (ev.key === 'Home') {
              ev.preventDefault();
              showQuestion(id, 0);
              showToast('First');
            }
            if (ev.key === 'End') {
              ev.preventDefault();
              const total = form.querySelectorAll('.question').length;
              if (total > 0) showQuestion(id, total - 1);
              showToast('Last');
            }
          }
          // Up/Down arrows work on all tests for showing/hiding answers
          if (ev.key === 'ArrowUp') { ev.preventDefault();
            const shown = toggleAnswer(id, true);
            // Sync button label
            const btn = document.getElementById(id === 'testA' ? 'btnCheckA' : (id === 'testB' ? 'btnCheckB' : 'btnCheckC'));
            if (btn) btn.textContent = shown ? 'Hide Answer' : 'Show Answer';
            showToast('Show Answer');
          }
          if (ev.key === 'ArrowDown') { ev.preventDefault();
            const shown = toggleAnswer(id, false);
            const btn = document.getElementById(id === 'testA' ? 'btnCheckA' : (id === 'testB' ? 'btnCheckB' : 'btnCheckC'));
            if (btn) btn.textContent = shown ? 'Hide Answer' : 'Show Answer';
            showToast('Hide Answer');
          }
          if (ev.key === 'Escape') { ev.preventDefault();
            // Scope Esc clear to Hard/Medium only
            if (id !== 'testA') {
              const idx = window.currentIndex ? window.currentIndex[id] : 0;
              const q = form.querySelectorAll('.question')[idx];
              if (q) {
                q.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
                q.querySelectorAll('input[type="text"]').forEach(t => { t.value = ''; });
                const ansDiv = q.querySelector('.answer');
                if (ansDiv){ ansDiv.classList.add('hidden'); ansDiv.style.display='none'; ansDiv.textContent=''; }
              }
              showToast('Cleared');
            }
          }
          // Enter for Next, Backspace for Prev (all tests)
          if (key === 'enter'){
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')){
              ev.preventDefault();
              nextQuestion(id);
              showToast('Next');
            }
          }
          if (ev.key === 'Backspace'){
            const active = document.activeElement;
            // Only trigger if not focused on an input field
            if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA')) {
              ev.preventDefault();
              prevQuestion(id);
              showToast('Prev');
            }
          }
        };
        form.addEventListener('keydown', form._kbHandler);
        // Clickable progress text to open quick navigator (simple prompt)
        const suffix = id === 'testA' ? 'A' : (id === 'testB' ? 'B' : 'C');
        const pText = document.getElementById('progressText' + suffix);
        if (pText) {
          pText.style.cursor = 'pointer';
          pText.title = 'Jump to question';
          pText.onclick = function(){
            const total = form.querySelectorAll('.question').length;
            const ans = prompt(`Enter question number (1-${total})`);
            const num = parseInt(ans||'', 10);
            if (!isNaN(num) && num >= 1 && num <= total) showQuestion(id, num-1);
          };
        }
      }

      function initPaging() {
        initPagingFor('testA');
        initPagingFor('testB');
        initPagingFor('testC');
      }

      // Remove show-answer buttons since we validate/correct before advancing
      document.querySelectorAll('.show-answer-btn').forEach(b => b.remove());

      initPaging();

      // Responsive, edge-aware tooltip for keyboard shortcuts; click-to-toggle on mobile
      (function(){
        const helps = document.querySelectorAll('.help-shortcuts');
        // Hide help buttons on small screens in addition to CSS (robust fallback)
        function hideHelpsIfMobile(){
          const isMobile = window.innerWidth <= 700 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
          if (isMobile) {
            helps.forEach(btn => { btn.style.display = 'none'; });
          } else {
            helps.forEach(btn => { btn.style.display = ''; });
          }
        }
        hideHelpsIfMobile();
        window.addEventListener('resize', hideHelpsIfMobile);
        function positionPopover(btn){
          const pop = btn.querySelector('.popover');
          if (!pop) return;
          // responsive width
          pop.style.maxWidth = 'min(90vw, 480px)';
          const rect = btn.getBoundingClientRect();
          const popW = Math.min(480, Math.floor(window.innerWidth * 0.9));
          const spaceRight = window.innerWidth - rect.right;
          if (spaceRight < popW + 16) {
            pop.style.right = 'auto';
            pop.style.left = '0';
          } else {
            pop.style.left = 'auto';
            pop.style.right = '10px';
          }
        }
        helps.forEach(btn => {
          const pop = btn.querySelector('.popover');
          if (!pop) return;
          ['mouseenter','focus'].forEach(ev => btn.addEventListener(ev, () => positionPopover(btn)));
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const open = btn.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            positionPopover(btn);
          });
        });
        document.addEventListener('click', (e) => {
          document.querySelectorAll('.help-shortcuts.open').forEach(btn => {
            if (!btn.contains(e.target)) {
              btn.classList.remove('open');
              btn.setAttribute('aria-expanded', 'false');
            }
          });
        });
        window.addEventListener('resize', () => {
          document.querySelectorAll('.help-shortcuts').forEach(positionPopover);
        });
      })();

      // Ensure the translucent backdrop covers the full page height (not just the viewport)
      const backdrop = document.querySelector('.card-backdrop');
      const page = document.querySelector('.page');
      function updateBackdrop(){
        if (!backdrop || !page) return;
        const rect = page.getBoundingClientRect();
        // page offset relative to document
        const pageTop = page.offsetTop;
        backdrop.style.position = 'absolute';
        backdrop.style.left = (rect.left + window.pageXOffset) + 'px';
        backdrop.style.top = pageTop + 'px';
        backdrop.style.width = rect.width + 'px';
        backdrop.style.height = page.offsetHeight + 'px';
        backdrop.style.transform = 'none';
      }
      updateBackdrop();
      window.addEventListener('resize', updateBackdrop);
      // also update after a short delay in case fonts/images change layout
      setTimeout(updateBackdrop, 500);
      // Watch for layout changes (content added/removed) and update backdrop
      const observer = new MutationObserver(updateBackdrop);
      observer.observe(page, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','class'] });
      // Expose a global hook so other functions can force an update
      window.requestBackdropUpdate = updateBackdrop;

      // Helper to rebuild questions from plain text and reinitialize paging for a test
      window.rerandomizeTest = function(test){
        const formId = test === 'A' ? 'testA' : (test === 'B' ? 'testB' : 'testC');
        const sourceId = test === 'A' ? 'sourceA' : (test === 'B' ? 'sourceB' : 'sourceC');
        const type = test === 'A' ? 'choice' : (test === 'B' ? 'text' : 'blanks');
        const form = document.getElementById(formId);
        if (!form) return;
        // Clear answer maps for the given test type
        if (type === 'choice') {
          for (const k in answers) delete answers[k];
        } else if (type === 'text') {
          for (const k in shortAnswerKey) delete shortAnswerKey[k];
        } else if (type === 'blanks') {
          for (const k in blanksAnswerKey) delete blanksAnswerKey[k];
        }
        // Reset form content to header + progress + actions to avoid accumulating DOM
        const headerHtml = form.querySelector('h2')?.outerHTML || '';
        const progressHtml = form.querySelector('.progress')?.outerHTML || '';
        const actionsHtml = form.querySelector('.form-actions')?.outerHTML || '';
        form.innerHTML = `${headerHtml}\n${progressHtml}\n${actionsHtml}`;
        // Allow render again
        delete form.dataset.rendered;
        // Render from sources and reinit paging
        renderFromPlainText(formId, sourceId, type);
        initPagingFor(formId);
        // Focus first question on start
        const questions = form.querySelectorAll('.question');
        if (questions.length) {
          setTimeout(() => {
            try {
              const firstControl = questions[0].querySelector('input.blank, input[type="radio"], input[type="text"]');
              if (firstControl) firstControl.focus({ preventScroll: true });
            } catch(_) {}
          }, 0);
        }
      };
    });
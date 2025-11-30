// Landing page functionality for T/F Question Generator
// State management
let isCreatingNew = true;
let targetFileName = '';
let selectedTests = [];
let currentTestIndex = 0;
let completedTests = {
  easy: null,
  medium: null,
  hard: null
};

// Use event delegation for Create Test buttons (works regardless of when elements load)
document.addEventListener('click', function(e) {
  // Open Copilot buttons - transition from Prompt Step to Confirmation Step
  if (e.target && e.target.id === 'easyOpenCopilotBtn') {
    document.getElementById('easyPromptStep').style.display = 'none';
    document.getElementById('easyCopilotConfirmStep').style.display = 'block';
    document.querySelector('#easyEditorSection > h3').style.display = 'none';
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  if (e.target && e.target.id === 'mediumOpenCopilotBtn') {
    document.getElementById('mediumPromptStep').style.display = 'none';
    document.getElementById('mediumCopilotConfirmStep').style.display = 'block';
    document.querySelector('#mediumEditorSection > h3').style.display = 'none';
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  if (e.target && e.target.id === 'hardOpenCopilotBtn') {
    document.getElementById('hardPromptStep').style.display = 'none';
    document.getElementById('hardCopilotConfirmStep').style.display = 'block';
    document.querySelector('#hardEditorSection > h3').style.display = 'none';
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  // Copilot confirmation - "Yes, I've Copied" buttons
  if (e.target && e.target.id === 'easyCopiedConfirmBtn') {
    document.getElementById('easyCopilotConfirmStep').style.display = 'none';
    document.getElementById('easyEditorStep').style.display = 'block';
    document.querySelector('#easyEditorSection > h3').style.display = 'block';
  }
  
  if (e.target && e.target.id === 'mediumCopiedConfirmBtn') {
    document.getElementById('mediumCopilotConfirmStep').style.display = 'none';
    document.getElementById('mediumEditorStep').style.display = 'block';
    document.querySelector('#mediumEditorSection > h3').style.display = 'block';
  }
  
  if (e.target && e.target.id === 'hardCopiedConfirmBtn') {
    document.getElementById('hardCopilotConfirmStep').style.display = 'none';
    document.getElementById('hardEditorStep').style.display = 'block';
    document.querySelector('#hardEditorSection > h3').style.display = 'block';
  }
  
  // Back to Copilot buttons - reopen Copilot tab
  if (e.target && e.target.id === 'easyBackToCopilotBtn') {
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  if (e.target && e.target.id === 'mediumBackToCopilotBtn') {
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  if (e.target && e.target.id === 'hardBackToCopilotBtn') {
    window.open('https://copilot.microsoft.com', '_blank');
  }
  
  // Individual section validate buttons
  if (e.target && e.target.id === 'validateEasyBtn') {
    validateSection('easy');
  }
  
  if (e.target && e.target.id === 'validateMediumBtn') {
    validateSection('medium');
  }
  
  if (e.target && e.target.id === 'validateHardBtn') {
    validateSection('hard');
  }
  
  // Workflow navigation buttons
  if (e.target && e.target.id === 'proceedToEditorBtn') {
    e.preventDefault();
    handleProceedToEditor();
  }
  
  if (e.target && e.target.id === 'nextTestBtn') {
    handleNextTest();
  }
  
  if (e.target && e.target.id === 'nextTestBtn2') {
    handleNextTest();
  }
  
  if (e.target && e.target.id === 'nextTestBtn3') {
    handleNextTest();
  }
  
  if (e.target && e.target.id === 'finishTestsBtn') {
    handleFinishTests();
  }
  
  if (e.target && e.target.id === 'finishTestsBtn2') {
    handleFinishTests();
  }
  
  if (e.target && e.target.id === 'finishTestsBtn3') {
    handleFinishTests();
  }
  
  if (e.target && e.target.id === 'createFileBtn') {
    handleCreateFile();
  }
  
  if (e.target && e.target.id === 'backFromSelectionBtn') {
    showSection('fileName');
  }
  
  if (e.target && e.target.id === 'backFromEditSelectionBtn') {
    showSection('finalize');
    showCompletedTests();
  }
  
  if (e.target && e.target.id === 'addMoreTestsBtn') {
    handleAddMoreTests();
  }
  
  if (e.target && e.target.id === 'finalDownloadBtn') {
    handleFinalDownload();
  }
  
  if (e.target && e.target.id === 'goToLandingBtn') {
    window.location.href = 'index.html';
  }
  
  if (e.target && e.target.id === 'validateAllBtn') {
    handleValidateAll();
  }
  
  if (e.target && e.target.id === 'downloadEditedBtn') {
    handleDownloadEdited();
  }
  
  if (e.target && e.target.id === 'backToHomeBtn') {
    window.location.href = 'index.html';
  }
  
  // Return to Summary buttons
  if (e.target && e.target.id === 'returnToSummaryBtn') {
    handleReturnToSummary();
  }
  
  if (e.target && e.target.id === 'returnToSummaryBtn2') {
    handleReturnToSummary();
  }
  
  if (e.target && e.target.id === 'returnToSummaryBtn3') {
    handleReturnToSummary();
  }
  
  // Edit test selection buttons
  if (e.target && e.target.classList.contains('edit-test-btn')) {
    const testType = e.target.getAttribute('data-test-type');
    handleEditTest(testType);
  }
  
  // Copy to clipboard buttons
  if (e.target && e.target.classList.contains('copy-prompt-btn')) {
    const targetId = e.target.getAttribute('data-target');
    let promptBoxId;
    
    if (targetId === 'easyTestPrompt') promptBoxId = 'easyPromptText';
    else if (targetId === 'mediumTestPrompt') promptBoxId = 'mediumPromptText';
    else if (targetId === 'hardTestPrompt') promptBoxId = 'hardPromptText';
    
    const promptBox = document.getElementById(promptBoxId);
    
    if (promptBox) {
      navigator.clipboard.writeText(promptBox.value).then(() => {
        // Hide the copy button and show the Open Copilot button
        e.target.style.display = 'none';
        
        if (targetId === 'easyTestPrompt') {
          document.getElementById('easyOpenCopilotBtn').style.display = 'inline-block';
        } else if (targetId === 'mediumTestPrompt') {
          document.getElementById('mediumOpenCopilotBtn').style.display = 'inline-block';
        } else if (targetId === 'hardTestPrompt') {
          document.getElementById('hardOpenCopilotBtn').style.display = 'inline-block';
        }
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }
});

// Helper function to show validation message in section-specific div
function showValidationMessage(section, message, type) {
  const messageId = section + 'ValidationMessage';
  const messageDiv = document.getElementById(messageId);
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = 'validation-message ' + type;
    messageDiv.style.display = 'flex';
  }
}

// Helper function to validate individual sections
function validateSection(section) {
  console.log('validateSection called with section:', section);
  
  let editorId, sectionName, isMediumTest = false, isEasyTest = false;
  
  if (section === 'easy') {
    editorId = 'easyTestEditor';
    sectionName = 'Easy Test';
    isEasyTest = true;
  } else if (section === 'medium') {
    editorId = 'mediumTestEditor';
    sectionName = 'Medium Test';
    isMediumTest = true;
  } else if (section === 'hard') {
    editorId = 'hardTestEditor';
    sectionName = 'Hard Test';
  }
  
  console.log('Looking for textarea with id:', editorId);
  const textarea = document.getElementById(editorId);
  console.log('Textarea found:', textarea);
  
  if (!textarea) {
    console.error('Textarea not found!');
    showValidationMessage(section, 'Editor not found', 'error');
    return;
  }
  
  const content = textarea.value.trim();
  console.log('Content length:', content.length);
  
  if (!content) {
    showValidationMessage(section, 'No content to validate', 'error');
    return;
  }
  
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  try {
    let expectedQ = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line starts with Q or A
      if (line.match(/^Q\d+:/)) {
        const qNum = parseInt(line.match(/^Q(\d+):/)[1]);
        if (qNum !== expectedQ) {
          showValidationMessage(section, `Expected Q${expectedQ} but found Q${qNum}`, 'error');
          return;
        }
        
        // Check if next line is the matching A
        if (i + 1 >= lines.length) {
          showValidationMessage(section, `Q${qNum} has no corresponding answer`, 'error');
          return;
        }
        
        const nextLine = lines[i + 1];
        if (!nextLine.match(/^A\d+:/)) {
          showValidationMessage(section, `Q${qNum} must be immediately followed by A${qNum}`, 'error');
          return;
        }
        
        const aNum = parseInt(nextLine.match(/^A(\d+):/)[1]);
        if (aNum !== qNum) {
          showValidationMessage(section, `Q${qNum} must be followed by A${qNum}, but found A${aNum}`, 'error');
          return;
        }
        
        // Validate question content (at least 4 words)
        const questionContent = line.replace(/^Q\d+:\s*/, '').trim();
        const questionWords = questionContent.split(/\s+/).filter(w => w.length > 0);
        if (questionWords.length < 4) {
          showValidationMessage(section, `Q${qNum} must have at least 4 words (found ${questionWords.length})`, 'error');
          return;
        }
        
        // For Easy Test, validate True/False format
        if (isEasyTest) {
          const hasTrue = questionContent.includes('| True |') || questionContent.includes('| True');
          const hasFalse = questionContent.includes('| False |') || questionContent.includes('| False');
          
          // If True or False exists, both must be present
          if ((hasTrue || hasFalse) && !(hasTrue && hasFalse)) {
            showValidationMessage(section, `Q${qNum} contains True/False format but is missing ${hasTrue ? 'False' : 'True'}. Both "| True" and "| False" must be present`, 'error');
            return;
          }
        }
        
        // For Medium Test, validate that question contains triple underscores
        if (isMediumTest) {
          if (!questionContent.includes('___')) {
            showValidationMessage(section, `Q${qNum} must contain at least one blank (___) for fill-in-the-blank questions`, 'error');
            return;
          }
        }
        
        // Validate answer content (at least 1 word)
        const answerContent = nextLine.replace(/^A\d+:\s*/, '').trim();
        const answerWords = answerContent.split(/\s+/).filter(w => w.length > 0);
        if (answerWords.length < 1) {
          showValidationMessage(section, `A${qNum} must have at least 1 word`, 'error');
          return;
        }
        
        // Validate that answer contains "Explanation: "
        if (!answerContent.includes('Explanation:')) {
          showValidationMessage(section, `A${qNum} must include "Explanation: " followed by explanation text`, 'error');
          return;
        }
        
        // For Easy Test, validate True/False answer format
        if (isEasyTest) {
          const hasTrue = questionContent.includes('| True |') || questionContent.includes('| True');
          const hasFalse = questionContent.includes('| False |') || questionContent.includes('| False');
          
          // If question has True/False format, answer must start with True or False
          if (hasTrue && hasFalse) {
            const answerFirstWord = answerContent.split('|')[0].trim();
            if (answerFirstWord !== 'True' && answerFirstWord !== 'False') {
              showValidationMessage(section, `A${qNum} must start with "True" or "False" (not "${answerFirstWord}") when the question has True/False options`, 'error');
              return;
            }
          }
        }
        
        // For Medium Test, validate that number of blanks matches number of answer parts
        if (isMediumTest) {
          const blankCount = (questionContent.match(/___/g) || []).length;
          const answerParts = answerContent.split('|').map(p => p.trim()).filter(p => p.length > 0);
          
          // Find the "Explanation:" part
          let explanationIndex = -1;
          for (let j = 0; j < answerParts.length; j++) {
            if (answerParts[j].startsWith('Explanation:')) {
              explanationIndex = j;
              break;
            }
          }
          
          // Count answer parts (everything before "Explanation:")
          const actualAnswerCount = explanationIndex === -1 ? answerParts.length : explanationIndex;
          
          if (actualAnswerCount !== blankCount) {
            showValidationMessage(section, `Q${qNum} has ${blankCount} blank(s) (___) but A${qNum} provides ${actualAnswerCount} answer(s). Must have exactly ${blankCount} answers before "Explanation:"`, 'error');
            return;
          }
        }
        
        expectedQ++;
        i++; // Skip the answer line since we've validated it
      } else if (line.match(/^A\d+:/)) {
        showValidationMessage(section, 'Found answer without a preceding question', 'error');
        return;
      } else {
        showValidationMessage(section, 'Invalid line format. Each line must start with Q# or A#', 'error');
        return;
      }
    }
    
    // Count questions for success message
    const qCount = lines.filter(l => l.match(/^Q\d+:/)).length;
    showValidationMessage(section, `✓ Format looks good! Found ${qCount} question(s).`, 'success');
    
    // Save the validated content
    completedTests[section] = content;
    
    // Show appropriate navigation buttons based on mode and position
    const returnBtnId = section === 'easy' ? 'returnToSummaryBtn' : 
                        section === 'medium' ? 'returnToSummaryBtn2' : 'returnToSummaryBtn3';
    const nextBtnId = section === 'easy' ? 'nextTestBtn' : 
                      section === 'medium' ? 'nextTestBtn2' : 'nextTestBtn3';
    const finishBtnId = section === 'easy' ? 'finishTestsBtn' : 
                        section === 'medium' ? 'finishTestsBtn2' : 'finishTestsBtn3';
    
    if (isEditMode) {
      // In edit mode, only show return to summary button
      document.getElementById(nextBtnId).style.display = 'none';
      document.getElementById(finishBtnId).style.display = 'none';
      document.getElementById(returnBtnId).style.display = 'inline-block';
    } else {
      // Normal creation flow
      const isLastTest = currentTestIndex === selectedTests.length - 1;
      
      document.getElementById(returnBtnId).style.display = 'none';
      document.getElementById(nextBtnId).style.display = isLastTest ? 'none' : 'inline-block';
      document.getElementById(finishBtnId).style.display = isLastTest ? 'inline-block' : 'none';
    }
  } catch (error) {
    showValidationMessage(section, `Validation error - ${error.message}`, 'error');
  }
}

function showStatus(message, type) {
  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    statusMessage.style.display = 'block';
  }
}

// Workflow handler functions
function handleCreateFile() {
  const fileNameInput = document.getElementById('fileNameInput');
  const fileName = fileNameInput.value.trim();
  
  if (!fileName) {
    alert('Please enter a file name');
    return;
  }
  
  if (!fileName.match(/^[a-zA-Z0-9-_]+$/)) {
    alert('File name can only contain letters, numbers, hyphens, and underscores');
    return;
  }
  
  // Save filename
  targetFileName = fileName + '.json';
  
  // Show test selection section
  showSection('testSelection');
}

function handleProceedToEditor() {
  console.log('handleProceedToEditor called');
  
  // Get selected tests and question counts
  selectedTests = [];
  if (document.getElementById('selectEasyTest').checked) {
    const count = parseInt(document.getElementById('easyQuestionCount').value) || 10;
    if (count < 1 || count > 40) {
      showStatus('Easy test question count must be between 1 and 40', 'error');
      return;
    }
    selectedTests.push('easy');
  }
  if (document.getElementById('selectMediumTest').checked) {
    const count = parseInt(document.getElementById('mediumQuestionCount').value) || 10;
    if (count < 1 || count > 40) {
      showStatus('Medium test question count must be between 1 and 40', 'error');
      return;
    }
    selectedTests.push('medium');
  }
  if (document.getElementById('selectHardTest').checked) {
    const count = parseInt(document.getElementById('hardQuestionCount').value) || 10;
    if (count < 1 || count > 40) {
      showStatus('Hard test question count must be between 1 and 40', 'error');
      return;
    }
    selectedTests.push('hard');
  }
  
  console.log('Selected tests:', selectedTests);
  
  if (selectedTests.length === 0) {
    showStatus('Please select at least one test type', 'error');
    return;
  }
  
  currentTestIndex = 0;
  showCurrentTest();
}

function showCurrentTest() {
  const testType = selectedTests[currentTestIndex];
  const sectionName = testType + 'Editor';
  
  // Get question count for this test type
  let questionCount = 10;
  if (testType === 'easy') {
    questionCount = parseInt(document.getElementById('easyQuestionCount').value) || 10;
  } else if (testType === 'medium') {
    questionCount = parseInt(document.getElementById('mediumQuestionCount').value) || 10;
  } else if (testType === 'hard') {
    questionCount = parseInt(document.getElementById('hardQuestionCount').value) || 10;
  }
  
  // Update the prompt text with the requested number of questions
  updatePromptText(testType, questionCount);
  
  // Show the appropriate section and reset step visibility (Prompt Step visible, Confirmation and Editor Steps hidden)
  if (testType === 'easy') {
    showSection('easyEditor');
    document.getElementById('easyPromptStep').style.display = 'block';
    document.getElementById('easyCopilotConfirmStep').style.display = 'none';
    document.getElementById('easyEditorStep').style.display = 'none';
    document.querySelector('#easyEditorSection > h3').style.display = 'block';
    // Reset button visibility
    const easyCopyBtn = document.querySelector('[data-target="easyTestPrompt"]');
    if (easyCopyBtn) easyCopyBtn.style.display = 'inline-block';
    document.getElementById('easyOpenCopilotBtn').style.display = 'none';
    document.getElementById('nextTestBtn').style.display = 'none';
    document.getElementById('finishTestsBtn').style.display = 'none';
  } else if (testType === 'medium') {
    showSection('mediumEditor');
    document.getElementById('mediumPromptStep').style.display = 'block';
    document.getElementById('mediumCopilotConfirmStep').style.display = 'none';
    document.getElementById('mediumEditorStep').style.display = 'none';
    document.querySelector('#mediumEditorSection > h3').style.display = 'block';
    // Reset button visibility
    const mediumCopyBtn = document.querySelector('[data-target="mediumTestPrompt"]');
    if (mediumCopyBtn) mediumCopyBtn.style.display = 'inline-block';
    document.getElementById('mediumOpenCopilotBtn').style.display = 'none';
    document.getElementById('nextTestBtn2').style.display = 'none';
    document.getElementById('finishTestsBtn2').style.display = 'none';
  } else if (testType === 'hard') {
    showSection('hardEditor');
    document.getElementById('hardPromptStep').style.display = 'block';
    document.getElementById('hardCopilotConfirmStep').style.display = 'none';
    document.getElementById('hardEditorStep').style.display = 'none';
    document.querySelector('#hardEditorSection > h3').style.display = 'block';
    // Reset button visibility
    const hardCopyBtn = document.querySelector('[data-target="hardTestPrompt"]');
    if (hardCopyBtn) hardCopyBtn.style.display = 'inline-block';
    document.getElementById('hardOpenCopilotBtn').style.display = 'none';
    document.getElementById('nextTestBtn3').style.display = 'none';
    document.getElementById('finishTestsBtn3').style.display = 'none';
  }
  
  showStatus(`Creating ${testType} test (${currentTestIndex + 1} of ${selectedTests.length})`, 'info');
}

function updatePromptText(testType, questionCount) {
  if (testType === 'easy') {
    const promptText = `Create a true/false and multiple choice test with ${questionCount} questions using the attached file and the following format:

Q1: Functional requirements define how a system should perform. | True | False
A1: False | Explanation: Functional = what the system must do; the how is non-functional.

Q2: Which requirements analysis strategy involves looking at past results to guide future actions? | Outcome Analysis | Technology Analysis | Activity Elimination | Informal Benchmarking
A2: Outcome Analysis | Explanation: Outcome Analysis examines past results to inform future decisions.

Make sure when I copy from your clipboard there will be no asterisks in the text.`;
    document.getElementById('easyPromptText').value = promptText;
  } else if (testType === 'medium') {
    const promptText = `Create a fill-in-the-blank test with ${questionCount} questions using the attached file and the following format:

Q1: Fill in the blanks: The two main development approaches are ___ and ___.
A1: Agile | Waterfall | Explanation: Agile focuses on iteration; Waterfall is sequential.

Q2: A project's primary trade-offs are ___, ___, and ___.
A2: Scope | Time | Cost | Explanation: These form the classic project management triangle.

Make sure when I copy from your clipboard there will be no asterisks in the text.`;
    document.getElementById('mediumPromptText').value = promptText;
  } else if (testType === 'hard') {
    const promptText = `Create a short answer test with ${questionCount} questions using the attached file and the following format:

Q1: Define functional requirements and explain their purpose.
A1: Explanation: Functional requirements define what a system must do, describing its core features and tasks.

Q2: Define non-functional requirements and explain their focus.
A2: Explanation: Non-functional requirements focus on how the system performs, covering quality attributes like speed, security, and usability.

Make sure when I copy from your clipboard there will be no asterisks in the text.`;
    document.getElementById('hardPromptText').value = promptText;
  }
}

function handleNextTest() {
  const testType = selectedTests[currentTestIndex];
  const editorId = `${testType}TestEditor`;
  const content = document.getElementById(editorId).value.trim();
  
  if (!content) {
    showStatus(`Please create content for the ${testType} test before continuing`, 'error');
    return;
  }
  
  // Save the content
  completedTests[testType] = content;
  
  // Move to next test
  currentTestIndex++;
  showCurrentTest();
}

function handleFinishTests() {
  // Save the last test - it's still at currentTestIndex because we didn't increment yet
  const testType = selectedTests[currentTestIndex];
  const editorId = `${testType}TestEditor`;
  const content = document.getElementById(editorId).value.trim();
  
  if (!content) {
    showStatus(`Please create content for the ${testType} test before finishing`, 'error');
    return;
  }
  
  completedTests[testType] = content;
  
  // Show finalize section
  updateCompletedTestsList();
  showSection('finalize');
}

function updateCompletedTestsList() {
  const listDiv = document.getElementById('completedTestsList');
  listDiv.innerHTML = '<h4 style="color: #fff; margin-bottom: 16px;">Completed Tests:</h4>';
  
  if (completedTests.easy) {
    listDiv.innerHTML += '<div class="completed-test-item"><span>✓ Easy Test (Multiple Choice / True-False)</span></div>';
  }
  if (completedTests.medium) {
    listDiv.innerHTML += '<div class="completed-test-item"><span>✓ Medium Test (Fill in the Blanks)</span></div>';
  }
  if (completedTests.hard) {
    listDiv.innerHTML += '<div class="completed-test-item"><span>✓ Hard Test (Short Answer)</span></div>';
  }
}

function handleAddMoreTests() {
  // Show edit selection screen with available tests
  showSection('editSelection');
  
  // Populate the edit tests list
  const editTestsList = document.getElementById('editTestsList');
  editTestsList.innerHTML = '';
  
  const testTypes = [
    { key: 'easy', label: 'Easy Test (Multiple Choice / True-False)' },
    { key: 'medium', label: 'Medium Test (Fill in the Blanks)' },
    { key: 'hard', label: 'Hard Test (Short Answer)' }
  ];
  
  testTypes.forEach(test => {
    if (completedTests[test.key]) {
      const testCard = document.createElement('div');
      testCard.className = 'choice-card';
      testCard.style.marginBottom = '12px';
      testCard.innerHTML = `
        <div class="choice-icon">✏️</div>
        <h4 style="color: #fff; margin: 8px 0;">${test.label}</h4>
        <p style="color: #bbb; margin: 8px 0; font-size: 0.9rem;">Click to edit this test</p>
        <button class="choice-btn edit-test-btn" data-test-type="${test.key}">Edit Test</button>
      `;
      editTestsList.appendChild(testCard);
    }
  });
}

let isEditMode = false;

function handleEditTest(testType) {
  isEditMode = true;
  
  // Load the test content into the editor
  const editorId = `${testType}TestEditor`;
  const editor = document.getElementById(editorId);
  if (editor && completedTests[testType]) {
    editor.value = completedTests[testType];
  }
  
  // Show the appropriate editor section
  showSection(testType + 'Editor');
  
  // Show editor step directly (skip prompt/confirmation steps)
  document.getElementById(`${testType}PromptStep`).style.display = 'none';
  document.getElementById(`${testType}CopilotConfirmStep`).style.display = 'none';
  document.getElementById(`${testType}EditorStep`).style.display = 'block';
  document.querySelector(`#${testType}EditorSection > h3`).style.display = 'block';
  
  // Hide navigation buttons, show only return to summary button
  const returnBtnId = testType === 'easy' ? 'returnToSummaryBtn' : 
                      testType === 'medium' ? 'returnToSummaryBtn2' : 'returnToSummaryBtn3';
  const nextBtnId = testType === 'easy' ? 'nextTestBtn' : 
                    testType === 'medium' ? 'nextTestBtn2' : 'nextTestBtn3';
  const finishBtnId = testType === 'easy' ? 'finishTestsBtn' : 
                      testType === 'medium' ? 'finishTestsBtn2' : 'finishTestsBtn3';
  
  document.getElementById(nextBtnId).style.display = 'none';
  document.getElementById(finishBtnId).style.display = 'none';
  document.getElementById(returnBtnId).style.display = 'none'; // Hidden until validation
}

function handleReturnToSummary() {
  isEditMode = false;
  showSection('finalize');
  showCompletedTests();
}

function handleValidateAll() {
  const easyContent = document.getElementById('combinedEasyEditor').value;
  const mediumContent = document.getElementById('combinedMediumEditor').value;
  const hardContent = document.getElementById('combinedHardEditor').value;
  
  let hasErrors = false;
  
  // Validate Easy Test
  if (easyContent.trim()) {
    try {
      const result = validateSectionContent('easy', easyContent);
      document.getElementById('combinedEasyValidation').style.display = 'block';
      document.getElementById('combinedEasyValidation').textContent = result.message;
      document.getElementById('combinedEasyValidation').className = 'validation-message ' + result.type;
      if (result.type === 'error') hasErrors = true;
    } catch (error) {
      document.getElementById('combinedEasyValidation').style.display = 'block';
      document.getElementById('combinedEasyValidation').textContent = 'Validation error: ' + error.message;
      document.getElementById('combinedEasyValidation').className = 'validation-message error';
      hasErrors = true;
    }
  }
  
  // Validate Medium Test
  if (mediumContent.trim()) {
    try {
      const result = validateSectionContent('medium', mediumContent);
      document.getElementById('combinedMediumValidation').style.display = 'block';
      document.getElementById('combinedMediumValidation').textContent = result.message;
      document.getElementById('combinedMediumValidation').className = 'validation-message ' + result.type;
      if (result.type === 'error') hasErrors = true;
    } catch (error) {
      document.getElementById('combinedMediumValidation').style.display = 'block';
      document.getElementById('combinedMediumValidation').textContent = 'Validation error: ' + error.message;
      document.getElementById('combinedMediumValidation').className = 'validation-message error';
      hasErrors = true;
    }
  }
  
  // Validate Hard Test
  if (hardContent.trim()) {
    try {
      const result = validateSectionContent('hard', hardContent);
      document.getElementById('combinedHardValidation').style.display = 'block';
      document.getElementById('combinedHardValidation').textContent = result.message;
      document.getElementById('combinedHardValidation').className = 'validation-message ' + result.type;
      if (result.type === 'error') hasErrors = true;
    } catch (error) {
      document.getElementById('combinedHardValidation').style.display = 'block';
      document.getElementById('combinedHardValidation').textContent = 'Validation error: ' + error.message;
      document.getElementById('combinedHardValidation').className = 'validation-message error';
      hasErrors = true;
    }
  }
  
  if (!hasErrors) {
    document.getElementById('downloadEditedBtn').style.display = 'inline-block';
    alert('✓ All tests validated successfully! You can now download.');
  }
}

function validateSectionContent(section, content) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length === 0) {
    return { type: 'error', message: 'No content to validate' };
  }
  
  // Check for basic Q/A format
  let hasQ = false;
  let hasA = false;
  for (const line of lines) {
    if (line.match(/^Q\d+:/)) hasQ = true;
    if (line.match(/^A\d+:/)) hasA = true;
  }
  
  if (!hasQ || !hasA) {
    return { type: 'error', message: 'Invalid format. Questions must start with Q# and answers with A#' };
  }
  
  // Count questions
  const qCount = lines.filter(l => l.match(/^Q\d+:/)).length;
  return { type: 'success', message: `✓ Format looks good! Found ${qCount} question(s).` };
}

function handleDownloadEdited() {
  try {
    const easyContent = document.getElementById('combinedEasyEditor').value;
    const mediumContent = document.getElementById('combinedMediumEditor').value;
    const hardContent = document.getElementById('combinedHardEditor').value;
    
    // Convert to JSON
    const jsonData = convertPlainTextToJSON(
      easyContent || '',
      mediumContent || '',
      hardContent || ''
    );
    
    // Download as JSON
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetFileName || 'edited-test-' + new Date().getTime() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Change button colors
    const downloadBtn = document.getElementById('downloadEditedBtn');
    const backBtn = document.getElementById('backToHomeBtn');
    if (downloadBtn) {
      downloadBtn.style.background = '#666';
      downloadBtn.style.borderColor = '#666';
    }
    if (backBtn) {
      backBtn.style.background = '#ffd43b';
      backBtn.style.borderColor = '#ffd43b';
      backBtn.style.color = '#1a1a1a';
    }
    
    alert('✓ Test file downloaded successfully!');
  } catch (error) {
    console.error('Download error:', error);
    alert('Error creating JSON: ' + (error.message || JSON.stringify(error)));
  }
}

function handleFinalDownload() {
  try {
    // Check if we have any completed tests
    if (!completedTests.easy && !completedTests.medium && !completedTests.hard) {
      alert('No completed tests to download. Please create and validate at least one test first.');
      return;
    }
    
    // Convert completed tests to JSON
    const jsonData = convertPlainTextToJSON(
      completedTests.easy || '',
      completedTests.medium || '',
      completedTests.hard || ''
    );
    
    // Download as JSON
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetFileName || 'questions-' + new Date().getTime() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show the Go to Home Page button
    const goToLandingBtn = document.getElementById('goToLandingBtn');
    if (goToLandingBtn) {
      goToLandingBtn.style.display = 'inline-block';
    }
    
    // Change Download Test Script button to secondary style
    const downloadBtn = document.getElementById('finalDownloadBtn');
    if (downloadBtn) {
      downloadBtn.className = 'secondary-btn';
    }
    
    alert('✓ Test file downloaded successfully!');
  } catch (error) {
    console.error('Download error:', error);
    alert('Error creating JSON: ' + (error.message || JSON.stringify(error)));
  }
}

// Global showSection function (needs to be accessible before DOMContentLoaded)
function showSection(section) {
  const choiceSection = document.getElementById('choiceSection');
  const fileNameSection = document.getElementById('fileNameSection');
  const uploadArea = document.getElementById('uploadArea');
  const statusMessage = document.getElementById('statusMessage');
  const easyEditorSection = document.getElementById('easyEditorSection');
  const mediumEditorSection = document.getElementById('mediumEditorSection');
  const hardEditorSection = document.getElementById('hardEditorSection');
  const pageHeader = document.getElementById('pageHeader');
  const heroSection = document.getElementById('heroSection');
  const testSelectionSection = document.getElementById('testSelectionSection');
  const editSelectionSection = document.getElementById('editSelectionSection');
  const finalizeSection = document.getElementById('finalizeSection');
  const combinedEditorSection = document.getElementById('combinedEditorSection');
  
  if (choiceSection) choiceSection.style.display = 'none';
  if (fileNameSection) fileNameSection.style.display = 'none';
  if (uploadArea) uploadArea.style.display = 'none';
  if (statusMessage) statusMessage.style.display = 'none';
  if (easyEditorSection) easyEditorSection.style.display = 'none';
  if (mediumEditorSection) mediumEditorSection.style.display = 'none';
  if (hardEditorSection) hardEditorSection.style.display = 'none';
  if (testSelectionSection) testSelectionSection.style.display = 'none';
  if (editSelectionSection) editSelectionSection.style.display = 'none';
  if (finalizeSection) finalizeSection.style.display = 'none';
  if (combinedEditorSection) combinedEditorSection.style.display = 'none';
  
  // Hide header and hero when in editor, fileName, testSelection, editSelection, finalize, or combinedEditor sections
  const editorSections = ['easyEditor', 'mediumEditor', 'hardEditor'];
  if (editorSections.includes(section) || section === 'fileName' || section === 'testSelection' || section === 'editSelection' || section === 'finalize' || section === 'combinedEditor') {
    if (pageHeader) pageHeader.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    if (section === 'easyEditor' && easyEditorSection) {
      easyEditorSection.style.display = 'block';
    } else if (section === 'mediumEditor' && mediumEditorSection) {
      mediumEditorSection.style.display = 'block';
    } else if (section === 'hardEditor' && hardEditorSection) {
      hardEditorSection.style.display = 'block';
    } else if (section === 'fileName' && fileNameSection) {
      fileNameSection.style.display = 'block';
    } else if (section === 'testSelection' && testSelectionSection) {
      testSelectionSection.style.display = 'block';
    } else if (section === 'editSelection' && editSelectionSection) {
      editSelectionSection.style.display = 'block';
    } else if (section === 'finalize' && finalizeSection) {
      finalizeSection.style.display = 'block';
    } else if (section === 'combinedEditor' && combinedEditorSection) {
      combinedEditorSection.style.display = 'block';
    }
  } else {
    if (pageHeader) pageHeader.style.display = 'flex';
    if (heroSection) heroSection.style.display = 'block';
    
    if (section === 'choice' && choiceSection) {
      choiceSection.style.display = 'grid';
    } else if (section === 'upload' && uploadArea) {
      uploadArea.style.display = 'block';
    }
  }
}

// Function to validate and convert plain text format to JSON
function convertPlainTextToJSON(easyContent, mediumContent, hardContent) {
  const result = {
    testName: targetFileName ? targetFileName.replace('.json', '').replace(/-/g, ' ') : 'Practice Test',
    easyTest: [],
    mediumTest: [],
    hardTest: []
  };
  
  // Helper function to validate Q/A pairing and return error info
  function validateQAPairing(lines, sectionName, originalContent, isMediumTest = false, isEasyTest = false) {
    const cleanLines = lines.filter(l => l);
    let expectedQ = 1;
    
    for (let i = 0; i < cleanLines.length; i++) {
      const line = cleanLines[i];
      
      // Check if line starts with Q or A
      if (line.match(/^Q\d+:/)) {
        const qNum = parseInt(line.match(/^Q(\d+):/)[1]);
        if (qNum !== expectedQ) {
          return {
            error: true,
            message: `Expected Q${expectedQ} but found Q${qNum}`,
            section: sectionName,
            line: line
          };
        }
        
        // Check if next line is the matching A
        if (i + 1 >= cleanLines.length) {
          return {
            error: true,
            message: `Q${qNum} has no corresponding answer`,
            section: sectionName,
            line: line
          };
        }
        
        const nextLine = cleanLines[i + 1];
        if (!nextLine.match(/^A\d+:/)) {
          return {
            error: true,
            message: `Q${qNum} must be immediately followed by A${qNum}`,
            section: sectionName,
            line: nextLine
          };
        }
        
        const aNum = parseInt(nextLine.match(/^A(\d+):/)[1]);
        if (aNum !== qNum) {
          return {
            error: true,
            message: `Q${qNum} must be followed by A${qNum}, but found A${aNum}`,
            section: sectionName,
            line: nextLine
          };
        }
        
        // Validate question content (at least 4 words)
        const questionContent = line.replace(/^Q\d+:\s*/, '').trim();
        const questionWords = questionContent.split(/\s+/).filter(w => w.length > 0);
        if (questionWords.length < 4) {
          return {
            error: true,
            message: `Q${qNum} must have at least 4 words (found ${questionWords.length})`,
            section: sectionName,
            line: line
          };
        }
        
        // For Easy Test, validate True/False format
        if (isEasyTest) {
          const hasTrue = questionContent.includes('| True |') || questionContent.includes('| True');
          const hasFalse = questionContent.includes('| False |') || questionContent.includes('| False');
          
          // If True or False exists, both must be present
          if ((hasTrue || hasFalse) && !(hasTrue && hasFalse)) {
            return {
              error: true,
              message: `Q${qNum} contains True/False format but is missing ${hasTrue ? 'False' : 'True'}. Both "| True" and "| False" must be present`,
              section: sectionName,
              line: line
            };
          }
        }
        
        // For Medium Test, validate that question contains triple underscores
        if (isMediumTest) {
          if (!questionContent.includes('___')) {
            return {
              error: true,
              message: `Q${qNum} must contain at least one blank (___) for fill-in-the-blank questions`,
              section: sectionName,
              line: line
            };
          }
        }
        
        // Validate answer content (at least 1 word)
        const answerContent = nextLine.replace(/^A\d+:\s*/, '').trim();
        const answerWords = answerContent.split(/\s+/).filter(w => w.length > 0);
        if (answerWords.length < 1) {
          return {
            error: true,
            message: `A${qNum} must have at least 1 word`,
            section: sectionName,
            line: nextLine
          };
        }
        
        // Validate that answer contains "Explanation: "
        if (!answerContent.includes('Explanation:')) {
          return {
            error: true,
            message: `A${qNum} must include "Explanation: " followed by explanation text`,
            section: sectionName,
            line: nextLine
          };
        }
        
        // For Easy Test, validate True/False answer format
        if (isEasyTest) {
          const hasTrue = questionContent.includes('| True |') || questionContent.includes('| True');
          const hasFalse = questionContent.includes('| False |') || questionContent.includes('| False');
          
          // If question has True/False format, answer must start with True or False
          if (hasTrue && hasFalse) {
            const answerFirstWord = answerContent.split('|')[0].trim();
            if (answerFirstWord !== 'True' && answerFirstWord !== 'False') {
              return {
                error: true,
                message: `A${qNum} must start with "True" or "False" (not "${answerFirstWord}") when the question has True/False options`,
                section: sectionName,
                line: nextLine
              };
            }
          }
        }
        
        // For Medium Test, validate that number of blanks matches number of answer parts
        if (isMediumTest) {
          const blankCount = (questionContent.match(/___/g) || []).length;
          const answerParts = answerContent.split('|').map(p => p.trim()).filter(p => p.length > 0);
          
          // Find the "Explanation:" part
          let explanationIndex = -1;
          for (let i = 0; i < answerParts.length; i++) {
            if (answerParts[i].startsWith('Explanation:')) {
              explanationIndex = i;
              break;
            }
          }
          
          // Count answer parts (everything before "Explanation:")
          const actualAnswerCount = explanationIndex === -1 ? answerParts.length : explanationIndex;
          
          if (actualAnswerCount !== blankCount) {
            return {
              error: true,
              message: `Q${qNum} has ${blankCount} blank(s) (___) but A${qNum} provides ${actualAnswerCount} answer(s). Must have exactly ${blankCount} answers before "Explanation:"`,
              section: sectionName,
              line: nextLine
            };
          }
        }
        
        expectedQ++;
        i++; // Skip the answer line since we've validated it
      } else if (line.match(/^A\d+:/)) {
        return {
          error: true,
          message: `Found answer without a preceding question`,
          section: sectionName,
          line: line
        };
      } else {
        return {
          error: true,
          message: `Invalid line format. Each line must start with Q# or A#`,
          section: sectionName,
          line: line
        };
      }
    }
    
    return { error: false };
  }
  
  // Parse Easy Test
  const easyLines = easyContent.split('\n').map(l => l.trim()).filter(l => l);
  if (easyLines.length > 0) {
    const validation = validateQAPairing(easyLines, 'Easy Test', easyContent, false, true);
    if (validation.error) {
      validation.textareaId = 'easyTestEditor';
      throw validation;
    }
    
    let currentQ = null;
    for (let line of easyLines) {
      if (line.match(/^Q\d+:/)) {
        currentQ = { question: line.replace(/^Q\d+:\s*/, '') };
        if (line.includes('|')) {
          const parts = currentQ.question.split('|').map(p => p.trim());
          currentQ.question = parts[0];
          currentQ.options = parts.slice(1);
        }
      } else if (line.match(/^A\d+:/) && currentQ) {
        const answerText = line.replace(/^A\d+:\s*/, '');
        const parts = answerText.split('|').map(p => p.trim());
        currentQ.answer = parts[0];
        currentQ.explanation = parts.slice(1).join(' | ');
        result.easyTest.push(currentQ);
        currentQ = null;
      }
    }
  }
  
  // Parse Medium Test
  const mediumLines = mediumContent.split('\n').map(l => l.trim()).filter(l => l);
  if (mediumLines.length > 0) {
    const validation = validateQAPairing(mediumLines, 'Medium Test', mediumContent, true);
    if (validation.error) {
      validation.textareaId = 'mediumTestEditor';
      throw validation;
    }
    
    let currentQ = null;
    for (let line of mediumLines) {
      if (line.match(/^Q\d+:/)) {
        currentQ = { question: line.replace(/^Q\d+:\s*/, '') };
        currentQ.blanks = [];
      } else if (line.match(/^A\d+:/) && currentQ) {
        const answerText = line.replace(/^A\d+:\s*/, '');
        const parts = answerText.split('|').map(p => p.trim());
        const blankCount = (currentQ.question.match(/___/g) || []).length;
        currentQ.blanks = parts.slice(0, blankCount);
        currentQ.explanation = parts.slice(blankCount).join(' | ');
        result.mediumTest.push(currentQ);
        currentQ = null;
      }
    }
  }
  
  // Parse Hard Test
  const hardLines = hardContent.split('\n').map(l => l.trim()).filter(l => l);
  if (hardLines.length > 0) {
    const validation = validateQAPairing(hardLines, 'Hard Test', hardContent);
    if (validation.error) {
      validation.textareaId = 'hardTestEditor';
      throw validation;
    }
    
    let currentQ = null;
    for (let line of hardLines) {
      if (line.match(/^Q\d+:/)) {
        currentQ = { question: line.replace(/^Q\d+:\s*/, '') };
      } else if (line.match(/^A\d+:/) && currentQ) {
        currentQ.answer = line.replace(/^A\d+:\s*/, '');
        result.hardTest.push(currentQ);
        currentQ = null;
      }
    }
  }
  
  return result;
}

// Helper function to populate editors from JSON data
function populateEditorsFromJSON(jsonData) {
  let easyText = '';
  let mediumText = '';
  let hardText = '';
  
  if (jsonData.easyTest && jsonData.easyTest.length > 0) {
    jsonData.easyTest.forEach((q, i) => {
      const qNum = i + 1;
      if (q.options && q.options.length > 0) {
        easyText += `Q${qNum}: ${q.question} | ${q.options.join(' | ')}\n`;
      } else {
        easyText += `Q${qNum}: ${q.question}\n`;
      }
      easyText += `A${qNum}: ${q.answer}`;
      if (q.explanation) easyText += ` | ${q.explanation}`;
      easyText += '\n\n';
    });
  }
  
  if (jsonData.mediumTest && jsonData.mediumTest.length > 0) {
    jsonData.mediumTest.forEach((q, i) => {
      const qNum = i + 1;
      mediumText += `Q${qNum}: ${q.question}\n`;
      mediumText += `A${qNum}: ${q.blanks.join(' | ')}`;
      if (q.explanation) mediumText += ` | ${q.explanation}`;
      mediumText += '\n\n';
    });
  }
  
  if (jsonData.hardTest && jsonData.hardTest.length > 0) {
    jsonData.hardTest.forEach((q, i) => {
      const qNum = i + 1;
      hardText += `Q${qNum}: ${q.question}\n`;
      hardText += `A${qNum}: ${q.answer}\n\n`;
    });
  }
  
  document.getElementById('easyTestEditor').value = easyText.trim();
  document.getElementById('mediumTestEditor').value = mediumText.trim();
  document.getElementById('hardTestEditor').value = hardText.trim();
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const statusMessage = document.getElementById('statusMessage');
  const choiceSection = document.getElementById('choiceSection');
  const fileNameSection = document.getElementById('fileNameSection');
  const newFileChoice = document.getElementById('newFileChoice');
  const existingFileChoice = document.getElementById('existingFileChoice');
  const backBtn = document.getElementById('backBtn');
  const proceedBtn = document.getElementById('proceedBtn');
  const fileNameInput = document.getElementById('fileNameInput');
  const sectionTitle = document.getElementById('sectionTitle');
  
  // Check if we're on the landing page (has these elements)
  if (!uploadArea || !choiceSection) return;
  
  // Early exit if critical elements don't exist
  if (!newFileChoice || !existingFileChoice) return;
  
  // Choice selection
  newFileChoice.addEventListener('click', () => {
    isCreatingNew = true;
    sectionTitle.textContent = 'Create New Test File';
    const newFileNameGroup = document.getElementById('newFileNameGroup');
    if (newFileNameGroup) newFileNameGroup.style.display = 'block';
    showSection('fileName');
  });
  
  // Run Practice Test choice
  const runPracticeChoice = document.getElementById('runPracticeChoice');
  if (runPracticeChoice) {
    runPracticeChoice.addEventListener('click', () => {
      // Create a temporary file input to prompt for JSON file
      const tempFileInput = document.createElement('input');
      tempFileInput.type = 'file';
      tempFileInput.accept = '.json';
      
      tempFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
          const text = await file.text();
          const jsonData = JSON.parse(text);
          
          // Validate JSON structure
          if (!jsonData.easyTest || !jsonData.mediumTest || !jsonData.hardTest) {
            alert('Invalid JSON format. Must contain easyTest, mediumTest, and hardTest sections.');
            return;
          }
          
          // Encode the JSON data to pass via URL hash (works with file:// protocol)
          const encodedData = encodeURIComponent(text);
          
          // Redirect with data in URL hash
          window.location.href = 'complete/PRACTICETEST.HTML#' + encodedData;
          
        } catch (error) {
          alert('Error reading file: ' + error.message);
        }
      });
      
      // Trigger file selection dialog
      tempFileInput.click();
    });
  }
  
  existingFileChoice.addEventListener('click', () => {
    // Create a temporary file input to prompt for JSON file
    const tempFileInput = document.createElement('input');
    tempFileInput.type = 'file';
    tempFileInput.accept = '.json';
    
    tempFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        
        // Validate JSON structure
        if (!jsonData.easyTest || !jsonData.mediumTest || !jsonData.hardTest) {
          alert('Invalid JSON format. Must contain easyTest, mediumTest, and hardTest sections.');
          return;
        }
        
        // Extract the file name and set it
        targetFileName = file.name;
        
        // Convert JSON to plain text format and populate combined editors
        let easyText = '';
        let mediumText = '';
        let hardText = '';
        
        if (jsonData.easyTest && jsonData.easyTest.length > 0) {
          jsonData.easyTest.forEach((q, i) => {
            const qNum = i + 1;
            if (q.options && q.options.length > 0) {
              easyText += `Q${qNum}: ${q.question} | ${q.options.join(' | ')}\n`;
            } else {
              easyText += `Q${qNum}: ${q.question}\n`;
            }
            easyText += `A${qNum}: ${q.answer}`;
            if (q.explanation) easyText += ` | ${q.explanation}`;
            easyText += '\n\n';
          });
        }
        
        if (jsonData.mediumTest && jsonData.mediumTest.length > 0) {
          jsonData.mediumTest.forEach((q, i) => {
            const qNum = i + 1;
            mediumText += `Q${qNum}: ${q.question}\n`;
            mediumText += `A${qNum}: ${q.blanks.join(' | ')}`;
            if (q.explanation) mediumText += ` | ${q.explanation}`;
            mediumText += '\n\n';
          });
        }
        
        if (jsonData.hardTest && jsonData.hardTest.length > 0) {
          jsonData.hardTest.forEach((q, i) => {
            const qNum = i + 1;
            hardText += `Q${qNum}: ${q.question}\n`;
            hardText += `A${qNum}: ${q.answer}\n\n`;
          });
        }
        
        // Populate the combined editor textareas
        document.getElementById('combinedEasyEditor').value = easyText.trim();
        document.getElementById('combinedMediumEditor').value = mediumText.trim();
        document.getElementById('combinedHardEditor').value = hardText.trim();
        
        // Show combined editor section
        showSection('combinedEditor');
        alert('File loaded successfully! Edit and validate your tests below.');
        
      } catch (error) {
        showStatus('Error reading file: ' + error.message, 'error');
      }
    });
    
    // Trigger file selection dialog
    tempFileInput.click();
  });
  
  // Validate questions
  let validatedData = null;
  const validateBtn = document.getElementById('validateBtn');
  if (validateBtn) {
    validateBtn.addEventListener('click', () => {
      const easyContent = document.getElementById('easyTestEditor').value;
      const mediumContent = document.getElementById('mediumTestEditor').value;
      const hardContent = document.getElementById('hardTestEditor').value;
      
      if (!easyContent.trim() && !mediumContent.trim() && !hardContent.trim()) {
        showStatus('No content to validate', 'error');
        return;
      }
      
      try {
        // Validate basic format
        const allContent = easyContent + mediumContent + hardContent;
        if (!allContent.includes('Q') || !allContent.includes('A')) {
          showStatus('Invalid format: Questions must start with Q# and answers with A#', 'error');
          return;
        }
        
        const jsonData = convertPlainTextToJSON(easyContent, mediumContent, hardContent);
        
        // Validate that we have at least some questions
        if (jsonData.easyTest.length === 0 && jsonData.mediumTest.length === 0 && jsonData.hardTest.length === 0) {
          showStatus('No valid questions found. Please check the format.', 'error');
          return;
        }
        
        // Store validated data
        validatedData = jsonData;
        
        // Lock textareas
        document.getElementById('easyTestEditor').disabled = true;
        document.getElementById('mediumTestEditor').disabled = true;
        document.getElementById('hardTestEditor').disabled = true;
        
        // Hide validate button, show edit and download buttons
        validateBtn.style.display = 'none';
        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('downloadBtn').style.display = 'inline-block';
        
        showStatus('\u2713 Validation successful! Questions are locked. Click Download to save or Edit to make changes.', 'success');
      } catch (error) {
        // Handle validation error with highlighting
        if (error.textareaId && error.line) {
          const textarea = document.getElementById(error.textareaId);
          const content = textarea.value;
          const lines = content.split('\n');
          
          // Find the line in the textarea
          let charPosition = 0;
          let lineFound = false;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === error.line) {
              // Select the problematic line
              const lineStart = charPosition;
              const lineEnd = charPosition + lines[i].length;
              textarea.focus();
              textarea.setSelectionRange(lineStart, lineEnd);
              textarea.scrollTop = textarea.scrollHeight * (i / lines.length);
              lineFound = true;
              break;
            }
            charPosition += lines[i].length + 1; // +1 for newline
          }
          
          showStatus(`${error.section}: ${error.message}`, 'error');
        } else {
          showStatus('Validation failed: ' + (error.message || error), 'error');
        }
      }
    });
  }
  
  // Edit button functionality
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Unlock textareas
      document.getElementById('easyTestEditor').disabled = false;
      document.getElementById('mediumTestEditor').disabled = false;
      document.getElementById('hardTestEditor').disabled = false;
      
      // Show validate button, hide edit and download buttons
      validateBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
      document.getElementById('downloadBtn').style.display = 'none';
      
      showStatus('Editors unlocked. Make your changes and validate again.', 'info');
    });
  }
  
  // Download button functionality - OLD CODE (not used in new workflow)
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!validatedData) {
        showStatus('Please validate your questions first', 'error');
        return;
      }
      
      try {
        const jsonString = JSON.stringify(validatedData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = targetFileName || 'questions-' + new Date().getTime() + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus('\u2713 File downloaded successfully!', 'success');
      } catch (error) {
        showStatus('Error downloading file: ' + error.message, 'error');
      }
    });
  }
  
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    statusMessage.style.display = 'block';
  }
});

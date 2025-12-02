// Load and populate test data from URL hash
(function() {
  console.log('practice.js loaded');
  console.log('Current URL:', window.location.href);
  console.log('URL hash:', window.location.hash);
  
  // Get data from URL hash (after #)
  let testDataString = null;
  
  if (window.location.hash && window.location.hash.length > 1) {
    try {
      testDataString = decodeURIComponent(window.location.hash.substring(1));
      console.log('Data loaded from URL hash, length:', testDataString.length);
    } catch (e) {
      console.error('Error decoding URL hash:', e);
      alert('Error decoding test data from URL. Please try again.');
      window.location.href = '../index.html';
      return;
    }
  }
  
  // Fallback to localStorage/sessionStorage if no hash
  if (!testDataString) {
    testDataString = localStorage.getItem('practiceTestData');
    if (!testDataString) {
      testDataString = sessionStorage.getItem('practiceTestData');
      if (testDataString) console.log('Using sessionStorage');
    } else {
      console.log('Using localStorage');
    }
  }
  
  console.log('Test data string:', testDataString ? 'exists (length: ' + testDataString.length + ')' : 'null');
  
  if (!testDataString) {
    alert('No test data found. Please upload a test file from the landing page.');
    window.location.href = '../index.html';
    return;
  }
  
  try {
    console.log('Parsing JSON data...');
    const testData = JSON.parse(testDataString);
    console.log('Test data:', testData);
    
    // Update title if testName exists
    if (testData.testName) {
      const titleElement = document.getElementById('testTitle');
      if (titleElement) {
        titleElement.textContent = testData.testName + ' Practice Tests';
      }
    }
    
    // Function to convert JSON test data to plain text format
    function convertTestToPlainText(testArray, testType) {
      let plainText = '';
      
      testArray.forEach((question, index) => {
        const qNum = index + 1;
        
        if (testType === 'easy') {
          // Easy test format: Q#: question | options
          if (question.options && question.options.length > 0) {
            plainText += `Q${qNum}: ${question.question} | ${question.options.join(' | ')}\n`;
          } else {
            plainText += `Q${qNum}: ${question.question}\n`;
          }
          plainText += `A${qNum}: ${question.answer}`;
          if (question.explanation) {
            plainText += ` | ${question.explanation}`;
          }
          plainText += '\n\n';
        } else if (testType === 'medium') {
          // Medium test format: Q#: question with ___
          plainText += `Q${qNum}: ${question.question}\n`;
          plainText += `A${qNum}: ${question.blanks.join(' | ')}`;
          if (question.explanation) {
            plainText += ` | ${question.explanation}`;
          }
          plainText += '\n\n';
        } else if (testType === 'hard') {
          // Hard test format: Q#: question
          plainText += `Q${qNum}: ${question.question}\n`;
          plainText += `A${qNum}: ${question.answer}\n\n`;
        }
      });
      
      return plainText.trim();
    }
    
    // Populate the source elements with converted test data
    const sourceA = document.getElementById('sourceA');
    const sourceC = document.getElementById('sourceC');
    const sourceB = document.getElementById('sourceB');
    
    if (testData.easyTest && testData.easyTest.length > 0) {
      sourceA.textContent = convertTestToPlainText(testData.easyTest, 'easy');
      const easyCount = document.getElementById('easyCount');
      if (easyCount) easyCount.textContent = testData.easyTest.length;
    } else {
      // Hide easy test option if no data
      const optionA = document.getElementById('optionA');
      if (optionA) optionA.style.display = 'none';
    }
    
    if (testData.mediumTest && testData.mediumTest.length > 0) {
      sourceC.textContent = convertTestToPlainText(testData.mediumTest, 'medium');
      const mediumCount = document.getElementById('mediumCount');
      if (mediumCount) mediumCount.textContent = testData.mediumTest.length;
    } else {
      // Hide medium test option if no data
      const optionC = document.getElementById('optionC');
      if (optionC) optionC.style.display = 'none';
    }
    
    if (testData.hardTest && testData.hardTest.length > 0) {
      sourceB.textContent = convertTestToPlainText(testData.hardTest, 'hard');
      const hardCount = document.getElementById('hardCount');
      if (hardCount) hardCount.textContent = testData.hardTest.length;
    } else {
      // Hide hard test option if no data
      const optionB = document.getElementById('optionB');
      if (optionB) optionB.style.display = 'none';
    }
    
    // Clear localStorage after loading (optional - uncomment if you want one-time use)
    // localStorage.removeItem('practiceTestData');
    
  } catch (error) {
    console.error('Error loading test data:', error);
    alert('Error loading test data: ' + error.message);
    window.location.href = '../index.html';
  }
})();

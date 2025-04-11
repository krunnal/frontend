// src/letterMap.js
const letterMap = {
    a: 'अ', A: 'आ',
    b: 'ब', B: 'ब',
    c: 'क', C: 'क',
    d: 'ड', D: 'ड',
    e: 'इ', E: 'ई',
    f: 'फ', F: 'फ',
    g: 'ग', G: 'ग',
    h: 'ह', H: 'ह',
    i: 'ई', I: 'ई',
    j: 'ज', J: 'ज',
    k: 'क', K: 'क',
    l: 'ल', L: 'ल',
    m: 'म', M: 'म',
    n: 'न', N: 'न',
    o: 'ओ', O: 'ओ',
    p: 'प', P: 'प',
    r: 'र', R: 'र',
    s: 'स', S: 'स',
    t: 'ट', T: 'ट',
    u: 'उ', U: 'ऊ',
    v: 'व', V: 'व',
    w: 'डब्ल्यू', W: 'डब्ल्यू',
    y: 'य', Y: 'य',
    z: 'झेड', Z: 'झेड',
    ' ': ' ', // Space
  };
  
  const transliterateToMarathi = (input) => {
    // Define common patterns for transliteration
    const patterns = [
      { regex: /rahul/gi, replacement: 'राहुल' },
      { regex: /ra/gi, replacement: 'रा' },
      { regex: /hu/gi, replacement: 'हू' },
      { regex: /l/gi, replacement: 'ल' },
      { regex: /a/gi, replacement: 'अ' },
      { regex: /u/gi, replacement: 'उ' },
      { regex: /o/gi, replacement: 'ओ' },
      { regex: /e/gi, replacement: 'इ' },
      { regex: /ai/gi, replacement: 'ऐ' },
      { regex: /au/gi, replacement: 'औ' },
      { regex: /ee/gi, replacement: 'ई' },
      { regex: /oo/gi, replacement: 'ऊ' },
      { regex: /ch/gi, replacement: 'च' },
      { regex: /sh/gi, replacement: 'श' },
      { regex: /th/gi, replacement: 'थ' },
      { regex: /ph/gi, replacement: 'फ' },
      { regex: /ng/gi, replacement: 'ङ' },
      { regex: /in/gi, replacement: 'इन' },
      { regex: /un/gi, replacement: 'उन' },
    ];
  
    // Apply patterns
    let output = input;
    patterns.forEach(({ regex, replacement }) => {
      output = output.replace(regex, replacement);
    });
  
    // Convert remaining letters
    return output.split('').map(letter => letterMap[letter] || letter).join('');
  };
  
  export { letterMap, transliterateToMarathi };
  
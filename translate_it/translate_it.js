function startGame() {
    if (points === 0) {
        pointsElement.innerHTML = points;
        askWord();
    } else {
        alert('Игра уже запущена!');
    }
}

function stopGame() {
    alert('Игра окончена! Ваш счет: ' + points);
    points = 0;
    fails = 0;
}

function askWord() {
    const words = Object.keys(dictionary);
    const translations = Object.values(dictionary);
    const wordIndex = getRandomIndex(words.length);
    currentWord = words[wordIndex];
    phraseElement.innerHTML = currentWord;
    const translateVariants = [dictionary[currentWord]];
    while (translateVariants.length < 4) {
        const variantIndex = getRandomIndex(words.length);
        if (variantIndex !== wordIndex) {
            translateVariants.push(translations[variantIndex]);
        }
    }

    translationElement.innerHTML = '';
    shuffleArray(translateVariants);
    translateVariants.forEach(translate => {
        const div = document.createElement('div');
        div.classList.add('translate-variant');
        div.innerHTML = translate;
        div.addEventListener('click', checkSelectedVariant);
        translationElement.appendChild(div);
    });
}

function increasePoints() {
    points += pointsStep;
    pointsElement.innerHTML = points;
}

function increaseFails() {
    fails++;
}

function checkSelectedVariant(event) {
    const selectedVariant = event.target.innerHTML;
    if (selectedVariant === dictionary[currentWord]) {
        increasePoints();
        askWord();
    } else {
        increaseFails();
        if (fails >= maxFails) {
            stopGame();
        } else {
            askWord();
        }
    }
}

function getRandomIndex(max) {
    return Math.round(Math.random() * (max - 1));
}

function shuffleArray(array) {
  array.sort(() => Math.random() - 0.5);
}

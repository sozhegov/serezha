class TranslateIt {
    constructor(gameContainer, dictionary, maxFails) {
        this.startButton = null;
        this.pointsStep = 10;
        this.maxFails = maxFails;
        this.points = 0;
        this.fails = 0;
        this.currentWord = "";
        this.gameContainer = gameContainer;
        this.initGameContainer();
        this.pointsElement = gameContainer.querySelector("#points");
        this.phraseElement = gameContainer.querySelector("#phrase");
        this.translationElement = gameContainer.querySelector("#translation");
        this.dictionary = dictionary;
        this.inversedDictionary = this.inverseDictionary(dictionary);
        this.mode = 0;
        this.variantSelected = false;
        this.currentDictionary = {};
    }

    initGameContainer() {
        this.gameContainer.innerHTML = "";

        let h3 = document.createElement("h3");
        h3.innerHTML = "Переведи фразу";
        this.gameContainer.appendChild(h3);

        const selectDiv = document.createElement("div");
        selectDiv.classList.add("select-variant");

        const phraseDiv = document.createElement("div");
        phraseDiv.innerHTML = "";
        phraseDiv.setAttribute("id", "phrase");
        selectDiv.appendChild(phraseDiv);

        h3 = document.createElement("h3");
        h3.innerHTML = "Выбери вариант ответа";
        selectDiv.appendChild(h3);

        const translationDiv = document.createElement("div");
        translationDiv.setAttribute("id", "translation");
        selectDiv.appendChild(translationDiv);

        this.gameContainer.appendChild(selectDiv);

        const h2 = document.createElement("h2");
        h2.innerHTML = "Счет";
        this.gameContainer.appendChild(h2);

        const pointsDiv = document.createElement("div");
        pointsDiv.innerHTML = "0";
        pointsDiv.setAttribute("id", "points");
        this.gameContainer.appendChild(pointsDiv);
    }

    inverseDictionary(dictionary) {
        const result = {};
        Object.entries(dictionary).forEach(([key, value]) => {
            result[value] = key;
        });
        return result;
    }

    startGame(event) {
        this.startButton = event.target;
        if (this.points === 0) {
            this.startButton.classList.add("hide");
            this.gameContainer.classList.remove("hide");
            this.pointsElement.innerHTML = this.points;
            this.askWord();
        } else {
            alert("Игра уже запущена!");
        }
    }

    stopGame() {
        this.startButton.classList.remove("hide");
        this.gameContainer.classList.add("hide");
        alert("Игра окончена! Ваш счет: " + this.points);
        this.points = 0;
        this.fails = 0;
    }

    askWord() {
        this.setRandomMode();
        if (this.mode === 0) {
            this.currentDictionary = JSON.parse(JSON.stringify(this.dictionary));
        } else {
            this.currentDictionary = JSON.parse(JSON.stringify(this.inversedDictionary));
        }
        const words = Object.keys(this.currentDictionary);
        const translations = Object.values(this.currentDictionary);
        const wordIndex = this.getRandomIndex(words.length);
        this.currentWord = words[wordIndex];
        this.phraseElement.innerHTML = this.currentWord;
        const translateVariants = [this.currentDictionary[this.currentWord]];
        while (translateVariants.length < 4) {
            const variantIndex = this.getRandomIndex(words.length);
            if (variantIndex !== wordIndex && !translateVariants.includes(translations[variantIndex])) {
                translateVariants.push(translations[variantIndex]);
            }
        }

        this.translationElement.innerHTML = "";
        this.shuffleArray(translateVariants);
        translateVariants.forEach((translate) => {
            const div = document.createElement("div");
            div.classList.add("translate-variant");
            div.innerHTML = translate;
            div.addEventListener("click", (event) => {
                this.checkSelectedVariant(event, this);
            });
            this.translationElement.appendChild(div);
        });
        this.variantSelected = false;
    }

    setRandomMode() {
        this.mode = Math.round(Math.random());
    }

    increasePoints() {
        this.points += this.pointsStep;
        this.pointsElement.innerHTML = this.points;
    }

    increaseFails() {
        this.fails++;
    }

    checkSelectedVariant(event, game) {
        if (!this.variantSelected) {
            this.variantSelected = true;
            const translateVariants = document.querySelectorAll(".translate-variant");
            const selectedVariant = event.target.innerHTML;
            if (selectedVariant === game.currentDictionary[game.currentWord]) {
                game.increasePoints();
                game.flashGreen(event.target);
                setTimeout(function () {
                    game.askWord();
                }, 1500);
            } else {
                game.increaseFails();
                if (game.fails >= game.maxFails) {
                    game.stopGame();
                } else {
                    game.flashRed(event.target);
                    translateVariants.forEach((translateVariant) => {
                        if (translateVariant.innerHTML === game.currentDictionary[game.currentWord]) {
                            game.flashGreen(translateVariant);
                        }
                    });
                    setTimeout(function () {
                        game.askWord();
                    }, 5000);
                }
            }
        }
    }

    flashGreen(element) {
        element.classList.toggle("flash-green");
    }

    flashRed(element) {
        element.classList.toggle("flash-red");
    }

    getRandomIndex(max) {
        return Math.round(Math.random() * (max - 1));
    }

    shuffleArray(array) {
        array.sort(() => Math.random() - 0.5);
    }
}

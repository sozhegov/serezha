class TranslateIt {
    constructor(gameContainer, dictionary, maxFails) {
        this.startButton = null;
        this.pointsStep = 10;
        this.maxFails = maxFails;
        this.points = 0;
        this.fails = 0;
        this.currentWord = "";
        this.gameContainer = gameContainer;
        // TODO: строим верстку контейнера с игрой
        this.pointsElement = gameContainer.querySelector("#points");
        this.phraseElement = gameContainer.querySelector("#phrase");
        this.translationElement = gameContainer.querySelector("#translation");
        this.dictionary = dictionary;
        this.variantSelected = false;
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
        const words = Object.keys(this.dictionary);
        const translations = Object.values(this.dictionary);
        const wordIndex = this.getRandomIndex(words.length);
        this.currentWord = words[wordIndex];
        this.phraseElement.innerHTML = this.currentWord;
        const translateVariants = [this.dictionary[this.currentWord]];
        while (translateVariants.length < 4) {
            const variantIndex = this.getRandomIndex(words.length);
            if (variantIndex !== wordIndex) {
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
            if (selectedVariant === game.dictionary[game.currentWord]) {
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
                        if (translateVariant.innerHTML === game.dictionary[game.currentWord]) {
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

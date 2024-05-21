console.log("memory_game.js avant chargement anime.js");

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js")
  .then(() => {
    console.log("memory_game.js après chargement anime.js");
    // Votre code utilisant anime.js
    anime.timeline({loop: true})
    .add({
    targets: '.ml15 .word',
    scale: [14,1],
    opacity: [0,1],
    easing: "easeOutCirc",
    duration: 800,
    delay: (el, i) => 800 * i
    })
    .add({
    targets: '.ml15',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
    });

    // Code du jeu de mémoire
    var currentPlayer = 1;
    var canPick = true;
    var flippedCards = [];
    var playerScores = [0, 0];
    var totalPairsEasy = 2;
    var totalPairsMedium = 6;
    var totalPairsHard = 12;

    function setDifficulty(difficulty) {
      var board = document.getElementById("board");
      board.innerHTML = ""; // Réinitialise le plateau de jeu

      switch (difficulty) {
        case "easy":
          emojis = ["🐱", "🐶","🐭", "🐹"];
          createBoard(totalPairsEasy); // Utilisez totalPairsEasy qui devrait être 1 pour la difficulté "easy"
          break;
        case "medium":
          emojis = ["🐱", "🐶", "🐭", "🐹", "🐰", "🦊"];
          createBoard(totalPairsMedium);
          break;
        case "hard":
          emojis = ["🐱", "🐶", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🐯", "🦁", "🐮"];
          createBoard(totalPairsHard);
          break;
        default:
          emojis = ["🐱", "🐶", "🐭", "🐹"];
          createBoard(totalPairsMedium);
      }
    }


    function stopGame() {
        // Détermination du joueur gagnant ou s'il y a une égalité
        var winner;
        if (playerScores[0] > playerScores[1]) {
          winner = 1;
        } else if (playerScores[0] < playerScores[1]) {
          winner = 2;
        } else {
          winner = "Tie"; // Utilisation de "Tie" pour indiquer une égalité
        }
  
        // Affichage du message de fin de jeu
        var messageElement = document.getElementById("message");
        if (winner === "Tie") {
          messageElement.innerHTML = "<strong>BYE BYE  </strong>";
        } else {
          messageElement.innerHTML = "<strong>Player " + winner + " wins!</strong>";
        }
  
        // Redirection vers une autre page après un délai
        setTimeout(function() {
          window.location.href = "memory game.html"; // Remplacez "autre_lien.html" par le lien de


    function createBoard(difficulty) {
    var board = document.getElementById("board");
    board.innerHTML = ""; // Réinitialise le plateau de jeu

    var cards = emojis.concat(emojis);
    cards.sort(() => Math.random() - 0.5);

    var numCardsPerRow;
    switch (difficulty) {
        case "easy":
            numCardsPerRow = 4; // Nombre fixe de cartes par ligne pour la difficulté facile
            break;
        case "medium":
            numCardsPerRow = 6; // Nombre fixe de cartes par ligne pour la difficulté moyenne
            break;
        case "hard":
            var totalCards = cards.length;
            numCardsPerRow = Math.ceil(Math.sqrt(totalCards)); // Ajuste dynamiquement le nombre de cartes par ligne pour la difficulté difficile
            break;
        default:
            numCardsPerRow = 4; // Par défaut, utilise le nombre de cartes par ligne pour la difficulté moyenne
            break;
    }

    var numRows = Math.ceil(cards.length / numCardsPerRow); // Calculer le nombre de lignes nécessaires

    for (var i = 0; i < numRows; i++) {
        var row = document.createElement("div");
        row.className = "row";

        for (var j = 0; j < numCardsPerRow; j++) {
            var index = i * numCardsPerRow + j;
            if (index < cards.length) {
                var card = document.createElement("div");
                card.className = "card";
                card.dataset.value = cards[index];
                card.dataset.index = index;
                card.addEventListener("click", flipCard);
                row.appendChild(card);
            }
        }

        board.appendChild(row);
    }
    }

    function flipCard() {
    var card = this;
    var value = card.dataset.value;
    var index = card.dataset.index;

    if (!canPick || card.classList.contains("flipped")) return;

    card.textContent = value;
    card.classList.add("flipped");
    flippedCards.push({ value, index });

    if (flippedCards.length === 2) {
        canPick = false;
        setTimeout(checkMatch, 1000);
    }
    }


    function displayPlayer() {
    var messageElement = document.getElementById("player");
    messageElement.innerHTML = "<strong>Player " + currentPlayer + "'s turn</strong>";
    }


    function displayScores() {
    var messageElement = document.getElementById("message");
    messageElement.innerHTML = "<strong>Player 1: " + playerScores[0] + "  Player 2: " + playerScores[1] + "</strong>";
    }

    function checkMatch() {
    var match = flippedCards[0].value === flippedCards[1].value;
    var cards = document.querySelectorAll(".card.flipped");
    if (match) {
    playerScores[currentPlayer - 1]++;

    // Au lieu de supprimer, ajoutez la classe 'matched'
    cards.forEach(card => {
        card.classList.add("matched");
        card.textContent = ""; // Optionnel, supprime le contenu de la carte
    });

    // Vérifier si le jeu est terminé
    /*console.log(" avant score player 1", playerScores[0]);
    console.log("avant score player 2", playerScores[1]);
    console.log("avant emojis.length", emojis.length );*/
    if ((playerScores[0] + playerScores[1]) == (emojis.length )) {
    /* console.log("score player 1", playerScores[0]);
        console.log("score player 2", playerScores[1]);
        console.log("emojis.length", emojis.length);*/
        endGame();
        return;
    }
    } else {
        // Retourner les cartes face cachée
        setTimeout(() => {
            cards.forEach(card => {
                card.textContent = "";
                card.classList.remove("flipped");
            });
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            displayScores(); 
            displayPlayer();
            flippedCards = [];
            canPick = true;
        }, 1000);
        return;
    }

    flippedCards = [];
    canPick = true;
    displayScores(); // Mettre à jour les scores affichés
    }
    var currentDifficulty = "";
    function resetGame() {
    // Réinitialiser le plateau de jeu en utilisant la difficulté actuelle
    setDifficulty(currentDifficulty);

    // Réinitialiser le joueur actif
    currentPlayer = 1;

    // Réinitialiser l'affichage du joueur actif
    displayPlayer();

    // Réinitialiser l'état des cartes
    var cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.classList.remove("flipped", "matched");
        card.textContent = "";
    });

    // Réinitialiser les cartes retournées
    flippedCards = [];

    // Autoriser à nouveau la sélection de cartes
    canPick = true;

    // Réactiver les événements de clic sur les cartes
    cards.forEach(card => {
        card.addEventListener("click", flipCard);
    });

    // Effacer le message de victoire
    var messageElement = document.getElementById("message");
    messageElement.innerHTML = "";
    }

    function endGame() {
    console.log("jeux finis:");
    var winner = playerScores[0] > playerScores[1] ? 1 : 2;
    var messageElement = document.getElementById("message");
    messageElement.innerHTML = "<strong>Player " + winner + " wins!</strong>";

    // Arrêter l'écoute des clics sur les cartes
    var cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.removeEventListener("click", flipCard);
    });

    canPick = false;
    resetGame();
    }


    function showScores() {
    var scoreboard = document.getElementById("game-container");
    var scoreHTML = "<div id='scoreboard' class='row'>";
    scoreHTML += "<div class='col-md-6'><div id='player1-score' class='player-score'><h2>Player 1: " + playerScores[0] + "</h2></div></div>";
    scoreHTML += "<div class='col-md-6'><div id='player2-score' class='player-score'><h2>Player 2: " + playerScores[1] + "</h2></div></div>";
    scoreHTML += "</div>";
    scoreboard.innerHTML += scoreHTML;
    }

    window.onload = function () {
        setDifficulty("easy");
        displayPlayer();
      };
    })
    .catch(() => {
      console.log("Erreur lors du chargement de anime.js");
    });
}});
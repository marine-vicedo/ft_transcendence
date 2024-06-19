// console.log("lobby.js chargé");

// $.ajax({
//   url: '/api/users/',  // je ne sais pas c'est qu'elle api mais moi j'ai appelle comme sa
//   method: 'GET',
  
//   success: function(data) {
//       if (data.length > 0) {
//           //  user
//           $('#userLogin').text((user.username));
//           // avatar par default
//           $('#avatar').attr('src', userAvatarURL);
//       }           
//   },
//   error: function(xhr, status, error) {
//       console.error("Erreur lors de la récupération des données: ", error);
//   }
// });

console.log('lobby.js loaded'); // Log pour confirmer le chargement du script

getMenuInfos();


$(document).ready(function() {
    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    function getGameIdFromUrl() {
        const hash = window.location.hash; // Get the full hash part of the URL
        const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?'))); // Extract and parse the query parameters from the hash
        return hashParams.get('id'); // Get the 'id' parameter value
    }

    function findOpponent() {

        const csrfToken = getCSRFToken();
        const gameId = getGameIdFromUrl();

        if (!csrfToken) {
            console.error('CSRF token is missing');
            return;
        }

        if (!gameId) {
            console.error('Game ID is missing');
            return;
        }

        console.log(`Finding opponent for game ID: ${gameId}`); // Log to confirm game ID

        fetch('/lobby/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  // Ajout du token CSRF
            },
            body: JSON.stringify({
                id: gameId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(response => {
            if (response.status === 'matched') {
                console.log('response.status === matched');
                // Afficher les détails de l'adversaire
                $('.lobby-opponent-avatar img').attr('src', response.opponent.avatar);
                $('#opponent-username').text(response.opponent.username);
                $('.waiting-indicator').hide();  // Masquer l'indicateur d'attente
                setTimeout(() => { // Rediriger vers la page du jeu après 3 secondes
                    if (gameId === '2') {
                        window.location.href = '#pong3D';
                    } else if (gameId === '3') {
                        window.location.href = '#memory_game';
                    } else {
                        console.error('Unknown game ID');
                    }
                }   , 3000);
            } else if (response.status === 'waiting') {
                console.log('response.status === waiting');
                setTimeout(findOpponent, 5000); // Vérifier à nouveau dans 5 secondes
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête fetch :', error);
        });
    }

    function initialDelay() {
        console.log('Initial delay before starting to find opponent');
        setTimeout(findOpponent, 2000); // Délai initial de 3 secondes avant de commencer la recherche
    }

    initialDelay();
});
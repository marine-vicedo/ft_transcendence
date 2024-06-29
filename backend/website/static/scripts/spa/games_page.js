console.log("games_page.js loaded");
$(document).ready(function() {
    // Fonction pour gérer le clic sur un lien de jeu
	function redirectToLobby(event) {
		console.log("Clic détecté sur un lien de jeu."); // Log pour confirmer que le clic est détecté
	
		event.preventDefault(); // Empêche le comportement par défaut du lien
		const target = $(event.currentTarget);
		const gameType = target.attr('id'); // Obtient l'identifiant du lien cliqué
	
		console.log(`Jeu sélectionné : ${gameType}`); // Log pour afficher le type de jeu sélectionné
	
		// Redirection vers la page du lobby en fonction du jeu sélectionné
		
		let lobbyId;
		if (gameType === "pong3D") {
			console.log("Redirection vers Pong3D"); // Log pour confirmer la condition
			lobbyId = 2;
			window.location.href = `#lobby_partie/?id=2`;
		} else if (gameType === "memory_game") {
			console.log("Redirection vers Memory Game"); // Log pour confirmer la condition
			lobbyId = 3;
			window.location.href = `#lobby_partie/?id=3`;
		} else {
			console.log("Jeu non reconnu"); // Log pour gérer les cas où aucun jeu n'est reconnu
			return;
		}

		// Redirection vers la page du lobby en fonction du jeu sélectionné
		//window.location.href = `#lobby/${lobbyId}/`; // Utilisation de # pour la SPA

		console.log(`Redirection vers lobby avec id=${lobbyId}`);
        //window.location.href = `#lobby/?id=${lobbyId}`;
	}
	
    // Sélectionne tous les liens de jeu et ajoute un gestionnaire d'événements pour le clic
    $('a[href="#pong3D"], a[href="#memory_game"]').click(redirectToLobby);
});


getMenuInfos();
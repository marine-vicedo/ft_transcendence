 console.log("pong3D.js chargé");


 function loadScript(src) {
    console.log("pong3D.js src=", src);
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      console.log("pong3D.js src=", src);
      script.onload = () => {
        console.log("Script loaded successfully:", src);
        resolve();
      };
      script.onerror = (error) => {
        console.error("Failed to load script:", src, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
  
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")
    
  .then(() => {

 let scene, camera, renderer;
        let table, sol, filet;
        let raquette1, raquette2, balle;
        let ballDirection = new THREE.Vector3(1, 0, 0); // Direction initiale de la balle
        let ballSpeed = 1.5; // Vitesse de la balle
        let scorePlayer1 = 0;
        let scorePlayer2 = 0;
        updateScore();
        let maxScore = 5; // Score maximum pour gagner le jeu
    
    // Mise à jour du score affiché
       function updateScore() {
        document.getElementById('score').innerText = `Player 1: ${scorePlayer1} - Player 2: ${scorePlayer2}`;
    }

    // Réinitialisation du jeu
   

 
    function init() {
            // Initialisation de la scène, de la caméra et du renderer
        scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 100, 200);
            camera.lookAt(scene.position);

            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background
            document.body.appendChild(renderer.domElement);

            // Ajout de lumière
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 20, 10);
            scene.add(directionalLight);

             // Création d'une boîte géométrique
            const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(box);

        
        // Sol
        const solGeometry = new THREE.PlaneGeometry(300, 150);
        const solMaterial = new THREE.MeshLambertMaterial({color: 0x777777});
        sol = new THREE.Mesh(solGeometry, solMaterial);
        sol.rotation.x = -Math.PI / 2;
        scene.add(sol);

        // Table de ping-pong
        const tableGeometry = new THREE.BoxGeometry(274, 5, 152.5); // Dimensions ajustées
        const tableMaterial = new THREE.MeshLambertMaterial({color: 0x008000}); // Vert typique pour la table
        table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = 2.5; // Ajustement pour que le bas de la table touche le sol
        scene.add(table);

        // Filet
        const filetGeometry = new THREE.BoxGeometry(5, 15, 152.5); // Largeur du filet négligeable
        const filetMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        filet = new THREE.Mesh(filetGeometry, filetMaterial);
        filet.position.z = 15 / 2; // Hauteur du filet
        scene.add(filet);

        // Dimensions des raquettes
        const raquetteRadius = 15; // Rayon de la raquette
        const raquetteDepth = 5; // Épaisseur de la raquette

        // Matériau des raquettes
        const raquetteMaterial = new THREE.MeshLambertMaterial({color: 0xff0000}); // Rouge

        // Raquette Joueur 1
        const raquette1Geometry = new THREE.CylinderGeometry(raquetteRadius, raquetteRadius, raquetteDepth, 32);
        raquette1 = new THREE.Mesh(raquette1Geometry, raquetteMaterial);
        raquette1.rotation.z = Math.PI / 2; // Oriente la raquette face à la caméra/au ciel
        raquette1.position.set(-125, 10, 0); // Positionnez la raquette sur le côté gauche de la table
        scene.add(raquette1);

        // Raquette Joueur 2
        const raquette2Geometry = new THREE.CylinderGeometry(raquetteRadius, raquetteRadius, raquetteDepth, 32);
        raquette2 = new THREE.Mesh(raquette2Geometry, raquetteMaterial);
        raquette2.rotation.z = Math.PI / 2; // Oriente la raquette face à la caméra/au ciel
        raquette2.position.set(125, 10, 0); // Positionnez la raquette sur le côté droit de la table
        scene.add(raquette2);

        // Création de la balle
        const balleGeometry = new THREE.SphereGeometry(5, 32, 32); // Rayon de 7.5 pour une balle de taille visible
        const balleMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}); // Balle blanche
        balle = new THREE.Mesh(balleGeometry, balleMaterial);
        balle.position.set(0, 15, 0); // Position initiale de la balle au-dessus de la table
        scene.add(balle);
            // Charger et ajouter l'arbitre à la scène
        

        // Chemin vers le fichier glTF de l'arbitre
        // Charger la texture pour afficher le score

        
        animate(); // Démarrer l'animation
    }
    
    function resetGame() {
        ball.position.set(10, 10, 10);
        ballSpeedX = 1;
        ballSpeedY = 1;
        if (scorePlayer1 >= maxScore || scorePlayer2 >= maxScore) 
        {
            if (scorePlayer1 > scorePlayer2) 
            {
                document.getElementById('victory-message').innerText = 'Player 1 a gagné !';
            } 
            else
            {
                document.getElementById('victory-message').innerText = 'Player 2 a gagné !';
            }
            // Jouer l'effet sonore
            document.getElementById('win-sound').play();
            scorePlayer1 = 0;
            scorePlayer2 = 0;
        }
    }
    let raquetteRadius = 15; 
    
    let lastHitTime = 0; // Le temps du dernier coup
    const hitCooldown = 200; // Temps en millisecondes
    function moveBall() {
        balle.position.add(ballDirection.clone().multiplyScalar(ballSpeed));
        const now = Date.now();

// Détection de la collision avec les raquettes
const ballBoundingBox = new THREE.Box3().setFromObject(balle);
const raquette1BoundingBox = new THREE.Box3().setFromObject(raquette1);
const raquette2BoundingBox = new THREE.Box3().setFromObject(raquette2);

if (ballBoundingBox.intersectsBox(raquette1BoundingBox) || ballBoundingBox.intersectsBox(raquette2BoundingBox)) {
    ballDirection.reflect(new THREE.Vector3(1, 0, 0.1)).normalize().multiplyScalar(ballSpeed);

    lastHitTime = now;
    

}
//console.log("ball.position.x",Math.abs(balle.position.x));
// Détection de la collision avec les bords de la table
if (Math.abs(balle.position.x) >= 137) {
   
    //ballDirection.reflect(new THREE.Vector3(1, 0, 0)); 
    ballDirection.reflect(new THREE.Vector3(1, 0, 0)); 
 // Limiter la position de la balle aux bords de la table
 balle.position.x = Math.sign(balle.position.x) * 137;
  // Vérifier si la balle a touché le bord gauche
  if (balle.position.x < 0) {
    
        // Ajouter un point au joueur 2 (le joueur à droite)
        scorePlayer1++;
        //console.log("score player1", scorePlayer1);
        
        resetGame();
    } 
    else if(balle.position.x > 0){
        //console.log("ballspeedy",ballSpeedY);
        //console.log("je suis dans balle.position.x > 0",ballSpeed,ballSpeedX,ballSpeedY);
        // Ajouter un point au joueur 1 (le joueur à gauche)
        scorePlayer2++;
        //console.log("score player2", scorePlayer2);
        resetGame();
}
     
}
//console.log("ball.position.z",Math.abs(balle.position.x));
if (balle.position.z >= 75 || balle.position.z <= -75) {
    // Use the correct normal vector for z-axis boundaries
    ballDirection.reflect(new THREE.Vector3(0, 0, Math.sign(balle.position.z)));
    
    // Clamp the position of the ball to prevent it from going out of bounds
    balle.position.z = THREE.MathUtils.clamp(balle.position.z, -75, 75);
}

}


function updateScore() {
    document.getElementById('score').innerText = `Player 1: ${scorePlayer1} - Player 2: ${scorePlayer2}`;
}

    function resetGame() {
        balle.position.set(10, 10, 10);
        ballSpeedX = 1;
        ballSpeedY = 1;
        updateScore();

        // Si l'un des joueurs atteint le score maximum, réinitialiser les scores et annoncer le gagnant
        if (scorePlayer1 >= maxScore || scorePlayer2 >= maxScore) 
        {
            if (scorePlayer1 > scorePlayer2) 
            { 
                document.getElementById('victory-message').innerText = 'Player 1 a gagné !';
            } 
            else
            { 
                document.getElementById('victory-message').innerText = 'Player 2 a gagné !';
            }
            scorePlayer1 = 0;
            scorePlayer2 = 0;
        }
    }

    // Déplacement des raquettes
    const raquetteSpeed = 2; // Vitesse de déplacement des raquettes

    // Fonction de mise à jour du déplacement des raquettes
    function updateRaquettes() {
        function updateRaquettes() {
    // Mettre à jour le mouvement de la raquette du joueur 1
    document.getElementById('player1-movement').innerText = `Player 1: ${Key.isDown(Key.W) ? '↑' : ''} ${Key.isDown(Key.S) ? '↓' : ''}`;

    // Mettre à jour le mouvement de la raquette du joueur 2
    document.getElementById('player2-movement').innerText = `Player 2: ${Key.isDown(Key.UP_ARROW) ? '↑' : ''} ${Key.isDown(Key.DOWN_ARROW) ? '↓' : ''}`;
}
        if (Key.isDown(Key.W)) { // Touche W pour monter
        if (raquette1.position.z < 125 / 2) { // Vérifiez si la raquette dépasse la limite supérieure
            raquette1.position.z += raquetteSpeed;
        }
    } else if (Key.isDown(Key.S)) { // Touche S pour descendre
        if (raquette1.position.z > -125 / 2) { // Vérifiez si la raquette dépasse la limite inférieure
            raquette1.position.z -= raquetteSpeed;
        }
    }

    // Raquette Joueur 2 (droite)
    if (Key.isDown(Key.UP_ARROW)) { // Flèche Haut pour monter
        if (raquette2.position.z < 125 / 2) { // Vérifiez si la raquette dépasse la limite supérieure
            raquette2.position.z += raquetteSpeed;
        }
    } else if (Key.isDown(Key.DOWN_ARROW)) { // Flèche Bas pour descendre
        if (raquette2.position.z > -125 / 2) { // Vérifiez si la raquette dépasse la limite inférieure
            raquette2.position.z -= raquetteSpeed;
        }
        }
    }

    // Fonction de gestion des touches
    const Key = {
        _pressed: {},

        W: 87,
       
        // rest of the Key object definition
        S: 83,
        UP_ARROW: 38,
        DOWN_ARROW: 40,

        isDown: function(keyCode) {
            return this._pressed[keyCode];
        },

        onKeyDown: function(event) {
            this._pressed[event.keyCode] = true;
        },

        onKeyUp: function(event) {
            delete this._pressed[event.keyCode];
        }
    };

    // Ajouter les écouteurs d'événements pour les touches du clavier
    window.addEventListener('keydown', function(event) { Key.onKeyDown(event); }, false);
    window.addEventListener('keyup', function(event) { Key.onKeyUp(event); }, false);
    
    function animateText(textMesh) {
    // Initialiser la position de départ
    let startPosition = textMesh.position.clone();
    
    // Définir la position cible pour l'animation
    let targetPosition = new THREE.Vector3(100, 50, -1); // Changer la position cible selon vos besoins
    
    // Durée totale de l'animation (en secondes)
    let animationDuration = 2;
    
    // Horloge pour suivre le temps écoulé
    let clock = new THREE.Clock();
    
    // Fonction d'animation
    function update() {
        // Calculer la progression de l'animation (valeur entre 0 et 1)
        let elapsedTime = clock.getElapsedTime();
        let progress = elapsedTime / animationDuration;
        progress = Math.min(progress, 1); // Assurer que la progression ne dépasse pas 1
        
        // Interpoler entre la position de départ et la position cible en fonction de la progression
        let newPosition = startPosition.clone().lerp(targetPosition, progress);
        
        // Mettre à jour la position du texte
        textMesh.position.copy(newPosition);
        
        // Continuer l'animation jusqu'à ce que la durée soit écoulée
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    // Démarrer l'animation
    update();
}
     // Création d'une fonction pour générer une géométrie de texte
     function createTextGeometry(text, size, height) {
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.140.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: size,
                height: height,
                curveSegments: 12,
                bevelEnabled: false
            });
            textGeometry.computeBoundingBox();
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Couleur du texte (blanc)
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(new THREE.Vector3(-100, 45, -30)); // Définir la position
            scene.add(textMesh);
        });
    }

    // Exemple d'utilisation de la fonction createTextGeometry
    createTextGeometry("PING PONG", 30, 1, new THREE.Vector3(1, 25, -1));

// Appel de la fonction createTextGeometry 
//createTextGeometry(scene, "Score: 0", new THREE.Vector3(-50, 50, 0), 5)
    // Fonction d'animation
    function animate() {
        requestAnimationFrame(animate);
        updateRaquettes(); // Mettre à jour les positions des raquettes
        
        moveBall(); // Mettre à jour le mouvement de la balle
        renderer.render(scene, camera);
    }

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
    

    init(); // Initialisation du jeu
})


.catch(() => {
  console.log("Erreur lors du chargement de anime.js");
});



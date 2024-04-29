// Importation des stores de jeu depuis le fichier game-stores.js
import gameStores from "../stores/game-stores.js";

// Définition du composant du joueur
export default {
    // Template HTML pour le composant du joueur
    template: `<img  ref = "player" class = "player" src="" alt="">`,
    // État initial du composant
    state: {
        // Propriétés du joueur
        playerProperties: null
    },
    // Méthodes du composant
    methods: {
        stopPlayerOnLeft() {
            // Récupération de l'élément du joueur
            let playerElement = this.refs.player
            // Modification de la source de l'image pour montrer le joueur arrêté à gauche
            playerElement.src = this.state.playerProperties.noMovingLeftSrc
        },
        // Méthode pour arrêter le joueur lorsqu'il se déplace vers la droite
        stopPlayerOnRight() {
            // Récupération de l'élément du joueur
            let playerElement = this.refs.player
            // Modification de la source de l'image pour montrer le joueur arrêté à droite
            playerElement.src = this.state.playerProperties.noMovingRightSrc
        },
        // TODO: Faire la même chose pour les autres directions
        // Méthode pour placer le joueur à une position spécifique
        placePlayer(objArgs) {
            // Affichage des arguments passés à la méthode
            // Récupération des coordonnées x et y
            let x = objArgs.coords.x
            let y = objArgs.coords.y

            let playerStore = gameStores.players[this.name]
            
            playerStore.positionX = x
            playerStore.positionY = y

            // Récupération de la direction
            let direction = objArgs.direction
            // playerStore.MoveState.lastDirection = direction
            // Utilisation d'une structure switch pour gérer les différentes directions
            switch (direction) {
                case 'left':
                    // Si la direction est 'left', arrêter le joueur à gauche
                    this.stopPlayerOnLeft()
                    break
                case 'right':
                    // Si la direction est 'right', arrêter le joueur à droite
                    this.stopPlayerOnRight()
                    // TODO: Gérer les autres directions
                    break
            }

            // Positionnement du joueur sur le plateau de jeu
            this.refs.player.style.top = gameStores.scale(y)
            this.refs.player.style.left = gameStores.scale(x)
        }
    },
    // Propriétés du composant
    props: {
        // Tag personnalisé pour le composant
        tag: 'player-template',
    },
    // Hooks du composant
    hooks: {
        // Hook d'initialisation
        init(playerObj) {
            this.name = playerObj.name
            
            // Récupération des propriétés du joueur depuis les stores de jeu
            this.state.playerProperties = gameStores.players[playerObj.name]

        },
        onConnected() {
    

            // gameStores.players[this.name]
        },
    }
}
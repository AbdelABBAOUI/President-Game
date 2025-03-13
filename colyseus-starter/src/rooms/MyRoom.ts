import { Room, Client } from "colyseus";

import { Card , Hand } from "./schema/MyRoomState";
import { Schema, Context, type ,ArraySchema} from "@colyseus/schema";
// Représentation d'un jeu de cartes
const SUITS = ['♠︎', '♥︎', '♣︎', '♦︎']; // Add more suits if needed
const RANKS = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];

function compareCards(card1: Card | undefined, card2: Card | undefined): boolean {
  console.log('Comparaison des cartes:');
  console.log('Carte 1:', card1 ? `${card1.value} of ${card1.suit}` : 'undefined');
  console.log('Carte 2:', card2 ? `${card2.value} of ${card2.suit}` : 'undefined');

  // Vérification que les cartes sont définies
  if (!card1 || !card2) {
    console.log('Tentative de comparaison avec une carte undefined');
    return false;
  }

  const rank1 = card1.value;
  const rank2 = card2.value;

  if (rank1 === '2') return true; // 2 always wins
  if (rank2 === '2') return false;

  return RANKS.indexOf(rank1) >= RANKS.indexOf(rank2);
}

function shuffle(array: ArraySchema<Card>): ArraySchema<Card> {
  // Convert ArraySchema to a regular array
  const arrayCopy = Array.from(array);

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements in the copied array
    const temp = arrayCopy[i];
    arrayCopy[i] = arrayCopy[j];
    arrayCopy[j] = temp;
  }

  // Create a new ArraySchema and push shuffled cards back
  const shuffledDeck = new ArraySchema<Card>();
  for (const card of arrayCopy) {
    shuffledDeck.push(card);
  }
  console.log(shuffledDeck);
  return shuffledDeck;  // Return the shuffled ArraySchema
}


function getRank(card: Card): number {
  const rank = card.value;
  return RANKS.indexOf(rank);
}

export class MyRoom extends Room {
private players: { 

    id: string; 
    hasPassed: boolean; 
    name: string; 
    hand: Hand ; 
  }[] = [];

  private turnIndex: number = 0;
  private deck = new ArraySchema<Card>();
  private pile = new ArraySchema<Card>();

  private playersByRank: { 
    id: string; 
    hasPassed: boolean; 
    name: string; 
    hand: Hand ; 
  }[] = [];



  onCreate(options: any) {
    console.log("Room created!");

    this.deck = this.createDeck();

    this.onMessage('pass_turn', (client: Client, message: any) => {
      const currentPlayer = this.players[this.turnIndex];

      if (client.sessionId === currentPlayer.id) {

        console.log(`${currentPlayer.name} passes their turn.`);
        currentPlayer.hasPassed = true; // Mark as passed
        this.checkIfNMinusOnePlayersPassed(); // Check if n-1 players have passed

      } else {

        console.log(`It's not ${client.sessionId}'s turn.`);

      }
    });

    this.onMessage('play_card', (client: Client, message: any) => {
      const currentPlayer = this.players[this.turnIndex];
      const cardData = message.card; 
      
      if (client.sessionId === currentPlayer.id) {

        const player = this.players.find(p => p.id === client.sessionId);
    
        if (player) {
          if (player.hand.getCardCount() === 0) {
            this.nextTurn();
            return;
          }

          // Trouver la carte correspondante dans la main du joueur
          const cardInHand = player.hand.cards.find(c => 
            c.value === cardData.value && c.suit === cardData.suit
          );

          if (!cardInHand) {
            console.log(`${JSON.stringify(cardData)} is not in ${currentPlayer.name}'s hand.`);
            return;
          }

          if (cardInHand.value === '2') {
            console.log(`${currentPlayer.name} played a 2. The pile is reset.`);
            this.pile.push(cardInHand);
            this.broadcast('pile_update', { pile: this.pile });
            this.players.forEach(player => { player.hasPassed = false; });
            this.pile.splice(0, this.pile.length); // Reset the pile
            this.broadcast('pile_update', { pile: this.pile });
            player.hand.removeCard(cardInHand);
            
            if (player.hand.getCardCount() === 0) {
              if (!this.playersByRank.some(playern => playern.id === player.id)) {
                this.playersByRank.push(player);
                console.log(`${player.name} a vidé sa main et est ajouté à la liste.`);
              }
            }
    
            if (player.hand.getCardCount() > 0) {
              console.log(`Turn continues with ${currentPlayer.name}`);
            } else {
              console.log(`${currentPlayer.name} has no cards. The turn moves to the next player.`);
              this.nextTurn();
            }
          } else {

            // Vérifier d'abord que la pile a une carte au sommet si nécessaire
            console.log('Longueur actuelle de la pile:', this.pile.length);
            const topCard = this.pile.at(-1);

            if (this.pile.length === 0 || compareCards(cardInHand, topCard)) {
              console.log(`${currentPlayer.name} played ${cardInHand.toString()}`);
              this.pile.push(cardInHand);
              this.broadcast('pile_update', { pile: this.pile });
              player.hand.removeCard(cardInHand);
              
              if (player.hand.getCardCount() === 0) {
                if (!this.playersByRank.some(playern => playern.id === player.id)) {
                  this.playersByRank.push(player);
                  console.log(`${player.name} a vidé sa main et est ajouté à la liste.`);
                }
              }
              
              this.nextTurn();
              return;
            } else {
              console.log(`${cardInHand.toString()} cannot be played.`);
              return;
            }
          }
    
          this.broadcast('pile_update', { pile: this.pile });
    
          if (player.hand.getCardCount() === 0) {
            this.nextTurn();
          }
        }
      } else {
        console.log(`It's not ${currentPlayer.name}'s turn.`);
      }
    });
  }

  onJoin(client: Client, options: any) {
    const playerName = options.playerName || `Player ${client.sessionId}`;
    this.players.push({ id: client.sessionId, hasPassed: false, name: playerName, hand: new Hand() });

    console.log(`${playerName} joined the room!`);
    this.broadcast('player_update', this.players.map(player => player.name));

    if (this.players.length === 3) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  startGame() {
    console.log("Game starts!");
    this.broadcast('game_started', { message: "The game starts now!" });
    this.deck = this.createDeck();
    this.deck = shuffle(this.deck);
    this.distributeCards();
    this.broadcast('player_update', this.players.map(player => player.name));
    this.startTurn();
  }

  distributeCards() {
    const cardsPerPlayer = Math.floor(this.deck.length / this.players.length);

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      // Assigner un nouveau Hand à la main du joueur
      player.hand = new Hand();
      // Distribuer les cartes au joueur
      for (let j = 0; j < cardsPerPlayer; j++) {
        const card = this.deck.shift(); // Retirer la première carte du deck
        if (card) {
          player.hand.cards.push(card); // Ajouter la carte à la main du joueur
        }
      }
      
      const client = this.clients.find(c => c.sessionId === player.id);
      if (client) {
        client.send('hand_update', { hand: player.hand });
      }
      // Afficher les cartes reçues par chaque joueur
      console.log(`${player.name} received the following cards:`);
      player.hand.cards.forEach(card => {
        console.log(`- ${card.value} of ${card.suit}`);
      });
    }
  }

  createDeck() {
    const newDeck = new ArraySchema<Card>(); // Création d'un nouveau deck

    // Création des cartes et ajout au deck
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        const card = new Card();
        card.suit = suit;
        card.value = rank;
        newDeck.push(card);
      }
    }

    return newDeck; // Retourne le deck créé
  }

  startTurn() {
    if (this.players.length === 0) {
      console.log("No players left. The game ends.");
      this.nextTurn();
    }
    const playersWithCards = this.players.filter(player => player.hand.getCardCount() > 0);
    if (playersWithCards.length === 1) {
      this.endGame(playersWithCards[0]);
      return;
    }

    const currentPlayer = this.players[this.turnIndex];
    console.log(`It's ${currentPlayer.name}'s turn`);

    const currentClient = this.clients.find(client => client.sessionId === currentPlayer.id);
    if (currentClient) {
      currentClient.send('your_turn', { message: `It's your turn, ${currentPlayer.name}!` });
    }
  }

  nextTurn() {
    const playersWithCards = this.players.filter(player => player.hand.getCardCount() > 0);
    if (playersWithCards.length === 1) {
      this.endGame(playersWithCards[0]);
      return;
    }

    this.turnIndex = (this.turnIndex + 1) % this.players.length;
    //this.checkHand();
    console.log(this.players[this.turnIndex].name);
    console.log(this.players[this.turnIndex].hand.getCardCount());
    while (this.players[this.turnIndex].hand.getCardCount() === 0 || this.players[this.turnIndex].hasPassed) {
      this.turnIndex = (this.turnIndex + 1) % this.players.length;
    }

    this.startTurn();
  }
  checkHand() {
    const currentPlayer = this.players[this.turnIndex];
    if (currentPlayer) {
      if (currentPlayer.hand.getCardCount() === 0) {
        this.nextTurn();
        return;
      }
      return;
  }}

  private checkIfNMinusOnePlayersPassed() {
    const passedPlayers = this.players.filter(player => player.hasPassed || player.hand.getCardCount() === 0 );
    const remainingPlayers = this.players.filter(player => player.hand.getCardCount() > 0 && !player.hasPassed);
    const passedPlayerss = this.players.filter(player => player.hasPassed && player.hand.getCardCount() >  0 );
    if (passedPlayers.length === this.players.length - 1) {
      console.log("n-1 players passed, resetting the pile and continuing with the last player.");
      this.pile.splice(0, this.pile.length); // Reset the pile
      this.broadcast('pile_update', { pile: this.pile });

      this.players.forEach(player => { player.hasPassed = false; });
      if(remainingPlayers[0]){
        const playerWithCards = remainingPlayers[0];
        console.log(`${playerWithCards.name} will continue playing.`);
        this.turnIndex = this.players.findIndex(player => player.id === playerWithCards.id);
      }else{
        const playerWithCards = passedPlayers[0];
        console.log(`${playerWithCards.name} will continue playing.`);
        this.turnIndex = this.players.findIndex(player => player.id === playerWithCards.id);

      }

      this.startTurn();
    } else {
      if(passedPlayers.length === this.players.length ){
        this.pile.splice(0, this.pile.length); // Reset the pile
      this.broadcast('pile_update', { pile: this.pile });
      const playerWithCards = passedPlayerss[0];
      console.log(`${playerWithCards.name} will continue playing.`);
      this.turnIndex = this.players.findIndex(player => player.id === playerWithCards.id);
      this.startTurn();
    }else{
      this.nextTurn();}
    }
  }

  private endGame(lastPlayer: { id: string; name: string; hand: Hand }) {
    const president = this.playersByRank[0]; // Player with the least cards
    this.playersByRank = [];
    const scum = lastPlayer; // Last player with cards

    this.players.forEach(player => { player.hasPassed = false; });

    console.log(`Le Président est ${president.name}`);
    console.log(`Le Scum est ${scum.name}`);

    this.pile.splice(0, this.pile.length); // Reset the pile
    this.broadcast('pile_update', { pile: this.pile });

    console.log("Nouvelle manche commence !");
    this.deck = this.createDeck();
    this.deck = shuffle(this.deck);
    this.distributeCards();

    this.broadcast('player_update', this.players.map(player => player.name));
  
    // After distributing cards, exchange cards between President and Scum
    setTimeout(() => {
      this.exchangeCards(president, scum); // Perform the exchange after distribution
      // Notify players of the new game state
      this.broadcast('game_over', { president: president.name, scum: scum.name });
    }, 3000); // 3-second delay before showing the exchange
  }
  
  private exchangeCards(president: { id: string; name: string; hand: Hand }, scum: { id: string; name: string; hand: Hand }) {
    console.log(`${president.name} (President) et ${scum.name} (Scum) échangent des cartes.`);
    

    const scumIndex = this.players.findIndex(player => player.id === scum.id);
    this.turnIndex=scumIndex;

    // Get the President's two worst cards
    const presidentWorstCards = president.hand.cards
      .sort((a, b) => getRank(a) - getRank(b))
      .slice(0, 2);
  
    // Get the Scum's two best cards
    const scumBestCards = scum.hand.cards
      .sort((a, b) => getRank(b) - getRank(a))
      .slice(0, 2);
  
    console.log(`${president.name} donne les cartes: ${presidentWorstCards}`);
    console.log(`${scum.name} donne les cartes: ${scumBestCards}`);
  
    // Remove the worst cards and add the best cards to the president's and scum's hands
    presidentWorstCards.forEach(card => {
      const index = president.hand.cards.findIndex(c => c === card);
      if (index !== -1) {
        president.hand.cards.splice(index, 1);  // Remove the card from president's hand
      }
    });
  
    scumBestCards.forEach(card => {
      const index = scum.hand.cards.findIndex(c => c === card);
      if (index !== -1) {
        scum.hand.cards.splice(index, 1);  // Remove the card from scum's hand
      }
    });

    // Add the exchanged cards
    president.hand.cards.push(...scumBestCards);  // Add scum's best cards to the president's hand
    scum.hand.cards.push(...presidentWorstCards); // Add president's worst cards to the scum's hand


    // Notify players of their updated hands
    this.clients.forEach(client => {
      const player = this.players.find(p => p.id === client.sessionId);
      if (player) {
        client.send('hand_update', { hand: player.hand });
      }
    });
    this.startTurn();
  }
  
  // Method to start a new round after the end of the current one


  onDispose() {
    console.log("Room disposed.");
  }
}
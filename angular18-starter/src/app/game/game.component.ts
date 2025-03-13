import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColyseusService } from '../colyseus.service';
import { GameLogicService } from '../game-logic.service'; // Assurez-vous d'importer votre service
import { CommonModule } from '@angular/common';
import {Hand , Card} from '../MyRoomState';
import {ArraySchema} from "@colyseus/schema";
import { PlayerCardComponent } from './player-card/player-card.component';


interface DisplayCard {
  value: string;
  suit: string;
}

interface PileUpdateData {
  pile: ArraySchema<Card>;
}

interface HandUpdateData {
  hand: Hand; // hand est de type Hand
}

interface GameOverData {
  president: string;
  scum: string;
}

type SuitType = '♠︎' | '♥︎' | '♣︎' | '♦︎';

/*interface PileUpdate {
  pile: string[];  // ou le type approprié pour vos cartes
}
interface handUpdate {
  hand: string[];  // ou le type approprié pour vos cartes
}*/
interface GameOverData {
  president: string;
  scum: string;
}


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,PlayerCardComponent,],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  roomId = '';
  players: string[] = [];
 
  hand: Hand = new Hand();  // Cartes du joueur
  pile: ArraySchema<Card> = new ArraySchema<Card>();  // Dernières cartes jouées
  isMyTurn = false;
  gameOver = false;  // Indique si le jeu est terminé
  winner = '';  // Gagnant du jeu
  gameMessage = '';  // Message du jeu (ex: "C'est votre tour", "Le jeu est terminé")
  president = '';  // Le Président
  scum = '';  // Le Scum

  constructor(
    private colyseusService: ColyseusService,
    private gameLogicService: GameLogicService, // Injectez votre service ici
    private route: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    // Écouter les mises à jour des joueurs
    this.colyseusService.onMessage('player_update', (players: string [])  : void  => {
      this.players = players;
    });

    // Écouter les messages de tour
    this.colyseusService.onYourTurn(() => {
      this.isMyTurn = true;
      this.gameMessage = "C'est votre tour!";
    });

    // Écouter les mises à jour des cartes jouées
    this.colyseusService.onMessage('pile_update', (data: PileUpdateData) => {
      console.log('Mise à jour de la pile:', data.pile);
      this.pile = data.pile;
    });

    // Écouter la fin du jeu
    this.colyseusService.onMessage('game_over', (data:GameOverData ) => {
      this.gameOver = true;
      this.president = data.president;
      this.scum = data.scum;
      this.winner = `Le Président est ${data.president}, et le Scum est ${data.scum}`;
      this.gameMessage = `Le jeu est terminé. ${this.winner}`;
    });


    // Écouter les cartes distribuées
    this.colyseusService.onMessage('hand_update', (data: HandUpdateData) => {
      console.log('Main reçue:', data.hand);
      this.hand = data.hand ;
    });

    // Écouter les échanges de cartes
    this.colyseusService.onMessage('cards_exchange', (data: GameOverData) => {
      console.log(`${data.president} échange des cartes avec ${data.scum}`);
      this.gameMessage = `${data.president} et ${data.scum} échangent des cartes.`;
    });
  }

  // Méthode pour vérifier si un objet est une carte valide
  isCard(obj: unknown): obj is DisplayCard {
    const card = obj as DisplayCard;
    return card !== null && 
           typeof card === 'object' && 
           'value' in card && 
           'suit' in card;
  }

  
  // Méthode sûre pour obtenir l'affichage d'une carte
  getCardValue(card: unknown): string {

      if (this.isCard(card)) {
        // Retourner simplement la valeur et le symbole de la carte
        return `${card.value}`;
      }
      return 'Carte invalide';
  }

  getCardSuit(card: unknown): string {

    if (this.isCard(card)) {
      // Retourner simplement la valeur et le symbole de la carte
      return `${card.suit}`;
    }
    return 'Carte invalide';
}



  private isValidSuit(suit: string): suit is SuitType {
    return ['♠︎', '♥︎', '♣︎', '♦︎'].includes(suit);
  }

  canPlayCard(card: Card | unknown): boolean {
    // Type guard to ensure card is of type Card
    if (!this.isValidCard(card)) {
      return false;
    }

    if (card.value === '2') {
      console.log(`La carte ${card} est jouée. La pile est réinitialisée. Le joueur peut jouer ce qu'il veut.`);
      return true;
    }

    if (this.pile.length === 0) {
      console.log(`Aucune carte sur la pile. La carte ${card} est valide.`);
      return true;
    }

    const topCard = this.pile[this.pile.length - 1];
    if (!topCard) {
      console.log("Erreur: La pile est vide ou la carte du dessus est invalide.");
      return false;
    }

    const isValid = this.gameLogicService.compareCards(card, topCard);

    if (!isValid) {
      console.log(`La carte ${card} est invalide et ne peut pas être jouée.`);
    }

    return isValid;
  }

  // Type guard function to check if unknown is Card
  private isValidCard(card: unknown): card is Card {
    return (card as Card)?.value !== undefined;
  }

  playCard(card: unknown): void {

    if (!this.isValidCard(card)) {
      console.log('Carte invalide');
      return;
    }

    if (!this.isMyTurn || !this.canPlayCard(card)) {
      console.log(`Impossible de jouer la carte ${card.value}.`);
      return;
    }

    // Créer un objet simple avec seulement les propriétés nécessaires
    const cardToSend = {
      value: card.value,
      suit: card.suit
    };

    if (card.value === '2') {
      console.log('La pile est réinitialisée après avoir joué un 2.');
      this.colyseusService.sendMessage('play_card', { card: cardToSend });
      //this.colyseusService.sendMessage('play_card', { card });
      const cardIndex = this.hand.cards.findIndex(c => c === card);
      if (cardIndex !== -1) {
        this.hand.cards.splice(cardIndex, 1);
      }
    } else {
      console.log(`La carte ${card} est valide et va être jouée.`);
      this.colyseusService.sendMessage('play_card', { card: cardToSend });
      //this.colyseusService.sendMessage('play_card', { card });
      const cardIndex = this.hand.cards.findIndex(c => c === card);
      if (cardIndex !== -1) {
        this.hand.cards.splice(cardIndex, 1);
      }
      this.isMyTurn = false;
    }
  }

  passTurn(): void {
    if (this.isMyTurn) {
      this.colyseusService.sendMessage('pass_turn', {});
      this.isMyTurn = false;
    }
  }

  leaveRoom(): void {
    this.colyseusService.leaveRoom();
  }
}

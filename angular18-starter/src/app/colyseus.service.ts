import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import {Hand , Card} from '../app/MyRoomState';
import {ArraySchema} from "@colyseus/schema";

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {
  private client: Colyseus.Client;
  private room!: Colyseus.Room;

  constructor() {
    this.client = new Colyseus.Client('http://localhost:2567');  // Assure-toi que l'URL est correcte
  }

  // Créer une room et envoyer le nom du joueur
  createRoom(playerName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.create('my_room', { playerName })  // Envoie le nom du joueur au serveur
        .then(room => {
          this.room = room;
          resolve(room.id);  // Renvoyer l'ID de la room créée
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Rejoindre une room existante en fonction de l'ID et envoyer le nom du joueur
  joinRoom(roomId: string, playerName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.joinById(roomId, { playerName })  // Envoie le nom du joueur au serveur
        .then(room => {
          this.room = room;
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Envoyer un message à la room
  sendMessage(type: string, message: Record<string, unknown>): void {
    if (this.room) {
      this.room.send(type, message);
    }
  }


  // Écouter les messages de type 'your_turn'
  onYourTurn(callback: (message: Record<string, unknown>) => void): void {
    if (this.room) {
      this.room.onMessage('your_turn', callback);
    }
  }


  // Quitter la room
  leaveRoom(): void {
    if (this.room) {
      this.room.leave();
    }
  }

  // Écouter les messages génériques
  onMessage<T>(type: string, callback: (message: T) => void): void {
    if (this.room) {
      this.room.onMessage(type, callback);
    }
  }


  // Écouter les mises à jour des joueurs
  listenForPlayers(callback: (players: string[]) => void): void {
    if (this.room) {
      this.room.onMessage('player_update', (players: string[]) => {
        callback(players); // Mise à jour de la liste des joueurs
      });
    }
  }

  // Écouter la mise à jour de la main des joueurs
  onHandUpdate(callback: (data: { hand: Hand }) => void): void {
    if (this.room) {
      this.room.onMessage('hand_update', (data: { hand: Hand }) => {
        console.log('Main reçue:', data.hand.cards);  // Afficher la main du joueur dans la console
        callback(data);
      });
    }
  }

  // Écouter les mises à jour de la pile de cartes
  onPileUpdate(callback: (data: { pile: ArraySchema<Card> }) => void): void {
    if (this.room) {
      this.room.onMessage('pile_update', (data: { pile: ArraySchema<Card> }) => {
        callback(data); // Mise à jour de la pile de cartes
      });
    }
  }

  // Écouter le message de début du jeu
  onGameStarted(callback: (data: { message: string }) => void): void {
    if (this.room) {
      this.room.onMessage('game_started', callback);
    }
  }

  // Écouter les notifications de fin de jeu
  onGameOver(callback: (data: { winner: string }) => void): void {
    if (this.room) {
      this.room.onMessage('game_over', callback);
    }
  }

  // Envoyer un message de fin de partie
  endGame(): void {
    this.sendMessage('end_game', {});
  }

  // Envoyer une carte jouée par le joueur
  playCard(card: Card): void {
    this.sendMessage('play_card', { card });
  }

  // Passer son tour
  passTurn(): void {
    this.sendMessage('pass_turn', {});
  }
}

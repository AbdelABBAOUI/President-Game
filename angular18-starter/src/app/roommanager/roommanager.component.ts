import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ColyseusService } from '../colyseus.service'; // Assure-toi que le chemin est correct

@Component({
  selector: 'app-room-manager',
  templateUrl: './roommanager.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Ajout du RouterModule ici
  styleUrls: ['./roommanager.component.css']
})
export class RoomManagerComponent  {
  roomId = ''; // ID de la room à rejoindre
  roomCreated = ''; // ID de la room créée
  playerName = ''; // Nom du joueur

  constructor(private colyseusService: ColyseusService, private router: Router) { }

 

  // Méthode pour créer une room
  createRoom(): void {
    if (!this.playerName.trim()) {
      console.error('Player name is required to create a room.');
      return;
    }

    this.colyseusService.createRoom(this.playerName).then(roomId => {
      console.log(`Room created with ID: ${roomId}`);
      this.router.navigate(['/waiting-room', roomId]); // Redirection vers la page d'attente
    }).catch(err => {
      console.error('Failed to create room', err);
    });
  }

  // Méthode pour rejoindre une room
  joinRoom(): void {
    if (!this.roomId.trim()) {
      console.error('Room ID is required to join.');
      return;
    }

    if (!this.playerName.trim()) {
      console.error('Player name is required to join a room.');
      return;
    }

    this.colyseusService.joinRoom(this.roomId, this.playerName).then(() => {
      console.log(`Joined room with ID: ${this.roomId}`);
      this.router.navigate(['/waiting-room', this.roomId]); // Redirection vers la page d'attente
    }).catch(err => {
      console.error('Failed to join room', err);
    });
  }
}

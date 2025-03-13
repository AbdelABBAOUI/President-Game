import { Component, OnInit } from '@angular/core';
import { ColyseusService } from '../colyseus.service';
import { Router, ActivatedRoute } from '@angular/router';  // Ajoutez ActivatedRoute ici
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css'],
  standalone: true,  // Déclarer le composant comme standalone
  imports: [CommonModule]  // Ajoutez CommonModule ici
})
export class WaitingRoomComponent implements OnInit {
  roomId = '';
  players: string[] = [];
  gameStarted = false;

  constructor(
    private colyseusService: ColyseusService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    // Écouter les mises à jour des joueurs
    this.colyseusService.onMessage('player_update', (players: string []): void => {
      this.players = players;
    });

    // Écouter le démarrage du jeu
    this.colyseusService.onMessage('game_started', () => {
      this.gameStarted = true;
      this.router.navigate([`/game/${this.roomId}`]);
    });
  }
}


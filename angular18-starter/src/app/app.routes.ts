import { Routes } from '@angular/router';
import { RoomManagerComponent } from './roommanager/roommanager.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', component: RoomManagerComponent },
  { path: 'waiting-room/:roomId', component: WaitingRoomComponent },
  { path: 'game/:roomId', component: GameComponent }

];

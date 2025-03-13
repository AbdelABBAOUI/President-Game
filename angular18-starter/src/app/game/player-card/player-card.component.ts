import { Component,Input} from '@angular/core';
import { CommonModule } from '@angular/common';

interface SymbolPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  @Input() value!: string;
  @Input() suit!: string;

  get isRed(): boolean {
    return this.suit === '♥' || this.suit === '♦';
  }

  get isJQKA(): boolean {
    return ['J', 'Q', 'K', 'A'].includes(this.value);
  }

  get isFigure(): boolean {
    return ['J', 'Q', 'K'].includes(this.value);
  }

  getFigureImage(): string {
    const path = `assets/card/${this.value.toLowerCase()}.svg`;
    return path;
  }

 

  get centerSymbolPositions(): SymbolPosition[] {
    const num = parseInt(this.value);
    if (isNaN(num)) return [];

    switch (num) {
      case 1: // Un seul symbole central
        return [
          { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        ];
      case 2: // Deux symboles alignés verticalement
        return [
          { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' },
          { bottom: '30%', left: '50%', transform: 'translate(-50%, 50%)' }
        ];
      case 3: // Triangle
        return [
          { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
          { top: '70%', left: '50%', transform: 'translate(-50%, -50%)' },
          { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }
        ];
      case 4: // Carré
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },
          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' }
        ];
      case 5: // Croix avec un centre
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },
          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' },
          { bottom: '50%', left: '50%', transform: 'translate(-50%, 50%)' }

        ];
      case 6: // Hexagone
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },
          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' },

          { bottom: '50%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '50%', left: '70%', transform: 'translate(-50%, 50%)' }
        ];
      case 7: // Hexagone + centre
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },
          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' },

          { bottom: '50%', left: '25%', transform: 'translate(-50%, 50%)' },
          { bottom: '50%', left: '75%', transform: 'translate(-50%, 50%)' },
          { bottom: '55%', left: '50%', transform: 'translate(-50%, 50%)' },
          
        ];
      case 8: // Octogone
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },

          { top: '40%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '40%', left: '70%', transform: 'translate(-50%, -50%)' },

          { bottom: '40%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '40%', left: '70%', transform: 'translate(-50%, 50%)' },

          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' }
        ];
      case 9: // Octogone + centre
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },

          { top: '40%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' },
          { top: '40%', left: '70%', transform: 'translate(-50%, -50%)' },

          { bottom: '40%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '40%', left: '70%', transform: 'translate(-50%, 50%)' },

          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' }
        ];
      case 10: // Disposition circulaire
        return [
          { top: '20%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '20%', left: '70%', transform: 'translate(-50%, -50%)' },

          { top: '40%', left: '30%', transform: 'translate(-50%, -50%)' },
          { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' },
          { top: '40%', left: '70%', transform: 'translate(-50%, -50%)' },

          { bottom: '40%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '40%', left: '70%', transform: 'translate(-50%, 50%)' },

          { bottom: '20%', left: '30%', transform: 'translate(-50%, 50%)' },
          { bottom: '35%', left: '50%', transform: 'translate(-50%, 50%)' },
          { bottom: '20%', left: '70%', transform: 'translate(-50%, 50%)' }
        ];
      default:
        return [];
    }
  }
}

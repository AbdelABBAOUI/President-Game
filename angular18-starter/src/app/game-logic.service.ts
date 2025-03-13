// game-logic.service.ts
import { Injectable } from '@angular/core';
import { Card} from '../app/MyRoomState';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {


  // Hiérarchie des cartes
  public cardOrder: string[] = [
    '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'
  ];

  // Fonction pour comparer les cartes selon les règles du jeu
  compareCards(card: Card, topCard: Card): boolean {
    if (!topCard) {
      console.log('La pile est vide, la carte peut être jouée.');
      return true; // Si la pile est vide, toute carte peut être jouée
    }
    
    
    // Comparaison des cartes selon l'ordre défini
    const cardIndex = this.cardOrder.indexOf(card.value);
    const topCardIndex = this.cardOrder.indexOf(topCard.value);
   // console.log(topCard);
    //console.log(card);
    //console.log(cardIndex);
    //console.log(topCardIndex);


    // Vérification des indices des cartes dans la hiérarchie
    if (cardIndex >= 0 && topCardIndex >= 0) {
      const isValid = cardIndex >= topCardIndex;
      if (isValid) {
       // console.log(`La carte ${card} est valide car elle est supérieure ou égale à ${topCard}.`);
      } else {
        //console.log(`La carte ${card} n'est pas valide car elle est inférieure à ${topCard}.`);
      }
      return isValid;
    }
  
    console.log(`Erreur dans la comparaison des cartes. Carte non trouvée dans l'ordre.`);
    return false;
  }
}

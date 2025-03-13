import { Schema,  type ,ArraySchema} from "@colyseus/schema";


/**
 * Represente une carte 
 */
export class Card extends Schema {
  @type('string') suit = "";
  @type('string') value = "";

  public get numericValue() {
    if (this.value == 'A') return 11;
    if (isNaN(Number(this.value))) return 10;
    return Number(this.value);
  }

  override toString(): string {
    return `${this.value}${this.suit}`;
  }

}

/**
 * Represents la main d'un joueur 
 */
export class Hand extends Schema {
  
  @type([Card]) cards = new ArraySchema<Card>();

  // Méthode pour récupérer le nombre de cartes
  public getCardCount(): number {
    return this.cards.length;
  }

  // Méthode pour vérifier si une carte est dans la main
  public containsCard(card: Card): boolean {
    return this.cards.some(existingCard => existingCard === card);
  }

  // Méthode pour supprimer une carte de la main
  public removeCard(card: Card): void {
    // Utilisation de filter pour obtenir un tableau sans la carte à supprimer
    const index = this.cards.findIndex(c => c === card);
    if (index !== -1) {
      this.cards.splice(index, 1);  // Supprime la carte à l'index trouvé
    }
  }

  override toString(): string {
    return this.cards.map(card => card.toString()).join(', ');
  }

}


export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty = "Hello world";

}

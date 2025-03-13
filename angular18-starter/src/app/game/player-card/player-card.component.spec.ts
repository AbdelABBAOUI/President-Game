import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerCardComponent } from './player-card.component';
import { By } from '@angular/platform-browser';

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
  });

  

  describe('Template Switch Tests', () => {
    

    
     it('should display card (visual check)', (done) => {
      component.value = 'Q';
      component.suit = '♣︎';
      fixture.detectChanges();
      
      // Ceci va maintenir la carte visible dans le navigateur Karma
      const card = fixture.debugElement.nativeElement;
      document.body.appendChild(card);
      
      // Utiliser setTimeout pour garder l'élément visible
      setTimeout(() => {
        document.body.removeChild(card);
        done();
      }, 200000); // garde l'élément visible pendant 2 secondes
    }); 

    
  });

  describe('getFigureImage Tests', () => {

    it('should display the correct image for red suit', () => {
      component.value = 'Q';
      component.suit = '♥'; // Valeur de la carte
      fixture.detectChanges();  // Détecter les changements dans le template
  
      const imageElement = fixture.debugElement.query(By.css('img')); // Rechercher l'élément <img>
      expect(imageElement).toBeTruthy();  // Vérifier que l'image existe
      expect(imageElement.nativeElement.src).toContain('assets/card/red_q.svg');  // Vérifier le chemin de l'image
    });
  
  });

});

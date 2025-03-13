import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomManagerComponent } from './roommanager.component';

describe('RoommanagerComponent', () => {
  let component: RoomManagerComponent;
  let fixture: ComponentFixture<RoomManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

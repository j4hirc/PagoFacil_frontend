import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bloque } from './bloque';

describe('Bloque', () => {
  let component: Bloque;
  let fixture: ComponentFixture<Bloque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bloque],
    }).compileComponents();

    fixture = TestBed.createComponent(Bloque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Condomino } from './condomino';

describe('Condomino', () => {
  let component: Condomino;
  let fixture: ComponentFixture<Condomino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Condomino],
    }).compileComponents();

    fixture = TestBed.createComponent(Condomino);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

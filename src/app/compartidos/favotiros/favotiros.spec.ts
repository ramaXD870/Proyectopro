import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Favotiros } from './favotiros';

describe('Favotiros', () => {
  let component: Favotiros;
  let fixture: ComponentFixture<Favotiros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favotiros],
    }).compileComponents();

    fixture = TestBed.createComponent(Favotiros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

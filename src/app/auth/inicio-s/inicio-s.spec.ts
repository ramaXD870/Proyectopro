import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InicioS } from './inicio-s';

describe('InicioS', () => {
  let component: InicioS;
  let fixture: ComponentFixture<InicioS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioS, CommonModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.loginForm).toBeDefined();
  });

  it('form should be invalid initially', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });
});
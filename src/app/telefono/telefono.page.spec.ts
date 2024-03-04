import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelefonoPage } from './telefono.page';

describe('TelefonoPage', () => {
  let component: TelefonoPage;
  let fixture: ComponentFixture<TelefonoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TelefonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

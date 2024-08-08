import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormKidPage } from './form-kid.page';

describe('FormKidPage', () => {
  let component: FormKidPage;
  let fixture: ComponentFixture<FormKidPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormKidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

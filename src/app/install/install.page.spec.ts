import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstallPage } from './install.page';

describe('InstallPage', () => {
  let component: InstallPage;
  let fixture: ComponentFixture<InstallPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InstallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

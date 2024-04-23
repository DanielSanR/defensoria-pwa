//shared component
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderOnboardingComponent } from './header-onboarding/header-onboarding.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [HeaderOnboardingComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HeaderOnboardingComponent]
})
export class SharedComponentsModule { }

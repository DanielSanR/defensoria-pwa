//shared component
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderOnboardingComponent } from './header-onboarding/header-onboarding.component';
import { IonicModule } from '@ionic/angular';
import { HeaderDesktopComponent } from './header-desktop/header-desktop.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [HeaderOnboardingComponent,HeaderDesktopComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [HeaderOnboardingComponent,
            HeaderDesktopComponent
  ]
})
export class SharedComponentsModule { }

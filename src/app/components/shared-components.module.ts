//shared component
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderOnboardingComponent } from './header-onboarding/header-onboarding.component';
import { IonicModule } from '@ionic/angular';
import { HeaderDesktopComponent } from './header-desktop/header-desktop.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [HeaderOnboardingComponent,HeaderDesktopComponent,FooterComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [HeaderOnboardingComponent,
            HeaderDesktopComponent,
            FooterComponent
             
  ]
})
export class SharedComponentsModule { }

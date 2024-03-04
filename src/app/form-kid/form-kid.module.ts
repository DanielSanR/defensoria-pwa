import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';

import { IonicModule } from '@ionic/angular';

import { FormKidPageRoutingModule } from './form-kid-routing.module';

import { FormKidPage } from './form-kid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormKidPageRoutingModule,
    SwiperModule
  ],
  declarations: [FormKidPage]
})
export class FormKidPageModule {}

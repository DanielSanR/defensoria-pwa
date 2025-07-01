import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormKidPage } from './form-kid.page';

const routes: Routes = [
  {
    path: '',
    component: FormKidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormKidPageRoutingModule {}

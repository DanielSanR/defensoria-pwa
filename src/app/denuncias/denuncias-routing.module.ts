import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DenunciasPage } from './denuncias.page';

const routes: Routes = [
  {
    path: '',
    component: DenunciasPage
  },
  {
    path: 'detalle',
    loadChildren: () => import('./detalle/detalle.module').then( m => m.DetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciasPageRoutingModule {}

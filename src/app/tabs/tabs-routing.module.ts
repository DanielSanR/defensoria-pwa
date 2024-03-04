import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { OnboardingGuard } from '../guard/onboarding.guard';

const routes: Routes = [
  {
    path: 'principal',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        canLoad: [OnboardingGuard]
      },
      {
        path: 'mapa',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule),
         canLoad: [OnboardingGuard]
      },
      {
        path: 'preguntas-frecuentes',
        loadChildren: () => import('../faq/faq.module').then(m => m.FaqPageModule),
         canLoad: [OnboardingGuard]
      },
      {
        path: 'numeros-utiles',
        loadChildren: () => import('../telefono/telefono.module').then(m => m.TelefonoPageModule),
         canLoad: [OnboardingGuard]
      },
       {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule),
         canLoad: [OnboardingGuard]
      }, 
      {
        path: '',
        redirectTo: '/principal/inicio',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/principal/inicio',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

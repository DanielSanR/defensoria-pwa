import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OnboardingGuard } from './guard/onboarding.guard';
import { FormGuard } from './guard/form.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)

  }/* ,
  {
    path: 'formulario',
    loadChildren: () => import('./form/form.module').then( m => m.FormPageModule),
    canLoad: [OnboardingGuard],
    canActivate: [FormGuard],
    data: {
      expectedSelected: 'teen'
    }
  },
  {
    path: 'formulario-kids',
    loadChildren: () => import('./form-kid/form-kid.module').then( m => m.FormKidPageModule),
    canLoad: [OnboardingGuard],
    canActivate: [FormGuard],
    data: {
      expectedSelected: 'kid'
    }
  } */,
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then( m => m.OnboardingPageModule),
    canActivate: [OnboardingGuard]
  },
  {
    path: '',
    redirectTo: '/principal/inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/principal/inicio',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'sobre-nosotros',
    loadChildren: () => import('./sobre-nosotros/sobre-nosotros.module').then( m => m.SobreNosotrosPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

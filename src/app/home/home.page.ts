import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  values: any[] = [
    {id: 1, text: 'Pedir Ayuda', icon: 'support.svg', page: 'formulario', externalURL: false},
    {id: 2, text: 'Tus Derechos', icon: 'Book.svg', page: 'preguntas-frecuentes', externalURL: false},
    {id: 3, text: 'Sitio Web', icon: 'globe-outline.svg', page: 'https://defensoriadennya.misiones.gob.ar/', externalURL: true},
    {id: 4, text: 'Mapa', icon: 'map.svg', page: 'mapa', externalURL: false}
  ];
    
  constructor(public router: Router) {}
  
  navigate(route: string) {
    this.router.navigate([route]);
  }
   
  redirect(item: any) {  
    if (item.externalURL) {
      window.open(item.page, '_blank');
      return;
    }
    this.router.navigate([item.page]);
  }

  getCardDescription(id: number): string {
    switch(id) {
      case 1:
        return 'Completa el formulario para solicitar ayuda';
      case 2:
        return 'Conoce tus derechos y cómo protegerlos';
      case 3:
        return 'Visita nuestro sitio web oficial';
      case 4:
        return 'Encuentra centros de ayuda cercanos';
      default:
        return '';
    }
  }
}
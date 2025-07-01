import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Card {
  id: number;
  title: string;
  description: string;
  iconPath: string;
  route: string;
  isExternal: boolean;
  isPrimary?: boolean;
}

interface TrustReason {
  id: number;
  title: string;
  text: string;
  iconPath: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  cards: Card[] = [
    {
      id: 1, 
      title: 'Pedir Ayuda', 
      description: 'Completa el formulario para solicitar ayuda',
      iconPath: '../../assets/icon/home/pedir-ayuda.svg', 
      route: 'formulario', 
      isExternal: false,
      isPrimary: true
    },
    {
      id: 2, 
      title: 'Tus Derechos', 
      description: 'Conoce tus derechos y cómo protegerlos',
      iconPath: '../../assets/icon/home/derechos.svg', 
      route: 'preguntas-frecuentes', 
      isExternal: false
    },
    {
      id: 3, 
      title: 'Sitio Web', 
      description: 'Visita nuestro sitio web oficial',
      iconPath: '../../assets/icon/home/sitioweb.svg', 
      route: 'https://defensoriadennya.misiones.gob.ar/', 
      isExternal: true
    },
    {
      id: 4, 
      title: 'Mapa', 
      description: 'Encuentra centros de ayuda cercanos',
      iconPath: '../../assets/icon/home/mapa.svg', 
      route: 'mapa', 
      isExternal: false
    }
  ];
  trustReasons: TrustReason[] = [
    {
      id: 1,
      title: 'Te Escuchamos',
      text: 'Siempre hay alguien disponible para escucharte, sin juzgar y con respeto.',
      iconPath: '../../assets/icon/home/te-escuchamos.svg'
    },
    {
      id: 2,
      title: 'Te Protegemos',
      text: 'Tu seguridad es nuestra prioridad. Todo lo que nos digas es confidencial.',
      iconPath: '../../assets/icon/home/te-protegemos.svg'
    },
    {
      id: 3,
      title: 'Te Ayudamos',
      text: 'Contamos con profesionales preparados para brindarte la ayuda que necesitas.',
      iconPath: '../../assets/icon/home/te-ayudamos.svg'
    }
  ];
    
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  redirect(item: Card): void {  
    if (item.isExternal) {
      window.open(item.route, '_blank');
      return;
    }
    this.router.navigate([item.route]);
  }
}
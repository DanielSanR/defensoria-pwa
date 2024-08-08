import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage  { 
  values: any[]=[
    {id:1,text:'Pedir Ayuda',icon:'microfono.svg',page:'formulario',externalURL:false},
    {id:2,text:'Tus Derechos',icon:'Book.svg',page:'preguntas-frecuentes',externalURL:false},
    {id:3,text:'Sitio Web',icon:'globe-outline.svg',page:'https://defensoriadennya.misiones.gob.ar/',externalURL:true},
    {id:4,text:'Mapa',icon:'map.svg',page:'mapa',externalURL:false}];
  constructor(public router: Router) {}
   
  redirect(item: any){  
    if(item.externalURL){
      location.assign(item.page);
    }
    this.router.navigate([item.page]);
  }
}


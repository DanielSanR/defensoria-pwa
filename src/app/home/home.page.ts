import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage  { 
  values: any[]=[
    {id:1,text:'Pedir Ayuda',icon:'microfono.svg',page:'/principal/formulario',externalURL:false},
    {id:2,text:'Consejos',icon:'faq.svg',page:'/principal/preguntas-frecuentes',externalURL:false},
    {id:3,text:'Sitio Web',icon:'globe-outline.svg',page:'https://defensoriadennya.misiones.gob.ar/',externalURL:true},
    {id:4,text:'Mapa',icon:'map.svg',page:'/principal/mapa',externalURL:false}];
  formRoute: string;
  $obs= new Subscription();
  constructor(public formService: FormService,public router: Router) {}
   
  redirect(item: any){  
    if(item.externalURL){
      location.assign(item.page);
    }
    this.router.navigate([item.page]);
  }
}


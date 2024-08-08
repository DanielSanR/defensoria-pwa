import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})
export class TelefonoPage  {
  values: any[]=[
    {id:1,title:'Línea de Emergencia 911',detail:'3764 - 345421',icon:'comisaria-numeros.svg'},
    {id:2,title:'Defensoria de los Derechos de Niños, Niñas y Adolescentes',detail:'3764-345421',icon:'secretaria-numeros.svg'},
    {id:3,title:'Secretaría Nacional Línea 102 y 137',detail:'3764-433019',icon:'secretaria-numeros.svg',externalURL:true},
    {id:4,title:'Correo electrónico',detail:'defensoriadennya.misiones@gmail.com',icon:'mail-numeros.svg'}];
  constructor() { }

 

}

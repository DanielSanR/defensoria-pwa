import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DenunciasService } from '../services/denuncias.service';


@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.page.html',
  styleUrls: ['./denuncias.page.scss'],
})
export class DenunciasPage {
 /*  denunciasArray=  [{ 'id_denuncia': '1', 'fecha': '11/12/2024', 'denuncia': 'Denuncia 1', 'estado': 'En proceso', 'victima': 'Victima 1','chip':'#f4f4f4','chip_color':'#000','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'},
    { 'id_denuncia': '2', 'fecha': '12/12/2024', 'denuncia': 'Denuncia 2', 'estado': 'En proceso', 'victima': 'Victima 2','chip':'#f4f4f4','chip_color':'#000','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'},
    { 'id_denuncia': '3', 'fecha': '13/12/2024', 'denuncia': 'Denuncia 3', 'estado': 'Finalizado', 'victima': 'Victima 3','chip':'#5A4BB2','chip_color':'#fff','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'}
  ] */
    denunciasArray=  [{ 'id_denuncia': '1', 'fecha': '11/12/2024', 'denuncia': 'Denuncia 1', 'estado': 'En proceso', 'victima': 'Victima 1','chip':'#f4f4f4','chip_color':'#000','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'},
    { 'id_denuncia': '2', 'fecha': '12/12/2024', 'denuncia': 'Denuncia 2', 'estado': 'En proceso', 'victima': 'Victima 2','chip':'#f4f4f4','chip_color':'#000','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'},
    { 'id_denuncia': '3', 'fecha': '13/12/2024', 'denuncia': 'Denuncia 3', 'estado': 'Finalizado', 'victima': 'Victima 3','chip':'#5A4BB2','chip_color':'#fff','dni':'12345678','telefono':'123456789','email':'emailtest@gmail.com','direccion':'direccion test','descripcion':'descripcion test'}
  ] 
  
  constructor(private route: Router,private denunciaService: DenunciasService) { }


  details(denuncia){
    this.denunciaService.setDenuncias(denuncia);

    this.route.navigate(['/denuncias/'+denuncia.id_denuncia]);
  }

}

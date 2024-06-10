import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.page.html',
  styleUrls: ['./denuncias.page.scss'],
})
export class DenunciasPage implements OnInit {
  denunciasArray=  [{ 'id_denuncia': '1', 'fecha': '11/12/2024', 'denuncia': 'Denuncia 1', 'estado': 'En proceso', 'victima': 'Victima 1','chip':'#f4f4f4','chip_color':'#000'},
    { 'id_denuncia': '2', 'fecha': '12/12/2024', 'denuncia': 'Denuncia 2', 'estado': 'En proceso', 'victima': 'Victima 2','chip':'#f4f4f4','chip_color':'#000'},
    { 'id_denuncia': '3', 'fecha': '13/12/2024', 'denuncia': 'Denuncia 3', 'estado': 'Finalizado', 'victima': 'Victima 3','chip':'#5A4BB2','chip_color':'#fff'}
  ]
  constructor() { }

  ngOnInit() {
  }

}

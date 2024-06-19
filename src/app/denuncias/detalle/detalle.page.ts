import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DenunciasService } from 'src/app/services/denuncias.service';
import { MapService } from 'src/app/services/map.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {

  denuncia 
  properties = [];

  cords: any;
  constructor(private denunciaService: DenunciasService,private _mapService: MapService,public loadingController: LoadingController,
    private route: Router
  ) { 
  }

  ngOnInit() {
    
    this.denunciaService.getDenuncias().subscribe((denuncia) => {
      this.denuncia = denuncia;
    });
    console.log(this.denuncia)
  }

  async ionViewDidEnter(){
    await this._mapService.loadCoordenates();
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'circles',
    });
    loading.present();
    const sub = this._mapService.getCoord().subscribe((data)=>{
      this.cords = data;
    });
    this._mapService.generateUserMap(this.cords);
    loading.dismiss();
  
  }

  back(){
    this.denunciaService.setDenuncias(null);
    this.route.navigate(['/denuncias'],{replaceUrl:true});
  }
  /* toggleAccordion(accordion){ 
    if(accordion.detail.value ==='third'){
      setTimeout(() => {
        this._mapService.map.invalidateSize();

      }, 500);
       
    } 
  } */

}

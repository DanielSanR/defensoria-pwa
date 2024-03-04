import { Component } from '@angular/core';
//leaflet imports
import * as Leaflet from 'leaflet';

import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder';
import { MapService } from '../services/map.service';
import { LoadingController } from '@ionic/angular';
import {  Subscription } from 'rxjs';
import { FormService } from '../services/form.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage{
  map!: Leaflet.Map;
  properties = [];

  cords: any;
  $obs = new Subscription();

  constructor(private _mapService: MapService,public loadingController: LoadingController,
    private formService: FormService) { 
      }

  async ionViewDidEnter(){
    this._mapService.loadCoordenates();
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'circles',
    });
    loading.present();
    const sub = this._mapService.getCoord().subscribe((data)=>{
      this.cords = data;
    });
    this._mapService.generateMap(this.cords);
    loading.dismiss();
    this.$obs.add(sub);
  
  }
  ionViewWillLeave() {
    this.$obs.unsubscribe();
  }
}

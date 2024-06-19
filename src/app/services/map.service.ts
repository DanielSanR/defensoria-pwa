
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { async } from 'rxjs/internal/scheduler/async';
//leaflet imports
import * as Leaflet from 'leaflet';
import {Map,tileLayer,marker} from 'leaflet';

import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder';
import * as ELG from 'esri-leaflet-geocoder';
import { GoogleMap } from '@capacitor/google-maps';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';
import { ReplaySubject, BehaviorSubject, from, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { FormService } from './form.service';

interface Properties {
  Nombre: string;
  Direccion: string;
  Descripcion: string;
  Ciudad: string;
  Telefono: string;
  Longitud: number;
  Latitud: number;
  Localidad: string;
  Telefono_1: string;
  Telefono_2: string;

}
@Injectable({
  providedIn: 'root'
})


export class MapService {
  map!: Leaflet.Map;
  comisarias = [] as any[]
  hospitales = [] as Properties[];
  coord: Observable<any> | undefined;
  ltlng: BehaviorSubject<any> = new BehaviorSubject(null);
   private comisariaIcon = new Leaflet.Icon({
    iconUrl: '../../assets/icon/policia.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [42, 42],
    iconAnchor: [42, 42],
    popupAnchor: [1, -34],
    shadowSize: [32, 32]
  });
  private hospitalIcon = new Leaflet.Icon({
    iconUrl: '../../assets/icon/hospital.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [42, 42],
    iconAnchor: [42, 42],
    popupAnchor: [1, -34],
    shadowSize: [32, 32]
  });
  private  key = 'AAPK895f48d83b5543ab80c5d058d510d5971uhYgfFtvdNCIB-no6TgvFEbUE-H-h6ZfPfs9GOWCpAtsp9cTGA8zFsd2DiPWwPf';
  constructor(private plt: Platform, private storageService: StorageService) {
     // this.loadCoordenates();
  }

   loadCoordenates(){
    this.storageService.getStorage2('device').then(
      (device) => {
       const latlng = JSON.parse(device).latlng
      if(latlng){
        this.ltlng.next(latlng);
      }
      else {
        this.ltlng.next(false);
      }
      }
    );
  }
  getCoord(){
    return this.ltlng.asObservable();
  }



   generateMap(cords: any){
     if(!cords){(cords = [-27.366667, -55.896944]);}
    if (this.map !== undefined) {this.map.remove();}
    this.map = new Leaflet.Map('map').setView([Number(cords[0]),Number(cords[1])], 16);
  Leaflet.tileLayer('https://api.mapbox.com/styles/v1/danielsanr/cl7s448ej004i15lqz3hudwgv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGFuaWVsc2FuciIsImEiOiJjbDdzNGJ3MTcwbHQyM3ZvODg5NHhxeTdzIn0.9FGfq9AypFMgmFR6gWjlFw', {
    maxZoom: 19,
    attribution: "<a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
  }).addTo(this.map);
  fetch('./assets/datos/comisarias.json').then(res => res.json())
  .then(data=>{
   this.comisarias= data;

  if (this.comisarias.length > 0) {
    for (const m of this.comisarias) { 
      if (m.longitud && m.latitud) {
        let address = (m.descripcion.length > 1 ? m.descripcion : 'Direccion no disponible');
        let name = (m.nombre.length > 1 ? m.nombre : 'Nombre no disponible');
        let city = (m.ciudad.length > 1 ? m.ciudad : 'Ciudad no disponible');
        let phone = (m.telefono.length > 1 ? m.telefono : 'Telefono no disponible');
        Leaflet.marker([m.longitud,m.latitud],{icon:this.comisariaIcon}).addTo(this.map)
          .bindPopup(`<div style="font-weight: bold; text-align: center;">COMISARIA</div><hr>` +
            `<strong>Ciudad: </strong>${city}<br>` +
            `<strong>Nombre: </strong>${name}<br>` +
            `<strong>Direccion: </strong>${address}<br>` +
            `<strong>Telefono: </strong>${phone}<br><hr>`);
      }
    }
  }

    });
 fetch('./assets/datos/hospitales.json').then(res => res.json())
  .then(data=>{
   this.hospitales= data;
   for(const m of this.hospitales){
    let lt = [m.Longitud,m.Latitud];
      let address = ( m.Direccion.length> 1 ?  m.Direccion : 'Direccion no disponible');
      let name = (m.Nombre.length > 1 ? m.Nombre : 'Nombre no disponible');
      let city = ( m.Localidad.length> 1 ?  m.Localidad : 'Ciudad no disponible');
      let phone = ((m.Telefono_1.length > 1 || m.Telefono_2.length > 1)? m.Telefono_1 +' / '+m.Telefono_2 : 'Telefono no disponible');
      Leaflet.marker([m.Latitud,m.Longitud],{icon:this.hospitalIcon}).addTo(this.map)
      .bindPopup(`<div style="font-weight: bold; text-align: center;">HOSPITAL</div><hr>` +
      `<strong>Ciudad: </strong>${ city }<br>` +
      `<strong>Nombre: </strong>${ name}<br>` +
      `<strong>Direccion: </strong>${ address}<br>` +
      `<strong>Telefono: </strong>${ phone }<br><hr>`);
   }
    });
    if (this.map) {
      let circle = Leaflet.circleMarker(cords, {
        radius: 50,
        color: 'cornflowerblue',
        fillOpacity: 0.2,
        opacity: 0.5
      }).addTo(this.map);
    }

}

generateUserMap(cords){
  if(!cords){(cords = [-27.366667, -55.896944]);}
    if (this.map !== undefined) {this.map.remove();}
    this.map = new Leaflet.Map('map').setView([Number(cords[0]),Number(cords[1])], 16);
  Leaflet.tileLayer('https://api.mapbox.com/styles/v1/danielsanr/cl7s448ej004i15lqz3hudwgv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGFuaWVsc2FuciIsImEiOiJjbDdzNGJ3MTcwbHQyM3ZvODg5NHhxeTdzIn0.9FGfq9AypFMgmFR6gWjlFw', {
    maxZoom: 19,
    attribution: "<a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
  }).addTo(this.map);
    if (this.map) {
      let circle = Leaflet.circleMarker(cords, {
        radius: 50,
        color: 'cornflowerblue',
        fillOpacity: 0.2,
        opacity: 0.5
      }).addTo(this.map);
    }

}

}


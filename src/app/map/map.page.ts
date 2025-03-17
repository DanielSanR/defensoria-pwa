import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  map!: Leaflet.Map;
  searchTerm: string = '';
  selectedType: 'all' | 'hospital' | 'police' = 'all';
  subscriptions = new Subscription();
  
  comisarias: any[] = [];
  hospitales: any[] = [];
  filteredLocations: any[] = [];
  markers: Leaflet.Marker[] = [];
  currentCoords: any;

  constructor(
    private mapService: MapService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando mapa...',
      spinner: 'circles',
    });
    
    await loading.present();
    this.mapService.loadCoordenates();
    
    const sub = this.mapService.getCoord().subscribe(
      (coords) => {
        this.currentCoords = coords || [-27.366667, -55.896944];
        this.fetchLocationsData().then(() => {
          this.initMap();
          loading.dismiss();
        });
      }
    );
    
    this.subscriptions.add(sub);
  }

  async fetchLocationsData() {
    try {
      const comisariasResponse = await fetch('./assets/datos/comisarias.json');
      this.comisarias = await comisariasResponse.json();
      
      const hospitalesResponse = await fetch('./assets/datos/hospitales.json');
      this.hospitales = await hospitalesResponse.json();
      this.prepareLocationsList();
    } catch (error) {
      console.error('Error loading locations data:', error);
    }
  }

  prepareLocationsList() {
    const policeLocations = this.comisarias.map(item => ({
      type: 'police',
      name: item.nombre || 'Comisaría',
      position: [item.longitud, item.latitud],
      address: item.descripcion || 'Sin dirección',
      phone: item.telefono || 'Sin teléfono',
      city: item.ciudad || 'Posadas',
      originalData: item
    }));
    const hospitalLocations = this.hospitales.map(item => ({
      type: 'hospital',
      name: item.Nombre || 'Hospital',
      position: [item.Latitud, item.Longitud],
      address: item.Direccion || 'Sin dirección',
      phone: (item.Telefono_1 && item.Telefono_2) ? 
        `${item.Telefono_1} / ${item.Telefono_2}` : 
        (item.Telefono_1 || item.Telefono_2 || 'Sin teléfono'),
      city: item.Localidad || 'Posadas',
      originalData: item
    }));
    this.filteredLocations = [...policeLocations, ...hospitalLocations];
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = new Leaflet.Map('map').setView(this.currentCoords, 14);
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/danielsanr/cl7s448ej004i15lqz3hudwgv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGFuaWVsc2FuciIsImEiOiJjbDdzNGJ3MTcwbHQyM3ZvODg5NHhxeTdzIn0.9FGfq9AypFMgmFR6gWjlFw', {
      maxZoom: 19,
      attribution: "<a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
    }).addTo(this.map);
    this.map.zoomControl.remove();
    Leaflet.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.addMarkers();
    if (this.currentCoords) {
      Leaflet.circleMarker(this.currentCoords, {
        radius: 50,
        color: 'cornflowerblue',
        fillOpacity: 0.2,
        opacity: 0.5
      }).addTo(this.map);
    }
  }

  addMarkers() {
    if (this.markers.length > 0) {
      for (const marker of this.markers) {
        this.map.removeLayer(marker);
      }
      this.markers = [];
    }
    const hospitalIcon = this.mapService.hospitalIcon;
    const comisariaIcon = this.mapService.comisariaIcon;
    for (const location of this.filteredLocations) {
      const icon = location.type === 'hospital' ? hospitalIcon : comisariaIcon;
      
      const marker = Leaflet.marker(location.position as Leaflet.LatLngExpression, { icon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-weight: bold; text-align: center;">${location.type === 'hospital' ? 'HOSPITAL' : 'COMISARIA'}</div><hr>
          <strong>Ciudad: </strong>${location.city}<br>
          <strong>Nombre: </strong>${location.name}<br>
          <strong>Dirección: </strong>${location.address}<br>
          <strong>Teléfono: </strong>${location.phone}<br><hr>
        `);
      
      this.markers.push(marker);
    }
  }

  filterLocations() {
    let allLocations = [];
    if (this.selectedType === 'all' || this.selectedType === 'police') {
      const policeLocations = this.comisarias
        .filter(item => 
          (item.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
           item.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           item.ciudad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           this.searchTerm === '')
        )
        .map(item => ({
          type: 'police',
          name: item.nombre || 'Comisaría',
          position: [item.longitud, item.latitud],
          address: item.descripcion || 'Sin dirección',
          phone: item.telefono || 'Sin teléfono',
          city: item.ciudad || 'Posadas',
          originalData: item
        }));
      
      allLocations = [...allLocations, ...policeLocations];
    }
    if (this.selectedType === 'all' || this.selectedType === 'hospital') {
      const hospitalLocations = this.hospitales
        .filter(item => 
          (item.Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
           item.Direccion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           item.Localidad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           this.searchTerm === '')
        )
        .map(item => ({
          type: 'hospital',
          name: item.Nombre || 'Hospital',
          position: [item.Latitud, item.Longitud],
          address: item.Direccion || 'Sin dirección',
          phone: (item.Telefono_1 && item.Telefono_2) ? 
            `${item.Telefono_1} / ${item.Telefono_2}` : 
            (item.Telefono_1 || item.Telefono_2 || 'Sin teléfono'),
          city: item.Localidad || 'Posadas',
          originalData: item
        }));
      
      allLocations = [...allLocations, ...hospitalLocations];
    }
    this.filteredLocations = allLocations;
    this.addMarkers();
  }

  setSelectedType(type: 'all' | 'hospital' | 'police') {
    this.selectedType = type;
    this.filterLocations();
  }

  selectLocation(location: any) {
    this.map.setView(location.position as Leaflet.LatLngExpression, 16);
    for (const marker of this.markers) {
      const markerLatLng = marker.getLatLng();
      const locationLatLng = Leaflet.latLng(location.position[0], location.position[1]);
      
      if (markerLatLng.equals(locationLatLng, 0.001)) {
        marker.openPopup();
        break;
      }
    }
  }
}
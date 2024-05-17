import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private url = environment.urlApi;
  constructor(private storageService: StorageService, private deviceService: DeviceService, private http: HttpClient) { }


  async saveOnboarding(selected: any, latlng: any, uuid: any){
    const date = this.formatDate();
    await this.storageService.setStorage('selected',selected) ;
    await this.storageService.setOnboarding();
    const ageRange  = selected == 'teen'? 'Adolescente' : ' Niño/Niña';
    await this.deviceService.updateDeviceUuid(uuid, ageRange, latlng,date);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
     return new Promise((resolve) => {
       this.http.post(`${this.url}`, this.replaceEmptyArraysWithObjects(device)).subscribe((res: any) => {
        //no capturamos errores ya que luego implementaremos un interceptor para manejarlos, tampoco catcheamos el formato json xq devuelve un text
        console.log(res)
       });
       resolve(true);
     });
     }
  
 formatDate(){
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;
  return formattedDateTime;
 }

 replaceEmptyArraysWithObjects(obj: any): any {
  if (Array.isArray(obj) && obj.length === 0) {
    return {};
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = this.replaceEmptyArraysWithObjects(obj[key]);
      }
    }
  }
  return obj;
}

  }


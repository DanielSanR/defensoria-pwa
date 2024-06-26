import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormService } from './form.service';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private url = environment.urlApi;
  constructor(private storageService: StorageService, private deviceService: DeviceService, private http: HttpClient,
    private formService: FormService) { }


  async saveOnboarding(selected: any, latlng: any, uuid: any){
    await this.storageService.setStorage('selected',selected) ;
    await this.storageService.setOnboarding();
    await this.deviceService.updateDeviceUuid(uuid, selected, latlng);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    console.log("POST para Onboarding( USER )",device)
    this.formService.optionChosed.next(selected);
     return new Promise((resolve) => {
       /* this.http.post(`${this.url}/Auth/denuncias/guardar`, this.replaceEmptyArraysWithObjects(device)).subscribe((res: any) => {
        console.log(res)
       }); */
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


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


  async saveOnboarding(selected: any, latlong: any, uuid: any){
    await this.storageService.setStorage('selected',selected) ;
    await this.deviceService.updateDeviceUuid(uuid, selected, latlong);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    this.formService.optionChosed.next(selected);
    //EN CASO DE QUE LA REQUEST A LA API SEA EXITOSA, SE GUARDAN LOS DATOS, SINO NO SE DEJA AVANZAR
    //eliminar const onboarding una vez se descomente la request a la api
    const onboarding = await this.storageService.setOnboarding()
    return new Promise((resolve) => {
                  //DESCOMENTAR TODA LA LINEA DE ABAJO PARA QUE FUNCIONE LA REQUEST A LA API
      this.http.post(`${this.url}/Auth/yoCuento/saveUser`, device).subscribe((res: any) => {
         if(res){
  
          console.log(onboarding);
          resolve(true);
         }
         else{
          resolve(false);
         }
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


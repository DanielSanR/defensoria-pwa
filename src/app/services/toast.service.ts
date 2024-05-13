import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor( private toastController: ToastController) {

  }


  async toast(text: string, color: string){
    const toast = await this.toastController.create({
      message: text, 
      duration: 2000,
      position:"top",
      positionAnchor:"footer",
      buttons: [
        {
          side: 'start',
          icon: '/../../assets/icon/chevron-black.svg'
        },
      ],
    });
    await toast.present();
  }

  async toastForm(message: string,position:any,icon:string,side:any,direction?: string){
    const toast = await this.toastController.create({
      message: '"'+message+'"',
      duration: 5000,
      position,
      cssClass: 'toast '+ position + ' ' + (direction? direction : ''),
      
      buttons: [
        {
          side,
          icon: '/../../assets/icon/form/'+icon
        },
      ],
    });
    await toast.present();
  }
}

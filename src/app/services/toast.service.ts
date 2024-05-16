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
      color: color
    });
    await toast.present();
  }

  async toastForm(message: string,position:any,icon:string,side:any,direction?: string){
    const toast = await this.toastController.create({
      message: '"'+message+'"',
      duration: 50100,
      position,
      cssClass: 'toast '+ position + ' ' + (direction? direction : ''),
      
      buttons: [
        {
          side,
          icon: '/../../assets/icon/form/'+icon
        },
        {
          side: 'end',
          icon: 'close-outline',
          role: 'cancel'
        },
      ],
    });
    await toast.present();
  }
}

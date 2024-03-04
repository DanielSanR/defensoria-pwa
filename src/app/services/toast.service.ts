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
      color,
      position: 'top',
    });
    await toast.present();
  }
}

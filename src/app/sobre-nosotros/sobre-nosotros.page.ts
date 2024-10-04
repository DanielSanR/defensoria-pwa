import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import packageInfo from '../../../package.json';
@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.page.html',
  styleUrls: ['./sobre-nosotros.page.scss'],
})
export class SobreNosotrosPage  {
  v = packageInfo.version;
  t = packageInfo.description;

  constructor(public modalController: ModalController) { }

  volver() {
    return this.modalController.dismiss();
  }
}

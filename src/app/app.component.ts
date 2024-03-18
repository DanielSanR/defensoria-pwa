import { Component, HostListener } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreensizeService } from './services/screensize.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
              private screenSizeService: ScreensizeService) {
                this.initializeApp();
              }


   initializeApp(){
    this.platform.ready().then(() => {
      this.screenSizeService.onResize(this.platform.width());
      
    });
   }   
   
   @HostListener('window:resize', ['$event'])
   private onResize(event){
     this.screenSizeService.onResize(event.target.innerWidth);
   }
}

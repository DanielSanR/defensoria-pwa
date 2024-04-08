import { Component, OnInit, ViewChild, ChangeDetectorRef,OnDestroy, ElementRef, AfterViewInit } from '@angular/core';/* 
import SwiperCore ,{Pagination, Autoplay,SwiperOptions,EffectFade, Navigation} from 'swiper'; *//* 
import { SwiperComponent } from 'swiper/angular'; */
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { SendmailService } from '../services/sendmail.service';
import { v4 as uuidv4 } from 'uuid';
import { DeviceService } from '../services/device.service';
import Swiper from 'swiper';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  private swiperInstance: any;

  @ViewChild('swiper')
  set swiper(swiperRef: ElementRef) {
    setTimeout(() => {
      this.swiperInstance = swiperRef.nativeElement.swiper;
      console.log(this.swiperInstance)
    }, 0);
  } 
  didInit: boolean = false;
  public background = '';
  key = 'AAPK895f48d83b5543ab80c5d058d510d5971uhYgfFtvdNCIB-no6TgvFEbUE-H-h6ZfPfs9GOWCpAtsp9cTGA8zFsd2DiPWwPf';
  result: string= '';
  selected: string = '';
  latitude: any;
  longitude: any;
  accuracy: any;
  usuarioId = uuidv4();
  constructor(private router: Router, private cd: ChangeDetectorRef,
    private alertController: AlertController,private toastService: ToastService
    ,private storageService: StorageService,
    private loadingController: LoadingController, 
    private sendMail: SendmailService, private deviceService: DeviceService
) { }

  ngOnInit() { 
    this.background = '#fff';
  }
 
  next(){ 
    this.swiperInstance.slideNext()
  }

  end(){
    console.log("end")
  }
  async getLocation(){
    const loading = await this.loadingController.create();
    await loading.present();
    const alert = await this.alertController.create({
      header: 'Ubicaciónn rechazada',
      message: 'Debido a que no se tienen los permisos necesarios, tendras una ubicación anonima.',
      buttons: ['OK'],
    });

    await Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp: any ) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        setTimeout(() => {
          this.swiperInstance.slideNext()
        }, 500);
    }).catch((error) => {
        (async ()=>{
          await alert.present();
        })();
    });
    
    await loading.dismiss();
      }

      async save(){
        if(this.selected!== null){
          await this.storageService.setStorage('selected',this.selected) ;
          await this.storageService.setOnboarding();
          const result = await this.sendMail.sendOnboarding(this.selected, [this.latitude, this.longitude],this.usuarioId);
          if(result){
            this.toastService.toast('Datos guardados ! :)','success');}
          else{
            this.toastService.toast('Hubo un error al cargar tus datos :( ','danger');
          }
            this.router.navigate(['/principal/inicio']);
    
        }
      }
    
      init(){
        console.log("init")
      }
    
      select(event: any,type: string){
        this.selected = event;
        if(type === 'desktop'){
          this.save();
        }
      }
      skip(){
        this.swiperInstance.slideNext()
      }
    
      ionViewDidLeave(){
        this.swiperInstance.slideNext()
      }
    
      slideWillChange() { 
           if(this.swiperInstance.activeIndex === 2){
          this.background ='url("../../assets/images/kid-teen.svg") no-repeat center center / cover';
        }   
      }
}

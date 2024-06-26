import { Component, OnInit, ViewChild, ChangeDetectorRef,OnDestroy, ElementRef, AfterViewInit } from '@angular/core';/* 
import SwiperCore ,{Pagination, Autoplay,SwiperOptions,EffectFade, Navigation} from 'swiper'; *//* 
import { SwiperComponent } from 'swiper/angular'; */
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { v4 as uuidv4 } from 'uuid';
import { DeviceService } from '../services/device.service'; 
import { ScreensizeService } from '../services/screensize.service';
import { OnboardingService } from '../services/onboarding.service';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  public swiperInstance: any;

  @ViewChild('swiper')
  set swiper(swiperRef: ElementRef) {
    setTimeout(() => {
      this.swiperInstance = swiperRef.nativeElement.swiper;
    }, 0);
  } 
  public background = '';
  headerPixel = '56px'
  result: string= '';
  selected: string = '';
  latitude: any;
  longitude: any;
  isDesktop: boolean = false;
  usuarioId = uuidv4();
  constructor(private router: Router, private cd: ChangeDetectorRef,
    private alertController: AlertController,private toastService: ToastService
    ,private storageService: StorageService,
    private loadingController: LoadingController,
    private onboardingService: OnboardingService,
    private screenSize: ScreensizeService
) { }

  ngOnInit() { 
    this.background = '#fff';
     this.screenSize.isDesktopView().subscribe(isDesktop => {
       this.headerPixel = isDesktop ? '125px' : '71px';
        this.isDesktop = isDesktop;
      });
  }
 
  next(){ 
    this.swiperInstance.slideNext()
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
      console.log(resp)
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        console.log('Ubicación',this.latitude,this.longitude);
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
          const result = await this.onboardingService.saveOnboarding(this.selected,[this.latitude, this.longitude],this.usuarioId); 
          if(result){
              /* console.log('Datos guardados ! :)'); */
            }
          else{
             console.log('Hubo un error al enviar tus datos  ');
          }
            this.router.navigate(['/inicio']);
    
        }
      }
      select(event: any){
        this.selected = event;
          this.save();
        
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

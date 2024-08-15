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

  
  async getLocation() {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
  
    if (permissionStatus.state === 'denied') {
      const alert = await this.alertController.create({
        header: 'Permiso de ubicación denegado',
        message: `Parece que el permiso para acceder a la ubicación está desactivado. Por favor, sigue estos pasos para habilitar el acceso a la ubicación: \n
               1. Abre la configuración de tu navegador.\n
               2. Busca la sección de "Privacidad" o "Permisos".\n
               3. Encuentra los permisos de ubicación y permite el acceso para este sitio.\n
               Una vez hecho esto, vuelve y presiona "Reintentar".`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Reintentar',
            handler: () => {
              this.getLocation();  // Revisar permisos nuevamente
            }
          }
        ]
      });
      await alert.present();
    } else if (permissionStatus.state === 'granted') {
      this.getGeoLocation();
    } else {
      this.requestLocationPermission();
    }
  }
  
  async requestLocationPermission() {
    try {
      await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      // Si el permiso fue concedido y la ubicación obtenida con éxito
      this.getGeoLocation();
    } catch (error) {
      console.log('Solicitud de ubicación rechazada por el usuario', error);
    }
  }
  
  async getGeoLocation() {
    try {
      const resp = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('Ubicación', this.latitude, this.longitude);
      setTimeout(() => {
        this.swiperInstance.slideNext();
      }, 500);
    } catch (error) {
      console.log('Error al obtener ubicación:', error);
    }
  }

      async save(){
        if(this.selected!== null){
          const result = await this.onboardingService.saveOnboarding(this.selected,[this.latitude, this.longitude],this.usuarioId); 
          if(result){
            this.router.navigate(['/inicio'])
          }
          else{
            // no avanza, se va a mostrar mensaje de error por medio del interceptor
            console.log('Hubo un error al enviar tus datos  ');
          }
          
            
    
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

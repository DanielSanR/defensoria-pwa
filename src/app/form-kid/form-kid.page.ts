import { OnInit,ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RangeCustomEvent, LoadingController } from '@ionic/angular';
import SwiperCore ,{SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import PreguntasformArr from '../../assets/datos/DinamicFormKid.json';
import { Help } from '../models/Help';
import { FormService } from '../services/form.service';
import { SendmailService } from '../services/sendmail.service';
import { ToastService } from '../services/toast.service';
export interface PreguntasForm {
  key: string;
  title: string;
  type: string;
  icon: boolean;
  preguntas?: Array<OpcForm>;
}
interface OpcForm {
id: number;
val: string;
isChecked?: boolean | false;
icon?: string;
}
@Component({
  selector: 'app-form-kid',
  templateUrl: './form-kid.page.html',
  styleUrls: ['./form-kid.page.scss'],
})
export class FormKidPage implements OnInit {
@ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
public dinamicForm: PreguntasForm[] = PreguntasformArr;
  public help: Help = new Help();
  public bandera = false;
  public selected: boolean;
  public selectedAge: any;
  public background ='#ffffff';
  public finalized: boolean;
  public backgroundChecked='#FE910E';
  isckecked: boolean;
  public config: SwiperOptions ={
    allowTouchMove:false,
    autoHeight: true,
    preventInteractionOnTransition:true,
    speed: 250,
    effect: 'fade',
          fadeEffect: {
              crossFade: true
          }
  };
  constructor(private router: Router,private formService: FormService,
    private cd: ChangeDetectorRef, private loadingController: LoadingController,
    private sendMailService : SendmailService, private toastService :ToastService) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.background ='#ffffff';
    this.finalized = false;
    }
    next(){
      this.selected = false;
      this.swiper.swiperRef.slideNext(500);
    }
    prev(){
      if(this.swiper.swiperRef.activeIndex ===0)
      {
    this.close();
      }
      this.selected = false;
      this.swiper.swiperRef.slidePrev(500);
    }
   close(){
    this.selected = false;
    this.router.navigateByUrl('/principal/inicio');
  }
  //check
   filterItems(arr) {
    return arr.filter((el) => el).map((e) => e.isChecked).includes(true);
  }
  select(entry: any, arr?: any,index?: any){
    if(!this.filterItems(arr.preguntas)){
          arr.preguntas[index].isChecked= true;
    }
    else if(this.filterItems(arr.preguntas)  &&  arr.multiple === true){
          if(arr.preguntas[index].isChecked){
            arr.preguntas[index].isChecked = false;
      }
      else {
            arr.preguntas[index].isChecked= true;
      }
    }
    else {
      arr.preguntas[index].isChecked = false;
    }
    this.selected = this.filterItems(arr.preguntas);
    if((this.swiper.swiperRef.activeIndex === 6)&&(entry.isChecked === true)){
      this.bandera = true;
      this.selected = true;
    } else{ this.bandera = false;}

  }
  ageRange(ev: Event){
    this.selectedAge = (ev as RangeCustomEvent).detail.value;
    this.selected = true;
  }

  async backHome(){
    const loading = await this.loadingController.create({
      message: 'Cerrando Formulario...',
      spinner: 'circles',
    });
    await loading.present();
    await this.clearCheckbox();
    this.finalized = false;
    this.swiper.swiperRef.destroy(true, true);
       loading.dismiss();
  }
  async enviar(){

    const formTemp = {
      victim : this.checked(this.dinamicForm[0]),
      reason: this.checked(this.dinamicForm[1]),
      agressor: this.checked(this.dinamicForm[2]),
      agressorGender: this.checked(this.dinamicForm[3]),
      age: this.selectedAge,
      gender: this.checked(this.dinamicForm[5]),
      place: this.checked(this.dinamicForm[6]),
    };
    console.log(formTemp);
    //guardamos en cache
    const formCache = await this.formService.setForm(formTemp);
    if(formCache){
      //const res = await this.sendMailService.sendForm();
    /*   if(res){
        this.toastService.toast('Datos guardados correctamente','success');
      }
      else {
        this.toastService.toast('Hubo un error al guardar el formulario :(','danger');
      } */
      this.swiper.swiperRef.slideNext(500);
      this.bandera= false;
      this.finalized = true;
    }else {
      this.finalized = true;
      this.bandera= false;
    }

  }
  onAfterTransitionEnd(){
    setTimeout(() => {
      this.background = '#5A4BB2';
    }, 300);
  }
  checked(array: any){
    if(array.multiple === true){
      return array.preguntas.filter(x=> x.isChecked === true ).map( x => {
        delete x.isChecked;
        delete x.id;
        return x.val;
    });
    }
    else {
      return array.preguntas.filter(x => x.isChecked === true)[0].val;

      };
    }


  async ionViewWillLeave() {
    const loading = await this.loadingController.create({
      message: 'Cerrando Formulario...',
      spinner: 'circles',
    });
    await loading.present();
    await this.clearCheckbox();
    this.finalized = false;
    loading.dismiss();
    this.background ='#ffffff';
    this.swiper.swiperRef.destroy(true, true);
  }

  async clearCheckbox(){
    this.dinamicForm.forEach(e =>{
      if(e.key !== 'edad'){
        e.preguntas.map( preg =>{
          preg.isChecked = false;
        });
      }
    });
  }
}

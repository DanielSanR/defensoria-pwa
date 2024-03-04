/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { OnInit,ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RangeCustomEvent, LoadingController } from '@ionic/angular';
import SwiperCore ,{SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import PreguntasformArr from '../../assets/datos/DinamicForm.json';
import { Help } from '../models/Help';
import { FormService } from '../services/form.service';
import { DeviceService } from '../services/device.service';
import { SendmailService } from '../services/sendmail.service';
export interface PreguntasForm {
  key: string;
  title: string;
  type: string;
  preguntas?: Array<OpcForm>;
}
interface OpcForm {
id: number;
val: string;
isChecked?: boolean | false;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
@ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
public dinamicForm: PreguntasForm[] = PreguntasformArr;
public help: Help = new Help();
public bandera = false;
public selected: boolean = false;
public selectedAge: any;
public background ='#F4F4F4';
public finalized: boolean = false;
public backgroundChecked='#FE910E';
isckecked: boolean = false;
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
    private mailService: SendmailService,
    private cd: ChangeDetectorRef, private loadingController: LoadingController) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.background ='#F4F4F4';
    this.finalized = false;
    }
    next(){
      this.selected = false;
      this.swiper?.swiperRef.slideNext(500);
    }
    prev(){
      if(this.swiper?.swiperRef.activeIndex ===0)
      {
    this.close();
      }
      this.selected = false;
      this.swiper?.swiperRef.slidePrev(500);
    }
   close(){
    this.selected = false;
    this.router.navigateByUrl('/principal/inicio');
  }

  filterItems(arr: any) {
    return arr.filter((el: any) => el).map((e: any) => e.isChecked).includes(true);
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
    if((this.swiper?.swiperRef.activeIndex === 6)&&(entry.isChecked === true)){
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
    this.swiper?.swiperRef.destroy(true, true);
       loading.dismiss();
  }
  async enviar(){
    this.bandera= false;
    const formTemp = {
      victim : this.checked(this.dinamicForm[0]),
      reason: this.checked(this.dinamicForm[1]),
      agressor: this.checked(this.dinamicForm[2]),
      agressorGender: this.checked(this.dinamicForm[3]),
      age: this.selectedAge,
      gender: this.checked(this.dinamicForm[5]),
      place: this.checked(this.dinamicForm[6]),
    };
    const t = await this.mailService.sendForm('form',formTemp);
    if(t){
      this.swiper?.swiperRef.slideNext(500)
      this.finalized = true;
    }
    else { this.finalized = false;}
  }
  
  onAfterTransitionEnd(){
    setTimeout(() => {
      this.background = '#5A4BB2';
    }, 300);
  }
  checked(array: any){
    if(array.multiple === true){
      return array.preguntas.filter((x: any)=> x.isChecked === true ).map( (x: any) => {
        delete x.isChecked;
        delete x.id;
        return x.val;
    });
    }
    else {
      return array.preguntas.filter((x: any) => x.isChecked === true)[0].val;
  
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
    this.background ='#F4F4F4';
    this.swiper?.swiperRef.destroy(true, true);
  }
  
  async clearCheckbox(){
    this.dinamicForm.forEach(e =>{
      if(e.key !== 'edad'){
        e.preguntas?.map( preg =>{
          preg.isChecked = false;
        });
      }
    });
  }
}

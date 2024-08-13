import { Component, HostListener, OnInit } from '@angular/core';
import { IonTabs, MenuController, Platform } from '@ionic/angular';
import { ScreensizeService } from '../services/screensize.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
   menu = [
    {
      title: 'Formulario',
      url: '/formulario',
      icon: '../../assets/icon/tabmenu/formulario.svg'
    },
    {
      title: 'Mapa',
      url: '/mapa',
      icon: '../../assets/icon/tabmenu/mapa.svg'
    },
    {
      title: 'Inicio',
      url: '/inicio',
      icon: '../../assets/icon/tabmenu/menu.svg'
    },
    {
      title: 'Telefono',
      url: '/numeros-utiles',
      icon: '../../assets/icon/tabmenu/telefono.svg'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: '../../assets/icon/tabmenu/perfil.svg'
    }
]
  isDesktop: boolean;
  public width: number;
  private activeTab?: HTMLElement;
  constructor(public platform: Platform,
    private screenSizeService: ScreensizeService, private menuCtrol: MenuController) {
      this.screenSizeService.isDesktopView().subscribe(isDesktop => {
          if (this.isDesktop && !isDesktop) {
          window.location.reload();
        }  
        this.isDesktop = isDesktop;   
      });
        
    }

  ngOnInit() { 
    this.updateMenuBasedOnWidth(window.innerWidth);
  }

  close(){
    this.menuCtrol.close();
  }

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  toggleMenu(width: number) {
    if (width > 1200) { 
      setTimeout(() => {
        this.menuCtrol.enable(false, 'myMenu');
      }, 1000);  
    } else {
      this.menuCtrol.enable(true, 'myMenu');
    }  
  }
    ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }
@HostListener('window:resize', ['$event'])
  onResize(event){
    const width = event.target.innerWidth;
    this.toggleMenu(width);
}
updateMenuBasedOnWidth(width: number) {
  this.toggleMenu(width);
}   
}

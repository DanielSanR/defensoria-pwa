import { Component, OnInit } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';
import { FormService } from '../services/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  public width: number;
  route: string;
  public $obs = new Subscription();
  private activeTab?: HTMLElement;
  constructor(public platform: Platform,public formService: FormService) {}

  ngOnInit() {
      const sub = this.formService.getSelectedData().subscribe((data) => {
        this.route = data;
      });
      this.$obs.add(sub);
   this.width= this.platform.width();
  }

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element;
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
}

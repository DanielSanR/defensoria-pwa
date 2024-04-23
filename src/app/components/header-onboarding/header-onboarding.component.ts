import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-onboarding',
  templateUrl: './header-onboarding.component.html',
  styleUrls: ['./header-onboarding.component.scss'],
})
export class HeaderOnboardingComponent  implements OnInit {
  @Input() isDesktop?: boolean;
  @Input() index?: number;
  constructor() { }
  ngOnInit() { 
 

  }

}

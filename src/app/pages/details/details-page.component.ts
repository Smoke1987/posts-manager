import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';

@Component({
  selector: 'app-details',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent,
  ],
})
export class DetailsPageComponent implements OnInit {
  router = inject(Router);
  location = inject(Location);

  ngOnInit() {
    // TODO
    console.log('DetailsComponent @ ngOnInit():: ', { _this: this, });
  }

  goBack(): void {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}

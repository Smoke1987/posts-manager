import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

import { HomePageComponent } from './pages/home/home-page.component';
import { DetailsPageComponent } from './pages/details/details-page.component';
import { EditPostComponent } from './pages/edit-post/edit-post.component';

const routes: Routes = [
  {
    path: 'home',
    pathMatch: 'full',
    component: HomePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'details',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'details/:userId',
    pathMatch: 'full',
    component: DetailsPageComponent,
    canActivate: [authGuard],
    data: {
      showBackButton: true,
    },
  },
  {
    path: 'edit-post',
    pathMatch: 'full',
    component: EditPostComponent,
    canActivate: [authGuard],
    data: {
      showBackButton: false,
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { usersFeatureKey, usersReducer } from './reducers/users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(usersFeatureKey, usersReducer),
  ],
})
export class AppStateModule {}

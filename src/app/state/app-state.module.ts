import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { usersFeatureKey, usersReducer } from './reducers/users.reducer';
import { postsFeatureKey, postsReducer } from './reducers/posts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(usersFeatureKey, usersReducer),
    StoreModule.forFeature(postsFeatureKey, postsReducer),
  ],
})
export class AppStateModule {}

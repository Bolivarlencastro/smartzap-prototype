import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserFilterComponent, UserListComponent } from './components';
import { UsersComponent } from './containers';
import { UsersService } from './services';
import { UsersEffects } from './store/effects';
import * as fromUsers from './store/reducers';
import { UsersRouterModule } from './users.route';

const PROVIDERS = [UsersService];
const COMPONENTS = [UserListComponent, UserFilterComponent];
const CONTAINERS = [UsersComponent];

@NgModule({
  providers: [PROVIDERS],
  imports: [
    UsersRouterModule,
    FormsModule,
    ReactiveFormsModule,
    FuseScrollbarModule,
    InfiniteScrollDirective,
    NgxSkeletonLoaderModule,
    // NGRX
    EffectsModule.forFeature([UsersEffects]),
    StoreModule.forFeature(fromUsers.usersFeatureKey, fromUsers.reducers),
    // Material
    KpPhonePipe,
    CONTAINERS,
    COMPONENTS,
  ],
})
export class UsersModule {}

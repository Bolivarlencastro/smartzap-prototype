import { Routes } from '@angular/router';
import { ValidationComponent } from './containers/validation.component';

export const appRoutes: Routes = [{ path: '**', component: ValidationComponent }];

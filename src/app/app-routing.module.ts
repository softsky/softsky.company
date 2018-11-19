import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

import { HomeComponent } from './home/home.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { NetworkComponent } from './network/network.component';

import { AuthGuard } from '@ngx-auth/core';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'home',
          component: HomeComponent
        },
        {
          path: 'account',
          children: [
            {
              path: 'profile',
              component: ProfileComponent
            },
            {
              path: 'change-password',
              component: ChangePasswordComponent
            }
          ],
          canActivateChild: [AuthGuard]
        },
        {
          path: 'purchases',
          component: PurchasesComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'auth-callback',
          component: AuthCallbackComponent
        }
      ]
    },
  Shell.childRoutes([
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

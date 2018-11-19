import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuard } from '@ngx-auth/core';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
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
          path: 'public',
          component: PublicComponent
        },
        {
          path: 'auth-callback',
          component: AuthCallbackComponent
        }
      ]
    }
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}

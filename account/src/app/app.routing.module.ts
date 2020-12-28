import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard, emailVerified} from '@angular/fire/auth-guard';
import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';

const redirectUnauthorizedTo = (redirect: any[]) => pipe(emailVerified, map(loggedIn => loggedIn || redirect));
const redirectLoggedInTo = (redirect: any[]) =>  pipe(emailVerified, map(loggedIn => loggedIn && redirect || true));


const unAuthGuardPipe = () => {
    return redirectUnauthorizedTo(['visitor/signin']);
};

const loggedInGuardPipe = () => {
    return redirectLoggedInTo(['member/playground']);
};

const routes: Routes = [
    {
        path: 'member',
        loadChildren: () => import('./member/member.module').then(m => m.MemberPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: unAuthGuardPipe},
    }, {
        path: 'speech',
        loadChildren: () => import('./speech/speech.module').then(m => m.SpeechPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: unAuthGuardPipe},
    }, {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: unAuthGuardPipe},
    }, {
        path: 'visitor',
        loadChildren: () => import('./visitor/visitor.module').then(m => m.VisitorPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: loggedInGuardPipe},
    }, {
        path: 'actions',
        loadChildren: () => import('./actions/actions.module').then(m => m.ActionsPageModule)
    }, {
        path: '**',
        redirectTo: 'visitor/signin'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule],
    providers: [AngularFireAuthGuard]
})
export class AppRoutingModule {
}

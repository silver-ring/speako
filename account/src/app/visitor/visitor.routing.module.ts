import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {VisitorPage} from './visitor.page';

const routes: Routes = [
    {
        path: '',
        component: VisitorPage,
        children: [
            {
                path: 'signup',
                loadChildren: () => import('./signup/signup.module').then(m => m.SignUpModule)
            }, {
                path: 'reset',
                loadChildren: () => import('./reset/reset.module').then(m => m.ResetPageModule)
            },
            {
                path: 'signin',
                loadChildren: () => import('./signin/signin.module').then(m => m.SignInPageModule)
            },
            {
                path: '**',
                loadChildren: () => import('./signin/signin.module').then(m => m.SignInPageModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VisitorPageRoutingModule {
}

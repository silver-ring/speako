import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SignUpPage} from './signup.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'confirm',
                loadChildren: () => import('./confirm/confirm.module').then(m => m.ConfirmPageModule)
            },
            {
                path: '**',
                component: SignUpPage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SignUpPageRoutingModule {
}

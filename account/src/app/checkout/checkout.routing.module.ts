import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CheckoutPage} from './checkout.page';

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
                component: CheckoutPage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CheckoutPageRoutingModule {
}

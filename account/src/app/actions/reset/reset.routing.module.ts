import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ResetPage} from './reset.page';

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
                component: ResetPage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ResetPageRoutingModule {
}

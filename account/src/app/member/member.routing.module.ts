import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MemberPage} from './member.page';

const routes: Routes = [
    {
        path: '',
        component: MemberPage,
        children: [
            {
                path: 'library',
                loadChildren: () => import('./library/library.module').then(m => m.LibraryPageModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'billing',
                loadChildren: () => import('./billing/billing.module').then(m => m.BillingPageModule)
            },{
                path: 'playground',
                loadChildren: () => import('./playground/playground.module').then(m => m.PlaygroundPageModule)
            },
            {
                path: '**', redirectTo: 'member/playground'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MemberPageRoutingModule {
}

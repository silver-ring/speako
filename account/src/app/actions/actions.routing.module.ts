import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// https://firebase.google.com/docs/auth/custom-email-handler#create_the_email_action_handler_page
// The user management action to be completed. Can be one of the following values:
// resetPassword
// recoverEmail
// verifyEmail

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'reset',
                loadChildren: () => import('./reset/reset.module').then(m => m.ResetPageModule)
            },
            {
                matcher: (segment) => {
                    if (checkMode('resetPassword')) {
                        return {
                            consumed: segment
                        };
                    } else {
                        return null;
                    }
                },
                loadChildren: () => import('./reset/reset.module').then(m => m.ResetPageModule)
            },
            {
                matcher: (segments) => {
                    if (checkMode('recoverEmail')) {
                        return {
                            consumed: segments
                        };
                    } else {
                        return null;
                    }
                },
                loadChildren: () => import('./recover/recover.module').then(m => m.RecoverPageModule)
            },
            {
                matcher: (segments) => {
                    if (checkMode('verifyEmail') || checkMode('verifyAndChangeEmail')) {
                        return {
                            consumed: segments
                        };
                    } else {
                        return null;
                    }
                },
                loadChildren: () => import('./verify/verify.module').then(m => m.VerifyPageModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/visitor/login'
    }
];

const checkMode = (mode) => {
    const urlParts = location.href.split('?');
    if (urlParts.length < 2) {
        return false;
    }
    const param = urlParts[1].split('&');
    return param.includes(`mode=${mode}`);
};

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ActionsPageRoutingModule {
}

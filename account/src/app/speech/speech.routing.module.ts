import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SpeechPage} from './speech.page';

const routes: Routes = [
    {
        path: '',
        component: SpeechPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SpeechPageRoutingModule {
}

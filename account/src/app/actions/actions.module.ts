import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ActionsPageRoutingModule} from './actions.routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ActionsPageRoutingModule
    ],
    declarations: []
})
export class ActionsPageModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MemberPage} from './member.page';
import {MemberPageRoutingModule} from "./member.routing.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MemberPageRoutingModule
    ],
    declarations: [MemberPage]
})
export class MemberPageModule {

    constructor() {
    }

}

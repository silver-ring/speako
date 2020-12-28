import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SpeechPage} from './speech.page';
import {SpeechPageRoutingModule} from "./speech.routing.module";
import {ParagraphOperationsComponent} from "./paragraph-operations/paragraph-operations.component";
import {LanguageSelectorButtonComponent} from "../components/language-selector-button/language-selector-button.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SpeechPageRoutingModule
    ],
    exports: [
        LanguageSelectorButtonComponent
    ],
    declarations: [SpeechPage, ParagraphOperationsComponent, LanguageSelectorButtonComponent]
})
export class SpeechPageModule {

    constructor() {
    }

}

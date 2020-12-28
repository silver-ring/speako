import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LibraryPageRoutingModule} from './library.routing.module';

import {LibraryPage} from './library.page';
import {ProjectOperationsComponent} from "./project-operations/project-operations.component";
import {LanguageSelectorComponent} from "../../components/language-selector/language-selector.component";

@NgModule({
    declarations: [
        LibraryPage,
        ProjectOperationsComponent,
        LanguageSelectorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LibraryPageRoutingModule
    ]
})
export class LibraryPageModule {
}

import {Component, Input, OnInit} from '@angular/core';
import voices from "../../../environments/voices.json";
import {PopoverController} from "@ionic/angular";
import {ancestorWhere} from "tslint";

interface VoiceSelectItem {
    label: string;
    value: string;
    icon: string;
}

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {

    constructor(private popoverController: PopoverController) {
    }

    voiceSelectItems: VoiceSelectItem[] = [];

    ngOnInit() {
        for (const voice of voices) {
            const item = {
                label: `${voice.name} (${voice.language} - ${voice.gender})`,
                value: voice.id,
                icon: this.getFlagIcon(voice.country)
            };
            this.voiceSelectItems.push(item);
        }
    }

    async onSelect(value: string) {
        await this.popoverController.dismiss({
            value
        })
    }

    private getFlagIcon(countryName): string {
        return `https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/${countryName}.svg`;
    }

}

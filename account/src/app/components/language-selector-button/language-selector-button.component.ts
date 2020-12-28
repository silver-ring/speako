import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LanguageSelectorComponent} from "../language-selector/language-selector.component";
import {PopoverController} from "@ionic/angular";
import voices from "../../../environments/voices.json";

interface VoiceSelectItem {
    label: string;
    value: string;
    icon: string;
}

@Component({
    selector: 'app-language-selector-button',
    templateUrl: './language-selector-button.component.html',
    styleUrls: ['./language-selector-button.component.scss'],
})
export class LanguageSelectorButtonComponent implements OnInit {

    @Input()
    selectedVoiceId;

    @Output()
    selectedVoiceIdChange = new EventEmitter<string>();

    selectedSpeaker: VoiceSelectItem;


    constructor(private popoverCtl: PopoverController) {

    }

    ngOnInit() {
        this.selectedSpeaker = {
            label: `${voices[30].name} (${voices[30].language} - ${voices[30].gender})`,
            value: voices[30].id,
            icon: this.getFlagIcon(voices[30].country)
        }
        this.loadSelectedSpeaker();
    }

    async showSelectLanguage() {
        const popover = await this.popoverCtl.create({
            component: LanguageSelectorComponent,
            cssClass: 'language_select',
        });
        await popover.present();
        const result = await popover.onDidDismiss();
        if (!!result.data) {
            this.selectedVoiceId = result.data.value;
            this.loadSelectedSpeaker();
        }
    }

    loadSelectedSpeaker() {
        if (!this.selectedVoiceId || this.selectedVoiceId === '') {
            this.selectedVoiceId = voices[30].id;
        }
        const selectedVoice = voices.find((voice) => voice.id == this.selectedVoiceId);
        this.selectedSpeaker = {
            label: `${selectedVoice.name} (${selectedVoice.language} - ${selectedVoice.gender})`,
            value: selectedVoice.id,
            icon: this.getFlagIcon(selectedVoice.country)
        };
        this.selectedVoiceIdChange.emit(this.selectedVoiceId);
    }

    private getFlagIcon(countryName): string {
        return `https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/${countryName}.svg`;
    }

}

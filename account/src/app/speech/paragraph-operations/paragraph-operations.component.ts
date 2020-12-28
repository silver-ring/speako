import {Component, Input, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController, PopoverController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Paragraph} from '../../models/project.model';
import {uuid4} from '@capacitor/core/dist/esm/util';
import {SpeechService} from '../speech.service';
import {Buffer} from 'buffer';
import {BalanceService} from '../../services/balance.service';

export enum ParagraphOperationsType {
    'Add',
    'Edit'
}

@Component({
    templateUrl: './paragraph-operations.component.html',
    styleUrls: ['./paragraph-operations.component.scss'],
})
export class ParagraphOperationsComponent implements OnInit {

    @Input()
    operation: ParagraphOperationsType;
    @Input()
    projectKey: string;
    @Input()
    paragraph: Paragraph;
    @Input()
    paragraphKey: number;

    speech: Buffer;
    yourBalance = 0;
    selectedSegment = 'text';

    oldParagraph: Paragraph;
    oldSpeech: Buffer;
    audio = new Audio();

    constructor(private modalController: ModalController,
                private alertCtl: AlertController,
                private loadingCtl: LoadingController,
                private popoverController: PopoverController,
                private authService: AngularFireAuth,
                private firestore: AngularFirestore,
                private speechService: SpeechService,
                private balanceService: BalanceService) {
        balanceService.updateBalanceSubject.subscribe(value => {
            this.yourBalance = value;
        });
    }

    async ngOnInit() {

    }

    async ionViewWillEnter() {
        if (this.operation === ParagraphOperationsType.Add) {
            this.paragraph = {
                key: this.paragraphKey,
                audioKey: uuid4(),
                duration: 0.0,
                speaker: '',
                speed: 1.0,
                text: '',
                pitch: 0,
                profiles: [''],
                gainDb: 0,
                isSsml: false,
            };
            this.updateOldParagraph(null);
        } else {
            const audioBuffer = await this.speechService.downloadAudio({
                audioKey: this.paragraph.audioKey
            });
            this.updateOldParagraph(audioBuffer);
        }
    }

    async closeModal(isSave = false, isDelete = false) {
        await this.modalController.dismiss({
            paragraph: this.paragraph,
            speech: this.speech,
            isSave,
            isDelete
        });
    }

    async testSpeak() {
        if (!!this.audio.src && !this.audio.paused) {
            this.audio.pause();
            this.audio.currentTime = 0;
        } else {
            const audioBuffer = await this.getSpeech();
            this.audio = new Audio(`data:audio/mp3;base64,${audioBuffer.toString('base64')}`);
            this.audio.load();
            await this.audio.play();
        }
    }

    async doAction() {
        await this.fillParagraphData();
        await this.closeModal(true);
    }

    async delete() {
        await this.closeModal(false, true);
    }

    async fillParagraphData() {
        this.speech = await this.getSpeech();
        this.paragraph.duration = await this.getAudioDuration(this.speech);
    }

    segmentChanged(event: CustomEvent) {
        this.selectedSegment = event.detail.value;
    }

    private async getSpeech() {
        await this.validateSpeak();
        if (this.checkOldParagraph()) {
            return this.oldSpeech;
        }
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            const speech = await this.speechService.convertTextToSpeech({
                text: this.paragraph.text,
                voiceName: this.paragraph.speaker,
                gainDb: this.paragraph.gainDb,
                isSsml: this.paragraph.isSsml,
                pitch: this.paragraph.pitch,
                speed: this.paragraph.speed,
                profiles: this.paragraph.profiles.filter(value => value.length > 0)
            });
            this.updateOldParagraph(speech);
            return speech;
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
            throw new Error('error');
        } finally {
            await loadingElement.dismiss();
        }
    }

    private async getAudioDuration(speech: Buffer): Promise<number> {
        const audioElem = new Audio(`data:audio/mp3;base64,${speech.toString('base64')}`);
        audioElem.load();
        return await new Promise<number>((resolve, reject) => {
            audioElem.onloadeddata = () => {
                resolve(audioElem.duration);
            };
            audioElem.onerror = () => {
                reject(audioElem.error);
            };
        });
    }

    private async validateSpeak() {
        try {
            if (!this.paragraph.text) {
                throw new Error('please enter a text');
            }
            if (this.paragraph.text.length > 5000) {
                throw new Error(`Your text is ${this.paragraph.text.length} character.
                for text more than 1000 character. please split your text or create a project in your library`);
            }
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
            throw new Error();
        }
    }

    private updateOldParagraph(speech) {
        this.oldParagraph = {...this.paragraph};
        this.oldParagraph.profiles = [...this.paragraph.profiles];
        this.oldSpeech = speech;
    }

    private checkOldParagraph() {
        return this.oldParagraph.text === this.paragraph.text
            && this.oldParagraph.speaker === this.paragraph.speaker
            && this.oldParagraph.speed === this.paragraph.speed
            && this.oldParagraph.pitch === this.paragraph.pitch
            && this.oldParagraph.gainDb === this.paragraph.gainDb
            && this.oldParagraph.isSsml === this.paragraph.isSsml
            && this.areAudioProfilesIdentical();
    }

    private areAudioProfilesIdentical() {
        if (this.paragraph.profiles.length
            !== this.oldParagraph.profiles.length) {
            return false;
        }
        for (let i = 0; i < this.paragraph.profiles.length; i++) {
            if (this.oldParagraph.profiles[i] !== this.paragraph.profiles[i]) {
                return false;
            }
        }
        return true;
    }

}

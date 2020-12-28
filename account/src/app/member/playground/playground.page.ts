import {Component, OnInit} from '@angular/core';
import {MemberService} from "../member.service";
import {PlaygroundService} from "./playground.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {BalanceService} from "../../services/balance.service";
import {Capacitor, FilesystemDirectory, Plugins} from '@capacitor/core';

@Component({
    templateUrl: './playground.page.html',
    styleUrls: ['./playground.page.scss'],
})
export class PlaygroundPage implements OnInit {

    text = '';
    audio = new Audio();
    selectedVoice;

    oldText = this.text;
    oldSelectedVoice = this.selectedVoice
    yourBalance = 0;

    speed = 1;
    pitch = 0;
    profile = '';
    gainDb = 0;
    isSsml = false;

    oldSpeed = 1;
    oldPitch = 0;
    oldProfile = '';
    oldGainDb = 0;
    oldIsSsml = false;

    selectedSegment = 'text';

    constructor(private memberService: MemberService, private playgroundService: PlaygroundService,
                private loadingCtl: LoadingController, private alertCtl: AlertController,
                private balanceService: BalanceService) {
        balanceService.updateBalanceSubject.subscribe(value => {
            this.yourBalance = value;
        });
    }

    async ngOnInit() {
    }

    async ionViewWillEnter() {
        this.memberService.setPageTitle('Playground');
    }

    async playAudio() {
        if (!!this.audio.src && !this.audio.paused) {
            this.audio.pause();
            this.audio.currentTime = 0;
        } else {
            await this.loadAudio();
            await this.audio.play();
        }
    }

    async downloadAudio() {
        if (!this.audio.src) {
            await this.loadAudio();
        }
        const now = new Date();
        const fileName = `speako-${now.getTime()}.mp3`;
        if (Capacitor.isNative) {
            await this.fileWrite(fileName);
        } else {
            await this.fileDownload(fileName);
        }
    }

    async fileWrite(fileName: string) {
        try {
            await Plugins.Filesystem.requestPermissions();
            const savedLocation = await Plugins.Filesystem.writeFile({
                path: `speako/${fileName}`,
                data: this.audio.src,
                directory: FilesystemDirectory.ExternalStorage,
                recursive: true
            });
            const alertElement = await this.alertCtl.create({
                header: 'File Saved!',
                message: savedLocation.uri,
                buttons: ['Ok']
            });
            await alertElement.present();
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: e,
                buttons: ['Ok']
            });
            await alertElement.present();
        }
    }

    async fileDownload(fileName: string) {
        const elem = document.createElement('a') as HTMLAnchorElement;
        elem.href = this.audio.src;
        elem.download = fileName;
        elem.click();
    }

    async loadAudio() {
        await this.validateSpeak();
        if (this.checkOldSettings()) {
            // no need to reload
            return;
        }
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            const res = await this.playgroundService.convertTextToSpeech({
                voiceName: this.selectedVoice,
                text: this.text,
                speed: this.speed,
                pitch: this.pitch,
                profiles: this.profile === '' ? [] : [this.profile],
                gainDb: this.gainDb,
                isSsml: this.isSsml
            });
            this.audio.src = `data:audio/mp3;base64,${res.audioContent}`;
            this.audio.load();
            this.updateOldSettings();
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
        } finally {
            await loadingElement.dismiss();
        }
    }

    async validateSpeak() {
        try {
            if (!this.text) {
                throw new Error('please enter a text');
            }
            if (this.text.length > 5000) {
                throw new Error(`Your text is ${this.text.length} character. for text more than 5000 character.
                please split your text or create a project in your library`);
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

    segmentChanged(event: CustomEvent) {
        this.selectedSegment = event.detail.value;
    }

    checkOldSettings() {
        return this.oldText === this.text
            && this.oldSelectedVoice === this.selectedVoice
            && this.oldSpeed === this.speed
            && this.oldPitch === this.pitch
            && this.oldProfile === this.profile
            && this.oldGainDb === this.gainDb
            && this.oldIsSsml === this.isSsml;
    }

    updateOldSettings() {
        this.oldText = this.text;
        this.oldSelectedVoice = this.selectedVoice;
        this.oldSpeed = this.speed;
        this.oldPitch = this.pitch;
        this.oldProfile = this.profile;
        this.oldGainDb = this.gainDb;
        this.oldIsSsml = this.isSsml;
    }

}

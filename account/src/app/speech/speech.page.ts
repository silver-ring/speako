import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import WaveSurfer from 'wavesurfer.js';
import {AngularFireAuth} from '@angular/fire/auth';
import {Paragraph, Project, PROJECTS_COLLECTION_NAME} from '../models/project.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {
    ParagraphOperationsComponent,
    ParagraphOperationsType
} from './paragraph-operations/paragraph-operations.component';
import {Buffer} from 'buffer';
import {SpeechService} from './speech.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {BalanceService} from '../services/balance.service';
import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';

@Component({
    templateUrl: './speech.page.html',
    styleUrls: ['./speech.page.scss'],
})
export class SpeechPage implements OnInit {

    projectKey: string;
    waveSurfer: WaveSurfer;
    projectFolder: string;
    paragraphs: Paragraph[] = [];
    projectTitle: string;
    audioList: Buffer[] = [];
    currentSpeechParts = 0;
    yourBalance = 0;

    constructor(private route: ActivatedRoute, private authService: AngularFireAuth,
                private firestore: AngularFirestore, private loadingCtl: LoadingController,
                private modalCtl: ModalController, private speechService: SpeechService,
                private storageService: AngularFireStorage, private alertCtl: AlertController,
                private balanceService: BalanceService) {
        balanceService.updateBalanceSubject.subscribe(value => {
            this.yourBalance = value;
        });
    }

    async ngOnInit() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            this.projectKey = await new Promise<string>((resolve, reject) => {
                this.route.queryParamMap.subscribe(value => {
                    resolve(value.get('key'));
                }, error => {
                    reject(error);
                });
            });
            const user = await this.authService.currentUser;
            this.projectFolder = `users/${user.uid}/projects/audio`;
            this.waveSurfer = WaveSurfer.create({
                container: '#waveElement',
                progressColor: '#fff',
                responsive: true
            });
            await this.loadProject();
            await this.loadAudioFiles();
            await this.loadAudio();
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

    async ionViewDidEnter() {

    }

    search(event) {

    }

    async addParagraph() {
        const modalElement = await this.modalCtl.create({
            component: ParagraphOperationsComponent,
            componentProps: {
                operation: ParagraphOperationsType.Add,
                projectKey: this.projectKey,
                paragraphKey: this.paragraphs.length
            },
            cssClass: 'paragraph-operations'
        });
        await modalElement.present();
        const res = await modalElement.onDidDismiss();
        if (!!res.data && res.data.isSave) {
            const loadingElement = await this.loadingCtl.create();
            await loadingElement.present();
            try {
                await this.saveAudioFile(res.data.paragraph, res.data.speech);
                const newParagraphs = this.paragraphs;
                newParagraphs.push(res.data.paragraph);
                this.audioList.push(res.data.speech);
                await this.saveParagraphs(newParagraphs);
                await this.loadAudio();
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
    }

    async downloadAudio() {
        const concatAllAudio = Buffer.concat(this.audioList);
        const encodedAudio = concatAllAudio.toString('base64');
        const now = new Date();
        const fileName = `speako-${now.getTime()}.mp3`;
        if (Capacitor.isNative) {
            await this.fileWrite(fileName, encodedAudio, false);
        } else {
            const data = `data:audio/mp3;base64,${encodedAudio}`;
            await this.fileDownload(fileName, data);
        }
    }

    async downloadText() {
        const allText = this.paragraphs.map(value => value.text).join('\n');
        const now = new Date();
        const fileName = `speako-${now.getTime()}.txt`;
        if (Capacitor.isNative) {
            await this.fileWrite(fileName, allText, true);
        } else {
            const data = `data:text/plain;charset=utf-8,${allText}`;
            await this.fileDownload(fileName, data);
        }
    }

    async fileDownload(fileName: string, data: string) {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        const elem = document.createElement('a') as HTMLAnchorElement;
        elem.href = data;
        elem.download = fileName;
        elem.click();
        await loadingElement.dismiss();
    }

    async fileWrite(fileName: string, data: string, isEncoding) {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            await Plugins.Filesystem.requestPermissions();
            let savedLocation;
            if (!isEncoding) {
                savedLocation = await Plugins.Filesystem.writeFile({
                    path: `speako/${fileName}`,
                    data,
                    directory: FilesystemDirectory.ExternalStorage,
                    recursive: true
                });
            } else {
                savedLocation = await Plugins.Filesystem.writeFile({
                    path: `speako/${fileName}`,
                    data,
                    directory: FilesystemDirectory.ExternalStorage,
                    recursive: true,
                    encoding: FilesystemEncoding.UTF8
                });
            }
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
        } finally {
            await loadingElement.dismiss();
        }
    }

    play() {
        if (this.waveSurfer.isPlaying()) {
            this.waveSurfer.pause();
        } else {
            this.waveSurfer.play();
        }
    }

    async editParagraph(paragraph: Paragraph) {
        const modalElement = await this.modalCtl.create({
            component: ParagraphOperationsComponent,
            componentProps: {
                operation: ParagraphOperationsType.Edit,
                projectKey: this.projectKey,
                paragraph: {...paragraph}
            },
            cssClass: 'paragraph-operations'
        });
        await modalElement.present();
        const res = await modalElement.onDidDismiss();
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            if (!!res.data && res.data.isSave) {
                await this.saveAudioFile(res.data.paragraph, res.data.speech);
                const newParagraphs = this.paragraphs;
                const paragraphData = res.data.paragraph;
                newParagraphs[paragraphData.key] = {...paragraphData};
                this.audioList[paragraphData.key] = res.data.speech;
                await this.saveParagraphs(newParagraphs);
                await this.loadAudio();
            }
            if (!!res.data && res.data.isDelete) {
                const paragraphData = res.data.paragraph;
                const newParagraphs = this.removeParagraph(paragraphData);
                await this.saveParagraphs(newParagraphs);
                await this.deleteAudioFile(paragraphData);
                this.audioList.splice(paragraphData.key, 1);
                await this.loadAudio();
            }
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

    removeParagraph(paragraph: Paragraph): Paragraph[] {
        const newParagraphs = [...this.paragraphs];
        newParagraphs.splice(paragraph.key, 1);
        return newParagraphs.map((value, index) => {
            const newValue = {...value};
            newValue.key = index;
            return newValue;
        });
    }

    async doReorder(event: CustomEvent) {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            const fromIndex = event.detail.from;
            const toIndex = event.detail.to;
            const newParagraphs = this.swap(fromIndex, toIndex);
            await this.saveParagraphs(newParagraphs);
            await this.loadAudio();
            event.detail.complete(true);
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
            event.detail.complete(false);
        } finally {
            await loadingElement.dismiss();
        }

    }

    private async saveParagraphs(newParagraphs) {
        await this.firestore.collection<Project>(PROJECTS_COLLECTION_NAME).ref.doc(this.projectKey)
            .update({
                paragraphs: [...newParagraphs]
            });
        await this.loadProject();
    }

    async loadProject() {
        const result = await this.firestore.collection(PROJECTS_COLLECTION_NAME)
            .doc(this.projectKey).get().toPromise();
        const project = result.data() as Project;
        const sortedProjects = project.paragraphs.sort((a, b) => a.key - b.key);
        this.paragraphs = [...sortedProjects];
        this.projectTitle = project.title;
    }

    private async loadAudio() {
        if (this.audioList.length === 0) {
            return new Promise<void>(resolve => resolve());
        }
        return new Promise<void>((resolve, reject) => {
            const fullAudioData = Buffer.concat(this.audioList);
            const fullAudio = fullAudioData.toString('base64');
            this.waveSurfer.load(`data:audio/mp3;base64,${fullAudio}`);
            this.waveSurfer.on('ready', () => {
                resolve();
            });
            this.waveSurfer.on('error', () => {
                reject();
            });
        });

    }

    private async loadAudioFiles() {
        for (const paragraph of this.paragraphs) {
            const audioBuffer = await this.speechService.downloadAudio({
                audioKey: paragraph.audioKey
            });
            this.audioList.push(audioBuffer);
            this.currentSpeechParts = Math.floor((this.audioList.length / this.paragraphs.length) * 100);
        }
        this.currentSpeechParts = 0;
    }

    private swap(fromIndex: number, toIndex: number) {
        const newParagraphs = this.paragraphs;
        const fromKey = newParagraphs[fromIndex].key;
        const toKey = newParagraphs[toIndex].key;

        newParagraphs[fromIndex].key = toKey;
        newParagraphs[toIndex].key = fromKey;

        const fa = this.audioList[fromIndex];
        const sa = this.audioList[toIndex];
        this.audioList[fromIndex] = sa;
        this.audioList[toIndex] = fa;

        return newParagraphs.sort((a, b) => a.key - b.key);
    }

    private async saveAudioFile(paragraph: Paragraph, speech: Buffer) {
        const audioRef = this.getAudioRef(paragraph);
        await this.storageService.ref(audioRef).put(speech);
    }

    private async deleteAudioFile(paragraph: Paragraph) {
        const audioRef = this.getAudioRef(paragraph);
        await this.storageService.ref(audioRef).delete().toPromise();
    }

    private getAudioRef(paragraph: Paragraph) {
        return `${this.projectFolder}/${paragraph.audioKey}`;
    }
}

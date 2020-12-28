import {Component, Input, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {Project, PROJECTS_COLLECTION_NAME} from "../../../models/project.model";
import {AngularFirestore} from "@angular/fire/firestore";

export enum ProjectOperationsType {
    'Create',
    'Edit'
}

@Component({
    templateUrl: './project-operations.component.html',
    styleUrls: ['./project-operations.component.scss'],
})
export class ProjectOperationsComponent implements OnInit {

    @Input()
    operation: ProjectOperationsType;
    @Input()
    key: string;

    projectKey;
    projectTitle: string;

    constructor(private modalController: ModalController,
                private alertCtl: AlertController,
                private loadingCtl: LoadingController,
                private authService: AngularFireAuth,
                private firestore: AngularFirestore) {
    }

    async ngOnInit() {
        if (this.operation === ProjectOperationsType.Edit) {
            const loadingElement = await this.loadingCtl.create();
            await loadingElement.present();
            try {
                const preLoad = await this.firestore.collection(PROJECTS_COLLECTION_NAME).ref
                    .doc(this.key)
                    .get();
                const data = preLoad.data() as Project;
                this.projectKey = this.key;
                this.projectTitle = data.title;
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

    async closeModal() {
        await this.modalController.dismiss();
    }

    async doAction() {
        if (!this.projectTitle) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: 'please enter project title',
                buttons: ['OK']
            });
            await alertElement.present();
            return;
        }
        if (this.projectTitle.length > 50) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: 'project title can not exceed 50 character',
                buttons: ['OK']
            });
            await alertElement.present();
            return;
        }
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            switch (this.operation) {
                case ProjectOperationsType.Create:
                    await this.saveCreateProject();
                    break;
                case ProjectOperationsType.Edit:
                    await this.saveEditProject();
                    break;
            }
            await this.closeModal();
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

    async saveCreateProject() {
        const user = await this.authService.currentUser;
        await this.firestore.collection<Project>(PROJECTS_COLLECTION_NAME).add({
            uid: user.uid,
            title: this.projectTitle,
            paragraphs: []
        });
    }

    async saveEditProject() {
        await this.firestore.collection<Project>(PROJECTS_COLLECTION_NAME).ref
            .doc(this.projectKey)
            .update({
                title: this.projectTitle
            });
    }

}

import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {Project, PROJECTS_COLLECTION_NAME} from "../../models/project.model";
import {ProjectOperationsComponent, ProjectOperationsType} from "./project-operations/project-operations.component";
import {MemberService} from "../member.service";

@Component({
    templateUrl: './library.page.html',
    styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

    projects: Project[] = [];

    constructor(private loadingCtl: LoadingController, private authService: AngularFireAuth,
                private firestore: AngularFirestore, public modalController: ModalController,
                private alertCtl: AlertController, private memberService: MemberService,) {
    }

    async ngOnInit() {

    }

    async ionViewWillEnter() {
        this.memberService.setPageTitle('My Library');
        await this.loadProjects();
    }


    async createProject() {
        const operationsModel = await this.modalController.create({
            component: ProjectOperationsComponent,
            componentProps: {
                operation: ProjectOperationsType.Create
            },
            cssClass: 'project_operations_dialog'
        });
        await operationsModel.present();
        await operationsModel.onDidDismiss();
        await this.loadProjects();
    }

    async editProject(key) {
        const operationsModel = await this.modalController.create({
            component: ProjectOperationsComponent,
            componentProps: {
                operation: ProjectOperationsType.Edit,
                key
            },
            cssClass: 'project_operations_dialog'
        });
        await operationsModel.present();
        await operationsModel.onDidDismiss();
        await this.loadProjects();
    }

    async deleteProject(key: string, title: string) {
        const alertElement = await this.alertCtl.create({
            header: 'Confirm!',
            message: `Are you sure you want to delete project <strong>${title}</strong>?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Ok',
                    handler: async () => {
                        const loadingElement = await this.loadingCtl.create();
                        await loadingElement.present();
                        try {
                            await this.firestore.collection(PROJECTS_COLLECTION_NAME).ref.doc(key).delete();
                        } catch (e) {
                            const errorAlertElement = await this.alertCtl.create({
                                header: 'Error!',
                                message: !e.message ? 'unexpected error' : e.message,
                                buttons: ['OK']
                            });
                            await errorAlertElement.present();
                        } finally {
                            await loadingElement.dismiss();
                            await this.loadProjects();
                        }
                    }
                }
            ]
        });
        await alertElement.present();
    }

    async loadProjects() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            const user = await this.authService.currentUser;
            const res = await this.firestore.collection(PROJECTS_COLLECTION_NAME).ref
                .where('uid', '==', user.uid)
                .get();
            this.projects = res.docs.map(value => {
                const project = value.data() as Project;
                project.key = value.id;
                return project;
            });
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

    async search(event) {
        const query = event.target.value.toLowerCase();
        requestAnimationFrame(() => this.projects.filter(item => item.title.toLowerCase().indexOf(query) > -1));
    }

}

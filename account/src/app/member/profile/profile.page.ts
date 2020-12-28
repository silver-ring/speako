import {Component, OnInit} from '@angular/core';
import {MemberService} from "../member.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AlertController, LoadingController} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/firestore";
import {USER_EXT_COLLECTION_NAME, UserExt} from "../../models/user-ext.model";

@Component({
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    email = '';
    oldEmail = '';
    password = '';
    newsSubscription = true;
    oldNewsSubscription = true;
    userExtKey: string;

    constructor(private memberService: MemberService, private authService: AngularFireAuth,
                private alertCtl: AlertController, private loadingCtl: LoadingController,
                private firestore: AngularFirestore) {
    }

    ngOnInit() {
    }

    async ionViewWillEnter() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            this.memberService.setPageTitle('My Profile');
            const user = await this.authService.currentUser;
            this.email = user.email;
            this.oldEmail = user.email;
            const userExtRef = await this.firestore.collection(USER_EXT_COLLECTION_NAME).ref
                .where('uid', '==', user.uid)
                .get();
            const userExtDoc = userExtRef.docs[0];
            const userExt = userExtDoc.data() as UserExt;
            userExt.key = userExtDoc.id;
            this.newsSubscription = userExt.newsSubscription;
            this.oldNewsSubscription = userExt.newsSubscription;
            this.userExtKey = userExtDoc.id;
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

    async toggleNewsSubscription() {
        this.newsSubscription = !this.newsSubscription;
    }

    async update() {
        if (!this.email) {
            const errorAlertElement = await this.alertCtl.create({
                header: 'Error!',
                message: 'Please enter your old email or a new email if you want to update your email',
            });
            await errorAlertElement.present();
            return;
        }

        const alertElement = await this.alertCtl.create({
            header: 'Confirm Update',
            buttons: [{
                text: 'Submit',
                handler: async value => {
                    const loadingElement = await this.loadingCtl.create();
                    await loadingElement.present();
                    let innerAlertElement: HTMLIonAlertElement;
                    try {
                        const authUser = await this.authService
                            .signInWithEmailAndPassword(this.oldEmail, value.password);
                        if (this.oldEmail !== this.email) {
                            await authUser.user.verifyBeforeUpdateEmail(this.email);
                            const emailVerificationAlertElement = await this.alertCtl.create({
                                header: 'Email Verification!',
                                message: 'Verification email send to your new email,' +
                                    'please follow the instructions in your email to update to your new email',
                                buttons: ['Ok']
                            });
                            await emailVerificationAlertElement.present();
                            await emailVerificationAlertElement.onDidDismiss();
                        }
                        if (!!this.password && this.password.trim() !== '') {
                            await authUser.user.updatePassword(this.password);
                        }
                        if (this.oldNewsSubscription !== this.newsSubscription) {
                            await this.firestore.collection<UserExt>(USER_EXT_COLLECTION_NAME)
                                .doc(this.userExtKey)
                                .update({
                                    newsSubscription: this.newsSubscription
                                });
                        }
                        innerAlertElement = await this.alertCtl.create({
                            header: 'Success!',
                            message: 'Profile Updated Successfully!',
                            buttons: ['OK']
                        });
                    } catch (e) {
                        innerAlertElement = await this.alertCtl.create({
                            header: 'Error!',
                            message: !e.message ? 'unexpected error' : e.message,
                            buttons: ['OK']
                        });
                    }
                    await loadingElement.dismiss();
                    await innerAlertElement.present();
                }
            }, {
                text: 'Cancel'
            }],
            inputs: [
                {
                    name: 'password',
                    placeholder: 'Enter Your Password',
                    type: 'password'
                }
            ]
        });
        await alertElement.present();
    }
}

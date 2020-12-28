import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {AlertController, LoadingController} from "@ionic/angular";
import {RecaptchaService} from "../../services/recaptcha.service";

@Component({
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SignInPage implements OnInit {

    email: '';
    password: '';

    constructor(private router: Router, private authService: AngularFireAuth,
                private loadingCtl: LoadingController, private alertCtl: AlertController,
                private recaptchaService: RecaptchaService) {
    }

    ngOnInit() {
    }

    async onSignIn() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            await this.recaptchaService.verifyCaptcha('SignIn');
            const res = await this.authService.signInWithEmailAndPassword(this.email, this.password);
            if (res.user.emailVerified) {
                await this.router.navigate(['member/playground']);
            } else {
                await this.authService.signOut();
                const alertElement = await this.alertCtl.create({
                    header: 'Error!',
                    message: 'your account is not activated yet',
                    buttons: [{
                        text: 'Ok'
                    }, {
                        text: 'Send Activation Link',
                        handler: async () => {
                            const sendActivationLoadingElement = await this.loadingCtl.create();
                            await sendActivationLoadingElement.present();
                            let verificationEmailAlert: HTMLIonAlertElement;
                            try {
                                await res.user.sendEmailVerification();
                                verificationEmailAlert = await this.alertCtl.create({
                                    header: 'Email Verification!',
                                    message: 'Verification email have been sent',
                                    buttons: ['OK']
                                });

                            } catch (e) {
                                verificationEmailAlert = await this.alertCtl.create({
                                    header: 'Error!',
                                    message: !e.message ? 'unexpected error' : e.message,
                                    buttons: ['OK']
                                });
                            } finally {
                                await sendActivationLoadingElement.dismiss();
                                await verificationEmailAlert.present();
                            }
                        }
                    }]
                });
                await alertElement.present();
            }
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
        }
        await loadingElement.dismiss();
    }

}

import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {AlertController, LoadingController} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/firestore";
import {USER_EXT_COLLECTION_NAME, UserExt} from "../../models/user-ext.model";
import {RecaptchaService} from "../../services/recaptcha.service";

declare const grecaptcha: any;

@Component({
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignUpPage implements OnInit {

    email = '';
    password = '';
    tellUs = '';
    subscribeToNews = true;

    constructor(private router: Router, private authService: AngularFireAuth,
                private loadingCtl: LoadingController, private alertCtl: AlertController,
                private firestore: AngularFirestore, private recaptchaService: RecaptchaService) {
    }

    ngOnInit() {
    }

    async onSignUp() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            if (!this.tellUs) {
                throw new Error('Please Tell Us How Are you Planning to use Speako,' +
                    'This will help us provide for you a better service');
            }
            await this.recaptchaService.verifyCaptcha('SignUp');
            const rs = await this.authService.createUserWithEmailAndPassword(this.email, this.password);
            await rs.user.sendEmailVerification();
            await this.firestore.collection<UserExt>(USER_EXT_COLLECTION_NAME).add({
                uid: rs.user.uid,
                tellUs: this.tellUs,
                newsSubscription: this.subscribeToNews
            });
            await this.router.navigate(['/visitor/signup/confirm']);
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

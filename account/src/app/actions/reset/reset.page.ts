import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {RecaptchaService} from "../../services/recaptcha.service";

@Component({
    templateUrl: './reset.page.html',
    styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

    code = '';
    newPassword = '';
    isLoading = true;

    constructor(private authService: AngularFireAuth, private route: ActivatedRoute,
                private router: Router, private alertCtl: AlertController, private loadingCtl: LoadingController,
                private recaptchaService: RecaptchaService) {
    }

    async ngOnInit() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        this.code = await new Promise<string>((resolve, reject) => {
            this.route.queryParamMap.subscribe(value => {
                resolve(value.get('oobCode'));
            }, error => {
                reject(error);
            });
        });
        try {
            await this.recaptchaService.verifyCaptcha('resetPassword');
            await this.authService.verifyPasswordResetCode(this.code);
            this.isLoading = false;
        } catch (e) {
            await this.router.navigate(['/visitor/signin']);
        } finally {
            await loadingElement.dismiss();
        }
    }

    async ionViewWillEnter() {

    }

    async onConfirm() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            await this.authService.confirmPasswordReset(this.code, this.newPassword);
            await this.router.navigate(['/visitor/actions/reset/confirm']);
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

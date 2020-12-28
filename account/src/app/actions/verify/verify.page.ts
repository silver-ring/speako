import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {RecaptchaService} from "../../services/recaptcha.service";

@Component({
    templateUrl: './verify.page.html',
    styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

    code = '';
    isLoading = true;

    constructor(private authService: AngularFireAuth, private route: ActivatedRoute,
                private router: Router, private loadingCtl: LoadingController,
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
            await this.recaptchaService.verifyCaptcha('verifyEmail');
            await this.authService.applyActionCode(this.code);
            this.isLoading = false;
        } catch (e) {
            await this.router.navigate(['/visitor/signin']);
        } finally {
            await loadingElement.dismiss();
        }
    }

    async ionViewWillEnter() {

    }

}

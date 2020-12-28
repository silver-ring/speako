import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {RecaptchaService} from "../../services/recaptcha.service";

@Component({
    templateUrl: './recover.page.html',
    styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {

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
            await this.recaptchaService.verifyCaptcha('recoverEmail');
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

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";

@Component({
    templateUrl: './reset.page.html',
    styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

    email = '';

    constructor(private authService: AngularFireAuth, private router: Router,
                private alertCtl: AlertController, private loadingCtl: LoadingController) {
    }

    ngOnInit() {
    }

    async onReset() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            await this.authService.sendPasswordResetEmail(this.email);
            await this.router.navigate(['/visitor/reset/confirm']);
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

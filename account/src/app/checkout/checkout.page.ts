import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController, LoadingController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {PricingPackage} from '../models/pricing.model';
import {User} from 'firebase';
import {BalanceService} from '../services/balance.service';

@Component({
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

    email: string;
    uid: string;
    yourBalance: number;
    basicPackage: PricingPackage;
    extraPackage: PricingPackage;
    superPackage: PricingPackage;

    constructor(private authService: AngularFireAuth, private loadingCtl: LoadingController,
                private alertCtl: AlertController, private balanceService: BalanceService) {
        balanceService.updateBalanceSubject.subscribe(value => {
            this.yourBalance = value;
        });
    }

    async ngOnInit() {
        this.basicPackage = environment.pricingPackages.basicPackage;
        this.extraPackage = environment.pricingPackages.extraPackage;
        this.superPackage = environment.pricingPackages.superPackage;
    }

    async ionViewDidEnter() {

    }

    async checkout(productId: string) {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            const user = await this.authService.currentUser;
            const url = this.getPaymentUrl(user, productId);
            window.open(url, '_self');
        } catch (e) {
            const alertElement = await this.alertCtl.create({
                header: 'Error!',
                message: !e.message ? 'unexpected error' : e.message,
                buttons: ['OK']
            });
            await alertElement.present();
        } finally {
            await this.loadingCtl.dismiss();
        }
    }

    getPaymentUrl(user: User, productId: string) {
        const email = 'mohamed.morsy@aurea.com';
        return `https://pay.paddle.com/checkout/${productId}?`
            + `disable_logout=true&guest_email=${email}&passthrough=${user.uid}`;
    }

}

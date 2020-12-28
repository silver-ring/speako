import {Component, OnInit} from '@angular/core';
import {MemberService} from "../member.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {Member, MEMBERS_COLLECTION_NAME} from "../../models/member.model";
import {AlertController, LoadingController} from "@ionic/angular";
import {Payment, PAYMENTS_COLLECTION_NAME} from "../../models/payment.model";
import {PROJECTS_COLLECTION_NAME} from "../../models/project.model";

@Component({
    templateUrl: './billing.page.html',
    styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {

    email = '';
    balance = 0;
    payments: Payment[] = [];

    constructor(private memberService: MemberService, private authService: AngularFireAuth,
                private firestore: AngularFirestore, private loadingCtl: LoadingController,
                private alertCtl: AlertController) {
    }

    async ngOnInit() {

    }

    async ionViewWillEnter() {
        const loadingElement = await this.loadingCtl.create();
        await loadingElement.present();
        try {
            this.memberService.setPageTitle('Billing Settings');
            const user = await this.authService.currentUser;
            this.email = user.email;
            const memberRef = await this.firestore.collection(MEMBERS_COLLECTION_NAME).ref
                .where('uid', '==', user.uid)
                .get();
            const member = memberRef.docs[0].data() as Member;
            this.balance = member.balance;
            const paymentsRef = await this.firestore.collection(PAYMENTS_COLLECTION_NAME).ref
                .where('uid', '==', user.uid)
                .get();
            if (paymentsRef.size > 0) {
                this.payments = paymentsRef.docs.map(value => value.data() as Payment);
            }
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

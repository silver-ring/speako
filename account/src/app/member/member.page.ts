import {Component, OnInit} from '@angular/core';
import {LoadingController, MenuController} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {MemberService} from "./member.service";

@Component({
    templateUrl: './member.page.html',
    styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit {

    title = 'playground';

    constructor(public menuCtl: MenuController, private loadingController: LoadingController,
                private authService: AngularFireAuth, private router: Router,
                private memberService: MemberService) {
        memberService.pageTitleSubject.subscribe(value => {
            this.title = value;
        });
    }

    async ngOnInit() {
    }

    async ionViewWillEnter() {
        await this.menuCtl.close();
    }

    async signOut() {
        try {
            await this.authService.signOut();
        } catch (reason) {

        } finally {
            await this.router.navigate(['/signin']);
        }
    }

}

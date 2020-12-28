import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";

@Component({
    templateUrl: './test.page.html',
    styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

    isOpen = false;

    constructor(public menu: MenuController) {
    }

    ngOnInit() {

    }

    async toggleMenu() {
        await this.menu.toggle();
        this.isOpen = !this.isOpen
    }

}

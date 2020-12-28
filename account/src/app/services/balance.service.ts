import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Member, MEMBERS_COLLECTION_NAME} from '../models/member.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class BalanceService {

    public updateBalanceSubject = new BehaviorSubject<number>(0);

    constructor(private authService: AngularFireAuth, private firestore: AngularFirestore) {
        this.loadBalance();
    }

    async loadBalance() {
        const user = await this.authService.currentUser;
        const res = await this.firestore.collection(MEMBERS_COLLECTION_NAME).ref
            .where('uid', '==', user.uid)
            .get();
        const member = res.docs[0].data() as Member;
        this.updateBalance(member.balance);
    }

    public updateBalance(newBalance: number) {
        this.updateBalanceSubject.next(newBalance);
    }

}

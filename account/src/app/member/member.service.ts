import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MemberService {

    public pageTitleSubject = new Subject<string>();

    public setPageTitle(title: string): void {
        this.pageTitleSubject.next(title);
    }

}

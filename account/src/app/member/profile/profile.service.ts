import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private http: HttpClient) {
    }

    public disableAccount(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<void>(`${environment.proxy}/users/disable`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe(() => {
                resolve();
            }, error => reject(error.error));
        });
    }

}

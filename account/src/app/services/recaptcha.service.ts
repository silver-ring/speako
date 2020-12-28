import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

declare const grecaptcha: any;

export interface RecaptchaRequest {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class RecaptchaService {

    constructor(private http: HttpClient) {
    }

    public async verifyCaptcha(action: string): Promise<void> {
        const token = await grecaptcha.execute('6LdveKUUAAAAAJw1j853lRaltdSWszk4yebsLm0B', {action});
        return new Promise((resolve, reject) => {
            this.http.post<RecaptchaRequest>(`${environment.proxy}/recaptcha`, {
                token
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe(value => {
                resolve();
            }, error => {
                reject(error.error);
            });
        });
    }

}

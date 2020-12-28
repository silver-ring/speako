import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BalanceService} from '../../services/balance.service';

export interface PlaygroundTtsRequest {
    text: string;
    voiceName: string;
    speed: number;
    pitch: number;
    profiles: string[];
    gainDb: number;
    isSsml: boolean;
}

export interface PlaygroundTtsResponse {
    audioContent: Uint8Array;
    newBalance: number;
}

@Injectable({
    providedIn: 'root'
})
export class PlaygroundService {

    constructor(private http: HttpClient, private balanceService: BalanceService) {
    }

    public convertTextToSpeech(playgroundTtsRequest: PlaygroundTtsRequest): Promise<PlaygroundTtsResponse> {
        return new Promise<PlaygroundTtsResponse>((resolve, reject) => {
            this.http.post<PlaygroundTtsResponse>(`${environment.proxy}/playground/tts`, playgroundTtsRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe(value => {
                this.balanceService.updateBalance(value.newBalance);
                resolve(value);
            }, error => reject(error.error));
        });
    }

}

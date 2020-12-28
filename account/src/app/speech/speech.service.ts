import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Buffer} from "buffer";
import {BalanceService} from "../services/balance.service";

export interface GetAudioContentRequest {
    audioKey: string;
}

export interface GetAudioResponse {
    audioContent: {
        type: string;
        data: number[];
    };
}

export interface SpeechTtsRequest {
    text: string;
    voiceName: string;
    speed: number;
    pitch: number;
    profiles: string[];
    gainDb: number;
    isSsml: boolean;
}

export interface SpeechTtsResponse {
    newBalance: number;
    audioContent: {
        type: string;
        data: number[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class SpeechService {

    constructor(private http: HttpClient, private balanceService: BalanceService) {
    }

    public downloadAudio(convertToTextRequest: GetAudioContentRequest): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            this.http.post<GetAudioResponse>(`${environment.proxy}/speech/audio`, convertToTextRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe(value => resolve(Buffer.from(value.audioContent.data)), error => {
                reject(error.error);
            });
        });
    }

    public convertTextToSpeech(speechTtsRequest: SpeechTtsRequest): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            this.http.post<SpeechTtsResponse>(`${environment.proxy}/speech/tts`, speechTtsRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe(
                value => {
                    this.balanceService.updateBalance(value.newBalance);
                    resolve(Buffer.from(value.audioContent.data))
                },
                error => reject(error.error)
            );
        });
    }

}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../app-config.module';
import * as _ from 'lodash';
@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(
        private readonly http: HttpClient,
        @Inject(APP_CONFIG) private config: AppConfig
    ) { }

    uploadAndProgress(payload, files: FileList) {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('file', f));
        if (payload) {
            _.forOwn(payload, (value, key) => {
                formData.append(key, payload[key]);
            });
        }
        return this.http.post(this.config.apiEndpoint + 'upload', formData, { reportProgress: true, observe: 'events' });
    }

    calcProgressPercent(event: HttpProgressEvent) {
        return Math.round(100 * event.loaded / event.total);
    }
}

import { Injectable } from '@angular/core';
import { Job, JobFunction } from '../models';
import { MyAccountV2Client } from './my-account-v2.client';

@Injectable({
  providedIn: 'root',
})
export class JobsApi {
  private readonly jobsBasePath = '/jobs';
  private readonly functionsBasePath = '/job-functions';

  constructor(private _http: MyAccountV2Client) {}

  fetchJobs(search?: string) {
    const params = search ? { search } : {};
    return this._http.get<Job[]>(this.jobsBasePath, params);
  }

  fetchJobFunctions(search?: string) {
    const params = search ? { search } : {};
    return this._http.get<JobFunction[]>(this.functionsBasePath, params);
  }
}

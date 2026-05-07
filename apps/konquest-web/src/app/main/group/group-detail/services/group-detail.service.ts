import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { Observable } from 'rxjs';
import { Group } from '../../groups/group.model';

@Injectable()
export class GroupDetailService {
  constructor(private readonly konquestApi: KonquestAPI) {}

  getGroupDetail(id: string): Observable<Group> {
    return this.konquestApi.get<Group>(`/groups/${id}`);
  }
}

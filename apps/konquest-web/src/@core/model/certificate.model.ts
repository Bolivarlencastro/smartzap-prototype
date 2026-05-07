import { Mission } from 'app/main/mission/mission.model';
import { User } from '.';

export class Certificate {
  constructor(
    public certificate_url: string,
    public created_date: Date,
    public end_date: Date,
    public performance: number,
    public mission: Mission,
    public user: User,
  ) {}
}

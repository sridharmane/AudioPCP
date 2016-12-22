import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ITrial, IAudio } from './types';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class StateManagerService {

  trials: FirebaseListObservable<ITrial[]>;

  constructor(private af: AngularFire, private http: Http) {
    this.trials = this.af.database.list('/observations');
  }

  getMode(): number {
    return 0;
  }

  getCategories() {
    return this.http.get('assets/data/categories.json')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  saveTrial(trial: ITrial) {
    this.trials.push(trial);
  }

}

import { Observable } from 'rxjs';

const source$ = Observable.create(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.complete();
});

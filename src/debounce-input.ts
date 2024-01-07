import { Observable, debounceTime, distinctUntilChanged, filter } from 'rxjs';

export const debounceInput = () => (source$: Observable<string>) =>
  source$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter((data) => data.length >= 3)
  );

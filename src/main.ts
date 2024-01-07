import { Observable, map, of, take, timer } from 'rxjs';

export const emitOne$ = of(1);
export const emitOneToFour$ = of(1, 2, 3, 4);
export const emitOntToFourPerSecond$ = timer(0, 1000).pipe(
  take(4)
);

export const plusOne = () => (source$: Observable<number>) => source$.pipe(map(value => value + 1));

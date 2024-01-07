import { of } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { emitOne$, emitOneToFour$, emitOntToFourPerSecond$, plusOne } from '../main';

describe('使用 Subscribe callback 測試', function () {
  test('測試單一個事件的 Observable', () => {
    emitOne$.subscribe((data) => {
      expect(data).toEqual(1);
    });
  });

  test('測試多個事件的 Observable', () => {
    const actual: number[] = [];
    emitOneToFour$.subscribe((data) => {
      actual.push(data);
    });
    expect(actual).toEqual([1, 2, 3, 4]);
  });

  test('測試非同步處理的 Observable', () =>
    new Promise<void>((done) => {
      const actual: number[] = [];
      emitOntToFourPerSecond$.subscribe({
        next: (data) => {
          actual.push(data);
        },
        complete: () => {
          expect(actual).toEqual([0, 1, 2, 3]);
          done();
        },
      });
    }));

  test('使用 pipe 測試 operator', () => {
    of(1)
      .pipe(plusOne())
      .subscribe((data) => {
        expect(data).toEqual(2);
      });
  });

  test('單獨測試一個 operator', () => {
    const source$ = of(1);
    plusOne()(source$).subscribe((data) => {
      expect(data).toEqual(2);
    });
  });
});

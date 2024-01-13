import { concatMap, of, delay, map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { describe, test, expect, beforeEach } from 'vitest';
import { subscribeSpyTo, fakeTime } from '@hirez_io/observer-spy';

describe('observer-spy-demo', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('時間敏感的彈珠圖測試案例', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const sourceMarbleDiagram = '(abc|)';
      // 把 xxms 改掉，就會看到測試失敗
      const expectedResult = '10ms x 9ms y 9ms (z|)';

      const sourceObservable = cold(sourceMarbleDiagram, { a: 1, b: 2, c: 3 });
      const source$ = sourceObservable.pipe(
        concatMap((value) =>
          of(value).pipe(
            delay(10),
            map((data) => data * 2)
          )
        )
      );

      expectObservable(source$).toBe(expectedResult, { x: 2, y: 4, z: 6 });
    });
  });

  test('對時間不敏感的測試方式', () =>
    new Promise<void>((done) => {
      const source$ = of(1, 2, 3);
      const result$ = source$.pipe(
        concatMap((value) =>
          of(value).pipe(
            delay(10),
            map((data) => data * 2)
          )
        )
      );
      const expected = [2, 4, 6];

      const actual: number[] = [];
      result$.subscribe({
        next: (value) => {
          actual.push(value);
        },
        complete: () => {
          expect(actual).toEqual(expected);
          done();
        },
      });
    }));

  describe('使用 @hirez_io/observer-spy 套件測試', () => {
    test('使用 subscribeSpyTo 測試', async () => {
      const source$ = of(1, 2, 3);
      const result$ = source$.pipe(
        concatMap((value) =>
          of(value).pipe(
            delay(10),
            map((data) => data * 2)
          )
        )
      );
      const expected = [2, 4, 6];

      const observerSpy = subscribeSpyTo(result$);
      await observerSpy.onComplete();

      expect(observerSpy.getValues()).toEqual(expected);
    });

    test(
      '使用 fakeTime + flush 測試',
      fakeTime(async (flush) => {
        const source$ = of(1, 2, 3);
        const result$ = source$.pipe(
          concatMap((value) =>
            of(value).pipe(
              delay(2000),
              map((data) => data * 2)
            )
          )
        );
        const expected = [2, 4, 6];

        const observerSpy = subscribeSpyTo(result$);
        flush();
        await observerSpy.onComplete();
        const actual = observerSpy.getValues();
        expect(actual).toEqual(expected);
      })
    );
  });
});

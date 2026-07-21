import { calculateSm2 } from './reviews.service';

describe('calculateSm2', () => {
  it('resets repetition when quality is below 3', () => {
    expect(calculateSm2({ interval: 6, easeFactor: 2.5, repetitions: 2, quality: 2 })).toEqual({
      interval: 1,
      easeFactor: 2.18,
      repetitions: 0,
    });
  });

  it('uses first successful interval', () => {
    expect(calculateSm2({ interval: 1, easeFactor: 2.5, repetitions: 0, quality: 5 })).toEqual({
      interval: 1,
      easeFactor: 2.6,
      repetitions: 1,
    });
  });

  it('uses six days for the second successful repetition', () => {
    expect(calculateSm2({ interval: 1, easeFactor: 2.6, repetitions: 1, quality: 4 })).toEqual({
      interval: 6,
      easeFactor: 2.6,
      repetitions: 2,
    });
  });
});

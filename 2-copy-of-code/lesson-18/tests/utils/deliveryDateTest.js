import {calculateDeliveryDate} from '../../scripts/utils/deliveryDate.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

describe('test suite: calculateDeliveryDate', () => {
  it('skips weekends', () => {
    // Friday, June 6 2025.
    const friday = dayjs('2025-06-06');

    expect(
      calculateDeliveryDate({deliveryDays: 1}, friday).format('YYYY-MM-DD')
    ).toEqual('2025-06-09');
    expect(
      calculateDeliveryDate({deliveryDays: 3}, friday).format('YYYY-MM-DD')
    ).toEqual('2025-06-11');
  });

  it('counts only business days', () => {
    // Monday, June 2 2025.
    const monday = dayjs('2025-06-02');

    expect(
      calculateDeliveryDate({deliveryDays: 7}, monday).format('YYYY-MM-DD')
    ).toEqual('2025-06-11');
  });
});

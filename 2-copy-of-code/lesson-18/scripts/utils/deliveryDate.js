import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function calculateDeliveryDate(deliveryOption, startDate = dayjs()) {
  let remainingDays = deliveryOption.deliveryDays;
  let date = startDate;

  while (remainingDays > 0) {
    date = date.add(1, 'day');

    const dayOfWeek = date.format('dddd');
    if (dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') {
      remainingDays -= 1;
    }
  }

  return date;
}

export function formatDeliveryDate(deliveryOption, startDate = dayjs()) {
  return calculateDeliveryDate(deliveryOption, startDate)
    .format('dddd, MMMM D');
}

import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })], {
      optional: true
    }),
    query(':enter', [style({ opacity: 0, transform: 'translateY(10px)' })], { optional: true }),
    group([
      query(':leave', [animate('180ms ease', style({ opacity: 0, transform: 'translateY(-8px)' }))], {
        optional: true
      }),
      query(':enter', [animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], {
        optional: true
      })
    ])
  ])
]);


import {animate, style, transition, trigger} from '@angular/animations';

export const timelineViewChange = trigger('timelineViewChange', [
  transition('* => *', [
    style({
      opacity: 0,
      transform: 'translateY(6px)'
    }),
    animate(
      '800ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0)'
      })
    )
  ])
]);

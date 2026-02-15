import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-center-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="work-center-activity">
    </div>
  `,
  styles: ``,
})
export class WorkCenterActivityComponent {
  workCenters = [
    'Genesis Hardware',
    'Rodriques Electrics',
    'Konsulting Inc',
    'McMarrow Distribution',
    'Spartan Manufacturing',
  ];
}

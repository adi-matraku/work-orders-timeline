import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {Timescale} from '../../models/timescale.model';

@Component({
  selector: 'app-timescale-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  template: `
    <div class="timescale-selector">
      <span class="timescale-selector-label">Timescale</span>

      <ng-select
        [items]="timescales"
        bindLabel="label"
        bindValue="value"
        [ngModel]="value()"
        (ngModelChange)="viewChange.emit($event)"
        [searchable]="false"
        [clearable]="false"
        [appendTo]="'body'"
        class="custom-timescale-select custom-dropdown-panel"
      >
      </ng-select>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 146px;
      height: 25px;
      box-shadow: 1px 2.5px 3px -1.5px rgba(200, 207, 233, 1);
      border-radius: 5px;
    }

    .timescale-selector {
      display: flex;
      align-items: center;
      position: relative;
      background-color: #fff;

      &-label {
        position: relative;
        z-index: 2;
        width: 75px;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 4px 8px 5px 8px;
        background-color: #f8f9fa;
        color: #6c757d;
        font-size: 13px;
        font-weight: 400;
        font-style: normal;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        line-height: 16px;
        pointer-events: none;
        box-sizing: border-box;
      }
    }
  `,
})
export class TimescaleSelectorComponent {
  readonly value = input<Timescale>('month');
  readonly viewChange = output<Timescale>();

  readonly timescales: { label: string; value: string }[] = [
    {label: 'Hour', value: 'hour'},
    {label: 'Day', value: 'day'},
    {label: 'Week', value: 'week'},
    {label: 'Month', value: 'month'}
  ];
}

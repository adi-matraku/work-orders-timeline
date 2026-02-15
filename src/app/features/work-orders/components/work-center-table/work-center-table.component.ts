import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-work-center-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="work-center-activity">
      <div class="panel-wrap">
        <div class="panel-main">
          <div class="work-center-panel">
            <div class="work-center-header">Work Center</div>
            @for (name of workCenters; track name) {
              <div class="work-center-row">
                <span class="work-center-name">{{ name }}</span>
              </div>
            }
          </div>
          <div class="gantt-panel"></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .work-center-activity {
      width: 100%;
      box-sizing: border-box;
    }

    .title {
      width: 142px;
      height: 34px;
      margin: 0 0 12px 0;
      padding: 0;
      color: #030929;
      font-family: "Circular-Std", sans-serif;
      font-size: 24px;
      font-weight: 600;
      font-style: normal;
      line-height: 34px;
      letter-spacing: 0;
      text-align: left;
      vertical-align: top;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .panel-wrap {
      margin-top: 24px;
    }

    .panel-main {
      width: 1293px;
      border: 1px solid rgba(230, 235, 240, 1);
      display: flex;
      box-sizing: border-box;
    }

    .work-center-panel {
      width: 382px;
      height: 749px;
      background-color: rgba(255, 255, 255, 1);
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .work-center-header {
      width: 138px;
      height: 16px;
      color: rgba(104, 113, 150, 1);
      font-family: "Circular-Std", sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      padding: 16px 0 16px 31px;
      box-sizing: border-box;
    }

    .work-center-row {
      width: 380px;
      height: 48px;
      background-color: rgba(255, 255, 255, 1);
      padding: 16px 0 16px 31px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(230, 235, 240, 1);
    }

    .work-center-name {
      width: 144px;
      height: 16px;
      color: rgba(3, 9, 41, 1);
      font-family: "Circular-Std", sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
    }

    .gantt-panel {
      flex: 1;
      min-width: 0;
      background: rgba(255, 255, 255, 1);
    }
  `,
})
export class WorkCenterTableComponent {
  workCenters = [
    'Genesis Hardware',
    'Rodriques Electrics',
    'Konsulting Inc',
    'McMarrow Distribution',
    'Spartan Manufacturing',
  ];
}

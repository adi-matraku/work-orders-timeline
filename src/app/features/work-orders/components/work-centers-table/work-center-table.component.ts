import {AfterViewInit, Component, computed, ElementRef, signal, viewChild, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimescaleSelectorComponent} from '../timescale-selector/timescale-selector.component';
import {TimelineColumn, Timescale, TIMESCALE_CONFIG} from '../../models/timescale.model';
import {
  buildDayColumns,
  buildHourColumns,
  buildMonthColumns,
  buildWeekColumns,
  getDurationPerCell
} from '../../utils/timeline-columns.utils';
import {MOCK_WORK_CENTERS, MOCK_WORK_ORDERS} from '../../../../mocks/work-orders.mock';
import {WorkCenterDocument, WorkOrderDocument} from '../../models/work-orders.model';

@Component({
  selector: 'app-work-centers-table',
  standalone: true,
  imports: [CommonModule, TimescaleSelectorComponent],
  template: `
    <div class="work-centers">
      <div class="timescale-selector-container">
        <app-timescale-selector (viewChange)="setView($event)"/>
      </div>
      <div class="work-centers-container">
        <div class="work-centers-layout">
          <!-- LEFT PANEL: Work Centers (382px) -->
          <div class="left-panel">
            <div class="panel-header">
              <span class="header-label">Work Center</span>
            </div>

            <div class="panel-rows">
              @for (center of workCenters(); track center) {
                <div class="center-row">
                  <span class="center-label">{{ center.data.name }}</span>
                </div>
              }
              <div class="filler-space"></div>
            </div>
          </div>

          <!-- RIGHT PANEL: Timeline (957px) -->
          <div class="right-panel" #scrollContainer>
            <div class="timeline-content-wrapper">
              <div class="timeline-header">
                @for (col of timelineColumns(); track col.label) {
                  <div class="timeline-col-header" [style.width.px]="cellWidth()">
                    <div class="header-label-wrapper">
                      @if (col.subLabel) {
                        <span class="sub-label">{{ col.subLabel }}</span>
                      }
                      <span class="main-label">{{ col.label }}</span>
                    </div>
                  </div>
                }
              </div>

              <div class="timeline-grid">
                @for (center of workCenters(); track center) {
                  <div class="grid-row">
                    @for (col of timelineColumns(); track col.label) {
                      <div class="grid-cell" [style.width.px]="cellWidth()"></div>
                    }
                  </div>
                }

                <!-- Current Date Vertical Line (Exact Today) -->
                <div class="today-line" [style.left.px]="todayOffset()"></div>

                <!-- Current Month Tag (Centered in the month cell) -->
                @if (currentView() === 'month') {
                  <div class="current-month-indicator" [style.left.px]="monthCenterOffset()">
                    <div class="indicator-tag">Current month</div>
                  </div>
                }

                <div class="grid-filler">
                  @for (col of timelineColumns(); track col.label) {
                    <div class="grid-cell" [style.width.px]="cellWidth()"></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .work-centers-container {
      border: 1px solid rgba(230, 235, 240, 1);
      margin-top: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // will remove later
    }

    .work-centers-layout {
      display: flex;
      overflow: hidden;
      align-items: stretch;

      .left-panel {
        width: 382px;
        flex-shrink: 0;
        border-right: 1px solid rgba(230, 235, 240, 1);
        background: white;
        z-index: 10;

        .panel-header {
          height: 36px;
          display: flex;
          align-items: center;
          padding: 9px 0 9px 31px;
          background-color: rgba(255, 255, 255, 1);
          border-bottom: 1px solid rgba(230, 235, 240, 1);
          box-sizing: border-box;

          .header-label {
            color: rgba(104, 113, 150, 1);
            font-size: 14px;
            font-weight: 500;
            height: 16px;
            letter-spacing: normal;
          }
        }

        .center-row {
          height: 48px;
          background-color: rgba(255, 255, 255, 1);
          display: flex;
          align-items: center;
          padding: 16px 0 16px 31px;
          border-bottom: 1px solid rgba(230, 235, 240, 1);
          box-sizing: border-box;

          .center-label {
            width: 98px;
            height: 16px;
            color: rgba(3, 9, 41, 1);
            font-size: 14px;
            font-weight: 500;
            line-height: 17px;
            white-space: nowrap;
          }
        }

        .filler-space {
          min-height: 400px;
          background: white;
        }
      }

      .right-panel {
        width: 957px;
        overflow-x: auto;
        position: relative;
        background: white;
        scroll-behavior: smooth;

        .timeline-content-wrapper {
          min-width: max-content;
          display: flex;
          flex-direction: column;
        }

        .timeline-header {
          display: flex;
          height: 36px;
          border-bottom: 1px solid rgba(230, 235, 240, 1);
          box-sizing: border-box;

          .timeline-col-header {
            flex-shrink: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: rgba(104, 113, 150, 1);
            border-right: 1px solid rgba(230, 235, 240, 1);
            box-sizing: border-box;
            background: white;

            .header-label-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              line-height: 1.2;

              .sub-label {
                font-size: 10px;
                color: rgba(140, 150, 180, 1);
                font-weight: 500;
                margin-bottom: 2px;
              }

              .main-label {
                color: rgba(104, 113, 150, 1);
                font-size: 14px;
                font-weight: 500;
                text-align: center;
              }
            }
          }
        }

        .timeline-grid {
          position: relative;
          display: flex;
          flex-direction: column;

          .grid-row {
            height: 48px;
            display: flex;
            border-bottom: 1px solid rgba(230, 235, 240, 1);
            box-sizing: border-box;
          }

          .grid-cell {
            flex-shrink: 0;
            height: 100%;
            border-right: 1px solid rgba(230, 235, 240, 1);
            box-sizing: border-box;
          }

          .grid-filler {
            min-height: 400px;
            background: transparent;
          }

          .today-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 0;
            border-left: 3px solid rgba(212, 215, 255, 1);
            pointer-events: none;
            z-index: 4;
          }

          .current-month-indicator {
            position: absolute;
            top: 0;
            pointer-events: none;
            z-index: 5;
            border-radius: 5px;

            width: 109px;
            height: 22px;
            background-color: rgba(212, 215, 255, 1);

            transform: translateX(-50%);

            .indicator-tag {
              width: 93px;
              height: 18px;
              font-weight: 500; // put 500 instead of 400 that was on sketch since font looks better

              color: rgba(62, 64, 219, 1);
              font-size: 14px;

              padding: 2px 8px;
              white-space: nowrap;
            }
          }
        }
      }
    }
  `,
})
export class WorkCenterTableComponent implements AfterViewInit {
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  readonly currentView = signal<Timescale>('month');

  // Cell width configuration for each view
  cellWidth = computed(() => {
    return TIMESCALE_CONFIG[this.currentView()].cellWidth;
  });

  // Mock Data of work centers
  readonly workCenters = signal<WorkCenterDocument[]>(MOCK_WORK_CENTERS);
  readonly workOrders = signal<WorkOrderDocument[]>(MOCK_WORK_ORDERS);


  // Hours in milliseconds
  private readonly HOUR_MS = 60 * 60 * 1000;

  setView(mode: Timescale) {
    this.currentView.set(mode);
  }

  /**
   * Generates timeline columns based on the current timescale.
   */
  timelineColumns = computed<TimelineColumn[]>(() => {
    switch (this.currentView()) {
      case 'hour':
        return buildHourColumns();
      case 'day':
        return buildDayColumns();
      case 'week':
        return buildWeekColumns();
      case 'month':
        return buildMonthColumns();
    }
  });

  /**
   * Calculates the pixel position of Today's indicator
   */
  todayOffset = computed(() => {
    const columns = this.timelineColumns();
    if (!columns.length) return 0;

    const timelineStartMs = columns[0].date.getTime();
    const nowMs = Date.now();

    const columnWidthPx = this.cellWidth();

    /** Hours view */
    if (this.currentView() === 'hour') {
      const elapsedMsSinceStart = nowMs - timelineStartMs;

      // Convert elapsed time into hours and map it to pixels
      const offsetPx =
        (elapsedMsSinceStart / this.HOUR_MS) * columnWidthPx;

      // Clamp the indicator within the visible timeline bounds
      const maxOffsetPx = columns.length * columnWidthPx;
      return Math.max(0, Math.min(offsetPx, maxOffsetPx));
    }

    /** Day / Week views: */
    const timelineEndMs =
      columns[columns.length - 1].date.getTime() +
      getDurationPerCell(this.currentView());

    const visibleDurationMs = timelineEndMs - timelineStartMs;
    const elapsedMsSinceStart = nowMs - timelineStartMs;

    // Total width of the timeline in pixels
    const totalTimelineWidthPx = columns.length * columnWidthPx;

    // Map elapsed time proportionally to pixel offset
    return (elapsedMsSinceStart / visibleDurationMs) * totalTimelineWidthPx;
  });

  ngAfterViewInit() {
    this.centerOnToday();
  }

  centerOnToday() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const offset = this.todayOffset();
    const centerPoint = container.clientWidth / 2;

    container.scrollTo({
      left: offset - centerPoint,
      behavior: 'smooth'
    });
  }

  monthCenterOffset = computed(() => {
    const cols = this.timelineColumns();
    const today = new Date();

    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const monthColIndex = cols.findIndex(c =>
      c.date.getMonth() === todayMonth && c.date.getFullYear() === todayYear
    );

    if (monthColIndex === -1) return -500;

    // Position at (index * width) + (half width)
    return (monthColIndex * this.cellWidth()) + (this.cellWidth() / 2);
  });
}

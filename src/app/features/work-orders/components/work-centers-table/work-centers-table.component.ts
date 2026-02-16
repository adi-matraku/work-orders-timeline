import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';
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
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-work-centers-table',
  standalone: true,
  imports: [CommonModule, TimescaleSelectorComponent, NgSelectComponent],
  templateUrl: './work-centers-table.component.html',
  styleUrls: ['./work-centers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkCentersTableComponent implements AfterViewInit {
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

  readonly workOrderActions = [
    {label: 'Edit', value: 'edit'},
    {label: 'Delete', value: 'delete'}
  ];

  // Hover preview rectangle state
  readonly hoverPreview = signal<{
    workCenterId: string;
    left: number;
    width: number;
  } | null>(null);

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

  minDate = computed(() => {
    const columns = this.timelineColumns();
    return columns.length > 0 ? new Date(columns[0].date) : new Date();
  });

  /**
   * Calculates the position and width for each work order in pixels
   */
  timelineOrders = computed(() => {
    const columns = this.timelineColumns();
    if (columns.length === 0) return [];

    const cellWidth = this.cellWidth();
    const timelineStartMs = columns[0].date.getTime();

    // Duration of a single cell in MS based on view
    const msPerCell = getDurationPerCell(this.currentView());

    return this.workOrders().map(order => {
      const startMs = new Date(order.data.startDate).getTime();
      const endMs = new Date(order.data.endDate).getTime();

      // Calculate how many MS from the start of the timeline
      const elapsedMs = startMs - timelineStartMs;

      // Convert MS to pixels: (Elapsed MS / MS per Cell) * Cell Width
      const left = (elapsedMs / msPerCell) * cellWidth;

      // Calculate width: (Duration MS / MS per Cell) * Cell Width
      const durationMs = endMs - startMs;
      const width = (durationMs / msPerCell) * cellWidth;

      return {
        ...order,
        left,
        width: Math.max(width, 40)
      };
    });
  });

  /**
   * Calculates the pixel offset to center the timeline on the current month (for month view)
   */
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

  setView(mode: Timescale) {
    this.currentView.set(mode);
  }

  onWorkOrderAction(
    action: 'edit' | 'delete',
    order: WorkOrderDocument
  ): void {
    if (!action) return;

    switch (action) {
      case 'edit':
        console.log('Edit', order);
        break;

      case 'delete':
        console.log('Delete', order);
        break;
    }
  }

  private centerOnToday() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const offset = this.todayOffset();
    const centerPoint = container.clientWidth / 2;

    container.scrollTo({
      left: offset - centerPoint,
      behavior: 'smooth'
    });
  }

  onGridRowHover(event: MouseEvent, workCenterId: string) {
    const scale = this.currentView();
    const config = TIMESCALE_CONFIG[scale];

    const disabledScales: Timescale[] = ['hour'];
    if (disabledScales.includes(scale)) {
      this.hoverPreview.set(null);
      return;
    }

    const PREVIEW_WIDTH = config.cellWidth;
    const gridRow = event.currentTarget as HTMLElement;
    const rect = gridRow.getBoundingClientRect();

    // 2. Calculate relative X position (Center the mouse in the preview box)
    let leftPos = event.clientX - rect.left - (PREVIEW_WIDTH / 2);

    // 3. Boundary Guard: Stay within the row edges
    const maxRight = rect.width - PREVIEW_WIDTH;
    leftPos = Math.max(0, Math.min(leftPos, maxRight));

    const rightPos = leftPos + PREVIEW_WIDTH;

    // 4. Collision Detection
    // Filter existing orders for THIS row only
    const existingOrdersInRow = this.timelineOrders().filter(
      (order) => order.data.workCenterId === workCenterId
    );

    // Check if our 1-unit-wide rectangle hits ANY existing order
    const isOverlapping = existingOrdersInRow.some((order) => {
      const orderStart = order.left;
      const orderEnd = order.left + order.width;

      // Returns true if there is even a 1px overlap
      return leftPos < orderEnd && rightPos > orderStart;
    });

    // 5. Update State
    if (isOverlapping) {
      this.hoverPreview.set(null);
    } else {
      this.hoverPreview.set({
        workCenterId,
        left: leftPos,
        width: PREVIEW_WIDTH
      });
    }
  }

  onPreviewClick(event: MouseEvent, workCenterId: string) {
    event.stopPropagation();

    const preview = this.hoverPreview();

    // 1. Safety check: If there's no preview (because of overlap), stop.
    if (!preview || preview.workCenterId !== workCenterId) return;

    // 2. Get the dates based on the current pixel offset
    const {startDate, endDate} = this.getDateFromOffset(preview.left, this.currentView());

    // 3. Construct the payload for your backend or state management
    const newWorkOrder = {
      workCenterId: workCenterId,
      startDate: startDate,
      endDate: endDate,
    };

    console.log('Successfully captured dates:', newWorkOrder);

    // 4. NEXT STEP: Open creation dialog
    // this.openCreateModal(newWorkOrder);

    // 5. Clear the preview after clicking so it doesn't stay stuck
    this.hoverPreview.set(null);
  }

  private getDateFromOffset(offset: number, scale: Timescale) {
    const config = TIMESCALE_CONFIG[scale];
    const timelineStart = new Date(this.minDate()).getTime();

    // 1. Define Time in a single column
    const msPerColumn = getDurationPerCell(scale);

    // 2. Calculate milliseconds per pixel based on the current scale's cellWidth
    const msPerPixel = msPerColumn / config.cellWidth;

    // 3. Calculate Start and End
    const startTimeMs = timelineStart + (offset * msPerPixel);
    const startDate = new Date(startTimeMs);

    // The Rectangle width is always config.cellWidth, so we calculate the duration based on that
    const durationMs = config.cellWidth * msPerPixel;
    const endDate = new Date(startTimeMs + durationMs);

    return {startDate, endDate};
  }
}

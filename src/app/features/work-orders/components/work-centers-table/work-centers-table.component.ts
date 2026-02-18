import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimescaleSelectorComponent} from '../timescale-selector/timescale-selector.component';
import {PositionedWorkOrder, TimelineColumn, Timescale, TIMESCALE_CONFIG} from '../../models/timescale.model';
import {
  buildDayColumns,
  buildHourColumns,
  buildMonthColumns,
  buildWeekColumns,
  getDurationPerCell
} from '../../utils/timeline-columns.utils';
import {MOCK_WORK_CENTERS} from '../../../../mocks/work-orders.mock';
import {
  WorkCenterDocument,
  WorkOrderActionType,
  WorkOrderData,
  WorkOrderDocument,
  WorkOrderPanelInput,
  WorkOrderSaveEvent
} from '../../models/work-orders.model';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {WorkOrderPanelComponent} from '../work-order-panel/work-order-panel.component';
import {ConfirmDialogComponent} from '../../../../shared/confirm-dialog.component';
import {timelineViewChange} from '../../animations/timeline-view-change.animation';

@Component({
  selector: 'app-work-centers-table',
  standalone: true,
  imports: [CommonModule, TimescaleSelectorComponent, NgSelectComponent, FormsModule, WorkOrderPanelComponent, ConfirmDialogComponent],
  templateUrl: './work-centers-table.component.html',
  styleUrls: ['./work-centers-table.component.scss'],
  animations: [timelineViewChange],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkCentersTableComponent {
  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  readonly currentView = signal<Timescale>('month');

  // Cell width configuration for each view
  readonly cellWidth = computed(() => {
    return TIMESCALE_CONFIG[this.currentView()].cellWidth;
  });

  // Mock Data of work centers
  readonly workCenters = signal<WorkCenterDocument[]>(MOCK_WORK_CENTERS);
  readonly workOrders = input.required<WorkOrderDocument[]>();

  readonly onCreate = output<WorkOrderData>();
  readonly onUpdate = output<WorkOrderDocument>();
  readonly onDelete = output<string>();

  orderToDelete = signal<PositionedWorkOrder | null>(null);

  // Hours in milliseconds
  private readonly HOUR_MS = 60 * 60 * 1000;

  readonly selectedAction = model<string | null>(null);

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

  panelOpen = signal(false);
  panelData = signal<WorkOrderPanelInput | null>(null);

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
  timelineOrders = computed<PositionedWorkOrder[]>(() => {
    const orders = this.workOrders();
    const columns = this.timelineColumns();
    if (!columns.length) return [];

    const cellWidth = this.cellWidth();
    const msPerCell = getDurationPerCell(this.currentView());

    // Define the visible time window of the timeline in milliseconds
    const timelineStartMs = columns[0].date.getTime();
    const timelineEndMs =
      columns[columns.length - 1].date.getTime() + msPerCell;

    // Map each order to its pixel position and width based on its start and end dates
    return orders.map(order => {
      const orderStartMs = new Date(order.data.startDate).getTime();
      const orderEndMs = new Date(order.data.endDate).getTime();

      /**
       * Clamp the order range to the visible timeline window.
       * This ensures we only render the part of the order
       * that actually intersects with the current view.
       */
      const visibleStartMs = Math.max(orderStartMs, timelineStartMs);
      const visibleEndMs = Math.min(orderEndMs, timelineEndMs);

      // If the order does not intersect the visible range, hide it
      if (visibleEndMs <= visibleStartMs) {
        return {
          ...order,
          left: 0,
          width: 0,
          hidden: true,
        };
      }

      /**
       * Convert time offsets into pixel values:
       * - left: distance from timeline start
       * - width: duration within the visible range
       */
      const left =
        ((visibleStartMs - timelineStartMs) / msPerCell) * cellWidth;

      const width =
        ((visibleEndMs - visibleStartMs) / msPerCell) * cellWidth;

      return {
        ...order,
        left,
        width: Math.max(width, 40), // min visual width
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

  constructor() {
    afterNextRender(() => {
      this.centerOnToday();
    });
  }

  setView(mode: Timescale) {
    this.currentView.set(mode);
  }

  onPanelClose(): void {
    this.closeAndResetModal();
    this.selectedAction.set(null);
  }

  onPanelSave(workOrder: WorkOrderSaveEvent): void {
    this.panelOpen.set(false);
    this.panelData.set(null);

    if (workOrder.mode === 'create') {
      this.onCreate.emit(workOrder.data);
    } else {
      this.onUpdate.emit(workOrder.data);
    }
  }

  onWorkOrderAction(
    action: WorkOrderActionType,
    order: PositionedWorkOrder
  ): void {
    switch (action) {
      case 'edit':
        this.openPanel({mode: 'edit', data: order});
        break;

      case 'delete':
        this.orderToDelete.set(order);
        break;
    }
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

  ordersByWorkCenter = computed(() => {
    const map = new Map<string, PositionedWorkOrder[]>();

    for (const order of this.timelineOrders()) {
      const centerId = order.data.workCenterId;

      if (!map.has(centerId)) {
        map.set(centerId, []);
      }

      map.get(centerId)!.push(order);
    }

    return map;
  });


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
    // Get filtered existing orders for this row only
    const existingOrdersInRow = this.ordersByWorkCenter().get(workCenterId) ?? [];

    // Check if our rectangle hits any existing order
    const isOverlapping = existingOrdersInRow.some((order) => {
      const orderStart = order.left;
      const orderEnd = order.left + order.width;

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
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    // 4. NEXT STEP: Open creation dialog
    this.openPanel({mode: 'create', data: newWorkOrder});

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

  confirmDelete() {
    if (this.orderToDelete()) {
      this.onDelete.emit(this.orderToDelete()!.docId);
      this.orderToDelete.set(null);
      this.selectedAction.set(null);
    }
  }

  /**
   * Opens the work order panel with the provided data.
   * This method is used for both creating new work orders (with pre-filled dates) and editing existing ones.
   * @param data
   * @private
   */
  private openPanel(data: WorkOrderPanelInput) {
    this.panelOpen.set(true);
    this.panelData.set(data);
  }

  /**
   * Closes the work order panel.
   * This is called after saving or when the user cancels the action.
   * @private
   */
  private closeAndResetModal(): void {
    this.panelOpen.set(false);
    this.panelData.set(null);
  }
}

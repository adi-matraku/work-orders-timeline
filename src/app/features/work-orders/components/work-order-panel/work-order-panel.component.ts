import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {WorkOrderData, WorkOrderPanelInput, WorkOrderSaveEvent} from '../../models/work-orders.model';
import {NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from '@ng-select/ng-select';
import {animate, group, query, style, transition, trigger} from '@angular/animations';
import {NgbDateParserFormatter, NgbDatepickerKeyboardService, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {isoToNgbDate, ngbDateToIso} from '../../utils/date-utils';
import {DmyDateParserFormatter} from '../../utils/date-formatter';
import {CustomKeyboardService} from '../../utils/datepicker-keyboard';
import {EscCloseDirective} from '../../directives/esc-close.directive';
import {AutoFocusDirective} from '../../directives/auto-focus.directive';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective, NgbInputDatepicker, EscCloseDirective, AutoFocusDirective],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: DmyDateParserFormatter},
    { provide: NgbDatepickerKeyboardService, useClass: CustomKeyboardService }
  ],
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        group([
          // 1. The Background (Overlay): Just fade opacity, NO movement
          query('.panel-overlay-bg', [
            style({opacity: 0}),
            animate('200ms ease-out', style({opacity: 1}))
          ], {optional: true}),

          // 2. The White Panel: Slide in fast from the right
          query('.panel-container', [
            style({transform: 'translateX(100%)'}),
            animate('250ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
              style({transform: 'translateX(0)'})
            )
          ], {optional: true})
        ])
      ]),

      transition(':leave', [
        group([
          query('.panel-overlay-bg', [
            animate('200ms ease-in', style({opacity: 0}))
          ], {optional: true}),
          query('.panel-container', [
            animate('200ms ease-in', style({transform: 'translateX(100%)'}))
          ], {optional: true})
        ])
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderPanelComponent {
  private fb = inject(FormBuilder);

  data = input<WorkOrderPanelInput | null>(null);

  close = output<void>();
  save = output<WorkOrderSaveEvent>();

  // Dropdown Options
  statuses: { label: string; value: string; }[] = [
    {label: 'Open', value: 'open'},
    {label: 'In Progress', value: 'in-progress'},
    {label: 'Complete', value: 'complete'},
    {label: 'Blocked', value: 'blocked',}
  ];

  workOrderForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    status: ['open', Validators.required],
    endDate: ['', Validators.required],
    startDate: ['', Validators.required],
    workCenterId: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const input = this.data();
      if (!input) return;

      if (input.mode === 'edit') {
        this.workOrderForm.patchValue({
          name: input.data.data.name,
          status: input.data.data.status,
          workCenterId: input.data.data.workCenterId,
          startDate: isoToNgbDate(input.data.data.startDate),
          endDate: isoToNgbDate(input.data.data.endDate),
        }, {emitEvent: false});

        return;
      }

      // Create mode - prefill with template data having start and end date
      const template = input.data;

      this.workOrderForm.patchValue({
        workCenterId: template.workCenterId,
        startDate: isoToNgbDate(template.startDate),
        endDate: isoToNgbDate(template.endDate),
      }, {emitEvent: false});
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.workOrderForm.get(controlName);
    // Only show error if the user has touched the field or tried to change it
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onClose() {
    this.close.emit();
  }

  submit() {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }

    const rawValue = this.workOrderForm.getRawValue();
    const panelInput = this.data();

    if (!panelInput) return;

    const formValue: WorkOrderData = {
      ...rawValue,
      startDate: ngbDateToIso(rawValue.startDate),
      endDate: ngbDateToIso(rawValue.endDate)
    };

    // Emit based on the mode of the input data
    if (panelInput.mode === 'edit') {
      this.save.emit({
        mode: 'edit',
        data: {
          docId: panelInput.data.docId,
          docType: panelInput.data.docType,
          data: formValue,
        }
      });
    } else {
      this.save.emit({
        mode: 'create',
        data: formValue
      });
    }

    this.onClose();
  }
}

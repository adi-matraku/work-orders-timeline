import {ChangeDetectionStrategy, Component, effect, HostListener, inject, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {WorkOrderForm} from '../../models/work-orders.model';
import {NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from '@ng-select/ng-select';
import {animate, group, query, style, transition, trigger} from '@angular/animations';
import {NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {isoToNgbDate} from '../../utils/date-utils';
import {DmyDateParserFormatter} from '../../utils/date-formatter';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective, NgbInputDatepicker],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NgbDateParserFormatter, useClass: DmyDateParserFormatter }
  ],
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        group([
          // 1. The Background (Overlay): Just fade opacity, NO movement
          query('.panel-overlay-bg', [
            style({ opacity: 0 }),
            animate('200ms ease-out', style({ opacity: 1 }))
          ], { optional: true }),

          // 2. The White Panel: Slide in fast from the right
          query('.panel-container', [
            style({ transform: 'translateX(100%)' }),
            animate('250ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
              style({ transform: 'translateX(0)' })
            )
          ], { optional: true })
        ])
      ]),

      transition(':leave', [
        group([
          query('.panel-overlay-bg', [
            animate('200ms ease-in', style({ opacity: 0 }))
          ], { optional: true }),
          query('.panel-container', [
            animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class WorkOrderPanelComponent {
  private fb = inject(FormBuilder);

  data = input<any | null>(null);

  close = output<void>();
  save = output<WorkOrderForm>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    event.preventDefault();
    this.onClose();
  }

  // Dropdown Options
  statuses: { label: string; value: string; }[] = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress'},
    { label: 'Complete', value: 'complete'},
    { label: 'Blocked', value: 'blocked', }
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
      const value = this.data();

      if (value) {
        console.warn(value);
        this.workOrderForm.patchValue({
          ...value,
          startDate: isoToNgbDate(value.startDate),
          endDate: isoToNgbDate(value.endDate)
        });
      }
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
    if (this.workOrderForm.valid) {
      this.save.emit(this.workOrderForm.value);
      this.onClose();
    }
  }
}

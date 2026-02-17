import {Component, effect, inject, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {WorkOrder} from '../../models/work-orders.model';
import {NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from '@ng-select/ng-select';
import {animate, group, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
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

  data = input<WorkOrder | null>(null);

  close = output<void>();
  save = output<WorkOrder>();

  // Dropdown Options
  statuses: { label: string; value: string; }[] = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress'},
    { label: 'Complete', value: 'complete'},
    { label: 'Blocked', value: 'blocked', }
  ];

  workOrderForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    status: ['', Validators.required],
    endDate: ['', Validators.required],
    startDate: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const value = this.data();

      if (value) {
        this.workOrderForm.patchValue(value);
      }
    });
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

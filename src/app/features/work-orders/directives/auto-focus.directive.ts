import { Directive, ElementRef, inject } from '@angular/core';
import { afterNextRender } from '@angular/core';

@Directive({
  selector: '[autoFocusElement]',
  standalone: true,
})
export class AutoFocusDirective {
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.focus();
    });
  }
}

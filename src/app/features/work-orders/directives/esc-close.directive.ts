import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[escClose]',
  standalone: true,
})
export class EscCloseDirective {
  esc = output<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    event.preventDefault();
    this.esc.emit();
  }
}

import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: 'textarea[appManualAutosize]',
  standalone: true
})
export class ManualAutosizeDirective implements AfterViewInit {
  @Input() minRows = 1;
  @Input() maxRows = 10;

  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {}

  ngAfterViewInit() {
    this.adjustHeight();
    this.elementRef.nativeElement.addEventListener('input', () => this.adjustHeight());
  }

  private adjustHeight() {
    const textarea = this.elementRef.nativeElement;
    const computedStyle = getComputedStyle(textarea);

    // Рассчитываем высоту одной строки с учетом line-height
    const lineHeight = parseFloat(computedStyle.lineHeight) ||
      parseFloat(computedStyle.fontSize) * 1.2;

    // Сбрасываем высоту для правильного расчета
    textarea.style.height = 'auto';

    // Рассчитываем высоту содержимого
    const contentHeight = textarea.scrollHeight;
    const rows = Math.floor(contentHeight / lineHeight);

    // Применяем ограничения по количеству строк
    const constrainedRows = Math.min(Math.max(rows, this.minRows), this.maxRows);
    textarea.style.height = `${constrainedRows * lineHeight}px`;
  }
}

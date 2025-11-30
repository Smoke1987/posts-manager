import { AfterContentInit, Component, ContentChild, ElementRef, signal } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-content-with-buttons-layout',
  templateUrl: './content-with-buttons-layout.component.html',
  styleUrl: './content-with-buttons-layout.component.scss',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class ContentWithButtonsLayoutComponent implements AfterContentInit {
  @ContentChild('buttonsContent', { static: false, read: ElementRef }) buttonsContent?: ElementRef;

  hasButtonsContent = false;

  ngAfterContentInit(): void {
    this.hasButtonsContent = !!this.buttonsContent;
  }
}

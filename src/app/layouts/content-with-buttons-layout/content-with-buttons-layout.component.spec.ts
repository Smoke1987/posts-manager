import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWithButtonsLayoutComponent } from './content-with-buttons-layout.component';

describe('ContentWithButtonsLayoutComponent', () => {
  let component: ContentWithButtonsLayoutComponent;
  let fixture: ComponentFixture<ContentWithButtonsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentWithButtonsLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentWithButtonsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

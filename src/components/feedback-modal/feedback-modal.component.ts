
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [],
  templateUrl: './feedback-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackModalComponent {
  isOpen = input.required<boolean>();
  closeModal = output<void>();

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}

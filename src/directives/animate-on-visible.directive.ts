
import { Directive, ElementRef, inject, afterNextRender } from '@angular/core';

@Directive({
  selector: '[appAnimateOnVisible]',
  standalone: true,
})
export class AnimateOnVisibleDirective {
  private element = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.element.nativeElement.classList.add('visible');
              observer.unobserve(this.element.nativeElement);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(this.element.nativeElement);
    });
  }
}

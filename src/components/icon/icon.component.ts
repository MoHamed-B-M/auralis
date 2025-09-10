import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <rect width="64" height="64" rx="32" fill="var(--md-sys-color-surface-variant)"/>
      <path d="M24.5 44L32 20L39.5 44" stroke="var(--md-sys-color-primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27.5 38C29.1667 36.6667 31.5 36.6667 33 38C34.5 39.3333 36.5 39.3333 38.5 38" stroke="var(--md-sys-color-primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {}

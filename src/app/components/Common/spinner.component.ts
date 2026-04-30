import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if (visible) {
      <div class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="spinner"></div>
        <p class="text-sm text-gray-400 animate-pulse">{{ message }}</p>
      </div>
    }
  `,
  styles: [`
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e5e7eb;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() visible = false;
  @Input() message = 'Loading...';
}
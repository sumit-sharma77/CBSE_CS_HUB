import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      [style.width]="width"
      [style.height]="height"
      [class]="skeletonClasses"
    ></div>
  `,
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() rounded = false;

  get skeletonClasses(): string {
    const base = 'skeleton';
    return this.rounded ? `${base} rounded-full` : base;
  }
}

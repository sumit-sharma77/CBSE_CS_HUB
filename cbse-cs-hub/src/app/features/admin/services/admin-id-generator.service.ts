import { Injectable } from '@angular/core';
import { IAdminIdGeneratorService } from '../admin.types';

@Injectable()
export class AdminIdGeneratorService implements IAdminIdGeneratorService {
  nextId(existingItems: { id: string }[], prefix: string): string {
    let max = 0;
    for (const item of existingItems) {
      if (item.id.startsWith(prefix + '-')) {
        const suffix = item.id.slice(prefix.length + 1);
        const num = parseInt(suffix, 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      }
    }
    const next = max + 1;
    return `${prefix}-${String(next).padStart(3, '0')}`;
  }

  validateId(proposedId: string, existingItems: { id: string }[]): boolean {
    return !existingItems.some(item => item.id === proposedId);
  }
}

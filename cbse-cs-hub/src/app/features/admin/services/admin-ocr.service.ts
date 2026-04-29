import { Injectable } from '@angular/core';
import { IAdminOcrService, OcrResult, ParsedOcrResult } from '../admin.types';

@Injectable()
export class AdminOcrService implements IAdminOcrService {
  private readonly OCR_TIMEOUT_MS = 10_000;

  async processImage(imageData: File | Blob): Promise<OcrResult> {
    const { createWorker } = await import('tesseract.js');

    const worker = await createWorker('eng');

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('OCR timed out after 10 seconds')), this.OCR_TIMEOUT_MS)
    );

    try {
      const url = URL.createObjectURL(imageData);
      const result = await Promise.race([
        worker.recognize(url),
        timeoutPromise,
      ]);
      URL.revokeObjectURL(url);

      const text: string = result.data.text;
      const confidence: number = result.data.confidence;
      return {
        text,
        confidence,
        lowConfidence: confidence < 70,
      };
    } finally {
      await worker.terminate();
    }
  }

  parseOptionsFromText(text: string): ParsedOcrResult {
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Match patterns: A) text, a) text, A. text, (A) text, 1. text, 1) text
    const optionPattern = /^(?:\(?\s*[AaBbCcDd1234]\s*[\)\.]\s*)(.+)/;
    const extracted: string[] = [];
    const questionLines: string[] = [];
    let foundFirstOption = false;

    for (const line of lines) {
      const match = line.match(optionPattern);
      if (match) {
        foundFirstOption = true;
        extracted.push(match[1].trim());
      } else if (!foundFirstOption) {
        questionLines.push(line);
      }
    }

    const questionText = questionLines.join(' ').trim() || text.trim();

    if (extracted.length === 4) {
      return {
        questionText,
        options: extracted as [string, string, string, string],
      };
    }

    return { questionText, options: null };
  }
}

import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';

@Injectable()
export class DmyDateParserFormatter extends NgbDateParserFormatter {
  override format(date: NgbDateStruct | null): string {
    if (!date) return '';
    return `${date.month}.${date.day}.${date.year}`;
  }

  override parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const [day, month, year] = value.split('.').map(Number);
    return {month, day, year};
  }
}

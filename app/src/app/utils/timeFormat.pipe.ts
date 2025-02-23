import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}

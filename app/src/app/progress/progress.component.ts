import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, viewChild, ViewChild } from '@angular/core';
import { TimeFormatPipe } from '../utils/timeFormat.pipe';

@Component({
  selector: 'app-progress',
  imports: [TimeFormatPipe],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() audio!: HTMLAudioElement;
  @Input() progress: number = 0;
  @Output() timeUpdate = new EventEmitter<number>();

  onSeek(): void {
    const bar = document.getElementById('bar');
    if (this.audio && bar) {
      const newTime = ((bar as HTMLInputElement).valueAsNumber);
      console.log(newTime);
      this.timeUpdate.emit(newTime);
    }
  }
}
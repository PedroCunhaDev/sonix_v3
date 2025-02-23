import { Component, Input } from '@angular/core';
import { TimeFormatPipe } from '../utils/timeFormat.pipe';

@Component({
  selector: 'app-progress',
  imports: [TimeFormatPipe],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  @Input() audio!: HTMLAudioElement;

  onSeek(event: any) {
    const newTime = (event.target as HTMLInputElement).valueAsNumber;
    if (this.audio) {
      this.audio.currentTime = newTime;
    }
  }
}

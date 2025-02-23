import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Song } from '../models/models';

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent {
  @Input()
  song!: Song;
  @Output()play=new EventEmitter<void>();
}

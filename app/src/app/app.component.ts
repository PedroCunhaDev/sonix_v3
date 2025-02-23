import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SongComponent } from './song/song.component';
import { NavigationComponent } from "./navigation/navigation.component";
import { Pages, Song } from './models/models';
import { ProgressComponent } from "./progress/progress.component";

@Component({
  selector: 'app-root',
  imports: [FormsModule, SongComponent, NavigationComponent, ProgressComponent],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {
  songs: Song[] = [];
  q: string = '';
  api: string = "http://localhost:3000/songs";
  currentAudio: HTMLAudioElement | null = null;
  currentSong!: Song;
  currentPage: string = 'Olá Pedro';
  startPage: boolean = true;
  duration: number = 100;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.load();
    this.welcomeMessage();
  }

  welcomeMessage() {
    this.startPage = true;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.currentPage = "Good morning!";
    }
    else if (hour >= 12 && hour < 19) {
      this.currentPage = "Good afternoon!";
    }
    else {
      this.currentPage = "Good evening"
    }
  }
  getFormattedTime(length: number) {
    const len = length / 60;
    const minutes = Math.floor(len);
    const seconds = Math.round((len - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  navigate(page: Pages) {
    if (page != Pages.Start) {
      this.startPage = false;
    }
    switch (page) {
      case Pages.Start:
        this.welcomeMessage();
        break;
      case Pages.AllSongs:
        this.currentPage = "All Songs";
        break;
      case Pages.Playlists:
        this.currentPage = "Playlists";
        break;
      case Pages.Albums:
        this.currentPage = "Albums";
        break;
      case Pages.Artists:
        this.currentPage = "Artists";
        break;
      case Pages.Upload:
        this.currentPage = "Upload";
        break;
      case Pages.About:
        this.currentPage = "About";
        break;
      case Pages.Profile:
        this.currentPage = "Profile";
        break;
    }
  }


  load() {
    this.http.get<Song[]>(this.api).subscribe(d => this.songs = d.map(s => {
      if (typeof s.length == 'number') {
        s.time = this.getFormattedTime(s.length)
      }
      return s
    }));
  }

  search() {
    this.http.get<any[]>(`${this.api}${this.q ? `?q=${this.q}` : ''}`).subscribe(d => this.songs = d);
  }

  async play(s: Song) {
    this.currentSong = s;
    this.duration = Math.floor(s.length);
    console.log(this.duration);
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    const audio = await new Audio(`${this.api}/${s.id}/file`);
    this.currentAudio = audio;
    this.currentAudio.play();
    console.log(this.currentAudio);
  }

  seekAudio(newTime: number) {
    if (this.currentAudio) {
      this.currentAudio.currentTime = newTime;
    }
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { Pages } from '../models/models';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Output() navigate = new EventEmitter<Pages>();
  pages = Pages;
  current: Pages = Pages.Start;

  onNavigate(item: Pages) {
    this.navigate.emit(item);
    this.current = item;
  }
}

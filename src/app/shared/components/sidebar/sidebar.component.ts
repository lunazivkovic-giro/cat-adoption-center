import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  searchTerm: string = '';
  sortOrder: string = ''; 
  sortAgeOrder: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<{ sortBy: string, order: string }>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }

  onSort(): void {
    this.sort.emit({ sortBy: 'date', order: this.sortOrder });
  }

  onSortAge(): void {
    this.sort.emit({ sortBy: 'age', order: this.sortAgeOrder });
  }
}
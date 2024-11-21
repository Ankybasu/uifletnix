import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports:[FormsModule,CommonModule],
  standalone:true,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private dataService: DataService) {}

  searchData(): void {
    if (!this.searchQuery.trim()) return;

    this.dataService.search(this.searchQuery).subscribe((results) => {
      this.searchResults = results;
      console.log('Search Results:', results);
    });
  }
}

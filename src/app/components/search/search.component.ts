import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  filteredData: any[] = []; // Data to be displayed after filtering
  @Input() totalData:any[]=[];
  titleMatches: boolean = false;
  castMatches:boolean=false;
  constructor(private dataService: DataService) {}

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.totalData.filter((movie) => {
      const titleMatch = movie.title?.toLowerCase().includes(query) || false;

    // Safeguard for undefined cast
    const castArray = movie.cast ? movie.cast.split(', ') : [];
    const castMatch = castArray.some((actor: string) => actor.toLowerCase().includes(query));

    return titleMatch || castMatch;
    });
  }
  searchMovies(event: any): void {
    let searchTerm=event.target.value;
    if (!searchTerm.trim()) {
      this.filteredData = [];
      return;
    }
  
    const lowerSearchTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.totalData.filter((movie) => {
      const titleMatches = movie.title?.toLowerCase().includes(lowerSearchTerm);
      const castMatches = Array.isArray(movie.cast)
        ? movie.cast.some((castMember: string) =>
            castMember.toLowerCase().includes(lowerSearchTerm)
          )
        : typeof movie.cast === 'string'
        ? movie.cast.toLowerCase().includes(lowerSearchTerm)
        : false;
  
      return titleMatches || castMatches;
    });
  }
  
  getCastString(cast: any): string {
    if (Array.isArray(cast)) {
      return cast.join(', ');
    } else if (typeof cast === 'string') {
      return cast;
    } else {
      return '';
    }
  }
  searchData(): void {
    if (!this.searchQuery.trim()) return;

    this.dataService.search(this.searchQuery).subscribe((results) => {
      this.searchResults = results;
      console.log('Search Results:', results);
    });
  }
  resetSearch(): void {
    this.searchQuery = '';         // Reset the search query
    this.filteredData = []; // Reset the filtered data to original
  }
}

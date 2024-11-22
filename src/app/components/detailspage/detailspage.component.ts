import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CacheService } from '../../services/cache.service';
import { DataService } from '../../services/data.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule,NavbarComponent,SearchComponent],
  templateUrl: './detailspage.component.html',
  styleUrl: './detailspage.component.scss'
})
export class DetailspageComponent {

  itemDetails: any; // Holds the item's details
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
  hide: boolean=true;
  @Input() shows: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cacheService:CacheService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.shows=this.cacheService.getData();
    this.route.paramMap.subscribe((params) => {
      const showId = params.get('show_id');
      if (showId) {
        this.fetchShowDetails(showId);
      } else {
        this.errorMessage = 'Invalid show ID';
        this.isLoading = false;
      }
    });
  }

  private fetchShowDetails(showId: string): void {
    this.isLoading = true; // Start loading
    this.dataService.getShowDetails(showId).subscribe(
      (response) => {
        this.itemDetails = response; // Assign the fetched data
        this.isLoading = false; // Loading complete
      },
      (error) => {
        this.errorMessage = 'Error fetching item details';
        console.error(error);
        this.isLoading = false; // Loading complete with error
      }
    );
  }
  emitToggle(toggle:boolean){
    this.hide=toggle;
  }
  
}

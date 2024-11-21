import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule,MenuComponent],
  templateUrl: './detailspage.component.html',
  styleUrl: './detailspage.component.scss'
})
export class DetailspageComponent {

  itemDetails: any; // Holds the item's details
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
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
  
}

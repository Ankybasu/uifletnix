import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule],
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
    // Extract the show_id from the route and fetch details
    const showId = this.route.snapshot.paramMap.get('show_id');
    if (showId) {
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
    } else {
      this.errorMessage = 'Invalid show ID';
      this.isLoading = false; // Loading complete
    }
  }
}

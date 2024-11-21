import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SearchComponent } from '../components/search/search.component';
import { CacheService } from '../services/cache.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule,CommonModule,MatPaginatorModule,SearchComponent,NavbarComponent,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() shows: any[] = [];
  totalPages: number = 0;
  totalCount:number=0;
  currentPage: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';
  pageSize:number= 15; // Items per page
  hide:boolean=false;
  pageSizeOptions: number[] = [15, 30, 45]; // Default options
  selectedMediaType: string='all';
  constructor(private dataService: DataService,private cacheService:CacheService) {}

  ngOnInit() {
    this.loadData(); // Fetch data on component load
  }

  // Method to load data from the API
  async loadData(page: number = 1) {
    this.isLoading = true;
    let userAge=25;
    let type=this.selectedMediaType==='all'?undefined:this.selectedMediaType;
    const cacheKey = `data-page-${page}-type-${type}-userAge-${userAge}`;
    const cachedData = this.cacheService.get(cacheKey);

    if (cachedData) {
      // Use cached data
      this.totalCount = cachedData.totalCount;
      this.shows = cachedData.data;
      this.filteredMedia = this.shows;
      this.totalPages = cachedData.totalPages;
      this.currentPage = cachedData.currentPage;
      this.isLoading = false;
      return;
    }

    await lastValueFrom(this.dataService.getData(page, 15,type, userAge)).then(
      (response) => {
        this.cacheService.set(cacheKey, response, 600000); // Cache for 10 minutes
        this.totalCount=response.totalCount;
        this.shows = response.data;
        this.filteredMedia=this.shows;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching data!';
        this.isLoading = false;
      }
    );
  }

  // // Method to go to the next page
  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.loadData(this.currentPage + 1);
  //   }
  // }

  // // Method to go to the previous page
  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.loadData(this.currentPage - 1);
  //   }
  // }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadData(this.currentPage);
  }
  filteredMedia = [...this.shows]; // Default shows all media

  // Method to filter movies and TV shows

  async filterDataReload(selectedMediaType:string){
    this.selectedMediaType=selectedMediaType;
    await this.loadData();
    await this.setData();
  }
  setData(){  
      if (this.selectedMediaType === 'all') {
        this.filteredMedia = [...this.shows]; // Show all media
      } else {
        this.filteredMedia = this.shows.filter(
          media => media.type ===this.selectedMediaType
        );
        console.log(this.filteredMedia)
      }
    }
  
  emitToggle(toggle:boolean){
    this.hide=toggle;
  }
}

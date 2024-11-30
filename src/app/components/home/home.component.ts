import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchComponent } from '../search/search.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { filter, lastValueFrom } from 'rxjs';
import { CacheService } from '../../services/cache.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule,MatPaginatorModule,SearchComponent,NavbarComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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
    this.dataService.data$.subscribe((data) => {
      if (data) {
       this.selectedMediaType=data;
      }
    });

    const userAgeString = localStorage.getItem('userAge'); // Retrieve the value from localStorage
    const userAge = userAgeString ? parseInt(userAgeString, 10) : undefined; // Parse to number or set undefined if null
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
        console.log(response)
        response.data.sort((a:any,b:any)=>new Date(b.date_added).getTime()-new Date(a.date_added).getTime())
        this.totalCount=response.totalCount;
        this.shows = response.data;
        this.filteredMedia=this.shows;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.isLoading = false;
        this.cacheService.setData(this.shows);
      },
      (error) => {
        this.errorMessage = 'Error fetching data!';
        this.isLoading = false;
      }
    );
  }

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

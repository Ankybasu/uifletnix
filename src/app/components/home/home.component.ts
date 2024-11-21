import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchComponent } from '../search/search.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { filter, lastValueFrom } from 'rxjs';
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
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData(); // Fetch data on component load
  }

  // Method to load data from the API
  async loadData(page: number = 1) {
    this.isLoading = true;
    let userAge=25;
    let type=this.selectedMediaType==='all'?undefined:this.selectedMediaType;
    await lastValueFrom(this.dataService.getData(page, 15,type, userAge)).then(
      (response) => {
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

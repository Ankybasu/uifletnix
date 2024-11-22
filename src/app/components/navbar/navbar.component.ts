import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
    

export class NavbarComponent {
  constructor(private router: Router,private dataService:DataService) {
    this.dataService.data$.subscribe((type) => {
      this.selectedMediaType = type;
    });
  }

  toggle:boolean=false;
  selectedMediaType: string = 'all'; // Default to 'all'
  @Output() filteredData=new EventEmitter();
  @Output() emitToggle=new EventEmitter();
  filterMedia(){
    this.filteredData.emit(this.selectedMediaType)
  }
  searchShowHide(){
    this.toggle=!this.toggle;
    this.emitToggle.emit(this.toggle);
    console.log(this.toggle)
  }
  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  navigateTo(navigate:string){
    this.dataService.updateData(navigate);
    this.filteredData.emit(navigate);
    if(this.router.url==='/home')
    return;
    this.router.navigate(['/home']);
  }
}

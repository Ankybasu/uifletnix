import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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

}

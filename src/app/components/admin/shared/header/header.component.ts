import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user: any;

  constructor(private router: Router) {
    this.getUser();
  }

  // course-programs toggle
  selectedTab: string = 'Courses';

  protected logOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  getUser(){
    this.user = JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  protected toggleCoursePrograms(selectedTabBool: boolean) {
    selectedTabBool
      ? (this.selectedTab = 'Courses')
      : (this.selectedTab = 'Programs');
  }
}

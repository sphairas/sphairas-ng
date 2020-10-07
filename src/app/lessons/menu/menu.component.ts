import { Component, OnInit } from '@angular/core';
import { LessonsService } from 'src/app/lessons.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

export const categories: any[] = [
  {
    id: "primary-unit",
    display: "My Classes",
    icon: "assets/images/icons/persons-in-a-class-svgrepo-com.svg"
  },
  {
    id: "lesson",
    display: "My Lessons",
    icon: "assets/images/icons/teach-svgrepo-com.svg"
  }
]

@Component({
  selector: 'courses-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class CoursesMenuComponent implements OnInit {

  courses: Observable<any>;
  categories: any[];

  constructor(private unitsService: LessonsService, private router: Router, private authService: AuthService) {
    this.courses = this.unitsService.getCourses();
    this.categories = categories;
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}

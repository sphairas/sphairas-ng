import { Component, OnInit } from '@angular/core';
import { LessonsService } from 'src/app/lessons.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseTargetDocument } from '../base-target-document';

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

  lessons: Observable<BaseTargetDocument[]>;
  categories: any[];

  constructor(private service: LessonsService, private router: Router, private authService: AuthService) {
    this.lessons = this.service.getCourses();
    this.categories = categories;
  }

  ngOnInit(): void {
    this.service.getCourses();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}

import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './app.main.html',
  styleUrls: ['./app.main.scss']
})
export class AppMainComponent {
  title = 'sphairas-client';
  newsActive: boolean = true;
  menuActive: boolean = true;
  news: string = "Please respect the TERM";


  /**
   * An HTML friendly identifier for the currently displayed page.
   * This is computed from the `currentDocument.id` by replacing `/` with `-`
   */
  pageId: string;
  isStarting = true;
  isTransitioning = true;
  isSideBySide = true; //false;
  isFetching = false;
  private isSideNavDoc = true;//false;
  get isOpened() { return this.isSideBySide && this.isSideNavDoc; }
  get mode() { return this.isSideBySide ? 'side' : 'over'; }

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/menu.svg')
    );
  }

  updateHostClasses() {
    // const mode = `mode-${this.deployment.mode}`;
    // const sideNavOpen = `sidenav-${this.sidenav.opened ? 'open' : 'closed'}`;
    // const pageClass = `page-${this.pageId}`;
    // const folderClass = `folder-${this.folderId}`;
    // const viewClasses = Object.keys(this.currentNodes).map(view => `view-${view}`).join(' ');
    // const notificationClass = `aio-notification-${this.notification.showNotification}`;
    // const notificationAnimatingClass = this.notificationAnimating ? 'aio-notification-animating' : '';

    // this.hostClasses = [
    //   mode,
    //   sideNavOpen,
    //   pageClass,
    //   folderClass,
    //   viewClasses,
    //   notificationClass,
    //   notificationAnimatingClass
    // ].join(' ');
  }


  onMenuButtonClick(event: Event) {
    this.menuActive = !this.menuActive;
    event.preventDefault();
  }

  // initNewsState() {
  //   this.newsActive = sessionStorage.getItem('primenews-hidden') ? false : true;
  // }

  hideNews(event) {
    this.newsActive = false;
    sessionStorage.setItem('primenews-hidden', "true");
    event.preventDefault();
  }
}

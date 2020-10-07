import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

const urlPattern = '[\da-z]+([.-]?[\da-z]+)*\\.[a-z]{2,63}';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  serverName: string = undefined;
  passwordForm: FormGroup;
  return: string = '';
  serverNameForm: FormControl; 

  constructor(private fb: FormBuilder,
    private authService: AuthService,  
    private router: Router,
    private route: ActivatedRoute) {

    this.serverNameForm = new FormControl('', [Validators.required, Validators.pattern(urlPattern)]);
    this.passwordForm = this.fb.group({
      account: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {    
    let settings: { db: string, api: string, account: string } = JSON.parse(localStorage.getItem('app-settings')) || {};
    this.passwordForm.patchValue(settings);
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');  
  }

  proceed() {
    let server = 'https://' + this.serverNameForm.value;
    this.authService.options(server)
      .subscribe(res => {
        if (res[0].type === 'password') {
          this.serverName = server;
        }
      }); 
  }

  login() {
    const val = this.passwordForm.value;
    this.authService.login(this.serverName, val.account, val.password)
      .subscribe(res => {
        if (res.jwt) {
          let settings: { db: string, api: string, account: string } = JSON.parse(localStorage.getItem('app-settings')) || {};
          settings.db = res.db;
          settings.api = res.api;
          settings.account = val.account;
          localStorage.setItem('app-settings', JSON.stringify(settings));
          // this.router.navigateByUrl('/');
          this.router.navigateByUrl(this.return);
        }
      }
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}

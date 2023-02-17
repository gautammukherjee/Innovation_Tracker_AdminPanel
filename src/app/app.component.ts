import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UsersService } from './services/users.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { filter, map } from 'rxjs/operators';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user: any;
  error = "false";
  errorMessage = "";

  title = 'innovation_tracker_back';
  sideNavStatus: boolean = false;

  constructor(private usersService: UsersService, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title, private location: Location) {

    this.user = JSON.parse(this.usersService.getCurrentUser());
    console.log("idToken:: ", localStorage.getItem('id_token'));

    if (this.usersService.isLoggednIn() == true) {
    }
    else {
      this.error = "true";
      this.errorMessage = "Your session is expired..";
      this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    }

    // Start set title bar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {
        var rt = this.getChild(this.activatedRoute)
        rt.data.subscribe(data => {
          // console.log(data);
          this.titleService.setTitle(data.title)
        })
      })
    // End set title bar

  }

  // Start set title bar
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
    // End set title bar
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

    // console.log("expireATT: ", localStorage.getItem('expires_at'));
    // if (this.usersService.isLoggednIn() == true) {
    //   this.router.navigate(['/pages/dashboard']);  // when app is (re)initialized, you are being redirected to root page 
    // } else {
    //   this.error = "true";
    //   this.errorMessage = "Your session is expired..";
    //   this.router.navigate(['login']); // when user is not logged in app is redirected to login page
    // }

  }

}

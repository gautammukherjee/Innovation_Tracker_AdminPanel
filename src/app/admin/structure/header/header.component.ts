import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  result: any;
  error = "false";
  errorMessage = "";

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;
  constructor(private usersService: UsersService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.result = JSON.parse(sessionStorage.getItem('currentUser'));
    // console.log("header: ", this.result);

    if (this.usersService.isLoggednIn() == false) {
      this.autologout();
    }
  }

  ngOnInit(): void {
  }

  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  autologout() {
    setTimeout(() => {
      this.error = "true";
      this.errorMessage = "Your session is expired..";
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    }, 1000);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

import * as moment from "moment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userCredentials: any = {};
  currentUser: any = {};
  result: any;
  loading = false;
  error = "false";
  errorMessage: String = '';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
    this._activatedRoute.queryParams.subscribe(params => {
      this.error = params['error'];
      this.errorMessage = params['errorMessage'];
    });
  }

  ngOnInit(): void {
  }

  loginFrmSubmit(loginForm: any) {
    this.loading = true;
    this.error = "false";
    let userEmail = loginForm.value.email;
    let userPwd = loginForm.value.pass;
    this.userCredentials = { email: userEmail, password: userPwd };

    this.usersService.doLogin(this.userCredentials).subscribe( //3 Login
      data => {
        this.result = data;
        console.log("result: ", this.result);
        // console.log("newres: ", this.result.search['original']['user']);

        if (this.result.success == false) {
          this.error = "true";
          this.loading = false;
          this.errorMessage = "Invalid User name or password";
        } else {
          if (this.result.success == true) {
            this.setSession(this.result.search['original']);
            this._router.navigate(['/admin/users-lists'], { relativeTo: this._activatedRoute });
          }
        }
      },
      err => {
        this.error = "true";
        this.errorMessage = err.message;
        this.loading = false;
      },
      () => {
        // this.loading = false;
      }
    );

    // if (userEmail === 'admin@bioxcel.com' && userPwd === 'admin@123') {
    //   this.setSession({ email: "admin@bioxcel.com", member_id: 1, firstname: 'admin' });
    //   this._router.navigate(['/dashboard'], { relativeTo: this._activatedRoute });
    // } else {
    //   this.errorMessage = "Invalid User name or password";
    // }

  }

  private setSession(authResult:any) {
    // const expiresAt = moment().add(authResult.expiresAt, authResult.expireTimeUnit);
    const expiresAt = moment().add(authResult.expires_in, authResult.expireTimeUnit);
    sessionStorage.setItem('currentUser', JSON.stringify({ user_name: authResult.user.name, user_id: authResult.user.user_id, user_type_id: authResult.user.user_type_id, email: authResult.user.email }));
    localStorage.setItem('id_token', authResult.access_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

  }

}

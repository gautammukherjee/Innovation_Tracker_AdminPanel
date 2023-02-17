import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
  }

}

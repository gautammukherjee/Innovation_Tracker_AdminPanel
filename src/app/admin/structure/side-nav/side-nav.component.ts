import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Input() sideNavStatus: boolean = false;

  result: any;
  lists: any;

  constructor() {
    this.result = JSON.parse(sessionStorage.getItem('currentUser'));
    // console.log("left menu: ", this.result.user_type_id);
  }
  ngOnInit(): void {

    if (this.result.user_type_id == 1) {
      this.lists = [
        // {
        //   number: '1',
        //   name: 'Dashboard',
        //   icon: 'fa-solid fa-house',
        //   routerLnk: '/admin/dashboard'
        // },
        {
          number: '2',
          name: 'Users Lists',
          icon: 'fa-solid fa-circle-info',
          routerLnk: '/admin/users-lists'
        },
        {
          number: '3',
          name: 'Genes Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/genes'
        },
        {
          number: '4',
          name: 'Companies Lists',
          icon: 'fa-solid fa-cart-shopping',
          routerLnk: '/admin/companies'
        },
        {
          number: '5',
          name: 'Disease Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/diseases'
        },
        {
          number: '6',
          name: 'Drugs Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/drugs'
        },
        {
          number: '7',
          name: 'MOAS Lists',
          icon: 'fa-solid fa-phone',
          routerLnk: '/admin/moas'
        },
      ]
    } else {
      this.lists = [
        // {
        //   number: '1',
        //   name: 'Dashboard',
        //   icon: 'fa-solid fa-house',
        //   routerLnk: '/admin/dashboard'
        // },
        {
          number: '2',
          name: 'Users Lists',
          icon: 'fa-solid fa-circle-info',
          routerLnk: '/admin/users-lists'
        }
      ]
    }

  }
}

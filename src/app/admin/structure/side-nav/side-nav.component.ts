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
          name: 'Newsletters',
          icon: 'fa-solid fa-circle-info',
          routerLnk: '/admin/newsletters'
        },
        {
          number: '4',
          name: 'Genes Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/genes'
        },
        {
          number: '5',
          name: 'Gene Synonms',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/gene-syns'
        },
        {
          number: '6',
          name: 'Companies Lists',
          icon: 'fa-solid fa-cart-shopping',
          routerLnk: '/admin/companies'
        },
        {
          number: '7',
          name: 'Disease Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/diseases'
        },
        {
          number: '8',
          name: 'Disease Synonms',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/disease-syns'
        },
        {
          number: '9',
          name: 'Drugs Lists',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/drugs'
        },
        {
          number: '10',
          name: 'Drug Synonms',
          icon: 'fa-solid fa-gear',
          routerLnk: '/admin/drug-syns'
        },
        {
          number: '11',
          name: 'MOAS Lists',
          icon: 'fa-solid fa-phone',
          routerLnk: '/admin/moas'
        },
        {
          number: '12',
          name: 'TAS Lists',
          icon: 'fa-solid fa-phone',
          routerLnk: '/admin/tas'
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

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
          name: 'Users List',
          icon: 'fa-solid fa-users',
          routerLnk: '/admin/users-lists'
        },
        {
          number: '3',
          name: 'Newsletters',
          icon: 'fa-solid fa-newspaper',
          routerLnk: '/admin/newsletters'
        },
        {
          number: '4',
          name: 'Genes List',
          icon: 'fa-solid fa-dna',
          routerLnk: '/admin/genes'
        },
        {
          number: '5',
          name: 'Gene Synonms',
          icon: 'fa-solid fa-atom',
          routerLnk: '/admin/gene-syns'
        },
        {
          number: '6',
          name: 'Companies List',
          icon: 'fa-solid fa-building',
          routerLnk: '/admin/companies'
        },
        {
          number: '7',
          name: 'Disease List',
          icon: 'fa-solid fa-disease',
          routerLnk: '/admin/diseases'
        },
        {
          number: '8',
          name: 'Disease Synonms',
          icon: 'fa-solid fa-disease',
          routerLnk: '/admin/disease-syns'
        },
        {
          number: '9',
          name: 'Drugs List',
          icon: 'fa-solid fa-capsules',
          routerLnk: '/admin/drugs'
        },
        {
          number: '10',
          name: 'Drug Synonms',
          icon: 'fa-solid fa-pills',
          routerLnk: '/admin/drug-syns'
        },
        {
          number: '11',
          name: 'MOAs List',
          icon: 'fa-solid fa-location-crosshairs',
          routerLnk: '/admin/moas'
        },
        {
          number: '12',
          name: 'TAS List',
          icon: 'fa-sharp fa-solid fa-square-virus',
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

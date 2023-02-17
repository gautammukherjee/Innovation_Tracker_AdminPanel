import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Input() sideNavStatus: boolean = false;

  lists = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-house',
      routerLnk: '/pages/dashboard'
    },
    {
      number: '2',
      name: 'Users Lists',
      icon: 'fa-solid fa-circle-info',
      routerLnk: '/pages/users-lists'
    },
    {
      number: '3',
      name: 'Genes Lists',
      icon: 'fa-solid fa-gear',
      routerLnk: '/pages/genes'
    },
    {
      number: '4',
      name: 'Companies Lists',
      icon: 'fa-solid fa-cart-shopping',
      routerLnk: '/companies'
    },
    {
      number: '5',
      name: 'Disease Lists',
      icon: 'fa-solid fa-gear',
      routerLnk: '/diseases'
    },
    {
      number: '6',
      name: 'MOAS Lists',
      icon: 'fa-solid fa-phone',
      routerLnk: '/moas'
    },

  ]


  constructor() { }
  ngOnInit(): void {

  }
}

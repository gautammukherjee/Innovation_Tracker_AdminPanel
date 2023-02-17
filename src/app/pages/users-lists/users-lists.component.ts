import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
declare var jQuery: any;
@Component({
  selector: 'app-users-lists',
  templateUrl: './users-lists.component.html',
  styleUrls: ['./users-lists.component.scss'],
  providers: [DatePipe]
})
export class UsersListsComponent implements OnInit {

  result: any = [];
  userRecords: any = [];
  userRecordsDetails: any = [];
  diseaseCheck: any;

  loading = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  modalRef: any;

  constructor(
    private usersService: UsersService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.usersService.getUsersLists().subscribe(
      data => {
        this.result = data;
        this.userRecords = this.result.usersRecords;
        console.log("userRecords: ", this.result);
        this.userRecordsDetails = [];
        this.userRecords.forEach(event => {
          var temps = {};
          temps["name"] = event.name;
          temps["email"] = event.email;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          this.userRecordsDetails.push(temps);
        });

        jQuery('#showUsersLists').bootstrapTable({
          bProcessing: true,
          bServerSide: true,
          pagination: true,
          showColumns: true,
          pageSize: 25,
          striped: true,
          showFilter: true,
          filter: true,
          showExport: true,
          columns: [
            {}, {},
            {
              title: 'Created At',
              field: 'created_at',
              class: 'text-center',
              formatter: function dateFormat(value, row, index) {
                return moment(value).format('DD-MM-YYYY');
              },
            },
          ],
          data: this.userRecordsDetails,
        });

        jQuery('#showUsersLists').bootstrapTable("load", this.userRecordsDetails);

        jQuery('#showUsersLists').on("search.bs.table", function () {
          jQuery('#showUsersLists').bootstrapTable("load", this.userRecordsDetails);
        })
          .on("search.bs.table", function () {
            jQuery('#showUsersLists').bootstrapTable("load", this.userRecordsDetails);
          })
          .on("page-change.bs.table", function () {
            jQuery('#showUsersLists').bootstrapTable("load", this.userRecordsDetails);
          });
      },
      err => {
        console.log(err.message);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );

  }
  title = 'innovation tracker back';
  sideNavStatus: boolean = false;


}

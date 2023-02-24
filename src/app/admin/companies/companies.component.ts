import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../services/companies.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
declare var jQuery: any;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [DatePipe]
})
export class CompaniesComponent implements OnInit {

  result: any = [];
  companiesRecords: any = [];
  companiesRecordsDetails: any = [];

  loading = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  modalRef: any;

  constructor(private companiesService: CompaniesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loading = true;
    this.companiesService.getCompaniesLists().subscribe(
      data => {
        this.result = data;
        this.companiesRecords = this.result.companiesRecords;
        console.log("companiesRecords: ", this.result);
        this.companiesRecordsDetails = [];
        this.companiesRecords.forEach(event => {
          var temps = {};
          temps["name"] = event.name;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          this.companiesRecordsDetails.push(temps);
        });

        jQuery('#showCompaniesLists').bootstrapTable({
          columns: [
            {},
            {
              title: 'Created At',
              field: 'created_at',
              class: 'text-center',
              formatter: function dateFormat(value, row, index) {
                return moment(value).format('DD-MM-YYYY');
              },
            },
          ],
          data: this.companiesRecordsDetails,
        });
        jQuery('#showCompaniesLists').bootstrapTable("load", this.companiesRecordsDetails);
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
}

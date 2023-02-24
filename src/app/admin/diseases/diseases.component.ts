import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiseasesService } from '../../services/diseases.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
declare var jQuery: any;

@Component({
  selector: 'app-diseases',
  templateUrl: './diseases.component.html',
  styleUrls: ['./diseases.component.scss'],
  providers: [DatePipe]
})
export class DiseasesComponent implements OnInit {

  result: any = [];
  diseasesRecords: any = [];
  diseasesRecordsDetails: any = [];

  loading = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  modalRef: any;

  constructor(private diseasesService: DiseasesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loading = true;
    this.diseasesService.getDiseasesLists().subscribe(
      data => {
        this.result = data;
        this.diseasesRecords = this.result.diseasesRecords;
        console.log("diseasesRecords: ", this.result);
        this.diseasesRecordsDetails = [];
        this.diseasesRecords.forEach(event => {
          var temps = {};
          temps["name"] = event.name;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          this.diseasesRecordsDetails.push(temps);
        });

        jQuery('#showDiseasesLists').bootstrapTable({
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
          data: this.diseasesRecordsDetails,
        });
        jQuery('#showDiseasesLists').bootstrapTable("load", this.diseasesRecordsDetails);
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasService } from '../../services/tas.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var jQuery: any;

@Component({
  selector: 'app-tas',
  templateUrl: './tas.component.html',
  styleUrls: ['./tas.component.scss'],
  providers: [DatePipe]
})
export class TasComponent implements OnInit {

  result: any = [];
  tasRecords: any = [];
  tasRecordsDetails: any = [];

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;

  constructor(private tasService: TasService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.formValue = this.formBuilder.group({
      name: [''],
      description: ['']
    });
    this.showAllTasLists();
  }

  showAllTasLists() {
    this.loading = true;
    this.tasService.getTasLists().subscribe(
      data => {
        this.result = data;
        this.tasRecords = this.result.tasRecords;
        let i = 1;
        this.tasRecordsDetails = [];
        this.tasRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.ta_id;
          temps["name"] = event.name;
          temps["description"] = event.description;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          i++;
          this.tasRecordsDetails.push(temps);
        });

        jQuery('#showTasLists').bootstrapTable({
          data: this.tasRecordsDetails,
        });
        jQuery('#showTasLists').bootstrapTable("load", this.tasRecordsDetails);
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

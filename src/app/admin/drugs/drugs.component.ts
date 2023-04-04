import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrugsService } from '../../services/drugs.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DrugsModel } from './drugs.model';
declare var jQuery: any;

@Component({
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrls: ['./drugs.component.scss'],
  providers: [DatePipe]
})
export class DrugsComponent implements OnInit {

  result: any = [];
  drugsRecords: any = [];
  drugsTypeRecords: any = [];
  drugsRecordsDetails: any = [];
  private addFormDrugModal: any;
  private modalRef: any;
  @ViewChild('addFormDrugModal', { static: false }) addFormDrugModal_edit: ElementRef;

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
  drugModelObj: DrugsModel = new DrugsModel();

  constructor(private drugsService: DrugsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {
    this.formValue = this.formBuilder.group({
      name: [''],
      description: [''],

    });
  }

  ngOnInit(): void {
    this.showAllDrugsLists();
  }

  showAllDrugsLists() {
    this.loading = true;
    this.drugsService.getBackendDrugsLists().subscribe(
      data => {
        this.result = data;
        this.drugsRecords = this.result.drugsRecords;
        console.log("drugsRecords1: ", this.drugsRecords);
        this.drugsRecordsDetails = [];
        let i = 1;
        this.drugsRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.drug_id;
          temps["name"] = event.drug_name;
          temps["description"] = event.description;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          i++;
          this.drugsRecordsDetails.push(temps);
        });

        jQuery('#showDrugsLists').bootstrapTable({
          data: this.drugsRecordsDetails,
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("Are you sure to delete? Your user id will be recorded in database.");
              if (result) {
                this.deleteDrugs(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormDrugModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.drugModelObj.drug_id = field.id;
              this.formValue.controls['name'].setValue(field.name);
              this.formValue.controls['description'].setValue(field.description);
            }
          }.bind(this),
        });
        jQuery('#showDrugsLists').bootstrapTable("load", this.drugsRecordsDetails);
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

  addDrugsPopup() {
    this.modalRef = this.modalService.open(this.addFormDrugModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  closePopup() {
    this.addFormDrugModal.close();
  }

  addDrugsSubmit() {
    this.loadingAdd = true;
    this.drugModelObj.name = this.formValue.value.name;
    this.drugModelObj.description = this.formValue.value.description;

    this.drugsService.addDrugs(this.drugModelObj)
      .subscribe(res => {
        // alert("Drugs Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.showAllDrugsLists();
      },
        err => {
          console.log(err.message);
          this.loadingAdd = false;
        },
        () => {
          this.loadingAdd = false;
        }
      );
  }

  updateDrugsSubmit() {
    this.loadingEdit = true;
    this.drugModelObj.name = this.formValue.value.name;
    this.drugModelObj.description = this.formValue.value.description;

    this.drugsService.updateDrugs(this.drugModelObj, this.drugModelObj.drug_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormDrugModal.close();
      this.formValue.reset();
      this.showAllDrugsLists();
    },
      err => {
        console.log(err.message);
        this.loadingEdit = false;
      },
      () => {
        this.loadingEdit = false;
      }
    );
  }

  deleteDrugs(event: any) {
    this.loadingDel = true;
    return this.drugsService.deleteDrugs(event).subscribe(res => {
      this.showAllDrugsLists();
      //window.location.reload();
    },
      err => {
        console.log(err.message);
        this.loadingDel = false;
      },
      () => {
        this.loadingDel = false;
      }
    );
  }


}

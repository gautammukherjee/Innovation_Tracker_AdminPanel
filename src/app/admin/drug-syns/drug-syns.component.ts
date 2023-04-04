import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrugsService } from '../../services/drugs.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DrugSynsModel } from './drug-syns.model';
declare var jQuery: any;

@Component({
  selector: 'app-drug-syns',
  templateUrl: './drug-syns.component.html',
  styleUrls: ['./drug-syns.component.scss'],
  providers: [DatePipe]
})
export class DrugSynsComponent implements OnInit {

  result: any = [];

  drugsRecords: any = [];
  drugsRecordsDetails: any = [];
  allDrugsLists: any = [];

  private addFormDrugModal: any;
  private modalRef: any;
  @ViewChild('addFormDrugModal', { static: false }) addFormDrugModal_edit: ElementRef;

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  loadingDLists = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;
  drugSynsModelObj: DrugSynsModel = new DrugSynsModel();

  constructor(private drugsService: DrugsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.formValue = this.formBuilder.group({
      drug_id: [''],
      name: ['']
    });
  }

  ngOnInit(): void {

    this.loadingDLists = true;
    //show the company type
    this.drugsService.getBackendDrugsLists().subscribe(
      data => {
        this.result = data;
        this.allDrugsLists = this.result.drugsRecords;
        // console.log("allDrugsLists: ", this.allDrugsLists);
      },
      err => {
        console.log(err.message);
        this.loadingDLists = false;
      },
      () => {
        this.loadingDLists = false;
      });

    this.showAllDrugsLists();
  }

  showAllDrugsLists() {
    this.loading = true;
    this.drugsService.getDrugSynLists().subscribe(
      data => {
        this.result = data;
        this.drugsRecords = this.result.drugsRecords;
        let i = 1;
        this.drugsRecordsDetails = [];
        this.drugsRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.drug_syn_id;
          temps["name"] = event.name;
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
                this.deleteDrugSyn(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormDrugModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.drugSynsModelObj.drug_syn_id = field.id;
              this.formValue.controls['drug_id'].setValue(field.drug_id);
              this.formValue.controls['name'].setValue(field.name);
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
    this.drugSynsModelObj.drug_id = this.formValue.value.drug_id;
    this.drugSynsModelObj.name = this.formValue.value.name;

    this.drugsService.addDrugSyn(this.drugSynsModelObj)
      .subscribe(res => {
        // alert("Companies Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormCompanyModal.close();
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
    this.drugSynsModelObj.drug_id = this.formValue.value.drug_id;
    this.drugSynsModelObj.name = this.formValue.value.name;

    this.drugsService.updateDrugSyn(this.drugSynsModelObj, this.drugSynsModelObj.drug_syn_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
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

  deleteDrugSyn(event: any) {
    this.loadingDel = true;
    return this.drugsService.deleteDrugSyn(event).subscribe(res => {
      this.showAllDrugsLists();
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
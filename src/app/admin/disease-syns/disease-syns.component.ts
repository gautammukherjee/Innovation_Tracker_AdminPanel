import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiseasesService } from '../../services/diseases.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiseaseSynsModel } from './disease-syns.model';
declare var jQuery: any;

@Component({
  selector: 'app-disease-syns',
  templateUrl: './disease-syns.component.html',
  styleUrls: ['./disease-syns.component.scss'],
  providers: [DatePipe]
})
export class DiseaseSynsComponent implements OnInit {

  result: any = [];

  diseasesRecords: any = [];
  diseasesRecordsDetails: any = [];
  allDiseasesLists: any = [];

  private addFormDiseaseModal: any;
  private modalRef: any;
  @ViewChild('addFormDiseaseModal', { static: false }) addFormDiseaseModal_edit: ElementRef;

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
  diseaseSynsModelObj: DiseaseSynsModel = new DiseaseSynsModel();

  constructor(private diseasesService: DiseasesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.formValue = this.formBuilder.group({
      disease_id: [''],
      name: ['']
    });
  }

  ngOnInit(): void {

    this.loadingDLists = true;
    //show the company type
    this.diseasesService.getDiseasesLists().subscribe(
      data => {
        this.result = data;
        this.allDiseasesLists = this.result.diseasesRecords;
        // console.log("allDiseasesLists: ", this.allDiseasesLists);
      },
      err => {
        console.log(err.message);
        this.loadingDLists = false;
      },
      () => {
        this.loadingDLists = false;
      });

    this.showAllDiseasesLists();
  }

  showAllDiseasesLists() {
    this.loading = true;
    this.diseasesService.getDiseaseSynLists().subscribe(
      data => {
        this.result = data;
        this.diseasesRecords = this.result.diseasesRecords;
        let i = 1;
        this.diseasesRecordsDetails = [];
        this.diseasesRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.disease_syn_id;
          temps["name"] = event.name;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          i++;
          this.diseasesRecordsDetails.push(temps);
        });

        jQuery('#showDiseasesLists').bootstrapTable({
          data: this.diseasesRecordsDetails,
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("are you want to delete this Disease Synonym?");
              if (result) {
                this.deleteDiseaseSyn(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormDiseaseModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.diseaseSynsModelObj.disease_syn_id = field.id;
              this.formValue.controls['disease_id'].setValue(field.disease_id);
              this.formValue.controls['name'].setValue(field.name);
            }
          }.bind(this),
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

  addDiseasesPopup() {
    this.modalRef = this.modalService.open(this.addFormDiseaseModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  closePopup() {
    this.addFormDiseaseModal.close();
  }

  addDiseasesSubmit() {
    this.loadingAdd = true;
    this.diseaseSynsModelObj.disease_id = this.formValue.value.disease_id;
    this.diseaseSynsModelObj.name = this.formValue.value.name;

    this.diseasesService.addDiseaseSyn(this.diseaseSynsModelObj)
      .subscribe(res => {
        // alert("Companies Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormCompanyModal.close();
        this.formValue.reset();
        this.showAllDiseasesLists();
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

  updateDiseasesSubmit() {
    this.loadingEdit = true;
    this.diseaseSynsModelObj.disease_id = this.formValue.value.disease_id;
    this.diseaseSynsModelObj.name = this.formValue.value.name;

    this.diseasesService.updateDiseaseSyn(this.diseaseSynsModelObj, this.diseaseSynsModelObj.disease_syn_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      this.formValue.reset();
      this.showAllDiseasesLists();
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

  deleteDiseaseSyn(event: any) {
    this.loadingDel = true;
    return this.diseasesService.deleteDiseaseSyn(event).subscribe(res => {
      this.showAllDiseasesLists();
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

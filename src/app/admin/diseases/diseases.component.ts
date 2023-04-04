import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiseasesService } from '../../services/diseases.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiseasesModel } from './diseases.model';
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

  private addFormDiseaseModal: any;
  private modalRef: any;
  @ViewChild('addFormDiseaseModal', { static: false }) addFormDiseaseModal_edit: ElementRef;

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
  diseaseModelObj: DiseasesModel = new DiseasesModel();

  constructor(private diseasesService: DiseasesService,
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
    this.showAllDiseasesLists();
  }

  showAllDiseasesLists() {
    this.loading = true;
    this.diseasesService.getBackendDiseasesLists().subscribe(
      data => {
        this.result = data;
        this.diseasesRecords = this.result.diseasesRecords;
        let i = 1;
        this.diseasesRecordsDetails = [];
        this.diseasesRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.disease_id;
          temps["name"] = event.disease_name;
          temps["description"] = event.description;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          i++;
          this.diseasesRecordsDetails.push(temps);
        });

        jQuery('#showDiseasesLists').bootstrapTable({
          columns: [
            {}, {}, {}, {},
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
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("Are you sure to delete? Your user id will be recorded in database.");
              if (result) {
                this.deleteDiseases(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormDiseaseModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.diseaseModelObj.disease_id = field.id;
              this.formValue.controls['name'].setValue(field.name);
              this.formValue.controls['description'].setValue(field.description);
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
    this.diseaseModelObj.name = this.formValue.value.name;
    this.diseaseModelObj.description = this.formValue.value.description;

    this.diseasesService.addDiseases(this.diseaseModelObj)
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
    this.diseaseModelObj.name = this.formValue.value.name;
    this.diseaseModelObj.description = this.formValue.value.description;

    this.diseasesService.updateDiseases(this.diseaseModelObj, this.diseaseModelObj.disease_id).subscribe(res => {
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

  deleteDiseases(event: any) {
    this.loadingDel = true;
    return this.diseasesService.deleteDiseases(event).subscribe(res => {
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

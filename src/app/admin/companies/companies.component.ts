import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../services/companies.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesModel } from './companies.model';
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
  companiesTypeRecords: any = [];
  companiesRecordsDetails: any = [];
  private addFormCompanyModal: any;
  private modalRef: any;
  @ViewChild('addFormCompanyModal', { static: false }) addFormCompanyModal_edit: ElementRef;

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  loadingCType = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;
  companyModelObj: CompaniesModel = new CompaniesModel();

  constructor(private companiesService: CompaniesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {
    this.formValue = this.formBuilder.group({
      company_type_id: [''],
      name: [''],
      description: [''],

    });
  }

  ngOnInit(): void {

    this.loadingCType = true;
    //show the company type
    this.companiesService.getCompaniesTypes().subscribe(
      data => {
        this.result = data;
        this.companiesTypeRecords = this.result.companiesTypeRecords;
        console.log("companiesTypeRecords2: ", this.companiesTypeRecords);
      },
      err => {
        console.log(err.message);
        this.loadingCType = false;
      },
      () => {
        this.loadingCType = false;
      });

    this.showAllCompaniesLists();
  }

  showAllCompaniesLists() {
    this.loading = true;
    this.companiesService.getBackendCompaniesLists().subscribe(
      data => {
        this.result = data;
        this.companiesRecords = this.result.companiesRecords;
        console.log("companiesRecords1: ", this.companiesRecords);
        this.companiesRecordsDetails = [];
        let i = 1;
        this.companiesRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.company_id;
          temps["name"] = event.company_name;
          temps["description"] = event.description;
          temps["company_type_id"] = event.company_type_id;
          temps["ct_name"] = event.ct_name;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          i++;
          this.companiesRecordsDetails.push(temps);
        });

        jQuery('#showCompaniesLists').bootstrapTable({
          columns: [
            {}, {}, {}, {}, {}, {},
            {
              title: 'Created At',
              field: 'created_at',
              class: 'text-center',
              formatter: function dateFormat(value, row, index) {
                return moment(value).format('DD-MM-YYYY');
              },
            },
            {}, {}
          ],
          data: this.companiesRecordsDetails,
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("are you want to delete this Company?");
              if (result) {
                this.deleteCompanies(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormCompanyModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.companyModelObj.company_id = field.id;
              this.formValue.controls['company_type_id'].setValue(field.company_type_id);
              this.formValue.controls['name'].setValue(field.name);
              this.formValue.controls['description'].setValue(field.description);


            }
          }.bind(this),
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

  addCompaniesPopup() {
    this.modalRef = this.modalService.open(this.addFormCompanyModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;

    this.loadingCType = true;
    //show the company type
    this.companiesService.getCompaniesTypes().subscribe(
      data => {
        this.result = data;
        this.companiesTypeRecords = this.result.companiesTypeRecords;
        // console.log("companiesTypeRecords1: ", this.companiesTypeRecords);
      },
      err => {
        console.log(err.message);
        this.loadingCType = false;
      },
      () => {
        this.loadingCType = false;
      });
  }

  closePopup() {
    this.addFormCompanyModal.close();
  }

  addCompaniesSubmit() {
    this.loadingAdd = true;
    this.companyModelObj.company_type_id = this.formValue.value.company_type_id;
    this.companyModelObj.name = this.formValue.value.name;
    this.companyModelObj.description = this.formValue.value.description;

    this.companiesService.addCompanies(this.companyModelObj)
      .subscribe(res => {
        // alert("Companies Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormCompanyModal.close();
        this.formValue.reset();
        this.showAllCompaniesLists();
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

  updateCompaniesSubmit() {
    this.loadingEdit = true;
    this.companyModelObj.company_type_id = this.formValue.value.company_type_id;
    this.companyModelObj.name = this.formValue.value.name;
    this.companyModelObj.description = this.formValue.value.description;

    this.companiesService.updateCompanies(this.companyModelObj, this.companyModelObj.company_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormCompanyModal.close();
      this.formValue.reset();
      this.showAllCompaniesLists();
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

  deleteCompanies(event: any) {
    this.loadingDel = true;
    return this.companiesService.deleteCompanies(event).subscribe(res => {
      this.showAllCompaniesLists();
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoasService } from '../../services/moas.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MoasModel } from './moas.model';
declare var jQuery: any;

@Component({
  selector: 'app-moas',
  templateUrl: './moas.component.html',
  styleUrls: ['./moas.component.scss'],
  providers: [DatePipe]
})
export class MoasComponent {

  result: any = [];
  moasRecords: any = [];
  moasRecordsDetails: any = [];
  private addFormMoaModal: any;
  private modalRef: any;
  @ViewChild('addFormMoaModal', { static: false }) addFormMoaModal_edit: ElementRef;

  loading = false;
  loadingAdd = false;

  loadingEdit = false;

  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;
  moaModelObj: MoasModel = new MoasModel();
  
  constructor(
    private moasService: MoasService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ){

  }
  
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: [''],
      description: ['']
    });
    this.showAllMoasLists();
  }

  showAllMoasLists(){
    
    this.loading = true;
    this.moasService.getMoasLists().subscribe(
      data => {
        this.result = data;
        this.moasRecords = this.result.moasRecords;
        console.log("moasRecords: ", this.result);
        this.moasRecordsDetails = [];
        this.moasRecords.forEach(event => {
          var temps = {};
          temps["id"] = event.moa_id;
          temps["name"] = event.name;
          temps["description"] = event.description;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          this.moasRecordsDetails.push(temps);
        });

        jQuery('#showMoasLists').bootstrapTable({
          columns: [
            {}, {}, {},
            {
              title: 'Created At',
              field: 'created_at',
              class: 'text-center',
              formatter: function dateFormat(value, row, index) {
                return moment(value).format('DD-MM-YYYY');
              },
            },


          ],
          data: this.moasRecordsDetails,
          onClickRow: function (field, row, $element) {
            // console.log("field12: ", field);

            //delete
            if ($element == "delete") {
              var result = confirm("are you want to delete this MOAs?");
              if (result) {
                this.deleteMoas(field.id);
              }
            }

            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormMoaModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.moaModelObj.moa_id = field.id;
              this.formValue.controls['name'].setValue(field.name);
              this.formValue.controls['description'].setValue(field.symbol);
            }
          }.bind(this),
        });
        jQuery('#showMoasLists').bootstrapTable("load", this.moasRecordsDetails);
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

  addMoasPopup(){
    this.modalRef = this.modalService.open(this.addFormMoaModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  closePopup() {
    this.addFormMoaModal.close();
  }
  
  addMoasSubmit() {
    
    this.loadingAdd = true;
    this.moaModelObj.name = this.formValue.value.name;
    this.moaModelObj.description = this.formValue.value.description;

    this.moasService.addMoas(this.moaModelObj)
      .subscribe(res => {
        // alert("MOAs Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormMoaModal.close();
        this.formValue.reset();
        this.showAllMoasLists();
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

  updateMoasSubmit(){
    this.loadingEdit = true;
    this.moaModelObj.name = this.formValue.value.name;
    this.moaModelObj.description = this.formValue.value.description;

    this.moasService.updateMoas(this.moaModelObj, this.moaModelObj.moa_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormGeneModal.close();
      this.formValue.reset();
      this.showAllMoasLists();
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

  deleteMoas(event: any) {
    console.log("event", event);
    this.loading = true;
    return this.moasService.deleteMoas(event).subscribe(res => {
      this.showAllMoasLists();
      //window.location.reload();
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

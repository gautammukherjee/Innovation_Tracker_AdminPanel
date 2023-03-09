import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenesService } from '../../services/genes.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneSynsModel } from './gene-syns.model';
declare var jQuery: any;

@Component({
  selector: 'app-gene-syns',
  templateUrl: './gene-syns.component.html',
  styleUrls: ['./gene-syns.component.scss'],
  providers: [DatePipe]
})
export class GeneSynsComponent implements OnInit {

  result: any = [];

  genesRecords: any = [];
  genesRecordsDetails: any = [];
  allGenesLists: any = [];

  private addFormGeneModal: any;
  private modalRef: any;
  @ViewChild('addFormGeneModal', { static: false }) addFormGeneModal_edit: ElementRef;

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
  geneSynsModelObj: GeneSynsModel = new GeneSynsModel();

  constructor(private genesService: GenesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.formValue = this.formBuilder.group({
      gene_id: [''],
      name: ['']
    });
  }

  ngOnInit(): void {

    this.loadingDLists = true;
    //show the company type
    this.genesService.getGenesLists().subscribe(
      data => {
        this.result = data;
        this.allGenesLists = this.result.genesRecords;
        // console.log("allGenesLists: ", this.allGenesLists);
      },
      err => {
        console.log(err.message);
        this.loadingDLists = false;
      },
      () => {
        this.loadingDLists = false;
      });

    this.showAllGenesLists();
  }

  showAllGenesLists() {
    this.loading = true;
    this.genesService.getGeneSynLists().subscribe(
      data => {
        this.result = data;
        this.genesRecords = this.result.genesRecords;
        let i = 1;
        this.genesRecordsDetails = [];
        this.genesRecords.forEach(event => {
          var temps = {};
          temps["sr_no"] = i;
          temps["id"] = event.gene_syn_id;
          temps["name"] = event.name;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          i++;
          this.genesRecordsDetails.push(temps);
        });

        jQuery('#showGenesLists').bootstrapTable({
          data: this.genesRecordsDetails,
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("are you want to delete this Gene Synonym?");
              if (result) {
                this.deleteGeneSyn(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormGeneModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.geneSynsModelObj.gene_syn_id = field.id;
              this.formValue.controls['gene_id'].setValue(field.gene_id);
              this.formValue.controls['name'].setValue(field.name);
            }
          }.bind(this),
        });
        jQuery('#showGenesLists').bootstrapTable("load", this.genesRecordsDetails);
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

  addGenesPopup() {
    this.modalRef = this.modalService.open(this.addFormGeneModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  closePopup() {
    this.addFormGeneModal.close();
  }

  addGenesSubmit() {
    this.loadingAdd = true;
    this.geneSynsModelObj.gene_id = this.formValue.value.gene_id;
    this.geneSynsModelObj.name = this.formValue.value.name;

    this.genesService.addGeneSyn(this.geneSynsModelObj)
      .subscribe(res => {
        // alert("Companies Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormCompanyModal.close();
        this.formValue.reset();
        this.showAllGenesLists();
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

  updateGenesSubmit() {
    this.loadingEdit = true;
    this.geneSynsModelObj.gene_id = this.formValue.value.gene_id;
    this.geneSynsModelObj.name = this.formValue.value.name;

    this.genesService.updateGeneSyn(this.geneSynsModelObj, this.geneSynsModelObj.gene_syn_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      this.formValue.reset();
      this.showAllGenesLists();
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

  deleteGeneSyn(event: any) {
    this.loadingDel = true;
    return this.genesService.deleteGeneSyn(event).subscribe(res => {
      this.showAllGenesLists();
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
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenesService } from '../../services/genes.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenesModel } from './genes.model';
declare var jQuery: any;

@Component({
  selector: 'app-genes',
  templateUrl: './genes.component.html',
  styleUrls: ['./genes.component.scss'],
  providers: [DatePipe]
})
export class GenesComponent implements OnInit {
  result: any = [];
  genesRecords: any = [];
  genesRecordsDetails: any = [];
  private addFormGeneModal: any;
  private modalRef: any;
  @ViewChild('addFormGeneModal', { static: false }) addFormGeneModal_edit: ElementRef;

  loading = false;
  loadingAdd = false;
  loadingDelete = false;
  loadingEdit = false;

  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;
  geneModelObj: GenesModel = new GenesModel();

  constructor(private genesService: GenesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: [''],
      symbol: ['']
    });
    this.showAllGenesLists();
  }

  showAllGenesLists() {
    this.loading = true;
    this.genesService.getGenesLists().subscribe(
      data => {
        this.result = data;
        this.genesRecords = this.result.genesRecords;
        console.log("genesRecords: ", this.result);
        this.genesRecordsDetails = [];
        this.genesRecords.forEach(event => {
          var temps = {};
          temps["id"] = event.gene_id;
          temps["name"] = event.name;
          temps["symbol"] = event.symbol;
          temps["created_at"] = this.datePipe.transform(event.created_at, 'yyyy-MM-dd');
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button> &nbsp;";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          this.genesRecordsDetails.push(temps);
        });

        jQuery('#showGenesLists').bootstrapTable({
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
            {},
            {}
          ],
          data: this.genesRecordsDetails,
        });

        jQuery("#showGenesLists").on("click-cell.bs.table", function (e, field, value, row, $el) {
          if (field == "delete") {
            console.log("chk2: ", field);
            var result = confirm("are you want to delete this genes?");
            if (result) {
              this.funDeleteGenes(row.id);
            }
          }
          if (field == "edit") {
            this.modalRef = this.modalService.open(this.addFormGeneModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
            // this.modalRef = this.modalService.open(this.edit_genes_popup_event, { size: 'lg', keyboard: false, backdrop: 'static' });

            this.showAdd = false;
            this.showUpdate = true;
            this.geneModelObj.gene_id = row.id;
            this.formValue.controls['name'].setValue(row.name);
            this.formValue.controls['symbol'].setValue(row.symbol);
          }
        }.bind(this));
        jQuery('#showGenesLists').bootstrapTable("load", this.genesRecordsDetails);
      },
      err => {
        console.log(err.message);
        this.loading = false;
      },
      () => {
        jQuery('#showGenesLists').bootstrapTable("load", this.genesRecordsDetails);
        this.loading = false;
      }
    );
  }

  addGenes(evt, addFormGeneModal) {
    this.modalRef = this.modalService.open(this.addFormGeneModal_edit, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  closePopup() {
    this.addFormGeneModal.close();
  }

  addGenesValues() {
    this.loadingAdd = true;
    this.geneModelObj.name = this.formValue.value.name;
    this.geneModelObj.symbol = this.formValue.value.symbol;

    this.genesService.addGenes(this.geneModelObj)
      .subscribe(res => {
        // alert("Genes Added Successfully");

        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormGeneModal.close();
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

  uodateGenesValues() {
    this.loadingEdit = true;
    this.geneModelObj.name = this.formValue.value.name;
    this.geneModelObj.symbol = this.formValue.value.symbol;

    this.genesService.updateGenes(this.geneModelObj, this.geneModelObj.gene_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormGeneModal.close();
      this.formValue.reset();
      //this.showAllGenesLists();
      //jQuery('#showGenesLists').bootstrapTable("load", this.genesRecordsDetails);
      // this._router.navigate(['/admin/user-lists'], { relativeTo: this._activatedRoute });
      // this._router.navigate(['/admin/users-lists']);
      window.location.reload();
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

  funDeleteGenes(event: any) {
    this.loadingDelete = true;
    return this.genesService.deleteGenes(event).subscribe(res => {
      this.showAllGenesLists();
    },
      err => {
        console.log(err.message);
        this.loadingDelete = false;
      },
      () => {
        this.loadingDelete = false;
      }
    );
  }



}

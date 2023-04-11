import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { ApproveNewssModel } from './approve_newss.model';
import { TasService } from '../../services/tas.service';
import { DiseasesService } from '../../services/diseases.service';
import { DrugsService } from '../../services/drugs.service';
import { CompaniesService } from '../../services/companies.service';
import { GenesService } from '../../services/genes.service';
import { MoasService } from '../../services/moas.service';
declare var jQuery: any;

@Component({
  selector: 'app-newsletters',
  templateUrl: './approve_news.component.html',
  styleUrls: ['./approve_news.component.scss'],
  providers: [DatePipe]
})
export class ApproveNewsComponent implements OnInit {
  result: any = [];
  newsletterRecords: any = [];
  newsletterRecordsDetails: any = [];
  newsCommentsRecords: any = [];
  private showCommentsNewsletterModal: any;
  private showAddSuggestNewsletterModal: any;
  private showRelationsNewsletterModal: any;
  private showRelationsNewsletterModalDisease: any;
  private showRelationsNewsletterModalDrug: any;
  private showRelationsNewsletterModalCompany: any;
  private showRelationsNewsletterModalGene: any;
  private showRelationsNewsletterModalMoa: any;

  private modalRef: any;
  @ViewChild('showCommentsNewsletterModal', { static: false }) showCommentsNewsletterModal_active: ElementRef;
  @ViewChild('showAddSuggestNewsletterModal', { static: false }) showAddSuggestNewsletterModal_active: ElementRef;

  @ViewChild('showRelationsNewsletterModal', { static: false }) showRelationsNewsletterModal_active: ElementRef;
  @ViewChild('showRelationsNewsletterModalDisease', { static: false }) showRelationsNewsletterModalDisease_active: ElementRef;
  @ViewChild('showRelationsNewsletterModalDrug', { static: false }) showRelationsNewsletterModalDrug_active: ElementRef;
  @ViewChild('showRelationsNewsletterModalCompany', { static: false }) showRelationsNewsletterModalCompany_active: ElementRef;
  @ViewChild('showRelationsNewsletterModalGene', { static: false }) showRelationsNewsletterModalGene_active: ElementRef;
  @ViewChild('showRelationsNewsletterModalMoa', { static: false }) showRelationsNewsletterModalMoa_active: ElementRef;

  loading: boolean = false;
  loadingComment: boolean = false;

  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];

  //for TA variables
  loadingRelations: boolean = false;
  loadingTa: boolean = false;
  loadingExistTa: boolean = false;
  showExistTA: boolean = false;
  tasRecords: any = [];
  tasExistRecords: any = [];
  saveMessage: boolean = false;

  //for disease variables
  loadingRelationsDisease: boolean = false;
  loadingDisease: boolean = false;
  loadingExistDisease: boolean = false;
  showExistDisease: boolean = false;
  diseaseRecords: any = [];
  diseaseExistRecords: any = [];
  saveMessageDisease: boolean = false;

  //for drug variables
  loadingRelationsDrug: boolean = false;
  loadingDrug: boolean = false;
  loadingExistDrug: boolean = false;
  showExistDrug: boolean = false;
  drugRecords: any = [];
  drugExistRecords: any = [];
  saveMessageDrug: boolean = false;

  //for company variables
  loadingRelationsCompany: boolean = false;
  loadingCompany: boolean = false;
  loadingExistCompany: boolean = false;
  showExistCompany: boolean = false;
  companyRecords: any = [];
  companyExistRecords: any = [];
  saveMessageCompany: boolean = false;

  //for Gene variables
  loadingRelationsGene: boolean = false;
  loadingGene: boolean = false;
  loadingExistGene: boolean = false;
  showExistGene: boolean = false;
  geneRecords: any = [];
  geneExistRecords: any = [];
  saveMessageGene: boolean = false;

  //for MOA variables
  loadingRelationsMoa: boolean = false;
  loadingMoa: boolean = false;
  loadingExistMoa: boolean = false;
  showExistMoa: boolean = false;
  moaRecords: any = [];
  moaExistRecords: any = [];
  saveMessageMoa: boolean = false;

  showAdd !: boolean;
  showUpdate !: boolean;
  showUpdateDate: Date;
  userType: any;
  newsHeading: any = '';
  public selectedTa: Array<object> = [];
  public selectedDisease: Array<object> = [];
  public selectedDrug: Array<object> = [];
  public selectedCompany: Array<object> = [];
  public selectedGene: Array<object> = [];
  public selectedMoa: Array<object> = [];

  formValue !: FormGroup;
  formValueDisease !: FormGroup;
  formValueDrug !: FormGroup;
  formValueCompany !: FormGroup;
  formValueGene !: FormGroup;
  formValueMoa !: FormGroup;
  newssModelObj: ApproveNewssModel = new ApproveNewssModel();

  constructor(private tasService: TasService,
    private diseasesService: DiseasesService,
    private drugsService: DrugsService,
    private companiesService: CompaniesService,
    private genesService: GenesService,
    private moasService: MoasService,
    private newsService: NewsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.userType = JSON.parse(sessionStorage.getItem('currentUser'));
    // console.log("utype: ", this.userType);

    this.formValue = this.formBuilder.group({
      ta_ids: this.formBuilder.array([], [Validators.required]),
    })
    this.formValueDisease = this.formBuilder.group({
      di_ids: this.formBuilder.array([], [Validators.required])
    })
    this.formValueDrug = this.formBuilder.group({
      drug_ids: this.formBuilder.array([], [Validators.required])
    })
    this.formValueCompany = this.formBuilder.group({
      company_ids: this.formBuilder.array([], [Validators.required])
    })
    this.formValueGene = this.formBuilder.group({
      gene_ids: this.formBuilder.array([], [Validators.required])
    })
    this.formValueMoa = this.formBuilder.group({
      moa_ids: this.formBuilder.array([], [Validators.required])
    })
  }

  ngOnInit(): void {
    this.publication_date = (new Date()).getMonth() + 1 + "-" + (new Date()).getDate() + "-" + (new Date()).getFullYear();
    console.log("this.publication_date: ", this.publication_date);
    this.showAllNewsletterLists();
  }

  showAllNewsletterLists() {
    this.loading = true;
    this.newsService.getApproveNewsletterLists().subscribe(
      data => {
        this.result = data;
        this.newsletterRecords = this.result.newsletterRecords;
        console.log("newsletterRecords: ", this.newsletterRecords);
        this.newsletterRecordsDetails = [];
        let i = 1;
        this.newsletterRecords.forEach(event => {
          var temps = {};
          //temps["sr_no"] = i;
          temps["id"] = event.news_id;
          temps["user_name"] = event.user_name;
          temps["publication_date"] = this.datePipe.transform(event.publication_date, 'dd/MM/yyyy');
          temps["title"] = (event.title.length > 100) ? (event.title.substring(0, 100) + "...") : (event.title);
          temps["description"] = (event.description.length > 200) ? (event.description.substring(0, 200) + "...") : (event.description);
          temps["url_title"] = (event.url != null) ? ('<a href="' + event.url + '" target="_blank">link</a>') : '-';
          temps["url"] = event.url;
          temps["show_comments"] = "<button class='btn btn-sm btn-primary'>Comments</button>";
          temps["add_suggestion"] = "<button class='btn btn-sm btn-primary'>Suggest</button>";

          temps["show_relations"] = "<ul id='meta_data' style='padding-left:0px;overflow: auto;max-height: 90px;'><li style='display:block;'><input type='radio' name='metadata' value ='ta'/>&nbsp;Attach TA </li><li style='display:block;'><input type='radio' name = 'metadata' value = 'disease' />&nbsp;Attach Disease </li><li style='display:block;'><input type='radio' name = 'metadata' value = 'drug' />&nbsp;Attach Drug</li><li style='display:block;'><input type='radio' name = 'metadata' value = 'company' />&nbsp;Attach Company</li><li style='display:block;'><input type='radio' name = 'metadata' value = 'gene' />&nbsp;Attach Gene</li><li style='display:block;'><input type='radio' name = 'metadata' value = 'moa' />&nbsp;Attach MOA</li></ul>";
          // temps["show_relations"] = "<select name='metadata_choose' class='form-control'><option value='ta'>Metadata TA</option><option value='disease'>Metadata Disease</option><option value='company'>Metadata Company</option><option value='drug'>Metadata Drug</option><option value='gene'>Metadata Gene</option><option value='moa'>Metadata MOA</option></select>";
          //temps["show_relations"] = "<div class='btn-group'><button class='btn btn-danger btn-sm dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>High</button><div class='dropdown-menu'><a id='mediumpriority' class='dropdown-item' value='medium'>Medium</a><a class='dropdown-item' value='low'>Low</a></div></div>";

          // if (this.userType.user_type_id == 1 || this.userType.user_type_id == 3) {
          //   temps["approve"] = "<button class='btn btn-sm btn-primary'>Approve</button>";
          // }
          i++;
          this.newsletterRecordsDetails.push(temps);
        });

        jQuery('#showNewsletterLists').bootstrapTable({
          data: this.newsletterRecordsDetails,

          columns: [
            { width: '5%' }, { width: '15%' }, { width: '20%' }, { width: '10%' }, { width: '10%' }, { width: '10%' },
            {
              width: '30%'
            },
          ],
          onClickRow: function (field, row, $element) {
            // Show all the comments

            this.newsHeading = field.title;

            if ($element == "show_comments") {
              this.newsHeading = field.title;
              this.modalRef = this.modalService.open(this.showCommentsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showCommentsNewsletter(field.id);
            }

            ///////////// Add Suggestion ////////////
            if ($element == "add_suggestion") {
              this.modalRef = this.modalService.open(this.showAddSuggestNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });

              this.newssModelObj.news_id = field.id;
              this.addSuggestion(field.id, field.description);
            }

            let metatagVal = jQuery('input:radio:checked').val();
            // let metatagVal = jQuery('select[name="metadata_choose"] option:selected').val();
            // jQuery('select[name="metadata_choose"]').on('change', function () {
            //   alert(jQuery(this).val());
            // });
            console.log("metatagVal", metatagVal);

            //TA Show
            if ($element == "show_relations" && metatagVal == 'ta') {
              this.showExistTA = false;
              this.saveMessage = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //TA lists
              this.newssModelObj.news_id = field.id;
              this.showListedTA(field.id);
              this.showExistTARlt(field.id);
            }

            //Disease Show
            if ($element == "show_relations" && metatagVal == 'disease') {
              this.showExistDisease = false;
              this.saveMessageDisease = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModalDisease_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //Disease lists
              this.newssModelObj.news_id = field.id;
              this.showListedDisease(field.id);
              this.showExistDiseaseRlt(field.id);
            }

            //Drug Show
            if ($element == "show_relations" && metatagVal == 'drug') {
              this.showExistDrug = false;
              this.saveMessageDrug = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModalDrug_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //Drug lists
              this.newssModelObj.news_id = field.id;
              this.showListedDrug(field.id);
              this.showExistDrugRlt(field.id);
            }

            //Company Show
            if ($element == "show_relations" && metatagVal == 'company') {
              this.showExistCompany = false;
              this.saveMessageCompany = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModalCompany_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //Company lists
              this.newssModelObj.news_id = field.id;
              this.showListedCompany(field.id);
              this.showExistCompanyRlt(field.id);
            }

            //Gene Show
            if ($element == "show_relations" && metatagVal == 'gene') {
              this.showExistGene = false;
              this.saveMessageGene = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModalGene_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //Gene lists
              this.newssModelObj.news_id = field.id;
              this.showListedGene(field.id);
              this.showExistGeneRlt(field.id);
            }

            //MOA Show
            if ($element == "show_relations" && metatagVal == 'moa') {
              this.showExistMoa = false;
              this.saveMessageMoa = false;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModalMoa_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              //MOA lists
              this.newssModelObj.news_id = field.id;
              this.showListedMoa(field.id);
              this.showExistMoaRlt(field.id);
            }

          }.bind(this),

        });


        // jQuery("#showNewsletterLists").change(function (field, row, $element) {
        //   var selected = jQuery('#selectbox option:selected').val();
        //   alert(selected);
        //   console.log(field);
        //   alert(row);
        //   alert($element);
        // });
        /////////////////////////////


        // jQuery("#showNewsletterLists").on('click', '.dropdown-item', function (e) {
        //   var menu = jQuery(this).html();
        //   console.log(menu);
        //   if (menu == "Low") {
        //     this.modalRef = this.modalService.open(this.showRelationsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
        //   }
        // });

        // jQuery("#showNewsletterLists").on("click-cell.bs.table", function (field, value, row, $el) {
        //   var col = jQuery(this).index();
        //   console.log(col);
        //   console.log("name: ", $el);
        //   this.modalRef = this.modalService.open(this.showRelationsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
        // });

        jQuery('#showNewsletterLists').bootstrapTable("load", this.newsletterRecordsDetails);
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

  // cellStyle(value, row, index) {
  //   return {
  //     css: {
  //       color: 'blue'
  //     }
  //   }
  // }

  showCommentsNewsletter(newsId: any) {
    this.loadingComment = true;
    this.newsCommentsRecords = [];
    this.newsService.getCommentsNewsletter(newsId).subscribe(
      data => {
        this.result = data;
        this.newsCommentsRecords = this.result.newsCommentsRecords;
        console.log("newsCommentsRecords: ", this.newsCommentsRecords);
      },
      err => {
        console.log(err.message);
        this.loadingComment = false;
      },
      () => {
        this.loadingComment = false;
      }
    );
  }

  //////////////////------------------ 1. START TA Section ----------------------------/////////////////////
  showListedTA(newsId: any) {
    this.loadingTa = true;
    console.log("newsId", newsId);
    this.tasRecords = [];
    this.tasService.getTasListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.tasRecords != "") {
          this.tasRecords = this.result.tasRecords;
          console.log("tasRecords: ", this.tasRecords);
        } else {
          this.tasRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingTa = false;
      },
      () => {
        this.loadingTa = false;
      }
    );
  }

  selectTa(e) {
    const ta_idss: FormArray = this.formValue.get('ta_ids') as FormArray;
    if (e.target.checked) {
      ta_idss.push(new FormControl(e.target.value));
      console.log("chkvalues: ", ta_idss);
      this.selectedTa.push(e.target.value);
    } else {
      const index = ta_idss.controls.findIndex(ta_ids => ta_ids.value === e.target.value);
      ta_idss.removeAt(index);
    }
  }

  //Already Exists TA News Relations  
  showExistTARlt(newsId: any) {
    this.loadingExistTa = true;
    this.showExistTA = true;
    console.log("newsId", newsId);
    this.tasExistRecords = [];
    this.tasService.getTasListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.tasExistRecords != "") {
          this.tasExistRecords = this.result.tasExistRecords;
        } else {
          this.tasExistRecords = [{ 'name': "Do not exist any TA relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistTa = false;
      },
      () => {
        this.loadingExistTa = false;
      }
    );
  }

  //TA Relation Attach
  saveNewsTaRlT() {
    this.loadingRelations = true;
    const selectedTAs = this.formValue.value.ta_ids.filter(n => n); // null and undefined values are clear from the array
    this.newsService.saveNewsTaRl({ 'ta_ids': selectedTAs }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValue.reset();
      this.saveMessage = true;
      this.showListedTA(this.newssModelObj.news_id);
      this.showExistTARlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelations = false;
      },
      () => {
        this.loadingRelations = false;
      }
    );
  }
  //////////////////------------------ 1. END TA Section ----------------------------/////////////////////

  //////////////////------------------ 2. START Disease Section ----------------------------/////////////////////
  showListedDisease(newsId: any) {
    this.loadingDisease = true;
    this.diseaseRecords = [];
    this.diseasesService.getDiseaseListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.diseaseRecords != "") {
          this.diseaseRecords = this.result.diseaseRecords;
          console.log("diseaseRecords: ", this.diseaseRecords);
        } else {
          this.diseaseRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingDisease = false;
      },
      () => {
        this.loadingDisease = false;
      }
    );
  }

  selectDisease(e) {
    const di_idss: FormArray = this.formValueDisease.get('di_ids') as FormArray;
    if (e.target.checked) {
      di_idss.push(new FormControl(e.target.value));
      console.log("chkvalues: ", di_idss);
      this.selectedDisease.push(e.target.value);
    } else {
      const index = di_idss.controls.findIndex(di_ids => di_ids.value === e.target.value);
      di_idss.removeAt(index);
      console.log("chkvalues2: ", di_idss);
    }
  }

  //Already Exists Disease News Relations  
  showExistDiseaseRlt(newsId: any) {
    this.loadingExistDisease = true;
    this.showExistDisease = true;
    console.log("newsId", newsId);
    this.diseaseExistRecords = [];
    this.diseasesService.getDiseaseListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.diseaseExistRecords != "") {
          this.diseaseExistRecords = this.result.diseaseExistRecords;
          console.log("diseaseExistRecords: ", this.diseaseExistRecords);
        } else {
          this.diseaseExistRecords = [{ 'name': "Do not exist any Disease relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistDisease = false;
      },
      () => {
        this.loadingExistDisease = false;
      }
    );
  }

  //Disease Relation Attach
  saveNewsDiseaseRlT() {
    this.loadingRelationsDisease = true;
    const selectedDiseases = this.formValueDisease.value.di_ids.filter(n => n); // null and undefined values are clear from the array
    console.log("values22: ", selectedDiseases);

    this.newsService.saveNewsDiseaseRl({ 'di_ids': selectedDiseases }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValueDisease.reset();
      this.saveMessageDisease = true;
      this.showListedDisease(this.newssModelObj.news_id);
      this.showExistDiseaseRlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelationsDisease = false;
      },
      () => {
        this.loadingRelationsDisease = false;
      }
    );
  }
  //////////////////------------------ 2. END Disease Section ----------------------------/////////////////////

  //////////////////------------------ 3. START Drug Section ----------------------------/////////////////////
  showListedDrug(newsId: any) {
    this.loadingDrug = true;
    this.drugRecords = [];
    this.drugsService.getDrugListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.drugRecords != "") {
          this.drugRecords = this.result.drugRecords;
          console.log("drugRecords: ", this.drugRecords);
        } else {
          this.drugRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingDrug = false;
      },
      () => {
        this.loadingDrug = false;
      }
    );
  }

  selectDrug(e) {
    const drug_idss: FormArray = this.formValueDrug.get('drug_ids') as FormArray;
    console.log("cjecked: ", drug_idss);
    if (e.target.checked) {
      drug_idss.push(new FormControl(e.target.value));
      console.log("chkvaluesdd: ", drug_idss);
      this.selectedDrug.push(e.target.value);
    } else {
      const index = drug_idss.controls.findIndex(drug_ids => drug_ids.value === e.target.value);
      drug_idss.removeAt(index);
      console.log("chkvaluesdd2: ", drug_idss);
    }
  }

  //Already Exists Drug News Relations  
  showExistDrugRlt(newsId: any) {
    this.loadingExistDrug = true;
    this.showExistDrug = true;
    console.log("newsId", newsId);
    this.drugExistRecords = [];
    this.drugsService.getDrugListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.drugExistRecords != "") {
          this.drugExistRecords = this.result.drugExistRecords;
          console.log("drugExistRecords: ", this.drugExistRecords);
        } else {
          this.drugExistRecords = [{ 'name': "Do not exist any Drug relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistDrug = false;
      },
      () => {
        this.loadingExistDrug = false;
      }
    );
  }

  //Drug Relation Attach
  saveNewsDrugRlT() {
    this.loadingRelationsDrug = true;
    const selectedDrugs = this.formValueDrug.value.drug_ids.filter(n => n); // null and undefined values are clear from the array
    console.log("values22: ", selectedDrugs);

    this.newsService.saveNewsDrugRl({ 'drug_ids': selectedDrugs }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValueDrug.reset();
      this.saveMessageDrug = true;
      this.showListedDrug(this.newssModelObj.news_id);
      this.showExistDrugRlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelationsDrug = false;
      },
      () => {
        this.loadingRelationsDrug = false;
      }
    );
  }
  //////////////////------------------ 3. END Drug Section ----------------------------/////////////////////


  //////////////////------------------ 4. START Company Section ----------------------------/////////////////////
  showListedCompany(newsId: any) {
    this.loadingCompany = true;
    this.companyRecords = [];
    this.companiesService.getCompanyListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.companyRecords != "") {
          this.companyRecords = this.result.companyRecords;
          console.log("companyRecords: ", this.companyRecords);
        } else {
          this.companyRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingCompany = false;
      },
      () => {
        this.loadingCompany = false;
      }
    );
  }

  selectCompany(e) {
    const company_idss: FormArray = this.formValueCompany.get('company_ids') as FormArray;
    console.log("cjecked: ", company_idss);
    if (e.target.checked) {
      company_idss.push(new FormControl(e.target.value));
      console.log("chkvaluesdd: ", company_idss);
      this.selectedCompany.push(e.target.value);
    } else {
      const index = company_idss.controls.findIndex(company_ids => company_ids.value === e.target.value);
      company_idss.removeAt(index);
      console.log("chkvaluesdd2: ", company_idss);
    }
  }

  //Already Exists Company News Relations  
  showExistCompanyRlt(newsId: any) {
    this.loadingExistCompany = true;
    this.showExistCompany = true;
    console.log("newsId", newsId);
    this.companyExistRecords = [];
    this.companiesService.getCompanyListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.companyExistRecords != "") {
          this.companyExistRecords = this.result.companyExistRecords;
          console.log("companyExistRecords: ", this.companyExistRecords);
        } else {
          this.companyExistRecords = [{ 'name': "Do not exist any Company relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistCompany = false;
      },
      () => {
        this.loadingExistCompany = false;
      }
    );
  }

  //Company Relation Attach
  saveNewsCompanyRlT() {
    this.loadingRelationsCompany = true;
    const selectedCompanys = this.formValueCompany.value.company_ids.filter(n => n); // null and undefined values are clear from the array
    console.log("values22: ", selectedCompanys);

    this.newsService.saveNewsCompanyRl({ 'company_ids': selectedCompanys }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValueCompany.reset();
      this.saveMessageCompany = true;
      this.showListedCompany(this.newssModelObj.news_id);
      this.showExistCompanyRlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelationsCompany = false;
      },
      () => {
        this.loadingRelationsCompany = false;
      }
    );
  }
  //////////////////------------------ 4. END Company Section ----------------------------/////////////////////


  //////////////////------------------ 5. START Gene Section ----------------------------/////////////////////
  showListedGene(newsId: any) {
    this.loadingGene = true;
    this.geneRecords = [];
    this.genesService.getGeneListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        this.geneRecords = this.result.geneRecords;
        if (this.result.geneRecords != "") {
          this.geneRecords = this.result.geneRecords;
          console.log("geneRecords: ", this.geneRecords);
        } else {
          this.geneRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingGene = false;
      },
      () => {
        this.loadingGene = false;
      }
    );
  }

  selectGene(e) {
    const gene_idss: FormArray = this.formValueGene.get('gene_ids') as FormArray;
    console.log("cjecked: ", gene_idss);
    if (e.target.checked) {
      gene_idss.push(new FormControl(e.target.value));
      console.log("chkvaluesdd: ", gene_idss);
      this.selectedGene.push(e.target.value);
    } else {
      const index = gene_idss.controls.findIndex(gene_ids => gene_ids.value === e.target.value);
      gene_idss.removeAt(index);
      console.log("chkvaluesdd2: ", gene_idss);
    }
  }

  //Already Exists Gene News Relations  
  showExistGeneRlt(newsId: any) {
    this.loadingExistGene = true;
    this.showExistGene = true;
    console.log("newsId", newsId);
    this.geneExistRecords = [];
    this.genesService.getGeneListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.geneExistRecords != "") {
          this.geneExistRecords = this.result.geneExistRecords;
          console.log("geneExistRecords: ", this.geneExistRecords);
        } else {
          this.geneExistRecords = [{ 'name': "Do not exist any Gene relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistGene = false;
      },
      () => {
        this.loadingExistGene = false;
      }
    );
  }

  //Gene Relation Attach
  saveNewsGeneRlT() {
    this.loadingRelationsGene = true;
    const selectedGenes = this.formValueGene.value.gene_ids.filter(n => n); // null and undefined values are clear from the array
    console.log("values22: ", selectedGenes);

    this.newsService.saveNewsGeneRl({ 'gene_ids': selectedGenes }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValueGene.reset();
      this.saveMessageGene = true;
      this.showListedGene(this.newssModelObj.news_id);
      this.showExistGeneRlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelationsGene = false;
      },
      () => {
        this.loadingRelationsGene = false;
      }
    );
  }
  //////////////////------------------ 5. END Gene Section ----------------------------/////////////////////


  //////////////////------------------ 6. START MOA Section ----------------------------/////////////////////
  showListedMoa(newsId: any) {
    this.loadingMoa = true;
    this.moaRecords = [];
    this.moasService.getMoaListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.moaRecords != "") {
          this.moaRecords = this.result.moaRecords;
          console.log("moaRecords: ", this.moaRecords);
        } else {
          this.moaRecords = [{ 'name': "All list are attached" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingMoa = false;
      },
      () => {
        this.loadingMoa = false;
      }
    );
  }

  selectMoa(e) {
    const moa_idss: FormArray = this.formValueMoa.get('moa_ids') as FormArray;
    console.log("cjecked: ", moa_idss);
    if (e.target.checked) {
      moa_idss.push(new FormControl(e.target.value));
      console.log("chkvaluesdd: ", moa_idss);
      this.selectedMoa.push(e.target.value);
    } else {
      const index = moa_idss.controls.findIndex(moa_ids => moa_ids.value === e.target.value);
      moa_idss.removeAt(index);
      console.log("chkvaluesdd2: ", moa_idss);
    }
  }

  //Already Exists Moa News Relations  
  showExistMoaRlt(newsId: any) {
    this.loadingExistMoa = true;
    this.showExistMoa = true;
    console.log("newsId", newsId);
    this.moaExistRecords = [];
    this.moasService.getMoaListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        if (this.result.moaExistRecords != "") {
          this.moaExistRecords = this.result.moaExistRecords;
          console.log("moaExistRecords: ", this.moaExistRecords);
        } else {
          this.moaExistRecords = [{ 'name': "Do not exist any MOA relation" }];
        }
      },
      err => {
        console.log(err.message);
        this.loadingExistMoa = false;
      },
      () => {
        this.loadingExistMoa = false;
      }
    );
  }

  //Moa Relation Attach
  saveNewsMoaRlT() {
    this.loadingRelationsMoa = true;
    const selectedMoas = this.formValueMoa.value.moa_ids.filter(n => n); // null and undefined values are clear from the array
    console.log("values22: ", selectedMoas);

    this.newsService.saveNewsMoaRl({ 'moa_ids': selectedMoas }, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValueMoa.reset();
      this.saveMessageMoa = true;
      this.showListedMoa(this.newssModelObj.news_id);
      this.showExistMoaRlt(this.newssModelObj.news_id);
    },
      err => {
        console.log(err.message);
        this.loadingRelationsMoa = false;
      },
      () => {
        this.loadingRelationsMoa = false;
      }
    );
  }
  //////////////////------------------ 5. END MOA Section ----------------------------/////////////////////


  //////////////////------------------ 1. START Add Suggestion at once ----------------------------/////////////////////
  addSuggestion(newsId: any, newsText: any) {
    this.loadingTa = true;
    console.log("newsId: ", newsId);
    console.log("newsText: ", newsText);

    this.tasRecords = [];
    // this.newsService.getCuratedUncuratedData({ catId: 1 }).subscribe(
    this.newsService.getCuratedUncuratedData({ 'news_id': newsId, 'news_text': newsText }).subscribe(
      data => {
        this.result = data;

        console.log("1: ", data);
        console.log("2: ", this.result);

        // if (this.result.tasRecords != "") {
        //   this.tasRecords = this.result.tasRecords;
        //   console.log("tasRecords: ", this.tasRecords);
        // } else {
        //   this.tasRecords = [{ 'name': "All list are attached" }];
        // }
      },
      err => {
        console.log(err.message);
        this.loadingTa = false;
      },
      () => {
        this.loadingTa = false;
      }
    );
  }

  closePopupApproval() {
    // this.showCommentsNewsletterModal.close();
  }

}

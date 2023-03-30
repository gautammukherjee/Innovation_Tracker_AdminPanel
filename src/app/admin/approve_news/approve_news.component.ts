import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { ApproveNewssModel } from './approve_newss.model';
import { TasService } from '../../services/tas.service';
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
  private showRelationsNewsletterModal: any;
  private modalRef: any;
  @ViewChild('showCommentsNewsletterModal', { static: false }) showCommentsNewsletterModal_active: ElementRef;
  @ViewChild('showRelationsNewsletterModal', { static: false }) showRelationsNewsletterModal_active: ElementRef;

  loading = false;
  loadingComment = false;
  loadingRelations = false;
  loadingTa = false;
  loadingExistTa = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];
  tasRecords: any = [];
  tasExistRecords: any = [];

  showAdd !: boolean;
  showUpdate !: boolean;
  showUpdateDate: Date;
  userType: any;
  newsHeading: any = '';
  public selectedTa: Array<object> = [];

  saveMessage: boolean = false;

  formValue !: FormGroup;
  newssModelObj: ApproveNewssModel = new ApproveNewssModel();

  constructor(private tasService: TasService,
    private newsService: NewsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.userType = JSON.parse(sessionStorage.getItem('currentUser'));
    // console.log("utype: ", this.userType);

    this.formValue = this.formBuilder.group({
      ta_ids: this.formBuilder.array([], [Validators.required])
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
          temps["show_relations"] = "<button class='btn btn-sm btn-primary'>Metadata</button>";

          // if (this.userType.user_type_id == 1 || this.userType.user_type_id == 3) {
          //   temps["approve"] = "<button class='btn btn-sm btn-primary'>Approve</button>";
          // }
          i++;
          this.newsletterRecordsDetails.push(temps);
        });

        jQuery('#showNewsletterLists').bootstrapTable({
          data: this.newsletterRecordsDetails,
          onClickRow: function (field, row, $element) {
            // Show all the comments
            if ($element == "show_comments") {
              this.newsHeading = field.title;
              this.modalRef = this.modalService.open(this.showCommentsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showCommentsNewsletter(field.id);
            }

            // Show all the comments
            if ($element == "show_relations") {
              console.log("field: ", field);
              this.newsHeading = field.title;
              this.modalRef = this.modalService.open(this.showRelationsNewsletterModal_active, { size: 'lg', keyboard: false, backdrop: 'static' });
              // this.showCommentsNewsletter(field.id);
              //TA lists
              this.newssModelObj.news_id = field.id;
              this.showListedTA(field.id);
              this.showExistTARlt(field.id);
            }

          }.bind(this),
        });
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

  showListedTA(newsId: any) {
    this.loadingTa = true;
    console.log("newsId", newsId);
    this.tasService.getTasListsNotExistRl(newsId).subscribe(
      data => {
        this.result = data;
        this.tasRecords = this.result.tasRecords;
        console.log("tasRecords: ", this.tasRecords);
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
    const ta_ids: FormArray = this.formValue.get('ta_ids') as FormArray;
    if (e.target.checked) {
      ta_ids.push(new FormControl(e.target.value));
      this.selectedTa.push(e.target.value);
    } else {
      const index = ta_ids.controls.findIndex(ta_ids => ta_ids.value === e.target.value);
      ta_ids.removeAt(index);
    }
  }

  //Already Exists TA News Relations
  showExistTARlt(newsId: any) {
    this.loadingExistTa = true;
    console.log("newsId", newsId);
    this.tasService.getTasListsExistRl(newsId).subscribe(
      data => {
        this.result = data;
        this.tasExistRecords = this.result.tasExistRecords;
        console.log("tasExistRecords: ", this.tasExistRecords);
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

  //Approval form Submit
  saveNewsTaRl() {
    this.loadingRelations = true;
    console.log("values1: ", this.formValue.value.ta_ids);
    console.log("values2: ", this.newssModelObj);
    this.newsService.saveNewsTaRl({ 'ta_ids': this.formValue.value.ta_ids }, this.newssModelObj.news_id).subscribe(res => {
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

  closePopupApproval() {
    this.showCommentsNewsletterModal.close();
  }

}

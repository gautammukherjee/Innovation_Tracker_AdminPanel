import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DisapproveNewssModel } from './disapprove-newss.model';
declare var jQuery: any;

@Component({
  selector: 'app-disapprove-news',
  templateUrl: './disapprove-news.component.html',
  styleUrls: ['./disapprove-news.component.scss'],
  providers: [DatePipe]
})
export class DisapproveNewsComponent implements OnInit {
  result: any = [];
  newsletterRecords: any = [];
  newsletterRecordsDetails: any = [];
  newsCommentsRecords: any = [];
  private showCommentsNewsletterModal: any;
  private pendingFormNewsletterModal: any;
  private modalRef: any;
  @ViewChild('showCommentsNewsletterModal', { static: false }) showCommentsNewsletterModal_active: ElementRef;
  @ViewChild('pendingFormNewsletterModal', { static: false }) pendingFormNewsletterModal_approve: ElementRef;

  loading = false;
  loadingEdit = false;
  loadingAdd = false;
  loadingComment = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];

  userType: any;
  newsHeading: any = '';

  formValue !: FormGroup;
  newssModelObj: DisapproveNewssModel = new DisapproveNewssModel();

  constructor(private newsService: NewsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {

    this.userType = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log("utype: ", this.userType);

    this.formValue = this.formBuilder.group({
      publication_date: [''],
      title: [''],
      description: [''],
      url: [''],
      comments: ['']
    });
  }

  ngOnInit(): void {

    this.publication_date = (new Date()).getMonth() + 1 + "-" + (new Date()).getDate() + "-" + (new Date()).getFullYear();
    console.log("this.publication_date: ", this.publication_date);

    this.showPendingNewsletterLists();
  }

  showPendingNewsletterLists() {
    this.loading = true;
    this.newsService.getPendingNewsletterLists().subscribe(
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
          temps["pending_news"] = "<button class='btn btn-sm btn-primary'>Pending News</button>";

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

            //Disapprove
            if ($element == "pending_news") {
              //var result = confirm("Are you sure to disapprove this Newsletter?");
              //if (result) {
              // this.trashNewsletter(field.id);
              this.modalRef = this.modalService.open(this.pendingFormNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.newssModelObj.news_id = field.id;
              //}
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

  //DisApproval form Submit
  disapproveNewsletterSubmit() {
    this.loadingEdit = true;
    this.newssModelObj.comments = this.formValue.value.comments;
    console.log("values: ", this.newssModelObj);
    // this.newssModelObj.approval_date = this.formValue.value.approval_date;
    // this.newssModelObj.publication_date = this.formValue.value.publication_date;

    this.newsService.pendingNewsletter(this.newssModelObj, this.newssModelObj.news_id).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValue.reset();
      this.showPendingNewsletterLists();
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

  closePopupApproval() {
    this.showCommentsNewsletterModal.close();
  }

}

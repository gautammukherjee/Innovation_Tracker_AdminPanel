import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  private modalRef: any;
  @ViewChild('showCommentsNewsletterModal', { static: false }) showCommentsNewsletterModal_approve: ElementRef;

  loading = false;
  loadingComment = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];

  showAdd !: boolean;
  showUpdate !: boolean;
  showUpdateDate: Date;
  userType: any;
  newsHeading: any = '';

  formValue !: FormGroup;

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
          temps["show_comments"] = "<button class='btn btn-sm btn-primary'>View Comments</button>";
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
              console.log("field: ", field);
              this.newsHeading = field.title;
              this.modalRef = this.modalService.open(this.showCommentsNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showCommentsNewsletter(field.id);
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

  closePopupApproval() {
    this.showCommentsNewsletterModal.close();
  }

}

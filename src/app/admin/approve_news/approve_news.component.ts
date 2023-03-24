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
  private addFormNewsletterModal: any;
  private approveFormNewsletterModal: any;
  private modalRef: any;
  @ViewChild('addFormNewsletterModal', { static: false }) addFormNewsletterModal_edit: ElementRef;
  @ViewChild('approveFormNewsletterModal', { static: false }) approveFormNewsletterModal_approve: ElementRef;

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];

  showAdd !: boolean;
  showUpdate !: boolean;
  showUpdateDate: Date;
  userType: any;

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
          //temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button>";
          // if (this.userType.user_type_id == 1 || this.userType.user_type_id == 3) {
          //   temps["approve"] = "<button class='btn btn-sm btn-primary'>Approve</button>";
          // }

          // temps["trash"] = "<button class='btn btn-sm btn-warning'>Trash</button>";
          i++;
          this.newsletterRecordsDetails.push(temps);
        });

        jQuery('#showNewsletterLists').bootstrapTable({
          data: this.newsletterRecordsDetails,
          onClickRow: function (field, row, $element) {
            // code goes here
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

  closePopup() {
    this.addFormNewsletterModal.close();
  }

  closePopupApproval() {
    this.approveFormNewsletterModal.close();
  }

}

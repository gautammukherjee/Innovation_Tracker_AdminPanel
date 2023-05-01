import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewssModel } from './newss.model';
declare var jQuery: any;

@Component({
  selector: 'app-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.scss'],
  providers: [DatePipe]
})
export class NewslettersComponent implements OnInit {
  result: any = [];
  newsletterRecords: any = [];
  newsletterRecordsDetails: any = [];
  newsCommentsRecords: any = [];
  private addFormNewsletterModal: any;
  private approveFormNewsletterModal: any;
  private showCommentsNewsletterModal: any;
  private modalRef: any;
  @ViewChild('addFormNewsletterModal', { static: false }) addFormNewsletterModal_edit: ElementRef;
  @ViewChild('approveFormNewsletterModal', { static: false }) approveFormNewsletterModal_approve: ElementRef;
  @ViewChild('showCommentsNewsletterModal', { static: false }) showCommentsNewsletterModal_approve: ElementRef;

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  loadingComment = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;
  publication_date: any;
  selectedItems: any = [];
  newsHeading: any = '';

  showApprove !: boolean;
  showDisapprove !: boolean;
  showUpdateDate: Date;
  userType: any;

  formValue !: FormGroup;
  newssModelObj: NewssModel = new NewssModel();

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

  // public initFromDate = { month: ((new Date()).getMonth() + 1), day: ((new Date()).getDate()), year: ((new Date()).getFullYear() - 1) };

  ngOnInit(): void {
    //this.publication_date = this.formatDate(new Date());

    this.publication_date = (new Date()).getMonth() + 1 + "-" + (new Date()).getDate() + "-" + (new Date()).getFullYear();
    console.log("this.publication_date: ", this.publication_date);

    this.showAllNewsletterLists();
  }

  // escapeString(str) {
  //   return (str + '').replace(/[\\"')(]/g, '\\$&').replace(/\u0000/g, '\\0')
  // }

  showAllNewsletterLists() {
    this.loading = true;
    this.newsService.getNewsletterLists().subscribe(
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
          temps["approve"] = "<button class='btn btn-sm btn-success'>Approve</button>";
          temps["disapprove"] = "<button class='btn btn-sm btn-danger'>Disapprove</button>";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Delete</button>";
          temps["show_comments"] = "<button class='btn btn-sm btn-primary'>Comments</button>";
          i++;
          this.newsletterRecordsDetails.push(temps);
        });

        jQuery('#showNewsletterLists').bootstrapTable({
          data: this.newsletterRecordsDetails,
          onClickRow: function (field, row, $element) {

            //Approve
            if ($element == "approve") {
              // console.log("field: ", field);
              this.showApprove = true;
              this.showDisapprove = false;
              this.modalRef = this.modalService.open(this.approveFormNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.newssModelObj.news_ids = [field.id];
            }

            //Disapprove
            if ($element == "disapprove") {
              //var result = confirm("Are you sure to disapprove this Newsletter?");
              //if (result) {
              // this.trashNewsletter(field.id);
              this.showApprove = false;
              this.showDisapprove = true;
              this.modalRef = this.modalService.open(this.approveFormNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.newssModelObj.news_ids = [field.id];
              //}
            }

            // Show all the comments
            if ($element == "show_comments") {
              this.newsHeading = field.title;
              this.modalRef = this.modalService.open(this.showCommentsNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showCommentsNewsletter(field.id);
            }

            //permanent delete
            if ($element == "delete") {
              var result = confirm("Are you sure to permanent delete this Newsletter?");
              if (result) {
                this.deleteNewsletter(field.id);
              }
            }

            //edit
            // if ($element == "edit") {
            //   console.log("field: ", field);
            //   this.modalRef = this.modalService.open(this.addFormNewsletterModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
            //   this.showAdd = false;
            //   this.showUpdate = true;
            //   this.newssModelObj.news_id = field.id;

            //   this.formValue.controls['title'].setValue(field.title);
            //   this.formValue.controls['description'].setValue(field.description);
            //   this.formValue.controls['url'].setValue(field.url);
            // }
          }.bind(this),
        });
        jQuery('#showNewsletterLists').bootstrapTable("load", this.newsletterRecordsDetails);

        // jQuery('#showNewsletterLists').on('all.bs.table', function (e, name, args) {
        //   this.showAdd = true;
        //   console.log("heres: ", this.showAdd);
        //   jQuery('#showNewsletterLists').bootstrapTable("load", this.newsletterRecordsDetails);
        // }).bind(this);

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

  addNewsletterPopup() {
    this.modalRef = this.modalService.open(this.addFormNewsletterModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    // this.showAdd = true;
    // this.showUpdate = false;
  }

  closePopup() {
    this.addFormNewsletterModal.close();
  }

  closePopupApproval() {
    this.approveFormNewsletterModal.close();
    this.showCommentsNewsletterModal.close();
  }

  addNewsletterSubmit() {
    this.loadingAdd = true;
    this.newssModelObj.title = this.formValue.value.title;
    this.newssModelObj.description = this.formValue.value.description;
    this.newssModelObj.url = this.formValue.value.url;
    this.newssModelObj.comments = this.formValue.value.comments;

    let pubDate: any = (this.formValue.value.publication_date.year) + '-' + (this.formValue.value.publication_date.month) + '-' + (this.formValue.value.publication_date.day);
    this.newssModelObj.publication_date = pubDate;
    console.log("tot: ", this.newssModelObj);

    this.newsService.addNewsletter(this.newssModelObj)
      .subscribe(res => {
        // alert("Newsletter Added Successfully");
        let ref = document.getElementById('cancel');
        ref?.click();
        //this.addFormNewsletterModal.close();
        this.formValue.reset();
        this.showAllNewsletterLists();
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

  // updateNewsletterSubmit() {
  //   this.loadingEdit = true;
  //   this.newssModelObj.title = this.formValue.value.title;
  //   this.newssModelObj.description = this.formValue.value.description;
  //   this.newssModelObj.url = this.formValue.value.url;
  //   // this.newssModelObj.publication_date = this.formValue.value.publication_date;

  //   let pubDate: any = (this.formValue.value.publication_date.year) + '-' + (this.formValue.value.publication_date.month) + '-' + (this.formValue.value.publication_date.day);
  //   this.newssModelObj.publication_date = pubDate;

  //   this.newsService.updateNewsletter(this.newssModelObj, this.newssModelObj.news_id).subscribe(res => {
  //     let refCancel = document.getElementById('cancel');
  //     refCancel?.click();
  //     //this.addFormNewsletterModal.close();
  //     this.formValue.reset();
  //     this.showAllNewsletterLists();
  //   },
  //     err => {
  //       console.log(err.message);
  //       this.loadingEdit = false;
  //     },
  //     () => {
  //       this.loadingEdit = false;
  //     }
  //   );
  // }

  // trashNewsletter(event: any) {
  //   this.loadingDel = true;
  //   return this.newsService.trashNewsletter(event).subscribe(res => {
  //   },
  //     err => {
  //       console.log(err.message);
  //       this.loadingDel = false;
  //     },
  //     () => {
  //       this.showAllNewsletterLists();
  //       this.loadingDel = false;
  //     }
  //   );
  // }

  deleteNewsletter(event: any) {
    this.loadingDel = true;
    return this.newsService.deleteNewsletter(event).subscribe(res => {
    },
      err => {
        console.log(err.message);
        this.loadingDel = false;
      },
      () => {
        this.showAllNewsletterLists();
        this.loadingDel = false;
      }
    );
  }

  approvedMultipleNewsletter() {
    this.showApprove = true;
    var selectedRows = this.getRowSelections();
    if (selectedRows == "") {
      alert("Please choose atleat one news");
    } else {
      this.selectedItems = [];
      selectedRows.forEach((value: any) => {
        this.selectedItems.push(value.id);
      });
      this.modalRef = this.modalService.open(this.approveFormNewsletterModal_approve, { size: 'lg', keyboard: false, backdrop: 'static' });
      this.newssModelObj.news_ids = this.selectedItems;
    }
  }

  getRowSelections() {
    return jQuery.map(jQuery('#showNewsletterLists').bootstrapTable('getSelections'), function (row) {
      return row;
    })
  }

  //Approval form Submit
  approveNewsletterSubmit() {
    this.loadingEdit = true;
    this.newssModelObj.comments = this.formValue.value.comments;
    // console.log("values: ", this.newssModelObj);
    // this.newssModelObj.approval_date = this.formValue.value.approval_date;
    // this.newssModelObj.publication_date = this.formValue.value.publication_date;

    this.newsService.approveNewsletter(this.newssModelObj).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValue.reset();
      this.showAllNewsletterLists();
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

  //DisApproval form Submit
  disapproveNewsletterSubmit() {
    this.loadingEdit = true;
    this.newssModelObj.comments = this.formValue.value.comments;
    // console.log("values: ", this.newssModelObj);
    // this.newssModelObj.approval_date = this.formValue.value.approval_date;
    // this.newssModelObj.publication_date = this.formValue.value.publication_date;

    this.newsService.disapproveNewsletter(this.newssModelObj).subscribe(res => {
      let refCancel = document.getElementById('cancel');
      refCancel?.click();
      //this.addFormNewsletterModal.close();
      this.formValue.reset();
      this.showAllNewsletterLists();
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

  // formatDate(date) {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();
  //   if (month.length < 2)
  //     month = '0' + month;
  //   if (day.length < 2)
  //     day = '0' + day;

  //   return [year, month, day].join('-');
  // }

}

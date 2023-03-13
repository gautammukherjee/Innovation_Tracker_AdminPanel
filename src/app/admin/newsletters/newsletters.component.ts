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
  private addFormNewsletterModal: any;
  private modalRef: any;
  @ViewChild('addFormNewsletterModal', { static: false }) addFormNewsletterModal_edit: ElementRef;

  loading = false;
  loadingDel = false;
  loadingAdd = false;
  loadingEdit = false;
  params;
  layout: any = {};
  hideCardBody: boolean = true;

  showAdd !: boolean;
  showUpdate !: boolean;

  formValue !: FormGroup;
  newssModelObj: NewssModel = new NewssModel();

  constructor(private newsService: NewsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {
    this.formValue = this.formBuilder.group({
      publication_date: [''],
      title: [''],
      description: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
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
          temps["title"] = (event.title.length>100)?(event.title.substring(0,100)+"..."):(event.title);
          temps["description"] = (event.description.length>200)?(event.description.substring(0,200)+"..."):(event.description);
          temps["url_title"] = (event.url != null) ? ('<a href="' + event.url + '" target="_blank">link</a>') : '-';
          temps["url"] = event.url;
          temps["edit"] = "<button class='btn btn-sm btn-primary'>Edit</button>";
          temps["delete"] = "<button class='btn btn-sm btn-danger'>Trash</button>";
          i++;
          this.newsletterRecordsDetails.push(temps);
        });

        jQuery('#showNewsletterLists').bootstrapTable({
          data: this.newsletterRecordsDetails,
          onClickRow: function (field, row, $element) {
            //delete
            if ($element == "delete") {
              var result = confirm("Are you sure to delete this Newsletter?");
              if (result) {
                this.deleteNewsletter(field.id);
              }
            }
            //edit
            if ($element == "edit") {
              this.modalRef = this.modalService.open(this.addFormNewsletterModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
              this.showAdd = false;
              this.showUpdate = true;
              this.newssModelObj.news_id = field.id;

              this.formValue.controls['publication_date'].setValue(field.publication_date);
              this.formValue.controls['title'].setValue(field.title);
              this.formValue.controls['description'].setValue(field.description);
              this.formValue.controls['url'].setValue(field.url);

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

  addNewsletterPopup() {
    this.modalRef = this.modalService.open(this.addFormNewsletterModal_edit, { size: 'lg', keyboard: false, backdrop: 'static' });
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  closePopup() {
    this.addFormNewsletterModal.close();
  }

  addNewsletterSubmit() {
    this.loadingAdd = true;
    this.newssModelObj.title = this.formValue.value.title;
    this.newssModelObj.description = this.formValue.value.description;
    this.newssModelObj.url = this.formValue.value.url;
    this.newssModelObj.publication_date = this.formValue.value.publication_date;

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

  updateNewsletterSubmit() {
    this.loadingEdit = true;
    this.newssModelObj.title = this.formValue.value.title;
    this.newssModelObj.description = this.formValue.value.description;
    this.newssModelObj.url = this.formValue.value.url;
    this.newssModelObj.publication_date = this.formValue.value.publication_date;

    this.newsService.updateNewsletter(this.newssModelObj, this.newssModelObj.news_id).subscribe(res => {
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

}

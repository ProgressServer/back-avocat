import { Component, OnInit, ViewChild } from '@angular/core';
import { DroitService } from 'src/app/services/droitService/droit.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Droit } from 'src/app/models/droit';
import { Router } from '@angular/router';
import { Pagination } from "../../../../models/pagination";
import { Children } from 'src/app/models/children';
import { ChildrenService } from 'src/app/services/childrenService/children.service';


// import { ConfirmationDeleteModalComponent } from 'src/app/modules/shared/components/confirmation-delete-modal/confirmation-delete-modal.component';


@Component({
  selector: 'app-liste-droit',
  templateUrl: './liste-droit.component.html',
  styleUrls: ['./liste-droit.component.css']
})
export class ListeDroitComponent implements OnInit {
  // @ViewChild(ConfirmationDeleteModalComponent) confirmDelete!: ConfirmationDeleteModalComponent;

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [1, 3, 6, 12];

  textConfirm: string = '';
  loader: boolean = false;
  loaderView: boolean = false;
  load: boolean = false;
  dataResultDroit: Droit[] = [];
  droitForm!: FormGroup;
  childrenForm!: FormGroup;
  paginationDroit: Pagination = new Pagination();

  newChildrenForm!: FormGroup;

  // New children
  childrenTitle: string = "";
  childrenContent: string = "";
  childrenMore: string = "";


  constructor(private router: Router,
    private droitService: DroitService,
    private toastr: ToastrService,
    private fB: FormBuilder,
    private newForm: FormBuilder,
    private childrenService: ChildrenService,
  ) { }


  ngOnInit(): void {
    this.initForm(new Droit());
    this.initData();
    this.initFormNewChildren(new Droit());
  }


  initData(): void {
    try {
      this.load = true;
      this.droitService.getAll().subscribe((res) => {
        this.dataResultDroit = res;
        this.load = false;
      });
    } catch (error) {
      alert(error);
    }

  }

  onTableDataChange(event: any) {
    this.page = event;
    this.initData();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.initData();
  }

  initForm(droit: Droit): void {
    this.droitForm = this.fB.group({
      _id: [droit._id, [Validators.required]],
      title: [droit.title, [Validators.required]],
      content: [droit.content, [Validators.required]],
      more: [droit.more],
      children: [droit.children],
    });
  }


  closeModal() {
    const btn = document.getElementById('updateCloseModal');
    if (btn) {
      btn.click();
    }
  }

  closeModalDelete() {
    const btn = document.getElementById('deleteCloseModal');
    if (btn) {
      btn.click();
    }
  }

  closeModalInfo() {
    const btn = document.getElementById('infoCloseModal');
    if (btn) {
      btn.click();
    }
  }

  get c(): any {
    return this.droitForm.controls;
  }

  get d(): any {
    return this.childrenForm.controls;
  }

  update() {
    if (this.droitForm.valid) {
      this.loader = true;
      const droit: Droit = this.droitForm.value;
      this.droitService.update(droit).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Le droit a été modifié');
          this.initData();
          this.closeModal();
        } else {
          this.toastr.error(res.message);
        }
      }, error => {
        this.loader = false;
      });
    }
  }

  noDelete() {
    const btn = document.getElementById('deleteCloseModal');
    if (btn) {
      btn.click();
    }
  }

  delete() {
    if (this.droitForm.valid) {
      this.loader = true;
      const droit: Droit = this.droitForm.value;
      this.droitService.delete(droit._id).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Le droit a été supprimé');
          this.initData();
          this.closeModalDelete();
        } else {
          this.toastr.error(res.message);
        }
      }, error => {
        this.loader = false;
      });
    }
  }

  getChildren(id: string, titre: string) {
    this.router.navigate(['/admin/children/' + id+"/"+titre]);
  }

  initFormNewChildren(droit: Droit): void {
    this.newChildrenForm = this.newForm.group({
      _id: [droit._id, Validators.required],
      title: [this.childrenTitle, Validators.required],
      content: [this.childrenContent, Validators.required],
      more: [this.childrenMore]
    });
  }

  get i(): any {
    return this.newChildrenForm.controls;
  }

  closeModalNewChildren() {
    const btn = document.getElementById('newChildrenModal');
    if (btn) {
      btn.click();
    }
  }

  insertChildren() {
    if (this.newChildrenForm.valid) {
      const newValueChildren = new Children();
      newValueChildren.title = this.newChildrenForm.value.title;
      newValueChildren.content = this.newChildrenForm.value.content;
      newValueChildren.more = this.newChildrenForm.value.more;
      this.loader = true;
      this.childrenService.updateChildren(this.newChildrenForm.value._id, newValueChildren).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Le catégorie a été ajouté');
          this.closeModalNewChildren();
        } else {
          this.toastr.error(res.message);
        }
      }, error => {
        this.loader = false;
      });

    }
  }
}

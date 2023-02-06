import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChildrenService } from 'src/app/services/childrenService/children.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Children } from 'src/app/models/children';

@Component({
  selector: 'app-liste-children',
  templateUrl: './liste-children.component.html',
  styleUrls: ['./liste-children.component.css']
})
export class ListeChildrenComponent implements OnInit {
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [1, 3, 6, 12];

  idDroit = String(this.route.snapshot.paramMap.get('id'));
  titreMere = String(this.route.snapshot.paramMap.get('titre'));
  loader: boolean = false;
  loaderView: boolean = false;
  load: boolean = false;
  listeChildren = {};
  childrenForm!: FormGroup;
  newChildrenForm!: FormGroup;
  dataResultChildren: Children[] = [];
  dataResultChildrenTemp: Children[] = [];
  estSousCategorie: boolean = false;
  indiceTemporaire!: number;
  indiceChildren!: string;
  listeSousCategorie: Children[] = [];
  idToInsertTemp!: number;

  // New children
  title: string = "";
  content: string = "";
  more: string = "";

  constructor(private route: ActivatedRoute, private router: Router,
    private childrenService: ChildrenService,
    private toastr: ToastrService,
    private fB: FormBuilder,
    private newForm: FormBuilder) {
    this.initFormNewCholdren();
  }

  ngOnInit(): void {
    this.getListeChildren();
    this.initForm(new Children);
  }

  getListeChildren(): void {
    try {
      this.load = true;
      this.childrenService.getAllById(this.idDroit).subscribe((res) => {
        this.dataResultChildren = res;
        console.log(this.dataResultChildren);
        this.load = false;
      });
    } catch (error) {
      alert(error);
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getListeChildren();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListeChildren();
  }

  initForm(children: Children): void {
    this.childrenForm = this.fB.group({
      _id: [children._id],
      title: [children.title],
      content: [children.content],
      more: [children.more],
    });
  }

  initFormNewCholdren(): void {
    this.newChildrenForm = this.newForm.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      more: ['']
    });
  }

  get d(): any {
    return this.childrenForm.controls;
  }

  get i(): any {
    return this.newChildrenForm.controls;
  }


  closeModal() {
    const btn = document.getElementById('updateCloseModal');
    if (btn) {
      btn.click();
    }
  }

  closeModalNewChildren() {
    const btn = document.getElementById('newChildrenModal');
    if (btn) {
      btn.click();
    }
  }

  closeModalInsertNewChildren() {
    const btn = document.getElementById('newChildrenModalInsert');
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


  noDelete() {
    const btn = document.getElementById('deleteCloseModal');
    if (btn) {
      btn.click();
    }
  }

  closeModalModifChildren() {
    const btn = document.getElementById('updateModalChildren');
    if (btn) {
      btn.click();
    }
  }

  closeModalDeleteChildren() {
    const btn = document.getElementById('deleteModalChildren');
    if (btn) {
      btn.click();
    }
  }

  update() {
    if (this.childrenForm.valid) {
      this.loader = true;
      const children: Children = this.childrenForm.value;
      this.childrenService.update(this.idDroit, children).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Le children a été modifié');
          this.getListeChildren();
          this.closeModal();
        } else {
          this.toastr.error(res.message);
        }
      }, error => {
        this.loader = false;
      });
    }
  }

  updateSousCategorie() {
    this.childrenService.updateSousChildren(this.idDroit, this.indiceChildren, this.childrenForm.value).subscribe(res => {
      this.loader = false;
      if (res) {
        this.toastr.success('Le sous catégorie a été modifié');
        this.refresh();
        this.closeModalModifChildren();
      } else {
        this.toastr.error("Une erreur s'est produit");
      }
    }, error => {
      console.log("Erreur");
      this.loader = false;
    });

  }



  delete() {
    if (this.childrenForm.valid) {
      this.loader = true;
      const children: Children = this.childrenForm.value;
      console.log(this.idDroit);
      console.log(children._id);
      this.childrenService.delete(this.idDroit, children._id).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Le catégorie a été supprimé');
          this.getListeChildren();
          this.closeModalDelete();
        } else {
          this.toastr.error(res.message);
        }
      }, error => {
        this.loader = false;
      });
    }
  }

  deleteChildren() {
    this.dataResultChildren.splice(this.indiceTemporaire, 1);
    this.childrenService.deleteSousChildren(this.idDroit, this.indiceChildren, this.childrenForm.value).subscribe(res => {
      this.loader = false;
      if (res) {
        this.toastr.success('Le sous catégorie a été supprimé');
        this.refresh();
        this.closeModalDeleteChildren();
      } else {
        this.toastr.error("Une erreur s'est produit");
      }
    }, error => {
      console.log("Erreur");
      this.loader = false;
    });
  }

  refresh(): void {
    window.location.reload();
  }


  insertChildren() {
    console.log("Insert children")
    if (this.newChildrenForm.valid) {
      this.loader = true;
      console.log("Info");
      console.log(this.idDroit);
      console.log(this.idToInsertTemp);
      this.childrenService.insertSousChildren(this.idDroit, this.idToInsertTemp, this.newChildrenForm.value).subscribe(res => {
        console.log(this.newChildrenForm.value);
        this.loader = false;
        if (res) {
          this.toastr.success('Le sous catégorie a été enregistré');
          this.refresh();
          this.closeModalInsertNewChildren();
        } else {
          this.toastr.error("Une erreur s'est produit");
        }
      }, error => {
        console.log("Erreur");
        this.loader = false;
      });
    }
  }


  insert() {
    if (this.newChildrenForm.valid) {
      const newValueChildren = new Children();
      newValueChildren.title = this.newChildrenForm.value.title;
      newValueChildren.content = this.newChildrenForm.value.content;
      newValueChildren.more = this.newChildrenForm.value.more;
      this.loader = true;
      console.log("IdDroit: ", this.idDroit);
      this.childrenService.updateChildren(this.idDroit, newValueChildren).subscribe(res => {
        this.loader = false;
        if (res) {
          this.toastr.success('Le catégorie a été ajouté');
          this.getListeChildren();
          this.closeModalNewChildren();
        } else {
          this.toastr.error(res);
        }
      }, error => {
        this.loader = false;
      });
    }
  }

  showSousCategorie(id: number) {
    this.estSousCategorie = true;
    this.indiceTemporaire = id;
    this.indiceChildren = this.dataResultChildren[id]._id;
    this.dataResultChildrenTemp = this.dataResultChildren[id].children;
    console.log("Resulat");
    console.log(this.dataResultChildrenTemp);
  }

  getIdSuppr(id: number) {
    console.log(id);
    this.indiceTemporaire = id;
  }

  changeIdChildren(children: Children) {
    console.log("Change Id");
    console.log(children._id);
    this.indiceChildren = children._id;
  }

  changeIdToInsert(id: number) {
    this.idToInsertTemp = id;
  }
}



import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DroitService } from 'src/app/services/droitService/droit.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthentificationService } from 'src/app/services/authentificationService/authentification.service';
import { User } from 'src/app/models/user';
import { ChildrenService } from 'src/app/services/childrenService/children.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nouvelle-droit',
  templateUrl: './nouvelle-droit.component.html',
  styleUrls: ['./nouvelle-droit.component.css']
})
export class NouvelleDroitComponent implements OnInit {
  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  tableSizes: any = [1, 3, 6, 12];


  droitForm!: FormGroup;
  childrenForm!: FormGroup;
  loadSave = false;
  loader = false;
  afficherBouton = true;
  idSousChildrenTemp: number = 0;

  listeChildren = [{ title: '', content: '', more: '', children: [{}] }];
  listeSousChildren = [{ title: '', content: '', more: '', children: [{}] }];
  oneChildren = { title: '', content: '', more: '', children: [{}] };
  childrenTemporaire = [{ title: '', content: '', more: '', children: [{}] }];

  loaderCategorie = false;
  oneUser: User = new User;
  idDroit: string = "";
  titreTemp: string = "";

  titre = "";
  contenue = "";
  info = "";

  titreTemporaire!: string;
  idTemporaire!: number;
  estCategorie: boolean = false;
  estSousCategorie: boolean = false;
  tempIdToUpdate!: number;

  titreCategorie = "";
  contenueCategorie = "";
  infoCategorie = "";
  childrenCategorie = [{}];

  public isChildren: boolean = false;

  constructor(private router: Router,
    private droitService: DroitService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authentificationService: AuthentificationService,
    private childrenService: ChildrenService,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initForm();
    this.addToChildren();
  }

  ngOnInit(): void {
    this.isChildren = false;
    for (let index = 0; index < this.listeChildren.length; index++) {
      if (this.listeChildren[index].title == "") {
        this.listeChildren.splice(index, 1);
      }

    }

    for (let index = 0; index < this.childrenTemporaire.length; index++) {
      if (this.childrenTemporaire[index].title == "") {
        this.childrenTemporaire.splice(index, 1);
      }
    }

  }

  initForm(): void {
    const user = this.authentificationService.getUser();
    if (user) {
      this.oneUser = user;
    }
    this.droitForm = this.fb.group({
      title: [this.titre, Validators.required],
      content: [this.contenue, Validators.required],
      more: [this.info],
      children: [[{ title: '', content: '', more: '', children: [{}] }]],
      owner: [this.oneUser._id],
    });
  }



  addToChildren(): void {
    this.childrenForm = this.fb.group({
      title: [this.titreCategorie, Validators.required],
      content: [this.contenueCategorie, Validators.required],
      more: [this.infoCategorie],
      children: [this.childrenCategorie]
    });
  }

  ajouterSousCatgorie(): void {
    this.afficherBouton = false;
    this.router.navigate(["droit"], { relativeTo: this._activatedRoute })
    this.isChildren = true;
    this.titreTemporaire = this.droitForm.value.title;
    this.estCategorie = true;
    this.estSousCategorie = false;

    const formulaire = this.droitForm.value.children;
    for (let index = 0; index < formulaire.length; index++) {
      if (formulaire[index].title == "") {
        formulaire.splice(index, 1);
      }
    }
  }

  addToInChildren_children(indice: number, titre: string, contenue: string, info: string): void {
    this.titreTemporaire = titre;
    this.router.navigate(["sous-categorie"], { relativeTo: this._activatedRoute })
    this.isChildren = true;
    this.childrenTemporaire = [{ title: '', content: '', more: '', children: [{}] }];
    for (let index = 0; index < this.childrenTemporaire.length; index++) {
      if (this.childrenTemporaire[index].title == "") {
        this.childrenTemporaire.splice(index, 1);
      }
    }
    this.oneChildren = { title: titre, content: contenue, more: info, children: [{}] };
    console.log(this.oneChildren);
    this.estCategorie = true;
    this.estSousCategorie = false;
  }

  ajouterDansSousCategorie(indice: number): void {
    console.log("Indice: ", indice);
    const btn = document.getElementById('multiCollapseExample');
    if (btn) {
      btn.click();
    }
    this.idTemporaire = indice;
    this.estCategorie = false;
    this.estSousCategorie = true;

    this.titreCategorie = "";
    this.contenueCategorie = "";
    this.infoCategorie = "";
    this.titreTemporaire = this.droitForm.value.children[indice].title;
    const formulaire = this.droitForm.value.children;
    for (let index = 0; index < formulaire[this.idTemporaire].children.length; index++) {
      if (formulaire[this.idTemporaire].children[index].title == undefined) {
        formulaire[this.idTemporaire].children.splice(index, 1);
      }

    }
    this.idSousChildrenTemp = indice;
    console.log("this.idSousChildrenTemp: ", this.idSousChildrenTemp);
  }

  ajouterNouvelleCategorie(): void {
    if (this.isChildren) {
      const formulaire = this.droitForm.value.children;
      if (this.estCategorie) {
        console.log("If");
        formulaire.push({ title: this.childrenForm.value.title, content: this.childrenForm.value.content, more: this.childrenForm.value.more, children: [{}] });
        for (let index = 0; index < formulaire.length; index++) {
          console.log(formulaire.length);
          if (formulaire[index].title == "" || formulaire[index].title == undefined) {
            formulaire.splice(index, 1);
            console.log("Miditra 1");
          } else {
            console.log("Miditra 2");
            for (let j = 0; j < formulaire[index].children.length; j++) {
              if (formulaire[index].children[j].title == "" || formulaire[index].children[j].title == undefined) {
                formulaire[index].children.splice(j, 1);
              }
              else {
                console.log("Aucun changement");
              }
            }
            formulaire[index].children.splice(index, 1);
          }
        }
        this.showCard();
        this.titreCategorie = "";
        this.contenueCategorie = "";
        this.infoCategorie = "";

      } else if (this.estSousCategorie) {
        console.log("else this.estSousCategorie");
        formulaire[this.idTemporaire].children.push({ title: this.childrenForm.value.title, content: this.childrenForm.value.content, more: this.childrenForm.value.more, children: [{}] });
        for (let index = 0; index < formulaire[this.idTemporaire].children.length; index++) {
          console.log(formulaire[this.idTemporaire].children[index]);
          if (formulaire[this.idTemporaire].children[index].title == "") {
            formulaire[this.idTemporaire].children.splice(index, 1);
          }
        }
        this.showCard();
        this.titreCategorie = "";
        this.contenueCategorie = "";
        this.infoCategorie = "";
      }
    }

    console.log(this.droitForm.value.children[this.idSousChildrenTemp]);
    console.log(this.droitForm.value.children[this.idSousChildrenTemp].children);
    console.log(this.droitForm.value.children[this.idSousChildrenTemp].children[0].title);
    this.isChildren = true;
  }

  revertAddChildren(): void {
    this.isChildren = true;
    if (this.estCategorie == true) {
      this.estCategorie = false;
      this.isChildren = false;
      this.estSousCategorie = false;
    }
    else if (this.estSousCategorie == true) {
      this.estCategorie = true;
      this.estSousCategorie = false;
      this.isChildren = true;
    }
  }

  revertDroit(): void {
    this.isChildren = false;
    this.estCategorie = false;
    this.estSousCategorie = false;
    console.log(this.droitForm.value);
  }

  getInfoChildren(): void {
    this.toastr.success('Sous catégorie ajouté avec succès');
    if (this.estCategorie == true) {
      this.listeChildren.push({ title: this.titreCategorie, content: this.contenueCategorie, more: this.infoCategorie, children: [{}] });
      for (let index = 0; index < this.listeChildren.length; index++) {
        if (this.listeChildren[index].title == "") {
          this.listeChildren.splice(index, 1);
        }
      }
    }
    else if (this.estSousCategorie = true) {
      this.listeSousChildren.push({ title: this.titreCategorie, content: this.contenueCategorie, more: this.infoCategorie, children: [{}] });
      for (let index = 0; index < this.listeSousChildren.length; index++) {
        if (this.listeSousChildren[index].title == "") {
          this.listeSousChildren.splice(index, 1);
        }
      }
    }
    this.titreCategorie = '';
    this.contenueCategorie = '';
    this.infoCategorie = '';

    this.childrenTemporaire = this.listeChildren;
  }

  get c(): any {
    return this.droitForm.controls;
  }

  get d(): any {
    return this.childrenForm.controls;
  }

  deleteChildren(idChildren: number, idSousChildren: number): void {
    const formulaire = this.droitForm.value.children;
    if (idSousChildren == -1) {
      formulaire.splice(idChildren, 1);
    }
    else {
      formulaire[idChildren].children.splice(idSousChildren, 1);
    }
  }

  closeModal() {
    const btn = document.getElementById('updateCloseModal');
    if (btn) {
      btn.click();
    }
  }

  closeInsertModal() {
    const btn = document.getElementById('insertCloseModal');
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

  showCard() {
    const btn = document.getElementById('multiCollapseExample');
    if (btn) {
      btn.click();
      this.ajouterSousCatgorie();
    }
  }

  save(): void {
    if (this.droitForm.valid) {
      this.loader = true;
      for (let index = 0; index < this.droitForm.value.children.length; index++) {
        if (this.droitForm.value.children[index].title == "") {
          this.droitForm.value.children.splice(index, 1);
        }
      }
      this.droitService.save(this.droitForm.value).subscribe(res => {
        this.loader = false;
        if (res) {
          this.toastr.success('Droit ajouté avec succès');
          this.router.navigate(['/admin/droit']);
        }
      }, error => {
        this.loader = false;
        this.toastr.error(error);
      });
    }
  }

  showModal() {
    const btn = document.getElementById('updateModal');
    if (btn) {
      btn.click();
    }
  }

  updateDroitParent(): void {
    if (this.childrenForm.valid) {
      const formulaire = this.droitForm.value.children;
      const formulaireChildren = this.childrenForm.value;
      if (this.estCategorie) {
        formulaire[this.tempIdToUpdate].title = formulaireChildren.title;
        formulaire[this.tempIdToUpdate].content = formulaireChildren.content;
        formulaire[this.tempIdToUpdate].more = formulaireChildren.more;
      } else if (this.estSousCategorie) {
        formulaire[this.idTemporaire].children[this.tempIdToUpdate].title = formulaireChildren.title;
        formulaire[this.idTemporaire].children[this.tempIdToUpdate].content = formulaireChildren.content;
        formulaire[this.idTemporaire].children[this.tempIdToUpdate].more = formulaireChildren.more;
      }
      this.closeModal();
    }

  }

  getIdToUpdate(idChildren: number, idSousChildren: number) {
    const formulaireChildren = this.droitForm.value.children;

    if (idSousChildren == -1) {
      console.log("if");
      this.tempIdToUpdate = idChildren;
      if (this.estCategorie) {
        this.titreCategorie = formulaireChildren[this.tempIdToUpdate].title;
        this.contenueCategorie = formulaireChildren[this.tempIdToUpdate].content;
        this.infoCategorie = formulaireChildren[this.tempIdToUpdate].more;
      }
    } else {
      this.tempIdToUpdate = idSousChildren;
      this.idTemporaire = idChildren;
      this.estCategorie = false;
      this.estSousCategorie = true;
      console.log("else: ", idChildren, idSousChildren);
      console.log(formulaireChildren[idChildren].children[idSousChildren].title);
      this.titreCategorie = formulaireChildren[idChildren].children[idSousChildren].title;
      this.contenueCategorie = formulaireChildren[idChildren].children[idSousChildren].content;
      this.infoCategorie = formulaireChildren[idChildren].children[idSousChildren].more;
    }

  }

  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  changeIDSousCategorie(id: number) {
    this.idSousChildrenTemp = id;
    console.log(this.idSousChildrenTemp);
  }
}
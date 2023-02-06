import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Droit } from 'src/app/models/droit';
import { ChildrenService } from 'src/app/services/childrenService/children.service';
import { DroitService } from 'src/app/services/droitService/droit.service';

@Component({
  selector: 'app-sous-categorie',
  templateUrl: './sous-categorie.component.html',
  styleUrls: ['./sous-categorie.component.css']
})
export class SousCategorieComponent implements OnInit {
  id!: string;
  textConfirm: string = '';
  loader: boolean = false;
  loaderView: boolean = false;
  load: boolean = false;
  dataResultDroit: Droit = {
    _id: '',
    title: '',
    content: '',
    more: '',
    children: [],
    owner: []
  };


  constructor(private routelens: ActivatedRoute,
    private router: Router,
    private droitService: DroitService,
    private toastr: ToastrService,
    private fB: FormBuilder,
    private newForm: FormBuilder,
    private childrenService: ChildrenService) { }

  ngOnInit(): void {
    // console.log("Id: ", this.routelens.snapshot.paramMap.get("id"));
    this.routelens.queryParams.subscribe((params) => {
      let style = params['id'];
      this.id = style;
      console.log("Test: ", params['id']);
    });
    this.initData();
  }

  initData(): void {
    try {
      this.load = true;
      this.droitService.findById(this.id).subscribe((res) => {
        this.dataResultDroit = res;
        console.log(this.dataResultDroit);
        this.load = false;
      });
    } catch (error) {
      alert(error);
    }

  }


}

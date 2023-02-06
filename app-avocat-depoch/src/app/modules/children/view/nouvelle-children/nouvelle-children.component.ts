import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChildrenService } from 'src/app/services/childrenService/children.service';
import { Children } from 'src/app/models/children';


@Component({
  selector: 'app-nouvelle-children',
  templateUrl: './nouvelle-children.component.html',
  styleUrls: ['./nouvelle-children.component.css']
})
export class NouvelleChildrenComponent implements OnInit {
  childrenForm!: FormGroup;
  loadSave = false;
  alertAjouter = false;
  loader = false;

  constructor(private router: Router,
    private childrenService: ChildrenService,
    private toastr: ToastrService,
    private fb: FormBuilder,) {
    this.initForm();
  }


  ngOnInit(): void {
  }


  initForm(): void {
    this.childrenForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      more: ['']
    });
  }

  get c(): any {
    return this.childrenForm.controls;
  }


  bouttonAucun(): void {
    this.router.navigate(['/admin/droit']);
    // this.toastr.warning("Un des format de vos champs est incorrect");
  }

  bouttonAjouter(): void {
    this.alertAjouter = true;
  }

  bouttonAjouterPlus(): void {
    this.alertAjouter = false;
    this.router.navigate(['/admin/children/nouveau']);
  }

  bouttonTerminer(): void {
    this.alertAjouter = false;
    this.router.navigate(['/admin/droit']);
  }

}

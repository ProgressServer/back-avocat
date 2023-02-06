import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../services/authentificationService/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loader = false;
  email: string = "";
  password: string = "";

  constructor(private router: Router, private authentificationService: AuthentificationService, private readonly fb: FormBuilder, private toastr: ToastrService) {

  }


  load = true;
  formGroup !: FormGroup;
  ngOnInit(): void {
    this.load = true;
    this.formGroup = this.fb.group({
      email: [this.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [this.password, Validators.required]
    });
  }

  get c(): any {
    return this.formGroup.controls;
  }

  login(): void {
    if (this.formGroup.valid) {
      this.loader = true;
      this.authentificationService.login(this.email, this.password).subscribe(res => {
        this.loader = false;
        if (res) {
          this.authentificationService.storeUserData(res.token, res.user);
          this.router.navigate(['/admin/droit']);
        }
      }, error => {
        this.loader = false;
        this.toastr.error(error.error.msg);
      });
    } else {
      this.toastr.warning("Un des format de vos champs est incorrect");
    }
  }

  signUp() {
    this.router.navigate(['/admin/login/signUp']);
    // this.router.navigate(['/admin/signUp']);
  }

  // login(): void {
  //   if (this.formGroup.valid) {
  //     this.load = true;
  //     var email = this.formGroup.get('email')?.value;
  //     var mdp = this.formGroup.get('password')?.value;
  //     if (email == "bdbgperformance@gmail.com") {
  //       if (mdp == "Richamed91:") {
  //         this.router.navigate(['/admin/droit']);
  //       }
  //     } else {
  //       this.toastr.error("Erreur d'authentification");
  //     }
  //   } else {
  //     this.toastr.warning("Un des format de vos champs est incorrect");
  //   }
  // }




}

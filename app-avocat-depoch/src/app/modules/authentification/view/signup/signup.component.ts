import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SignUpService } from 'src/app/services/signUpService/sign-up.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  currentDate = new Date();
  loader = false;
  load = true;
  formGroup !: FormGroup;


  firstname: string = "";
  lastname: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  phone: string = "";
  barreau: string = "";
  // speciality: Speciality[] = [];
  website: string = "";
  bio: string = "";
  activated: boolean = true;
  activationLimit: Date = this.currentDate;
  activationCode: string = "";
  roles: string[] = [];
  // follow!: User[];
  profilePicture: string = '';
  isImage = false;
  imagePath: string = '';


  constructor(private router: Router, private signUpService: SignUpService, private readonly fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.load = true;
    this.formGroup = this.fb.group({
      firstname: [this.firstname],
      lastname: [this.lastname],
      username: [this.username],
      email: [this.email,],
      password: [this.password],
      phone: [this.phone],
      barreau: [this.barreau],
      website: [this.website],
      bio: [this.bio],
      activated: [this.activated],
      activationLimit: [this.activationLimit],
      activationCode: [this.activationCode],
      roles: [this.roles],
      profilePicture: [this.profilePicture],
    });
  }

  get c(): any {
    return this.formGroup.controls;
  }

  login() {
    this.router.navigate(['/admin/login']);
  }

  signUp(): void {
    if (this.formGroup.valid) {
      this.loader = true;
      this.signUpService.save(this.formGroup.value).subscribe(res => {
        this.loader = false;
        if (!res.error) {
          this.toastr.success('Vous êtes inscrit');
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

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Mila atao type text le profil picture vao mazaka anle base64
      // this.profilePicture = String(reader.result);
      // this.ngOnInit();
      console.log(this.formGroup.value);
    };
  }



}

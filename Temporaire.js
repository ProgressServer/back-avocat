// currentDate = new Date();
//   loader = false;
//   load = true;
//   formGroup !: FormGroup;

//   firstname: string = "";
//   lastname: string = "";
//   username: string = "";
//   email: string = "";
//   password: string = "";
//   phone: string = "";
//   barreau: string = "";
//   // speciality: Speciality[] = [];
//   website: string = "";
//   bio: string = "";
//   activated: boolean = false;
//   activationLimit: Date = this.currentDate;
//   activationCode: string = "";
//   roles: string[] = [];
//   // follow!: User[];
//   profilePicture: string = "";


//   constructor(private router: Router, private signUpService: SignUpService, private readonly fb: FormBuilder, private toastr: ToastrService) { }

//   ngOnInit(): void {
//     this.load = true;
//     this.formGroup = this.fb.group({
//       firstname: [this.firstname, Validators.required],
//       lastname: [this.lastname, Validators.required],
//       username: [this.username],
//       email: [this.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
//       password: [this.password, Validators.required],
//       phone: [this.phone],
//       barreau: [this.barreau],
//       website: [this.website],
//       bio: [this.bio],
//       activated: [this.activated],
//       activationLimit: [this.activationLimit],
//       activationCode: [this.activationCode],
//       roles: [this.roles],
//       profilePicture: [this.profilePicture],
//     });
//   }

//   get c(): any {
//     return this.formGroup.controls;
//   }

//   login() {
//     this.router.navigate(['/admin/login']);
//   }

//   signUp(): void {
//     if (this.formGroup.valid) {
//       this.loader = true;
//       this.signUpService.save(this.formGroup.value).subscribe(res => {
//         this.loader = false;
//         if (!res.error) {
//           this.toastr.success('Vous êtes inscrit');
//           this.router.navigate(['/admin/droit']);
//         }
//       }, error => {
//         this.loader = false;
//         this.toastr.error(error.error.msg);
//       });
//     } else {
//       this.toastr.warning("Un des format de vos champs est incorrect");
//     }
//   }
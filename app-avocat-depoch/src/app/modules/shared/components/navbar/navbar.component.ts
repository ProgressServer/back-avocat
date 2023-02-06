import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from "../../../../services/authentificationService/authentification.service";
import { Router } from "@angular/router";
import { User } from "../../../../models/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthentificationService, private router: Router) { }
  user: User = new User();
  ngOnInit(): void {
    this.initUser();
  }

  initUser() {
    const tempUser = this.authService.getUser();
    if (tempUser) {
      this.user = tempUser;
    }
  }

  lougout() {
    const isLoggedOut = this.authService.loggedOut();
    this.router.navigate(['admin/login']);
    if (isLoggedOut) {
      this.router.navigate(['admin/login']);
    }
  }
  clickToggled(): void {
    const btn = document.getElementById('sidebarToggle');
    if (btn) {
      btn.click();
    }
  }
  onclickProfil() {
    // this.router.navigate(['/admin/mon-profile']);
  }
}

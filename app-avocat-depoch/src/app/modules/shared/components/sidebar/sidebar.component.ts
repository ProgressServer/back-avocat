import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { NouvelleDroitComponent } from 'src/app/modules/droit/view/nouvelle-droit/nouvelle-droit.component';
import { AuthentificationService } from "../../../../services/authentificationService/authentification.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  minify = false;
  @Input()
  public nouvelleDroitComponent!: NouvelleDroitComponent;
  public isChildren = false;
  user: User = new User();
  constructor(private authService: AuthentificationService, private router: Router,) { }

  ngOnInit(): void {
    this.initUser();
  }


  initUser() {
    const tempUser = this.authService.getUser();
    if (tempUser) {
      this.user = tempUser;
    }
  }

  public changeVariable() {
    // After passing component2 context, you can call all its public functions/properties.
    console.log(this.nouvelleDroitComponent.isChildren);
    this.nouvelleDroitComponent.isChildren = false;

  }





}

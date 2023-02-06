import { Injectable } from '@angular/core';
import { User } from "../../models/user";
import { HttpClient, HttpParams } from '@angular/common/http';
import { SecuriteService } from '../securiteService/securite.service';
import { Observable } from "rxjs";
import { HttpResponseModel } from "../../models/http-response-model";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  authToken: any;
  acces: any;
  user: any;
  
  constructor(private httpClient: HttpClient, private securiteService: SecuriteService) {
    this.loadToken();
  }

  /**
   * Crypter mdp
   * @params | mots de passe
   * @returns String
   */
  public getCrypteMDP(newMdp: string): string | undefined {
    return this.securiteService.encryptData(newMdp);
    // This is  DEVTEST for login shoud be remove for real the fonction
    // return newMdp;
  }


  /**
   * Recupere le token decrypter dans le storage session
   */
  public getToken(): string | undefined {
    const tokenCrypted = localStorage.getItem('id_token');
    if (tokenCrypted) {
      return this.securiteService.decryptData(tokenCrypted);
    }
    return undefined;
  }

  /**
   * Sauvegarder le token dans une variable temporaire 'authToken'
   */
  loadToken(): string | undefined {
    const token = this.getToken();
    this.authToken = token;
    return token;
  }

  /**
   * Permet de recuper l'user dans le session storage
   */
  getUser(): User | undefined {
    const stringUserCrypted = localStorage.getItem('user');
    if (stringUserCrypted) {
      const stringUser = this.securiteService.decryptData(stringUserCrypted);
      if (stringUser) {
        return JSON.parse(stringUser);
      }
    }
    return undefined;
  }

  /**
   * Checker s'il est connecter ou non
   */
  loggedIn(): boolean {
    const token: string | undefined = this.getToken();
    if (token) {
      if (this.tokenExpired(token)) {
        this.clearUserStorage();
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Check si le token est expiré
   * @param token
   */
  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
  /**
   * Permet de se deconnecter
   */
  loggedOut(): boolean {
    if (localStorage.getItem('id_token')) {
      this.clearUserStorage();
      return true;
    }
    return false;
  }

  // Mbola misy condition tsy ampy
  isAdmin(): boolean {
    const user = this.getUser();
    if (user) {
      return true;
    }
    return false;
  }


  /**
   * Permet de supprimer toutes les sessions dans le navigateur
   */
  clearUserStorage(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  }

  /**
   * Permet de sauvegarder les informations de l'utilisateur
   * @param token | string le token a sauvegarder
   * @param user | l'objet user a sauvegarder
   */
  storeUserData(token: string, user: any): void {
    const cryptToken = this.securiteService.encryptData(token);
    if (cryptToken) {
      localStorage.setItem('id_token', cryptToken);
    }
    const cryptedData = this.securiteService.encryptData(JSON.stringify(user));
    if (cryptedData) {
      localStorage.setItem('user', cryptedData);
    }
    this.authToken = token;
    this.user = user;
  }

  /**
   * Permet de sauvegarder les informations de l'utilisateur uniquement
   * @param user | User le model user
   */
  storeUserOnly(user: User): void {
    const cryptedData = this.securiteService.encryptData(JSON.stringify(user));
    if (cryptedData) {
      localStorage.setItem('user', cryptedData);
    }
    this.user = user;
  }

  /**
   * Permet de se connecter
   * @param email | String email du client
   * @param password | String le mot de passe du client
   */
  login(email: string, password: string): Observable<{ user: User, token: string }> {
    return this.httpClient.post<{ user: User, token: string }>(environment.end_point + 'login', {
      email: email,
      password: password
    });
  }

  /**
   * Permet au client de creer un compte
   * @param user | User model user
   */
  signUp(user: User): Observable<HttpResponseModel<User>> {
    return this.httpClient.post<HttpResponseModel<User>>(environment.end_point + 'signup', user);
  }

  /**
   * Permet d'envoyer un email de confirmation sur le mail
   * @param mail | string le mail du client a envoyer le lien de reset
   */
  forgotPassword(mail: string): Observable<HttpResponseModel<boolean>> {
    return this.httpClient.post<HttpResponseModel<boolean>>(environment.end_point + 'forgotpassword', { mail });
  }

  /**
   * Permet de se connecter
   * @param user | data new user
   */
  upDateUser(user: User): Observable<HttpResponseModel<User>> {
    return this.httpClient.put<HttpResponseModel<User>>(environment.end_point + 'user', user);
  }
  /**
   * Permet de changer le mot de passe du client en ligne
   * @param mdp string l'ancien mot de passe du client
   * @param mdpnew string le nouveau de passe du client
   * @param mdpconf string le confirmation du mot de passe du client
   */
  changePassword(id_user: number, mdp: string, mdpnew: string, mdpconf: string): Observable<HttpResponseModel<boolean>> {
    return this.httpClient.post<HttpResponseModel<boolean>>(environment.end_point + 'user/changePassword', {
      id_user,
      mdp,
      mdpnew,
      mdpconf
    });
  }
}

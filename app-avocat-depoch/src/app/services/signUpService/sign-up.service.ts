import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseModel } from 'src/app/models/http-response-model';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Appel de l'api qui permet de recuperer la liste de toutes les Users
   */
  getAll(): Observable<HttpResponseModel<User[]>> {
    return this.httpClient.get<HttpResponseModel<User[]>>(environment.end_point + 'Users');
  }

  /**
   * Appel de l'api qui permet de sauvegarder un User
   * @param User objet de l'unite à sauvegarder
   */
  save(User: User): Observable<HttpResponseModel<User>> {
    return this.httpClient.post<HttpResponseModel<User>>(environment.end_point + 'User', User);
  }

  /**
   * Appel de l'api qui permet de modifier un User
   * @param User l'objet à modifier
   */
  update(User: User): Observable<HttpResponseModel<User>> {
    return this.httpClient.put<HttpResponseModel<User>>(environment.end_point + 'User', User);
  }

  /**
   * Appel de l'api qui permet de supprimer un User
   * @param id
   */
  delete(id: number): Observable<HttpResponseModel<any>> {
    return this.httpClient.delete<HttpResponseModel<any>>(environment.end_point + 'User/' + id);
  }
}

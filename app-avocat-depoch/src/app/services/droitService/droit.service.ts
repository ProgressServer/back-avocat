import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseModel } from 'src/app/models/http-response-model';
import { environment } from 'src/environments/environment';
import { Droit } from 'src/app/models/droit';

@Injectable({
  providedIn: 'root'
})
export class DroitService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Appel de l'api qui permet de recuperer la liste de toutes les droits
   */
  getAll(): Observable<Droit[]> {
    return this.httpClient.get<Droit[]>(environment.end_point);
  }


  /**
   * Appel de l'api qui permet de sauvegarder un droit
   * @param droit objet de l'unite à sauvegarder
   */
  save(droit: Droit): Observable<Droit> {
    return this.httpClient.post<Droit>(environment.end_point, droit);
  }

  /**
   * Appel de l'api qui permet de modifier un droit
   * @param droit l'objet à modifier
   */
  update(droit: Droit): Observable<HttpResponseModel<Droit>> {
    return this.httpClient.put<HttpResponseModel<Droit>>(environment.end_point, droit);
  }

  /**
   * Appel de l'api qui permet de supprimer un droit
   * @param id
   */
  delete(id: string): Observable<HttpResponseModel<any>> {
    return this.httpClient.delete<HttpResponseModel<any>>(environment.end_point + id);
  }


  getChildrenByID(id: string): Observable<Droit[]> {
    return this.httpClient.get<Droit[]>(environment.end_point + "children/" + id);
  }

  findById(id:string): Observable<Droit> {
    return this.httpClient.get<Droit>(environment.end_point+id);
  }

}

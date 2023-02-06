import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseModel } from 'src/app/models/http-response-model';
import { environment } from 'src/environments/environment';
import { Speciality } from 'src/app/models/speciality';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Appel de l'api qui permet de recuperer la liste de toutes les specialitys
   */
  getAll(): Observable<HttpResponseModel<Speciality[]>> {
    return this.httpClient.get<HttpResponseModel<Speciality[]>>(environment.end_point + 'specialitys');
  }

  /**
   * Appel de l'api qui permet de sauvegarder un speciality
   * @param speciality objet de l'unite à sauvegarder
   */
  save(speciality: Speciality): Observable<HttpResponseModel<Speciality>> {
    return this.httpClient.post<HttpResponseModel<Speciality>>(environment.end_point + 'speciality', speciality);
  }

  /**
   * Appel de l'api qui permet de modifier un speciality
   * @param speciality l'objet à modifier
   */
  update(speciality: Speciality): Observable<HttpResponseModel<Speciality>> {
    return this.httpClient.put<HttpResponseModel<Speciality>>(environment.end_point + 'speciality', speciality);
  }

  /**
   * Appel de l'api qui permet de supprimer un speciality
   * @param id
   */
  delete(id: number): Observable<HttpResponseModel<any>> {
    return this.httpClient.delete<HttpResponseModel<any>>(environment.end_point + 'speciality/' + id);
  }
}

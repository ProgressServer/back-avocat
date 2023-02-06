import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseModel } from 'src/app/models/http-response-model';
import { environment } from 'src/environments/environment';
import { Children } from 'src/app/models/children';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Appel de l'api qui permet de recuperer la liste de toutes les childrens
   */
  getAll(): Observable<HttpResponseModel<Children[]>> {
    return this.httpClient.get<HttpResponseModel<Children[]>>(environment.end_point + 'childrens');
  }

  /**
   * Appel de l'api qui permet de sauvegarder un children
   * @param children objet de l'unite à sauvegarder
   */
  save(children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.post<HttpResponseModel<Children>>(environment.end_point + 'children', children);
  }

  /**
   * Appel de l'api qui permet de modifier un children
   * @param children l'objet à modifier
   */
  update(id: string, children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.put<HttpResponseModel<Children>>(environment.end_point + 'childrens/' + id, children);
  }

  /**
   * Appel de l'api qui permet de supprimer un children
   * @param id
   */
  delete(id: string, idChildren: string): Observable<HttpResponseModel<any>> {
    return this.httpClient.delete<HttpResponseModel<any>>(environment.end_point + 'childrens/' + id + '/' + idChildren);
  }

  deleteCategorie(id: string, idChildren: string, idSousCategorie: string): Observable<HttpResponseModel<any>> {
    return this.httpClient.delete<HttpResponseModel<any>>(environment.end_point + 'childrens/' + id + '/' + idChildren + '/' + idSousCategorie);
  }

  getAllById(id: string): Observable<Children[]> {
    return this.httpClient.get<Children[]>(environment.end_point + 'childrens/' + id);
  }

  updateChildren(id: string, children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.post<HttpResponseModel<Children>>(environment.end_point + 'childrens/' + id, children);
  }

  updateSousChildren(id: string, idCategorie: string, children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.put<HttpResponseModel<Children>>(environment.end_point + 'childrens/' + id + '/' + idCategorie, children);
  }

  deleteSousChildren(id: string, idCategorie: string, children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.delete<HttpResponseModel<Children>>(environment.end_point + 'childrens/' + id + '/' + idCategorie + '/' + children._id);
  }

  insertSousChildren(id: string, idCategorie: number, children: Children): Observable<HttpResponseModel<Children>> {
    return this.httpClient.post<HttpResponseModel<Children>>(environment.end_point + 'childrens/' + id + '/' + idCategorie, children);
  }

}

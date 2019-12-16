import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { catchError, map, tap } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { File } from './file.js';


@Injectable()
export class FileService {
    private mainurl = 'api/v1/list';

    constructor(private http: Http) { }

    getFiles(folder: string): Promise<any> {
        // Todo: send the message _after_ fetching the heroes
        /*const url = `${this.mainurl}/?folder=${folder}`;
        this.http.get(url).toPromise().then(response => {
            var body = JSON.parse(response['_body']);
            //console.log({"response": body});
            //response.json().data as File[]
            return body.list as File[];
        }).catch(err => {
            console.log("err", err);
            return new Array<File>();
        });*/
        //return this.http.get(url).toPromise().then(response => response.json().data as File[]).catch(console.log("err"));
            //.pipe(
            //    tap(files => this.log(`fetched files`)),
            //    catchError(this.handleError('getFiles', []))
            //);
        var self = this;
        return new Promise(function(resolve, reject) {
            const url = `${self.mainurl}/?folder=${folder}`;
            self.http.get(url).toPromise().then(response => {
                var body = JSON.parse(response['_body']);
                //console.log({"response": body});
                //response.json().data as File[]
                resolve(body.list as File[]);
            }).catch(err => {
                console.log("err", err);
                reject(err);
            });
        });
    }
    
    log(message: string): void {
        console.log(message);
    }
  
    /** GET hero by id. Return `undefined` when id not found */
    /*getFileNo404<Data>(id: string): Observable<File> {
        const url = `${this.heroesUrl}/?id=${id}`;
        return this.http.get<Hero[]>(url)
          .pipe(
            map(heroes => heroes[0]), // returns a {0|1} element array
            tap(h => {
              const outcome = h ? `fetched` : `did not find`;
              this.log(`${outcome} hero id=${id}`);
            }),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
          );
    }*/
 
      /** GET hero by id. Will 404 if id not found */
      /*getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
          tap(_ => this.log(`fetched hero id=${id}`)),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
      }*/
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var of_1 = require("rxjs/observable/of");
var FileService = /** @class */ (function () {
    function FileService(http) {
        this.http = http;
        this.mainurl = 'api/v1/list';
    }
    FileService.prototype.getFiles = function (folder) {
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
        return new Promise(function (resolve, reject) {
            var url = self.mainurl + "/?folder=" + folder;
            self.http.get(url).toPromise().then(function (response) {
                var body = JSON.parse(response['_body']);
                //console.log({"response": body});
                //response.json().data as File[]
                resolve(body.list);
            }).catch(function (err) {
                console.log("err", err);
                reject(err);
            });
        });
    };
    FileService.prototype.log = function (message) {
        console.log(message);
    };
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
    FileService.prototype.handleError = function (operation, result) {
        var _this = this;
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            _this.log(operation + " failed: " + error.message);
            // Let the app keep running by returning an empty result.
            return of_1.of(result);
        };
    };
    FileService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], FileService);
    return FileService;
}());
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map
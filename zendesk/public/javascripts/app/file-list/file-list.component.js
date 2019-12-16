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
var router_1 = require("@angular/router");
var file_service_js_1 = require("./file.service.js");
var FileListComponent = /** @class */ (function () {
    function FileListComponent(router, fileService) {
        this.router = router;
        this.fileService = fileService;
    }
    FileListComponent.prototype.ngOnInit = function () {
        this.getFiles('wavefront');
        this.location = '' + window.location.href;
        this.location = this.location.substring(0, this.location.length - 1);
    };
    FileListComponent.prototype.getFiles = function (folder) {
        //this.fileService.getFiles(folder).subscribe(files => this.files = files);
        var self = this;
        this.fileService.getFiles(folder).then(function (result) {
            //console.log(result);
            self.files = result;
        }).catch(function (err) {
            console.log(err);
        });
    };
    FileListComponent.prototype.onSelect = function (file) {
        /*console.log(file);
        console.log(file.mtime);
        console.log(new Date(file.mtime));*/
        //console.log('http://localhost:4000/api/v1/item?key=' + file.key);
        //this.location.go('/api/v1/item?key=' + file.key);
        //this.router.navigate(['/item/' + file.key + '/' + file.name]);
        //console.log(window.location.href);
        //console.log(this.location);
        window.location.href = this.location + 'api/v1/item/' + file.key + '/' + file.name + '.' + file.type;
    };
    FileListComponent = __decorate([
        core_1.Component({
            selector: 'file-list',
            templateUrl: './javascripts/app/file-list/file-list.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, file_service_js_1.FileService])
    ], FileListComponent);
    return FileListComponent;
}());
exports.FileListComponent = FileListComponent;
//# sourceMappingURL=file-list.component.js.map
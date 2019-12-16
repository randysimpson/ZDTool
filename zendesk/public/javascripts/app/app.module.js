"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_component_js_1 = require("./app.component.js");
var menu_component_js_1 = require("./menu/menu.component.js");
var file_list_component_js_1 = require("./file-list/file-list.component.js");
var file_service_js_1 = require("./file-list/file.service.js");
var modal_component_js_1 = require("./modal.component.js");
var appRoutes = [
    { path: 'item/:key/:name', redirectTo: './api/v1/item/:key/:name' },
    { path: '', redirectTo: '/', pathMatch: 'full' }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot(appRoutes, { enableTracing: true } // <-- debugging purposes only
                )
            ],
            declarations: [
                app_component_js_1.AppComponent,
                menu_component_js_1.MenuComponent,
                file_list_component_js_1.FileListComponent,
                modal_component_js_1.ModalComponent
            ],
            bootstrap: [app_component_js_1.AppComponent],
            providers: [file_service_js_1.FileService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
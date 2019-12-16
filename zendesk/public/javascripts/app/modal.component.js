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
var ModalComponent = /** @class */ (function () {
    function ModalComponent() {
        this.visible = false;
        this.visibleAnimate = false;
        this.initialVisible = false; //default to false
    }
    ModalComponent.prototype.ngOnInit = function () {
        if (this.initialVisible)
            this.show();
        //console.log("init: " + this.initialVisible);
    };
    ModalComponent.prototype.show = function () {
        var _this = this;
        this.visible = true;
        setTimeout(function () { return _this.visibleAnimate = true; }, 100);
    };
    ModalComponent.prototype.hide = function () {
        var _this = this;
        this.visibleAnimate = false;
        setTimeout(function () { return _this.visible = false; }, 300);
    };
    ModalComponent.prototype.onContainerClicked = function (event) {
        /*if ((<HTMLElement>event.target).classList.contains('modal')) {
          this.hide();
        }*/
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ModalComponent.prototype, "initialVisible", void 0);
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'app-modal',
            template: "\n  <div (click)=\"onContainerClicked($event)\" class=\"modal fade\" tabindex=\"-1\" [ngClass]=\"{'in': visibleAnimate}\"\n       [ngStyle]=\"{'display': visible ? 'block' : 'none', 'margin-left': '0px', 'opacity': visibleAnimate ? 1 : 0}\">\n    <div class=\"modal-dialog\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <ng-content select=\".app-modal-header\"></ng-content>\n        </div>\n        <div class=\"modal-body\">\n          <ng-content select=\".app-modal-body\"></ng-content>\n        </div>\n        <div class=\"modal-footer\">\n          <ng-content select=\".app-modal-footer\"></ng-content>\n        </div>\n      </div>\n    </div>\n  </div>\n  "
        }),
        __metadata("design:paramtypes", [])
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;
//# sourceMappingURL=modal.component.js.map
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './javascripts/app/app.component.html',
})
export class AppComponent {
    name = 'Angular';
    showFiles: boolean;
    
    constructor() {
        this.showFiles = true;
    }
    
    decline(modal: any): void {
        this.showFiles = false;
        modal.hide();
    }
    
    accept(modal: any): void {
        modal.hide();
    }
}
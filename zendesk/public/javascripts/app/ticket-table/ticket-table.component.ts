import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

/*import { File } from './file.js';
import { FileService } from './file.service.js';*/

@Component({
  selector: 'ticket-table',
  templateUrl: './javascripts/app/ticket-table/ticket-table.component.html'
})
export class TicketTableComponent implements OnInit {
    
    constructor(private router: Router, private fileService: FileService) { }
    
    ngOnInit() {
        this.getFiles('wavefront');
        this.location = '' + window.location.href;
        this.location = this.location.substring(0, this.location.length - 1);
    }
    
    getFiles(folder: string): void {
        //this.fileService.getFiles(folder).subscribe(files => this.files = files);
        var self = this;
        this.fileService.getFiles(folder).then(function(result: any) {
            //console.log(result);
            self.files = result;
        }).catch(function(err: any) {
            console.log(err);
        });
    }
}
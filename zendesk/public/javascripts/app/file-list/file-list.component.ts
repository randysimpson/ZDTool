import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { File } from './file.js';
import { FileService } from './file.service.js';

@Component({
  selector: 'file-list',
  templateUrl: './javascripts/app/file-list/file-list.component.html'
})
export class FileListComponent implements OnInit {
    files: File[];
    location: string;
    
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
    
    onSelect(file: File): void {
        /*console.log(file);
        console.log(file.mtime);
        console.log(new Date(file.mtime));*/
        //console.log('http://localhost:4000/api/v1/item?key=' + file.key);
        //this.location.go('/api/v1/item?key=' + file.key);
        //this.router.navigate(['/item/' + file.key + '/' + file.name]);
        //console.log(window.location.href);
        //console.log(this.location);
        window.location.href= this.location + 'api/v1/item/' + file.key + '/' + file.name + '.' + file.type;
    }
}
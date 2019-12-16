import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component.js';
import { MenuComponent }  from './menu/menu.component.js';
import { FileListComponent }  from './file-list/file-list.component.js';
import { FileService } from './file-list/file.service.js';
import { ModalComponent } from './modal.component.js';

const appRoutes: Routes = [
  { path: 'item/:key/:name', redirectTo: './api/v1/item/:key/:name' },
  { path: '',   redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports:      [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ) ],
  declarations: [
    AppComponent,
    MenuComponent,
    FileListComponent,
    ModalComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [ FileService ]
})
export class AppModule { }
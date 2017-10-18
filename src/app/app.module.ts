import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JsonpModule, Jsonp, Response } from '@angular/http';

import { AppComponent } from './app.component';
import { PropertySearchComponent } from './property-search/property-search.component';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PropertyListingComponent } from './property-listing/property-listing.component';

import { PropertyGuard } from './guards/property-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    PropertySearchComponent,
    SearchResultsComponent,
    PropertyListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  providers: [ApiService,
              UserService,
              PropertyGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

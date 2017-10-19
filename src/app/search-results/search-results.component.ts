import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { House } from '../models/house';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  text: string = "";
  errorMessage: string = "";
  currentPage: number = 1;
  numberHouses: number;
  houses:Array<House> = [];
  resultsReady: boolean = false;
  noResults: boolean = false;
  title:string = "";

  constructor(public apiService: ApiService,
              private activatedRoute: ActivatedRoute,
              public userService: UserService,
              private router: Router
            ){}

  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      this.text = params['text'];
      if (this.text === 'favorite'){
        this.getFavoriteProperties();
        this.title = 'Favorite Properties';
      }else if(this.text === 'location'){
        this.startSearchUsingLocation();
        this.title = 'Search Results';
      }else{
        this.startSearch(this.text, 1);
        this.title = 'Search Results';
      }
    });
  }

  startSearch(text, page){
    this.resultsReady = false;
    this.apiService.getProperties(text, page)
      .subscribe(res => {
        this.resultsReady = true;
        this.numberHouses = res.total_results;

        let propertiesFromStorage = this.userService.getDataFromStorage("properties");
        res.listings = res.listings.map(res => this.apiService.toHouse(res, propertiesFromStorage));
        this.houses = [...this.houses, ...res.listings];
        this.userService.saveSearchResult(text, this.numberHouses, page);
        if (this.houses.length === 0) {
          this.noResults = true;
        }
      }),
      err => {
        this.errorMessage = err;
        console.error(err);
      }
  }

  startSearchUsingLocation(){
    this.resultsReady = false;
    this.apiService.getPropertiesUsingLocation(this.currentPage)
      .subscribe(res => {
        this.resultsReady = true;
        this.numberHouses = res.total_results;

        let propertiesFromStorage = this.userService.getDataFromStorage("properties");
        res.listings = res.listings.map(res => this.apiService.toHouse(res, propertiesFromStorage));
        this.houses = [...this.houses, ...res.listings];
        if (this.houses.length === 0) {
          this.noResults = true;
        }
      }),
      err => {
        this.errorMessage = err;
        console.error(err);
      }
  }

  getFavoriteProperties(){
    this.resultsReady = true;
    this.houses = this.userService.getFavoriteDataFromStorage();
    if (this.houses.length === 0) {
      this.noResults = true;
    }else{
      this.numberHouses = this.houses.length;
    }
  }

  openPropertyPage(house){
    if (house.id === ""){
      house.id = this.userService.savePropertyAndGetId(house);
    }
    this.router.navigate([`/propertylisting/${house.id}`]);
  }

  getMoreProperty(){
    this.currentPage++;
    this.startSearch(this.text, this.currentPage);
  }
}

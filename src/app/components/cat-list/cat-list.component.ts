import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CatService } from '../../services/cat.service';
import { Cat } from '../../models/cat.model';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.component.html',
  styleUrls: ['./cat-list.component.scss']
})
export class CatListComponent implements OnInit, AfterViewInit, OnDestroy {
  cats: Cat[] = [];
  filteredCats: Cat[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  sortOrder: string = ''; 
  sortAgeOrder: string = ''; 
  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer!: IntersectionObserver;
  private catsSubscription!: Subscription;

  constructor(private catService: CatService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadCats();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.observer) {
      this.observer.disconnect();
    }
    if (this.catsSubscription) {
      this.catsSubscription.unsubscribe();
    }
  }

  loadCats(): void {
    this.catsSubscription = this.catService.getCats(this.currentPage, this.itemsPerPage).subscribe(
      (data) => {
        const uniqueCats = data.filter(cat => !this.cats.some(existingCat => existingCat.id === cat.id));
        this.cats = this.cats.concat(uniqueCats);
        this.currentPage++;
        this.applySortingAndFiltering(); 
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  loadAllCats(): void {
    this.catsSubscription = this.catService.getCats().subscribe(
      (data) => {
        this.cats = data;
        this.applySortingAndFiltering();
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.searchTerm === '') {
        this.loadCats();
      }
    }, options);

    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.resetPagination();
  }

  onSort(sortParams: { sortBy: string, order: string }): void {
    if (sortParams.sortBy === 'date') {
      this.sortOrder = sortParams.order;
      this.sortAgeOrder = ''; 
    } else if (sortParams.sortBy === 'age') {
      this.sortAgeOrder = sortParams.order;
      this.sortOrder = ''; 
    }
    this.applySortingAndFiltering();
  }

  resetPagination(): void {
    this.currentPage = 1;
    this.cats = [];
    this.filteredCats = [];
    if (this.searchTerm) {
      this.loadAllCats();
    } else {
      this.loadCats();
    }
  }

  applySortingAndFiltering(): void {
    this.filterCats();
    this.sortCats();
  }

  filterCats(): void {
    if (this.searchTerm) {
      this.filteredCats = this.cats.filter(cat =>
        cat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cat.breed.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCats = [...this.cats];
    }
  }

  sortCats(): void {
    if (this.sortOrder) {
      this.filteredCats.sort((a, b) => {
        const dateA = new Date(a.listed_at).getTime();
        const dateB = new Date(b.listed_at).getTime();
        return this.sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      });
    } else if (this.sortAgeOrder) {
      this.filteredCats.sort((a, b) => {
        return this.sortAgeOrder === 'youngest' ? a.age - b.age : b.age - a.age;
      });
    }
  }
}
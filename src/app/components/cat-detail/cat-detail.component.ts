import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService } from '../../services/cat.service';
import { Cat } from '../../models/cat.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './cat-detail.component.html',
  styleUrls: ['./cat-detail.component.scss'],
  providers: [DatePipe]
})
export class CatDetailComponent implements OnInit {
  cat: Cat | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private catService: CatService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const catId = this.route.snapshot.paramMap.get('id');
    if (catId) {
      this.catService.getCat(catId).subscribe(
        (data) => {
          this.cat = data;
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    }
  }

  close(): void {
    this.router.navigate(['/']); 
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'longDate') || date;
  }
}
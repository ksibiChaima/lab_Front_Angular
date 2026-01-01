import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutilService } from 'src/services/outil.service';

@Component({
  selector: 'app-outil-detail',
  templateUrl: './outil-detail.component.html',
  styleUrls: ['./outil-detail.component.css']
})
export class OutilDetailComponent implements OnInit {
  outil: any;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private outilService: OutilService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/outils']); return; }
    this.loading = true;
    this.outilService.getById(id).subscribe(o => { this.outil = o; this.loading = false; }, () => (this.loading = false));
  }
}

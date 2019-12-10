import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Key, KeysService} from '../../../services/keys.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-keys-detail',
  templateUrl: './keys-detail.component.html',
  styleUrls: ['./keys-detail.component.scss']
})
export class KeysDetailComponent implements OnInit {

  key: Key;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, public keysService: KeysService, private router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.keysService.getKey(params['id']).pipe(take(1)).subscribe(key => {
        this.key = key;
      });
    });
  }

  removeKey() {
    this.keysService.removeKey(this.key.id).pipe(take(1)).subscribe(() => {
      this.router.navigate(['/keys']);
    });
  }

}

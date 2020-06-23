import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuhthenticated => {
        this.userIsAuthenticated = isAuhthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}

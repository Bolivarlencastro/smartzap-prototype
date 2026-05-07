import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerNavComponent } from './inner-nav.component';
import { Router } from '@angular/router';

describe('InnerNavComponent', () => {
  let component: InnerNavComponent;
  let fixture: ComponentFixture<InnerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: Router, useValue: { url: '/profile/account' } }],
    }).compileComponents();

    fixture = TestBed.createComponent(InnerNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return a boolean value when the tab is active', () => {
    expect(component.isActive('account')).toBe(true);
  });
});

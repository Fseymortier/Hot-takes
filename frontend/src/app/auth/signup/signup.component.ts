import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: UntypedFormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(private formBuilder: UntypedFormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    this.auth.createUser(email, password).pipe(
      tap(() => {
        this.loading = false;
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMsg = error.message;
        return EMPTY;
      })
    ).subscribe();
  }

}

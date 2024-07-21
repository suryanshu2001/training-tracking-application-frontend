import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { JwtService } from '../Services/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private jwtService: JwtService
  ) { }
  hide = true;

  // reactive forms
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      rememberMe: new FormControl(null, Validators.required),
    });
  }

  protected openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  protected onSubmit() {
    if (this.loginForm.invalid) {
      this.openSnackBar('Please enter valid credentials.');
      return;
    }

    const requestBody = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.loginService.login(requestBody).subscribe({
      next: (data) => {
        localStorage.setItem('token', JSON.stringify(data.jwt));
        const decoded = this.jwtService.decodeJwt(data.jwt);
        console.log("decoded:",decoded)
        if (!decoded || !decoded.sub) {
          this.openSnackBar('Invalid token received.');
          return;
        }

        if (!decoded.sub) {
          this.openSnackBar('Failed to parse user details.');
          return;
        }
          this.loginService.getUser(decoded.sub).subscribe({
            next: (userData) => {
              if (userData.userRole === 'admin') {
              localStorage.setItem('loggedInSaveAdmin', 'true');
              localStorage.setItem('user', JSON.stringify(userData));
              this.router.navigate(['admin/home/', 'courses']);
            } else if (userData.userRole === 'teacher') {
              localStorage.setItem('loggedInSaveTeacher', 'true');
              localStorage.setItem('user', JSON.stringify(userData));
              this.router.navigate(['teacher/home']);
            }},
            error: (err) => {
              console.error('Error fetching user details:', err);
              this.openSnackBar('Failed to fetch user details.');
            }
          });

    },
      error: (err) => {
        console.error('Login error:', err);
        this.openSnackBar('Login failed. Please check your credentials.');
      }
    }
    );
  }
}

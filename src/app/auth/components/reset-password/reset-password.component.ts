import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    isSpinnerLoading = false;
    private token = '';
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.initForm();
        this.token = this.route.snapshot.params.token;
    }

    onSubmit() {
        const { password, confirmPassword } = this.resetPasswordForm.value;
        if (password !== confirmPassword) {
            this.snackBar.open('Both password should match', 'warning', {
                duration: 3000,
            });
            return;
        }
        this.isSpinnerLoading = true;
        this.authService
            .resetPassword({ token: this.token, password })
            .subscribe(
                data => {
                    this.snackBar.open(
                        'Password updated successfully',
                        'Success',
                        {
                            duration: 3000,
                        }
                    );
                    this.router.navigate(['/login']);
                },
                err => this.errorHandler(err, 'Oops, something went wrong'),
                () => (this.isSpinnerLoading = false)
            );
    }

    private initForm() {
        this.resetPasswordForm = this.fb.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }

    private errorHandler(error, message) {
        this.isSpinnerLoading = false;
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 2000,
        });
    }
}

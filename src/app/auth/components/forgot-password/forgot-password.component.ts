import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    isSpinnerLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.forgotPasswordForm = this.fb.group({
            email: ['', Validators.required],
        });
    }

    onSubmit() {
        this.isSpinnerLoading = true;
        this.authService
            .forgotPassword(this.forgotPasswordForm.value)
            .subscribe(
                data => {
                    this.snackBar.open(data.message, 'Success', {
                        duration: 3000,
                    });
                },
                err => {
                    this.errorHandler(err, 'Oops, something went wrong');
                },
                () => (this.isSpinnerLoading = false)
            );
    }

    private errorHandler(error, message) {
        this.isSpinnerLoading = false;
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 2000,
        });
    }
}

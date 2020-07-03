import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
    @Output() toggleSidenav = new EventEmitter<void>();
    isSpinnerLoading = false;
    constructor(
        private jwtService: JwtService,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {}

    logout() {
        this.authService.logout().subscribe(
            data => {
                console.log(data);
            },
            err => this.errorHandler(err, 'Oops, something went wrong'),
            () => {
                this.jwtService.destroyToken();
                this.router.navigate(['/login']);
            }
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

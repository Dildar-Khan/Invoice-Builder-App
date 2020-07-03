import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-client-dialog-form',
    templateUrl: './client-dialog-form.component.html',
    styleUrls: ['./client-dialog-form.component.scss'],
})
export class ClientDialogFormComponent implements OnInit {
    clientForm: FormGroup;
    title = 'New Client';
    constructor(
        public dialogRef: MatDialogRef<ClientDialogFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private clientService: ClientService,
        private snackBar: MatSnackBar
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.initClientForm();
        if (this.data && this.data._id) {
            this.setClientToForm(this.data._id);
        }
    }

    private setClientToForm(id) {
        this.title = 'Edit Client';
        this.clientService.getClient(id).subscribe(
            client => {
                this.clientForm.patchValue(client);
            },
            err => this.errorHandler(err, 'Failed to load Client')
        );
    }

    private initClientForm() {
        this.clientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
        });
    }

    private errorHandler(error, message) {
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 3000,
        });
    }
}

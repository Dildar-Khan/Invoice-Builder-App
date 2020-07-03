import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Client } from '../../models/client';
import { ClientDialogFormComponent } from '../client-dialog-form/client-dialog-form.component';
import { flatMap, filter } from 'rxjs/operators';
import { remove } from 'lodash';

@Component({
    selector: 'app-client-listing',
    templateUrl: './client-listing.component.html',
    styleUrls: ['./client-listing.component.scss'],
})
export class ClientListingComponent implements OnInit {
    constructor(
        private clientService: ClientService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'action'];
    dataSource = new MatTableDataSource<Client>();
    isSpinnerLoading = false;

    ngOnInit() {
        this.isSpinnerLoading = true;
        this.clientService.getClients().subscribe(
            data => {
                this.dataSource.data = data;
                this.isSpinnerLoading = false;
            },
            err => this.errorHandler(err, 'Failed to fetch Clients'),
            () => (this.isSpinnerLoading = false)
        );
    }

    delete(id) {
        this.clientService.deleteClient(id).subscribe(
            data => {
                const removeItems = remove(this.dataSource.data, item => {
                    return item._id === data._id;
                });
                this.dataSource.data = [...this.dataSource.data];
                this.snackBar.open('Client deleted', 'Success', {
                    duration: 2000,
                });
            },
            err => this.errorHandler(err, 'Failed to delete Client')
        );
    }

    openDialog(id: string): void {
        const options = {
            width: '400px',
            height: '350px',
            data: {},
        };

        if (id) {
            options.data = { _id: id };
        }

        const dialogRef = this.dialog.open(ClientDialogFormComponent, options);

        dialogRef
            .afterClosed()
            .pipe(
                filter(clientParam => typeof clientParam === 'object'),
                flatMap(result => {
                    return id
                        ? this.clientService.updateClient(id, result)
                        : this.clientService.createClient(result);
                })
            )
            .subscribe(
                client => {
                    let successMsg = '';
                    if (id) {
                        const index = this.dataSource.data.findIndex(
                            data => data._id === id
                        );
                        this.dataSource.data[index] = client;
                        successMsg = 'Client updated successfully';
                    } else {
                        this.dataSource.data.push(client);
                        successMsg = 'Client created successfully';
                    }
                    this.dataSource.data = [...this.dataSource.data];
                    this.snackBar.open(successMsg, 'Success', {
                        duration: 2000,
                    });
                },
                err => this.errorHandler(err, 'Failed to create client')
            );
    }

    private errorHandler(error, message) {
        this.isSpinnerLoading = false;
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 3000,
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Invoice } from '../../models/invoice';
import { ClientService } from 'src/app/clients/services/client.service';
import { Client } from '../../../clients/models/client';

@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: ['./invoice-form.component.scss'],
})
export class InvoiceFormComponent implements OnInit {
    private invoiceVariable: Invoice;
    invoiceForm: FormGroup;
    clients: Client[] = [];
    title = 'New Invoice';

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private clientService: ClientService,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.createForm();
        this.setInvoiceToForm();
        this.setClients();
    }

    onSubmit() {
        if (this.invoiceVariable) {
            this.invoiceService
                .updateInvoice(this.invoiceVariable._id, this.invoiceForm.value)
                .subscribe(
                    data => {
                        this.snackBar.open('Invoice update', 'Success', {
                            duration: 3000,
                        });
                        this.router.navigate(['dashboard', 'invoices']);
                    },
                    err => this.errorHandler(err, 'Failed to update Invoice')
                );
        } else {
            this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
                data => {
                    this.snackBar.open('Invoice created!', 'Success', {
                        duration: 3000,
                    });
                    this.invoiceForm.reset();
                    this.router.navigate(['dashboard', 'invoices']);
                },
                err => this.errorHandler(err, 'Failed to create Invoice')
            );
        }
    }

    private setInvoiceToForm() {
        this.route.params.subscribe(params => {
            const id = params.id;
            if (!id) {
                return;
            }
            this.title = 'Edit Invoice';
            // this.invoiceService.getOneInvoice(id).subscribe(
            //     invoice => {
            //         this.invoiceVariable = invoice;
            //         this.invoiceForm.patchValue(this.invoiceVariable);
            //     },
            //     err => this.errorHandler(err, 'Failed to get Invoice')
            // );
            this.route.data.subscribe(
                (data: { invoice: Invoice }) => {
                    this.invoiceVariable = data.invoice;
                    if (this.invoiceVariable.client) {
                        this.invoiceForm.patchValue({
                            client: this.invoiceVariable.client._id,
                        });
                    }
                    this.invoiceForm.patchValue({
                        item: this.invoiceVariable.item,
                        qty: this.invoiceVariable.qty,
                        date: this.invoiceVariable.date,
                        due: this.invoiceVariable.due,
                        rate: this.invoiceVariable.rate,
                        tax: this.invoiceVariable.tax,
                    });
                },
                err => this.errorHandler(err, 'Failed to get Invoice')
            );
        });
    }

    private setClients() {
        this.clientService.getClients().subscribe(
            client => {
                this.clients = client;
            },
            err => this.errorHandler(err, 'Failed to get Clietns')
        );
    }

    private createForm() {
        this.invoiceForm = this.fb.group({
            item: ['', Validators.required],
            date: ['', Validators.required],
            due: ['', Validators.required],
            qty: ['', Validators.required],
            client: ['', Validators.required],
            rate: '',
            tax: '',
        });
    }

    private errorHandler(error, message) {
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 3000,
        });
    }
}

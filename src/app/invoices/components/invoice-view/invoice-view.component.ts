import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-invoice-view',
    templateUrl: './invoice-view.component.html',
    styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent implements OnInit {
    invoiceView: Invoice;
    total: number;
    isSpinnerLoading = false;
    constructor(
        private route: ActivatedRoute,
        private invoiceService: InvoiceService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.route.data.subscribe((data: { invoice: Invoice }) => {
            this.invoiceView = data.invoice;
            if (
                typeof this.invoiceView.qty !== 'undefined' &&
                typeof this.invoiceView.rate !== 'undefined'
            ) {
                this.total = this.invoiceView.qty * this.invoiceView.rate;
            }
            let salesTax = 0;
            if (typeof this.invoiceView.tax !== 'undefined') {
                salesTax = (this.total * this.invoiceView.tax) / 100;
            }
            this.total += salesTax;
        });
    }
    downloadHandler(id) {
        this.isSpinnerLoading = true;
        this.invoiceService.downloadInvoice(id).subscribe(
            data => {
                saveAs(data, this.invoiceView.item);
                this.isSpinnerLoading = false;
            },
            err => {
                this.errorHandler(err, 'Error while downloading Invoice');
            }
        );
    }

    private errorHandler(error, message) {
        console.error(error);
        this.isSpinnerLoading = false;
        this.snackBar.open(message, 'Error', {
            duration: 3000,
        });
    }
}

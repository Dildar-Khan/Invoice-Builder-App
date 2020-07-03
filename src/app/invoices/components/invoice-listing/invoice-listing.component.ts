import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    AfterViewChecked,
} from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';
import { Router } from '@angular/router';
import {
    MatSnackBar,
    MatPaginator,
    MatSort,
    MatTableDataSource,
} from '@angular/material';
import { remove } from 'lodash';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { of as observableOf, merge } from 'rxjs';

@Component({
    selector: 'app-invoice-listing',
    templateUrl: './invoice-listing.component.html',
    styleUrls: ['./invoice-listing.component.scss'],
})
export class InvoiceListingComponent
    implements OnInit, AfterViewInit, AfterViewChecked {
    constructor(
        private invoiceService: InvoiceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private changeDetector: ChangeDetectorRef
    ) {}

    displayedColumns: string[] = [
        'item',
        'date',
        'due',
        // 'qty',
        // 'rate',
        // 'tax',
        'action',
    ];
    dataSource = new MatTableDataSource<Invoice>();
    resultsLength = 0;
    isSpinnerLoading = false;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    save() {
        this.router.navigate(['dashboard', 'invoices', 'new']);
    }

    edit(id) {
        this.router.navigate(['dashboard', 'invoices', id]);
    }

    delete(id) {
        this.invoiceService.deleteInvoice(id).subscribe(
            data => {
                remove(this.dataSource.data, item => {
                    return item._id === data._id;
                });
                this.dataSource.data = [...this.dataSource.data];
                this.snackBar.open('Invoice deleted', 'Success', {
                    duration: 3000,
                });
            },
            err => this.errorHandler(err, 'Failed to delete Invoice')
        );
    }
    ngOnInit() {
        // this.populateInvoices();
    }

    filterText(filterValue: string) {
        this.isSpinnerLoading = true;
        filterValue = filterValue.trim();
        this.paginator.pageIndex = 0;
        this.invoiceService
            .getInvoices({
                page: this.paginator.pageIndex,
                perPage: this.paginator.pageSize,
                sortField: this.sort.active,
                sortDir: this.sort.direction,
                filter: filterValue,
            })
            .subscribe(
                data => {
                    this.dataSource.data = data.docs;
                    this.resultsLength = data.total;
                    this.isSpinnerLoading = true;
                },
                err => this.errorHandler(err, 'Failed to filter invoices')
            );
    }

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }

    ngAfterViewInit() {
        merge(this.paginator.page, this.sort.sortChange)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isSpinnerLoading = true;
                    return this.invoiceService.getInvoices({
                        page: this.paginator.pageIndex,
                        perPage: this.paginator.pageSize,
                        sortField: this.sort.active,
                        sortDir: this.sort.direction,
                        filter: '',
                    });
                }),
                map(data => {
                    this.isSpinnerLoading = false;
                    this.resultsLength = data.total;
                    return data.docs;
                }),
                catchError(() => {
                    this.isSpinnerLoading = false;
                    this.errorHandler('Failed to fetch to invoice', 'Error');
                    return observableOf([]);
                })
            )
            .subscribe(data => {
                this.dataSource.data = data;
            });
        // this.paginator.page
        //     .pipe(
        //         flatMap(() => {
        //             this.isSpinnerLoading = true;
        //             return this.invoiceService.getInvoices({
        //                 page: this.paginator.pageIndex,
        //                 perPage: this.paginator.pageSize,
        //                 sortField: this.sort.active,
        //                 sortDir: this.sort.direction,
        //             });
        //         })
        //     )
        //     .subscribe(
        //         results => {
        //             this.dataSource = results.docs;
        //             this.resultsLength = results.total;
        //             this.isSpinnerLoading = false;
        //         },
        //         err => this.errorHandler(err, 'Failed to Fetch Invoices')
        //     );
        // // Sorting Data
        // this.sort.sortChange
        //     .pipe(
        //         flatMap(() => {
        //             this.isSpinnerLoading = true;
        //             this.paginator.pageIndex = 0;
        //             return this.invoiceService.getInvoices({
        //                 page: this.paginator.pageIndex,
        //                 perPage: this.paginator.pageSize,
        //                 sortField: this.sort.active,
        //                 sortDir: this.sort.direction,
        //             });
        //         })
        //     )
        //     .subscribe(
        //         results => {
        //             this.dataSource = results.docs;
        //             this.resultsLength = results.total;
        //             this.isSpinnerLoading = false;
        //         },
        //         err => this.errorHandler(err, 'Failed to Fetch Invoices')
        //     );
        // // Call all invoices
        // this.populateInvoices();
    }

    // private populateInvoices() {
    //     this.isSpinnerLoading = true;
    //     this.invoiceService
    //         .getInvoices({
    //             page: this.paginator.pageIndex,
    //             perPage: this.paginator.pageSize,
    //             sortField: this.sort.active,
    //             sortDir: this.sort.direction,
    //         })
    //         .subscribe(
    //             data => {
    //                 this.dataSource = data.docs;
    //                 this.resultsLength = data.total;
    //             },
    //             err => this.errorHandler(err, 'Failed to Fetch Invoices'),
    //             () => {
    //                 this.isSpinnerLoading = false;
    //             }
    //         );
    // }

    private errorHandler(error, message) {
        this.isSpinnerLoading = false;
        console.error(error);
        this.snackBar.open(message, 'Error', {
            duration: 3000,
        });
    }
}

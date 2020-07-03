import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Invoice } from '../models/invoice';
import { Observable } from 'rxjs';
import { InvoiceService } from './invoice.service';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EditInvoiceResolverService implements Resolve<Invoice> {
    constructor(
        private invoiceService: InvoiceService,
        private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Invoice> {
        const id = route.paramMap.get('id');
        return this.invoiceService.getOneInvoice(id).pipe(
            take(1),
            map(invoice => {
                if (invoice) {
                    return invoice;
                } else {
                    this.router.navigate(['dashboard', 'invoices']);
                    return null;
                }
            })
        );
    }
}

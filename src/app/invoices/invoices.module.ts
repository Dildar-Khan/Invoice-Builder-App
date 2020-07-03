import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListingComponent } from './components/invoice-listing/invoice-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { InvoiceService } from './services/invoice.service';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { EditInvoiceResolverService } from './services/edit-invoice-resolver.service';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        InvoiceListingComponent,
        InvoiceFormComponent,
        InvoiceViewComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
    ],
    providers: [InvoiceService, EditInvoiceResolverService],
})
export class InvoicesModule {}

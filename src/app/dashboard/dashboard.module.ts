import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { InvoiceBuilderComponent } from './invoice-builder/invoice-builder.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../shared/material.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { ClientsModule } from '../clients/clients.module';

@NgModule({
    declarations: [InvoiceBuilderComponent, SideNavComponent, ToolbarComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        InvoicesModule,
        ClientsModule,
        MaterialModule,
    ],
})
export class DashboardModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListingComponent } from './components/client-listing/client-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ClientService } from './services/client.service';
import { ClientDialogFormComponent } from './components/client-dialog-form/client-dialog-form.component';

@NgModule({
    declarations: [ClientListingComponent, ClientDialogFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
    providers: [ClientService],
    entryComponents: [ClientDialogFormComponent],
})
export class ClientsModule {}

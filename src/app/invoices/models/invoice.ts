import { Client } from 'src/app/clients/models/client';

export class Invoice {
    // tslint:disable-next-line: variable-name
    _id: string;
    item: string;
    qty: number;
    date: Date;
    due: Date;
    tax: number;
    rate: number;
    client: Client;
}

export class InvoicePaginationRsp {
    docs: Invoice[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}

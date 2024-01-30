import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DailyExchangeRate {
  open: number;
  high: number;
  low: number;
  close: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardRateLastMonthService {
  apiKey: string;
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.apiKey = 'RVZG0GHEV2KORLNA'
    this.baseUrl = 'https://api-brl-exchange.actionlabs.com.br/api/1.0/open/dailyExchangeRate';
  }

  getMonthExchangeRates(currencyCodeFrom: string, currencyCodeTo: string): Observable<DailyExchangeRate[]> {
    const url = `${this.baseUrl}?apiKey=${this.apiKey}&from_symbol=${encodeURIComponent(currencyCodeFrom)}&to_symbol=${encodeURIComponent(currencyCodeTo)}`;

    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Erro na solicitação de cotações mensais:', error);
        return throwError(error);
      })
    );
  }
}

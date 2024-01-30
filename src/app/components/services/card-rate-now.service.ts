import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CardRateNowService {
  apiKey: string;
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.apiKey = 'RVZG0GHEV2KORLNA';
    this.baseUrl = 'https://api-brl-exchange.actionlabs.com.br/api/1.0/open/currentExchangeRate';
  }

  getCurrentExchangeRateData(currencyCodeFrom: string,currencyCodeTo: string ): Observable<any> {
    const url = `${this.baseUrl}?apiKey=${this.apiKey}&from_symbol=${encodeURIComponent(currencyCodeFrom)}&to_symbol=${encodeURIComponent(currencyCodeTo)}`;

    return this.http.get<any>(url).pipe(
      map(response => response),
      catchError(error => {
        console.error('Erro na solicitação de taxa de câmbio:', error);
        return throwError(error);
      })
    );
  }
}

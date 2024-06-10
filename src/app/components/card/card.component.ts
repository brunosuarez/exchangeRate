import { Component, OnInit } from '@angular/core';
import { CardRateLastMonthService, DailyExchangeRate } from '../services/card-rate-last-month.service';
import { CardRateNowService } from '../services/card-rate-now.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class Card implements OnInit {

  exchangeRateData: any = null;
  currencyCodeFrom: string = '';
  currencyCodeTo: string = 'BRL';
  lastUpdatedAt: string = '';
  showExchangeRate: boolean = false;
  showCards: boolean = true;

  dailyExchangeRateData: DailyExchangeRate[] = [];

  constructor(private cardRateNowService: CardRateNowService, private cardRateLastMonthService: CardRateLastMonthService) { }

  ngOnInit(): void { }

  getCurrentExchangeRate() {
    this.cardRateNowService.getCurrentExchangeRateData(
      this.currencyCodeFrom.toUpperCase(),
      this.currencyCodeTo.toUpperCase()
    ).subscribe(
      (data) => {
        this.exchangeRateData = data;
        this.showExchangeRate = true;
      },
      (error) => {
        console.error('Erro ao obter taxa de câmbio:', error);
      }
    );
  }

  getMonthExchangeRates() {
    this.cardRateLastMonthService.getMonthExchangeRates(
      this.currencyCodeFrom,
      this.currencyCodeTo,
    ).subscribe(
      (response: any) => {
        if (response.success) {
          const sortedData = response.data.sort((a: DailyExchangeRate, b: DailyExchangeRate) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.dailyExchangeRateData = sortedData.slice(0, 30);
          this.showCards = !this.showCards;
        } else {
          console.error('Erro ao obter cotações mensais:', response.message);
        }
      },
    );
  }

  upperCaseInput() {
    this.currencyCodeFrom = this.currencyCodeFrom.toUpperCase();
  }

  differenceCalculation(data: DailyExchangeRate): string {
    if (data.open !== 0) {
      const diffPercentage = ((data.close - data.open) / data.open) * 100;
      return diffPercentage.toFixed(2);
    } else {
      return '0.00';
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  isNegativeDiff(data: DailyExchangeRate): boolean {
    const diffPercentage = +this.differenceCalculation(data);
    return diffPercentage < 0;
  }
}
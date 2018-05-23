import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr')

const monthsStrings = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];


export class DateMoving {
  public date: moment.Moment;
  public hour: string;
  public number: number;
  public month: string;
  public year: number;

  constructor(time: number) {
    this.date = moment(time * 1000);
    this.hour = `${this.date.format('HH:mm')}`;
    this.number = this.date.date();
    this.year = this.date.year();
    this.month = monthsStrings[this.date.month()];
  }

  fullString() {
    return this.date.format('Do MMMM YYYY, HH:mm');
  }
}
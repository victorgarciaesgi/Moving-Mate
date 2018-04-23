import moment from 'moment';
import 'moment/locale/fr';

const monthsStrings = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];


export class DateMoving {
  public date: moment.Moment;
  public hour: string;
  public number: number;
  public month: string;

  constructor(time: number) {
    this.date = moment(time);
    this.hour = `${this.date.hours()}:00`;
    this.number = this.date.date();
    this.month = monthsStrings[this.date.month()];
  }

  fullString() {
    return this.date.format('Do MMMM YYYY, hh:mm');
  }
}
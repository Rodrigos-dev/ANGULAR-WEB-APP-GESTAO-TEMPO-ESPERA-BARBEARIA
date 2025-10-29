export class DateUtil {
  static getFormattedDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }
}

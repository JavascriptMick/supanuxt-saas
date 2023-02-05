export class UtilService {
  public static addMonths(date: Date, months: number): Date {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }
}
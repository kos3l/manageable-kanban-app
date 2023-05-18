import dayjs from "dayjs";

export class DateHelper {
  static formatDateToString(date: Date, format: string): string {
    return dayjs(date).format(format);
  }
  static addOneDay(date1: Date) {
    return dayjs(date1).add(1, "day").toDate();
  }

  static differenceInDays(date1: Date, date2: Date) {
    return dayjs(date1).diff(date2, "day");
  }
}

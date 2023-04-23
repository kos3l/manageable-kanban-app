import dayjs from "dayjs";

export class DateHelper {
  static formatDateToString(date: Date, format: string): string {
    return dayjs(date).format(format);
  }
}

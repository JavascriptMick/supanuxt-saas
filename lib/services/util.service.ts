export class UtilService {
  public static addMonths(date: Date, months: number): Date {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  public static getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }

  public static stringifySafely(obj: any) {
    let cache: any[] = [];
    let str = JSON.stringify(obj, function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = []; // reset the cache
    return str;
  }  
}
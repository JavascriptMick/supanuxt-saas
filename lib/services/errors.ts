export class AccountLimitError extends Error {
  constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, AccountLimitError.prototype);
  }
}
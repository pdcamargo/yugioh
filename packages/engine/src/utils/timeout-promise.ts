export type TimeoutPromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void,
  onCancel: (callback: () => void) => void,
) => void;

export class TimeoutPromise<T> {
  private promise: Promise<T>;
  private fulfillFn!: (value: T) => void;
  private rejectFn!: (reason?: any) => void;
  private timeoutId: NodeJS.Timeout;
  private isCanceled: boolean = false;
  private cancelFn: (() => void) | null = null;

  constructor(executor: TimeoutPromiseExecutor<T>, timeout: number) {
    this.promise = new Promise<T>((resolve, reject) => {
      this.fulfillFn = resolve;
      this.rejectFn = reject;

      executor(
        (value) => {
          if (!this.isCanceled) {
            this.clearTimeout();
            resolve(value);
          }
        },
        (reason) => {
          if (!this.isCanceled) {
            this.clearTimeout();
            reject(reason);
          }
        },
        (onCancel) => {
          this.cancelFn = onCancel;
        },
      );
    });

    this.timeoutId = setTimeout(() => {
      this.cancel("Timeout exceeded");
    }, timeout);
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onRejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch<TResult = never>(
    onRejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    return this.promise.catch(onRejected);
  }

  finally(onFinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onFinally);
  }

  fulfill(value: T) {
    if (!this.isCanceled) {
      this.clearTimeout();
      this.fulfillFn(value);
    }
  }

  reject(reason?: any) {
    if (!this.isCanceled) {
      this.clearTimeout();
      this.rejectFn(reason);
    }
  }

  cancel(reason?: any) {
    if (!this.isCanceled) {
      this.isCanceled = true;
      this.clearTimeout();
      if (this.cancelFn) {
        this.cancelFn();
      }
      this.rejectFn(reason);
    }
  }

  private clearTimeout() {
    clearTimeout(this.timeoutId);
  }

  async await(): Promise<T> {
    return this.promise;
  }
}

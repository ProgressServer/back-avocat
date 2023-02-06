export class HttpResponseModel<T> {
    data!: T;
    error!: boolean;
    message!: string;
    statusCode!: number;

    public constructor(init?: Partial<HttpResponseModel<T>>) {
        Object.assign(this, init);
    }
}

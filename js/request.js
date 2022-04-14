export class Request {
    constructor() {
        this._fields = [];
    }
    static new() {
        return new Request();
    }
    fields(...fields) {
        const r = this;
        r._fields.push(...fields.map(f => f.toString()));
        return r;
    }
    child(key, f) {
        const r = this;
        const child = f(Request.new());
        r._fields.push(`${key}{${child.stringify()}}`);
        return r;
    }
    stringify() {
        return this._fields.join(' ');
    }
    parse(response) {
        if (response) {
            return response;
        }
    }
}
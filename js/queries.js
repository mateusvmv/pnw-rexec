import { PaginatorRequest } from './paginator.js';
import { Request, stringifyArgs } from './request.js';
export class QueryRequest {
    constructor(endpoint, args, request) {
        this.endpoint = endpoint;
        this.args = args;
        this.request = request;
    }
    stringify() {
        if (Object.keys(this.args).length > 0) {
            const args = Object.entries(this.args).map(([k, v]) => `${k}:${stringifyArgs(v)}`).join(' ');
            return `${this.endpoint}(${args}){${this.request.stringify()}}`;
        }
        else {
            return `${this.endpoint}{${this.request.stringify()}}`;
        }
    }
    parse(res) {
        return this.request.parse(res);
    }
    hash() {
        const args = stringifyArgs(this.args);
        const req = this.request.hash();
        let hash = 0;
        for (const c of args)
            hash = ((hash << 5) - hash) + c.charCodeAt(0);
        hash = ((hash << 5) - hash) + req;
        return hash;
    }
}
export class RequestBuilder {
    constructor(executor) {
        this.requests = {};
        this.executor = executor;
    }
    me(f) {
        const builder = this;
        builder.requests.me = new QueryRequest('me', {}, f(new Request()));
        return builder;
    }
    treasures(f) {
        const builder = this;
        builder.requests.treasures = new QueryRequest('treasures', {}, f(new Request()));
        return builder;
    }
    colors(f) {
        const builder = this;
        builder.requests.colors = new QueryRequest('colors', {}, f(new Request()));
        return builder;
    }
    game_info(f) {
        const builder = this;
        builder.requests.game_info = new QueryRequest('game_info', {}, f(new Request()));
        return builder;
    }
    nations(args, f) {
        const builder = this;
        builder.requests.nations = new PaginatorRequest('nations', args, f(new Request()), this.executor);
        return builder;
    }
    alliances(args, f) {
        const builder = this;
        builder.requests.alliances = new PaginatorRequest('alliances', args, f(new Request()), this.executor);
        return builder;
    }
    tradeprices(args, f) {
        const builder = this;
        builder.requests.tradeprices = new PaginatorRequest('tradeprices', args, f(new Request()), this.executor);
        return builder;
    }
    trades(args, f) {
        const builder = this;
        builder.requests.trades = new PaginatorRequest('trades', args, f(new Request()), this.executor);
        return builder;
    }
    wars(args, f) {
        const builder = this;
        builder.requests.wars = new PaginatorRequest('wars', args, f(new Request()), this.executor);
        return builder;
    }
    bounties(args, f) {
        const builder = this;
        builder.requests.bounties = new PaginatorRequest('bounties', args, f(new Request()), this.executor);
        return builder;
    }
    warattacks(args, f) {
        const builder = this;
        builder.requests.warattacks = new PaginatorRequest('warattacks', args, f(new Request()), this.executor);
        return builder;
    }
    treaties(args, f) {
        const builder = this;
        builder.requests.treaties = new PaginatorRequest('treaties', args, f(new Request()), this.executor);
        return builder;
    }
    cities(args, f) {
        const builder = this;
        builder.requests.cities = new PaginatorRequest('cities', args, f(new Request()), this.executor);
        return builder;
    }
    bankrecs(args, f) {
        const builder = this;
        builder.requests.bankrecs = new PaginatorRequest('bankrecs', args, f(new Request()), this.executor);
        return builder;
    }
    baseball_games(args, f) {
        const builder = this;
        builder.requests.baseball_games = new PaginatorRequest('baseball_games', args, f(new Request()), this.executor);
        return builder;
    }
    baseball_teams(args, f) {
        const builder = this;
        builder.requests.baseball_teams = new PaginatorRequest('baseball_teams', args, f(new Request()), this.executor);
        return builder;
    }
    baseball_players(args, f) {
        const builder = this;
        builder.requests.baseball_players = new PaginatorRequest('baseball_players', args, f(new Request()), this.executor);
        return builder;
    }
    async send(options) {
        const entries = Object.entries(this.requests);
        return await this.executor.push(entries, options);
    }
}

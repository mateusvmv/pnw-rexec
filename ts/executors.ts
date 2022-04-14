import { QueryRequest } from "./queries";
import { Query } from "./types";
import fetch, { Response } from "node-fetch";

export interface Executor {
  push<R>(requests: {[K in keyof Query]: QueryRequest<any, any, any>}): Promise<R>;
}

function url() {
  if(config.key) {
    return `https://api.politicsandwar.com/graphql?api_key=${config.key}`;
  } else {
    throw new Error("No API key provided");
  }
}

class QueryError extends Error {
	constructor(response: Response, query: string) {
		super(`GraphQL Query Error: ${response.status} ${response.statusText} ${query}`);
	}
}

interface ExecutorLog {
  date: Date;
  query: string;
  response: Response;
}

export class InstantExecutor implements Executor {
  async push<R>(requests: {[K in keyof Query]: QueryRequest<any, any, any>}): Promise<R> {
    while(true) {
      const queries: string[] = Object.values(requests).map(req => req.stringify());
      const query = `{${queries.join(' ')}}`;
      const response = await fetch(url(), {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: `{"query":"${query}"}`
      });
      const log = {
        date: new Date(),
        query,
        response
      };
      config.log?.(log);
      if(response.ok) {
        const query = await response.json() as { data: Query, errors: any[] };
        if(query.errors?.length > 0) {
          throw new QueryError(response, JSON.stringify(query.errors));
        } else {
          const data = query.data;
          const entries = Object.entries(requests) as ([keyof Query, QueryRequest<any, any, any>])[];
          const result = Object.fromEntries(entries.map(([k,r]) => [k, r.parse(data[k])])) as R;
          return result;
        }
      } else {
        if(response.status === 429) {
          const seconds = Number(response.headers.get("x-ratelimit-reset-after"));
          await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        } else {
          throw new QueryError(response, query);
        }
      }
    }
  }
}

class RequesterConfig {
  executor: Executor = new InstantExecutor();
  key?: string;
  log?: (log: ExecutorLog) => void;
  withExecutor(executor: Executor) {
    this.executor = executor;
  }
  withKey(key: string) {
    this.key = key;
  }
  withLog(log: (log: ExecutorLog) => void) {
    this.log = log;
  }
}

export const config = new RequesterConfig();
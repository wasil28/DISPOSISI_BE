import { GqlExecutionContext } from "@nestjs/graphql";
// import { PluginDefinition } from "@nestjs/graphql/node_modules/apollo-server-core";
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as Sentry from "@sentry/node";
import { verify } from "jsonwebtoken";
import { Plugin } from '@nestjs/apollo';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart({ request: { query }, context: { headers, ipInfo } }: any): Promise<GraphQLRequestListener<any>> {
    // const date = new Date().toDateString();
    
    // const access = { headers, query, ipInfo };
    
    // if (!existsSync('storage/logs/access')) mkdirSync('storage/logs/access');
    // if (!existsSync(`storage/logs/access/${date}-access.log`)) writeFileSync(`storage/logs/access/${date}-access.log`, `${JSON.stringify(access)} \r\n`);
    // else appendFileSync(`storage/logs/access/${date}-access.log`, `${JSON.stringify(access)} \r\n`);

    return {
      async willSendResponse({ source, errors }: any) {
        // const err = { time: new Date().toLocaleString(), source, errors };
        
        // if (!existsSync('storage/logs/errors')) mkdirSync('storage/logs/errors');
        // if (!existsSync(`storage/logs/errors/${date}-error.log`)) writeFileSync(`storage/logs/errors/${date}-error.log`, `${JSON.stringify(err)} \r\n`);
        // else appendFileSync(`storage/logs/errors/${date}-error.log`, `${JSON.stringify(err)} \r\n`);
      }
    }
  }
}

export const sentryPlugin = {
  async requestDidStart({ request }) {
    const scope = Sentry.getCurrentHub().getScope();
    const transaction =  scope?.getTransaction();
    if(request.operationName) {
      if (request.operationName != 'IntrospectionQuery' && transaction) {
        scope?.setTransactionName(`${request.operationName}`)
      }
    }
  }
}

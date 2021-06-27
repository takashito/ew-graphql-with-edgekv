/// <reference types="akamai-edgeworkers"/>

import { logger } from 'log';
import URLParse from "url-parse";
import { createResponse } from 'create-response';
import { getGraphQLParameters, processRequest } from "graphql-helix";
import { schema } from './graphql/schema'

export async function responseProvider(request: EW.ResponseProviderRequest) {
  try {
    //logger.log('request : %s', JSON.stringify(request));
    let url = URLParse(`${request.scheme}://${request.host}${request.url}`, true)

    if (request.path == '/edgekv/graphql') {
      logger.log('/edgekv/graphql : start');

      let req = { 
        method: request.method,
        query: url.query,
        headers: request.getHeaders()
      }

      let {operationName, query, variables} = getGraphQLParameters(req);
      //logger.log('graphql : operationName: %s, query: %s, variables: %s', operationName, query, variables);
    
      const result = await processRequest({
        request: req,
        schema: schema,
        operationName: operationName,
        query: query,
        variables: variables
      });

      if (result.type === 'RESPONSE') {
        return createResponse(
          JSON.stringify(result.payload), { headers: { "Vary":["*"] } }
        );  
      }
    }
  } catch (error) {
    return createResponse(JSON.stringify({errors:JSON.stringify(error)}));
  }
  
  return createResponse(JSON.stringify({path:request.path, query:request.query, response:"ok"}), { headers: { "Vary":["*"] } });
}

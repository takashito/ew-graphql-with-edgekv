# ew-graphql-with-edgekv
REST API federation by Akamai EdgeWoker Graphql Service with additional Object Caching layber using EdgeKV

<img width="926" alt="ew-graphql-with-edgekv" src="https://user-images.githubusercontent.com/2292155/123541138-da670300-d77d-11eb-892d-aa45f2bb4692.png">

## How it work

there are 3 layers of caching for this example

### 1, REST API Caching at Edge Server
 REST API response will be cached at Edge Server<br>

### 2, Object Data Caching at EdgeKV
 Object data will be extracted from REST API response, and saved to EdgeKV per object id. <br>
 Each object has set TTL (shorter than REST API TTL).<br>
 until it does not expires TTL, this cache will be used to create response to client.<br>

### 3, On Memory cache
 once Object data is retrieved from EdgeKV cache, then it will be saved in EdgeWorker's memory space.<br>
 until it does not expires TTL, this cache will be used to create response to client.<br>


## REST API
3 REST API to federate and turn into Single Graphql Service <br>
I have used mockapi servece "My JSON Server" from [typecode](https://my-json-server.typicode.com/)

Books : https://ewdemo.test.edgekey.net/mockapi/books <br>
Authors : https://ewdemo.test.edgekey.net/mockapi/authors <br>
Publishers : https://ewdemo.test.edgekey.net/mockapi/publishers <br>

Database : https://ewdemo.test.edgekey.net/mockapi/db <br>
Sorce Code : https://github.com/takashito/mockapi <br>


## Federated Graphql Schema
```
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
    debug: Debug
  }
  
  type Book {
    id: ID!
    name: String!
    publisher: Publisher!
    authors: [Author!]!
    debug: Debug
  }
  
  type Publisher {
    id: ID!
    name: String!
    books: [Book!]!
    debug: Debug
  }

  type Debug {
    url: ID!
    status: String!
    latency: String
    cacheable: String
    cacheKey: String
    cacheHit: String
  }

  type Query {
    authors: [Author!]!
    author(id: ID!): Author!
    books: [Book!]!
    book(id: ID!): Book!
    publishers: [Publisher!]!
    publisher(id: ID!): Publisher!
  }
```

Now you can access your data with single graphql endpoint.
Routing to rest api to fullfill query will be done by graqhpl engine.
<br>

when you hit these example URLs, you may see error due to EdgeWorker initialization timeout, but after hitting URL 2,3 times, it should work. <br>

## Example URLs without Debug info
```
https://ewdemo.test.edgekey.net/federation/graphql?query={book(id:3){name,authors{name},publisher{name}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={publishers{name,books{name}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={authors{name,books{name}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={books{name,authors{name},publisher{name}}}
```

## Example URLs with Debug info
```
https://ewdemo.test.edgekey.net/federation/graphql?query={book(id:3){name,,debug{url,cacheHit,cacheKey},authors{name,debug{url,cacheHit,cacheKey}},publisher{name,debug{url,cacheHit,cacheKey}}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={publishers{name,books{name},debug{url,cacheKey,cacheHit}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={authors{name,books{name,debug{url,cacheKey,cacheHit}}}}
https://ewdemo.test.edgekey.net/federation/graphql?query={books{name,debug{url,cacheHit},authors{name,debug{url,cacheHit,cacheKey}},publisher{name,debug{url,cacheHit}}}}
```

### Debug Info
+ url: REST API called by graphql engine
+ cacheable: REST API is cacheable or not
+ cacheKey: Akamai CacheKey
+ cacheHit: 
  - KV_MEM_HIT : Object Data was responded from EdgeKV cache stored in EdgeWorker's Memory space
  - KV_HIT : Object Data was responded from EdgeKV cache
  - EDGE_MEM_HIT : REST API was responded from Edge memory cache
  - EDGE_HIT : REST API was responded from Edge disk cache
  - REMOTE_MEM_HIT : REST API was responded from parent memory cache
  - REMOTE_HIT : REST API was responded from parent disk cache
  - CACHE_MISS : REST API was responded from mock api server (origin)

## Known EW Issue

- sending query via POST will not work due to [EdgeWorker limitation](https://learn.akamai.com/en-us/webhelp/edgeworkers/edgeworkers-user-guide/GUID-F709406E-2D67-4996-B619-91E90F04EDF2.html)

- when upload bundle file to sandbox or staging, you will see error 
```
ERROR: got unexpected response from API:
{
  "type": "/sandbox-api/error-types/bad-request",
  "title": "Bad Request.",
  "detail": "Error in tarball file : [Error[message=uncompressed size exceeds the limit of 1 MB, type=MAX_UNCOMPRESSED_SIZE_EXCEEDED]]",
  "instance": "/sandbox-api/error-instances/f4a1637a-c44f-43ec-b02a-f3e60c9ba3c3",
  "status": 400,
  "path": "/sandbox-api/v1/sandboxes/d125b951-d59e-46cf-96b5-f545449d7a1a/edgeworkers/5939",
  "method": "PUT"
}
```
This is due to the EW limitation that bundled code size need to be < 1MB.
to avoid this error, you need to edit follwoing file

```
./node_modules/graphql-helix/dist/render-graphiql.js

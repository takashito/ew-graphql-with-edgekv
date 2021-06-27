import { DataSource } from 'apollo-datasource';
import { ewRequest } from '../lib/ewRequest';
import { ekvCaching } from '../lib/ekvCache';
import { Book, Author, Publisher, Debug } from './type'
import { logger } from 'log';

export class BookService extends DataSource {
    ekv = {
        'Book': new ekvCaching<any>('ew-graphql', 'Book'), 
        'Author': new ekvCaching<any>('ew-graphql', 'Author'), 
        'Publisher': new ekvCaching<any>('ew-graphql', 'Publisher'), 
    }
    constructor() {
        super();
        logger.log('@BookService');
    }

    baseUrl = 'https://ewdemo.test.edgekey.net/mockapi'
    
    initialize() {}

    async getKVCache(object:'Book'|'Author'|'Publisher', ids:string[]) : Promise<Array<any>> {
        let caching = this.ekv[object];
        let getCache = ids.map(id => caching.get(id));
        let caches = await Promise.all(getCache);
        let data:Array<any> = [];
        if (Array.isArray(caches)) {
            caches.forEach( cache => {
                // Adding Debug Info
                if (cache !== undefined && 'value' in cache && 'id' in cache.value) 
                    data.push(Object.assign(cache.value, { 'debug': { '__typename':'Debug', 'url': `EdgeKV/ew-graphql/${object}/${cache.value.id}`, 'status': '200', 'cacheable': 'YES', 'cacheKey':`EdgeKV/ew-graphql/${object}/${cache.value.id}`, 'cacheHit': (cache.memCache) ? 'KV_MEM_HIT' : 'KV_HIT'}}))
            });
        }
        return data;
    }

    setKVCache(object:'Book'|'Author'|'Publisher', value:Book|Author|Publisher) {
        let caching = this.ekv[object];
        if (value !== undefined && 'id' in value) caching.set(value.id, value, 60);
    }

    async callRESTApi(url:string, object:'Book'|'Author'|'Publisher') : Promise<Array<any>> {
        let res = await ewRequest(url);
        let json = (res.ok) ? await res.json() : [];
        let data:Array<any> = []
        if (Array.isArray(json)) {
            json.forEach( v => { 
                // Save All Objects returned by REST API to EdgeKV Cache
                this.setKVCache(object, v); 
                // Adding Debug Info
                data.push(Object.assign(v, { 'debug':res.debug }))
            })
        }
        return data;
    }

    async getAuthors(ids:string[] = []) {
        const endpoint = '/authors';
        const Object = 'Author';
        let data:Array<Author> = [];

        if (!ids.length) {
            return this.callRESTApi(this.baseUrl + endpoint, Object);
        }
        
        // check EdgeKV cache
        let kvHit:{[key:string]:boolean} = {}
        let cache = await this.getKVCache(Object, ids);
        cache.forEach(v => (v !== undefined && 'id' in v) ? kvHit[v.id] = true : false);
        data = data.concat(cache);
        logger.log('#AC:%o',kvHit);

        // query rest of data
        let query = ids.reduce((prev, id) => { if (!kvHit[id]) (prev == '') ? prev += `?id=${id}` : prev += `&id=${id}`; return prev }, '')
        if (query != '') {
            let res = await this.callRESTApi(this.baseUrl + endpoint + query, Object);
            data = data.concat(res);
        }

        return data;
    }
    
    async getAuthor(id) {
        let authors = await this.getAuthors([id]);
        if (Array.isArray(authors) && authors.length) {
            return authors[0];
        }
        return {};
    }
    
    async getPublishers(ids:string[] = []) {
        const endpoint = '/publishers';
        const Object = 'Publisher';
        let data:Array<Publisher> = [];

        if (!ids.length) {
            return this.callRESTApi(this.baseUrl + endpoint, Object);
        }
        
        // check EdgeKV cache
        let kvHit:{[key:string]:boolean} = {}
        let cache = await this.getKVCache(Object, ids);
        cache.forEach(v => (v !== undefined && 'id' in v) ? kvHit[v.id] = true : false);
        data = data.concat(cache);
        logger.log('#PC:%o',kvHit);

        // query rest of data
        let query = ids.reduce((prev, id) => { if (!kvHit[id]) (prev == '') ? prev += `?id=${id}` : prev += `&id=${id}`; return prev }, '')
        if (query != '') {
            data = data.concat(await this.callRESTApi(this.baseUrl + endpoint + query, Object));
        }

        return data;
    }
    
    async getPublisher(id) {
        let publishers = await this.getPublishers([id]);
        if (Array.isArray(publishers) && publishers.length) {
            return publishers[0];
        }
        return {};    
    }
    
    async getBooks(ids:string[] = []) {
        const endpoint = '/books';
        const Object = 'Book';
        let data:Array<Book> = [];

        if (!ids.length) {
            return this.callRESTApi(this.baseUrl + endpoint, Object);
        }
        
        // check EdgeKV cache
        let kvHit:{[key:string]:boolean} = {}
        let cache = await this.getKVCache(Object, ids);
        cache.forEach(v => (v !== undefined && 'id' in v) ? kvHit[v.id] = true : false);
        data = data.concat(cache);
        logger.log('#BC:%o',kvHit);

        // query rest of data
        let query = ids.reduce((prev, id) => { if (!kvHit[id]) (prev == '') ? prev += `?id=${id}` : prev += `&id=${id}`; return prev }, '')
        if (query != '') {
            data = data.concat(await this.callRESTApi(this.baseUrl + endpoint + query, Object));
        }

        return data;
    }

    async getBook(id) {
        let books = await this.getBooks([id]);
        if (Array.isArray(books) && books.length) {
            return books[0];
        }
        return {};
    }
}

export const dataSources = {
    bookService: new BookService()
};

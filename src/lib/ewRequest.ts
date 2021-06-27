import { Headers } from 'create-response';
import { httpRequest, HttpResponse } from 'http-request'
import { logger } from 'log';

export async function ewRequest(url, headers?: Headers) : Promise<ewResponse> {
    let ewRes:ewResponse = new ewResponse(url);

    try {
        headers = {...headers, "Pragma":"akamai-x-get-cache-key, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-get-true-cache-key, akamai-x-check-cacheable, akamai-x-get-request-id, akamai-x-serial-no, akamai-x-get-ssl-client-session-id, X-Akamai-CacheTrack, akamai-x-get-client-ip, akamai-x-feo-trace, akamai-x-tapioca-trace, akamai-x-ew-debug, akamai-x-ew-debug-rp, akamai-x-ew-debug-subs"};
        //let s = Date.now();
        let res = await httpRequest(url, {headers});
        //let e = Date.now();
        // [ISSUE] s, e returns same value
        ewRes.setResponse(res, undefined);
    } catch (error) {
        ewRes.setResponse(undefined, error);
        logger.log('#E:ewRequest:%o', error);
    }
    return ewRes;
}

export class ewResponse {
    constructor(url:string){ 
        this.debug.url = url 
    }

    setResponse(res:HttpResponse | undefined, error:any = undefined, latency:number = 0){
        this.debug.latency = latency.toString();

        if (res !== undefined && res != null && 'ok' in res) {
            this.res = res;
            this.ok = res.ok;
            this.error = {};
            this.debug.status = res.status.toString();
            this.debug.cacheable = res.getHeader('X-Check-Cacheable')?.join();
            this.debug.cacheKey = res.getHeader('X-Cache-Key')?.join();
            let XCache = res.getHeader('X-Cache')?.join();
            let XCacheRemote = res.getHeader('X-Cache-Remote')?.join();
            if (XCache == undefined && XCacheRemote == undefined) this.debug.cacheHit = undefined;
            else if (XCache?.startsWith('TCP_MEM_HIT')) this.debug.cacheHit = 'EDGE_MEM_HIT';
            else if (XCache?.startsWith('TCP_HIT')) this.debug.cacheHit = 'EDGE_HIT';
            else if (XCacheRemote?.startsWith('TCP_MEM_HIT')) this.debug.cacheHit = 'REMOTE_MEM_HIT';
            else if (XCacheRemote?.startsWith('TCP_HIT')) this.debug.cacheHit = 'REMOTE_HIT';
            else this.debug.cacheHit = 'CACHE_MISS'
        }

        if (error !== undefined) this.error = error;
    }

    error:any = {'errors':['ewResponse have not received httpResponse or error Object']}
    res:HttpResponse | undefined = undefined;
    debug : { url:string, status:string, latency:string, cacheable?:string, cacheKey?:string, cacheHit?:string } = { url:'', status:'', latency:''}
    ok : boolean = false;
    status = () => (this.ok) ? this.res?.status : 0;
    body = () => (this.ok) ? this.res?.body : '';
    getHeader = (name:string) => (this.ok) ? this.res?.getHeader(name) : [];
    getHeaders = () => (this.ok) ? this.res?.getHeaders() : {};
    json = () => (this.ok) ? this.res?.json() : Promise.resolve({});
    text = () => (this.ok) ? this.res?.text() : Promise.resolve('');
}

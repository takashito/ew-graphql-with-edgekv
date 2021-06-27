/// <reference types="akamai-edgeworkers"/>

import EdgeKV from './edgekv'
import { logger } from 'log'

export type ekvCache<T extends Object> = {
    value?:T;
    ttl:number;
    lastModified:Date,
    memCache?:boolean;
}

export class ekvCaching<T extends { __typename?:string } > extends EdgeKV {

    cache:{[key:string]:ekvCache<any>} = {};
    #Obj:string = '';

    constructor(
        private namespace:string,
        private group:string
    ) {
        super(namespace, group);
        this.#Obj = namespace + "." + group + ".";
    }

    async get(key:string) : Promise< ekvCache<T> | undefined > {
        try {
            let cache:ekvCache<any>|undefined = this.cache[this.#Obj+key];

            if (cache == undefined) {
                cache = await this.getJson(key, undefined);
            } else {
                cache.memCache = true;
                logger.log('#MCH:%s.%s', this.group, key)
            }

            if (cache !== undefined && 'ttl' in cache && 'lastModified' in cache && 'value' in cache ) {
                if ( Date.now() - new Date(cache.lastModified).getTime() < cache.ttl * 1000) {
                    // keep cache on memory
                    this.cache[this.#Obj+key] = cache;
                    return cache;
                }
                //logger.log('#DC:%s.%s', this.group, key)
                //this.delete(key);
                delete this.cache[this.#Obj+key];
            }
        } catch (error) {
            logger.log('#E:%s.%s:%o', this.group, key, error)
        }
        logger.log('#NC:%s.%s', this.group, key)
        return undefined;
    }

    set(key:string, value:T, ttl:number = 60) {
        let cache:ekvCache<T> = { value:value, ttl:ttl, lastModified:new Date}
        //this.cache[this.#Obj+key] = cache;
        //logger.log('#SC:%s',this.#Obj+key);
        this.putJsonNoWait(key, cache);
    }
}
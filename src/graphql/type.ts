import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID'];
  name: Scalars['String'];
  books: Array<Book>;
  debug?: Maybe<Debug>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  name: Scalars['String'];
  publisher: Publisher;
  authors: Array<Author>;
  debug?: Maybe<Debug>;
};

export type Debug = {
  __typename?: 'Debug';
  url: Scalars['ID'];
  status: Scalars['String'];
  latency?: Maybe<Scalars['String']>;
  cacheable?: Maybe<Scalars['String']>;
  cacheKey?: Maybe<Scalars['String']>;
  cacheHit?: Maybe<Scalars['String']>;
};

export type Publisher = {
  __typename?: 'Publisher';
  id: Scalars['ID'];
  name: Scalars['String'];
  books: Array<Book>;
  debug?: Maybe<Debug>;
};

export type Query = {
  __typename?: 'Query';
  authors: Array<Author>;
  author: Author;
  books: Array<Book>;
  book: Book;
  publishers: Array<Publisher>;
  publisher: Publisher;
};


export type QueryAuthorArgs = {
  id: Scalars['ID'];
};


export type QueryBookArgs = {
  id: Scalars['ID'];
};


export type QueryPublisherArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Author: ResolverTypeWrapper<Author>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Book: ResolverTypeWrapper<Book>;
  Debug: ResolverTypeWrapper<Debug>;
  Publisher: ResolverTypeWrapper<Publisher>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Author: Author;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Book: Book;
  Debug: Debug;
  Publisher: Publisher;
  Query: {};
  Boolean: Scalars['Boolean'];
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  debug?: Resolver<Maybe<ResolversTypes['Debug']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publisher?: Resolver<ResolversTypes['Publisher'], ParentType, ContextType>;
  authors?: Resolver<Array<ResolversTypes['Author']>, ParentType, ContextType>;
  debug?: Resolver<Maybe<ResolversTypes['Debug']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DebugResolvers<ContextType = any, ParentType extends ResolversParentTypes['Debug'] = ResolversParentTypes['Debug']> = {
  url?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cacheable?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cacheKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cacheHit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublisherResolvers<ContextType = any, ParentType extends ResolversParentTypes['Publisher'] = ResolversParentTypes['Publisher']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  debug?: Resolver<Maybe<ResolversTypes['Debug']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authors?: Resolver<Array<ResolversTypes['Author']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<QueryAuthorArgs, 'id'>>;
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<QueryBookArgs, 'id'>>;
  publishers?: Resolver<Array<ResolversTypes['Publisher']>, ParentType, ContextType>;
  publisher?: Resolver<ResolversTypes['Publisher'], ParentType, ContextType, RequireFields<QueryPublisherArgs, 'id'>>;
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  Debug?: DebugResolvers<ContextType>;
  Publisher?: PublisherResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

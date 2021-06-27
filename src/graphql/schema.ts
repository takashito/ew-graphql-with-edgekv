/// <reference types="akamai-edgeworkers"/>
import { logger } from 'log';
import { gql } from 'graphql-tag';
import { dataSources } from './dataSources';
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = gql`
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
`;


export const resolvers = {
  Query: {
      authors() {
          logger.log('resolver:authors');
          return dataSources.bookService.getAuthors();
      },
      author(parent, args) {
          logger.log('resolver:author');
          return dataSources.bookService.getAuthor(args.id);
      },
      books() {
          logger.log('resolver:books');
          return dataSources.bookService.getBooks();
      },
      book(parent, args) {
          logger.log('resolver:book');
          return dataSources.bookService.getBook(args.id);
      },
      publishers() {
          logger.log('resolver:publishers');
          return dataSources.bookService.getPublishers();
      },
      publisher(parent, args) {
          logger.log('resolver:publisher');
          return dataSources.bookService.getPublisher(args.id);
      }
  },

  Author: {
      books(parent) {
          return dataSources.bookService.getBooks(parent.books);
      },
      debug(parent) {
          return Promise.resolve(parent.debug);
      }
  },
  Book: {
      publisher(parent) {
          return dataSources.bookService.getPublisher(parent.publisher);
      },
      authors(parent) {
          return dataSources.bookService.getAuthors(parent.authors);
      },
      debug(parent) {
          return Promise.resolve(parent.debug);
      }
  },
  Publisher: {
      books(parent) {
          return dataSources.bookService.getBooks(parent.books);
      },
      debug(parent) {
          return Promise.resolve(parent.debug);
      }
  }
};

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
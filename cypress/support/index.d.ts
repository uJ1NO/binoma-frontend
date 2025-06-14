/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<any>;
    logout(): Chainable<any>;
    register(name: string, email: string, password: string): Chainable<any>;
  }
} 
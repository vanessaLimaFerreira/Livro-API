// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('postLivro', (livro) => {
    cy.api({
      method: 'POST',
      url: 'http://localhost:5000/api/livros',
      body: livro,
      failOnStatusCode: false
    }).then((response) => {
      return response
    })
  
  })

  Cypress.Commands.add('getLivro', (id) => {
    cy.api({
      method: 'GET',
      url: `http://localhost:5000/api/livros/${id}`,
      failOnStatusCode: false
    }).then((response) => {
      return response;
    });
  });

  Cypress.Commands.add('deleteLivro', (id) => {
    cy.api({
      method: 'DELETE',
      url: `http://localhost:5000/api/livros/${id}`,
      failOnStatusCode: false
    }).then((response) => {
      return response;
    });
  }
  );
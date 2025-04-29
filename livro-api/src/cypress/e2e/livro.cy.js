const { before } = require("mocha");

describe('/livros POST', () => {
  before(() => {
    cy.dropCollection('livros', { database: 'test', failSilently: 'true' }).then(result => {
      cy.log(result); // Will return 'Collection dropped' or the error object if collection doesn’t exist. Will not fail the test
    });
  })

  it('deve cadastrar um novo livro', () => {
    const livro = {

      "titulo": "Titulo do Livro",
      "autor": "J.R.R. Tolkien",
      "editora": "HarperCollins",
      "anoPublicacao": 1955,
      "numeroPaginas": 576
    };

    cy.postLivro(livro)
      .then((response) => {

        cy.log(JSON.stringify(response.body)) //mostra o body no retorno do log do cypress

        expect(response.body.titulo).to.eql(livro.titulo)
        expect(response.body.autor).to.eql(livro.autor)
        expect(response.body.editora).to.eql(livro.editora)
        expect(response.body.anoPublicacao).to.eql(livro.anoPublicacao)
        expect(response.body.numeroPaginas).to.eql(livro.numeroPaginas)
        expect(response.body._id).to.not.be.empty // verifica se o id não é vazio

      })
  })


  it(' Não deve cadastrar um novo livro com o titulo duplicado', () => {
    const livro = {

      "titulo": "Harry Potter e a Pedra Filosofal",
      "autor": "J.K. Rowling",
      "editora": "Rocco",
      "anoPublicacao": 1997,
      "numeroPaginas": 223
    };

    cy.postLivro(livro)
      .then((response) => {
        expect(response.status).to.eq(201)
      })

    cy.postLivro(livro)
      .then((response) => {
        expect(response.status).to.eq(409)
        expect(response.body.erro).to.eql("O título do livro já foi cadastrado.")
      })

  })
})

describe('/livros GET por id', () => {
  let livroId = null;

  before(() => {
    // Busca todos os livros primeiro para obter um ID válido
    cy.api({
      method: 'GET',
      url: 'http://localhost:5000/api/livros',
    }).then((response) => {
      expect(response.status).to.eq(200);

      const livros = response.body;
      if (livros.length === 0) {
        throw new Error('Nenhum livro encontrado para buscar por ID.');
      }

      livroId = livros[0]._id;
    });
  });

 // it('teste direto com ID fixo', () => {
  //  cy.getLivro('6810f5e4b54bb2fd2d477f23').then((response) => {
  //    cy.log(JSON.stringify(response.body));
  //  });
 // });

  it('deve buscar um livro existente pelo ID usando comando customizado', () => {
    cy.getLivro(livroId).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('_id', livroId);
      expect(response.body).to.have.property('titulo');
      expect(response.body).to.have.property('autor');
      expect(response.body).to.have.property('editora');
      expect(response.body).to.have.property('anoPublicacao');
      expect(response.body).to.have.property('numeroPaginas');
    });
  });
});

describe('/livros DELETE', () => {
  let livroId = null;

  it('deve deletar um livro existente pelo ID usando comando customizado', function () {
    // Busca o ID primeiro
    cy.api({
      method: 'GET',
      url: 'http://localhost:5000/api/livros',
    }).then((response) => {
      expect(response.status).to.eq(200);

      const livros = response.body;

      if (livros.length === 0) {
        this.skip(); // pula o teste se não houver livro
      } else {
        livroId = livros[0]._id;

        // Agora deleta
        cy.deleteLivro(livroId).then((res) => {
          expect(res.status).to.be.oneOf([200, 204]);
          if (res.status === 200) {
            expect(res.body).to.have.property('message', 'Livro removido com sucesso');
          }
        });

        // Confirma que foi removido
        cy.getLivro(livroId).then((res) => {
          expect(res.status).to.eq(404);
        });
      }
    });
  });
});



const { defineConfig } = require("cypress");


const { configurePlugin } = require("cypress-mongodb");

module.exports = defineConfig({
  env: {
    mongodb: {
      uri: "mongodb+srv://dba:vanessa123@livroapi.lyhx2ad.mongodb.net/?retryWrites=true&w=majority&appName=LivroApi",
      db: "test",
      collection: "livros",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
       configurePlugin(on)
    },
  },
});

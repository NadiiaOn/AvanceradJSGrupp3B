// The main file for the Nadiia module, which exports all the campaign functions.

export default class rabattModule {

  static descriptor = {
    name: "RabattModule",
    methodsAndInputs: [
      {
        method: 'productsFromDb',
        input: ['productsFromDB - an array of products from the db'],
        output: 'an array of Product instances with getters for price formatting'
      }
    ]
  };

  makeInstances(productsFromDB) {
    return productsFromDB.map(x => new Product(x));
  }

}
/*
From our teacher Thomas

export default class UserHandlerModule {

  static descriptor = {
    name: "UserHandler",
    methodsAndInputs: [
      {
        method: 'createMailLink',
        input: ['a user object'],
        output: 'jsx with a mail link with the users name'
      }
    ],
    // description of the form needed to for user registration
    userRegForm: {
      firstName: {
        label: 'Förnamn',
        type: 'text',
        initialValue: '',
        required: true
      },
      lastName: {
        label: 'Efternamn',
        type: 'text',
        initialValue: '',
        required: true
      },
      email: {
        label: 'E-post',
        type: 'email',
        initialValue: '',
        required: true
      }
    }
  };

  createMailLink({ firstName, lastName, email }) {
    return <a href={"mailto:" + email}>{firstName} {lastName}</a>;
  }

}
  */
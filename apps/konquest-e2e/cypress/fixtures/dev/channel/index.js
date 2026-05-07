(() => {
  const model = {
    companyUUID: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
    categorie: 'automacao cy',
    categorieUUID: 'dbc9ffa1-1f59-428e-a18d-0e67a2770db8',
    type: 'Aberto para a Workspace',
    typeUUID: '94176ccd-d3bd-4ee1-a4ae-c08798125617',
    language: 'Português (BR)',
    languageID: 'pt-BR',
    name: Math.random().toString(36).slice(2),
    description: 'Description of Automate Cypress',
    active: true,
    contributor: {
      user: {
        name: 'New User Cy 2',
        email: 'newuser2@cypress.com.br',
        pass: '123456',
      },
      quantity: 1,
    },
    messages: {
      nameRequired: 'Informe o nome do canal.',
      categorieRequired: 'Informe uma categoria para o canal.',
      typeRequired: 'Informe um tipo para o canal.',
      descriptionRequired: 'Necessário informar uma descrição para o canal.',
      channelNotFound: 'Nenhum canal encontrado.',
    },
  };
  return model;
})()

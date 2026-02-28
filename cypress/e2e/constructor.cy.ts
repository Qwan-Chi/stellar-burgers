/// <reference types="cypress" />

const API_URL = 'https://norma.education-services.ru/api';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${API_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'mockAccessToken');
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    window.localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('[data-cy=add-button]')
        .click();

      cy.get('[data-cy=burger-constructor]')
        .should('contain', 'Краторная булка N-200i (верх)')
        .and('contain', 'Краторная булка N-200i (низ)');
    });

    it('должен добавить начинку в конструктор', () => {
      cy.contains('[data-cy=ingredient]', 'Биокотлета из марсианской Магнолии')
        .find('[data-cy=add-button]')
        .click();

      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должен добавить соус в конструктор', () => {
      cy.contains('[data-cy=ingredient]', 'Соус Spicy-X')
        .find('[data-cy=add-button]')
        .click();

      cy.get('[data-cy=burger-constructor]').should('contain', 'Соус Spicy-X');
    });
  });

  describe('Модальные окна', () => {
    it('должен открыть модальное окно ингредиента при клике', () => {
      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('a')
        .click();

      cy.get('[data-cy=modal]').should('exist');
      cy.get('[data-cy=modal]').should('contain', 'Детали ингредиента');
      cy.get('[data-cy=modal]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=modal]').should('contain', '420');
      cy.get('[data-cy=modal]').should('contain', '80');
      cy.get('[data-cy=modal]').should('contain', '24');
      cy.get('[data-cy=modal]').should('contain', '53');
    });

    it('должен закрыть модальное окно по клику на крестик', () => {
      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('a')
        .click();

      cy.get('[data-cy=modal]').should('exist');

      cy.get('[data-cy=modal-close]').click();

      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрыть модальное окно по клику на оверлей', () => {
      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('a')
        .click();

      cy.get('[data-cy=modal]').should('exist');

      cy.get('[data-cy=modal-overlay]').click({ force: true });

      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрыть модальное окно по нажатию Escape', () => {
      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('a')
        .click();

      cy.get('[data-cy=modal]').should('exist');

      cy.get('body').type('{esc}');

      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен оформить заказ и показать модальное окно с номером', () => {
      cy.intercept('POST', `${API_URL}/orders`, {
        fixture: 'order.json'
      }).as('createOrder');

      cy.contains('[data-cy=ingredient]', 'Краторная булка N-200i')
        .find('[data-cy=add-button]')
        .click();

      cy.contains('[data-cy=ingredient]', 'Биокотлета из марсианской Магнолии')
        .find('[data-cy=add-button]')
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy=modal]').should('exist');
      cy.get('[data-cy=order-number]').should('contain', '12345');

      cy.get('[data-cy=modal-close]').click();

      cy.get('[data-cy=modal]').should('not.exist');

      cy.get('[data-cy=burger-constructor]')
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
    });
  });
});

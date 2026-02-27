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
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[class*=burger_constructor]')
        .should('contain', 'Краторная булка N-200i (верх)')
        .and('contain', 'Краторная булка N-200i (низ)');
    });

    it('должен добавить начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[class*=burger_constructor]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должен добавить соус в конструктор', () => {
      cy.contains('Соус Spicy-X')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[class*=burger_constructor]').should(
        'contain',
        'Соус Spicy-X'
      );
    });
  });

  describe('Модальные окна', () => {
    it('должен открыть модальное окно ингредиента при клике', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      cy.get('#modals').should('contain', 'Детали ингредиента');
      cy.get('#modals').should('contain', 'Краторная булка N-200i');
      cy.get('#modals').should('contain', '420');
      cy.get('#modals').should('contain', '80');
      cy.get('#modals').should('contain', '24');
      cy.get('#modals').should('contain', '53');
    });

    it('должен закрыть модальное окно по клику на крестик', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      cy.get('#modals').should('contain', 'Детали ингредиента');

      cy.get('#modals').find('button').click();

      cy.get('#modals').children().should('have.length', 0);
    });

    it('должен закрыть модальное окно по клику на оверлей', () => {
      cy.contains('a', 'Краторная булка N-200i').click();

      cy.get('#modals').should('contain', 'Детали ингредиента');

      cy.get('[class*=overlay]').click({ force: true });

      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Создание заказа', () => {
    it('должен оформить заказ и показать модальное окно с номером', () => {
      cy.intercept('POST', `${API_URL}/orders`, {
        fixture: 'order.json'
      }).as('createOrder');

      // Собираем бургер: добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Нажимаем «Оформить заказ»
      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось и номер заказа верный
      cy.get('#modals').should('contain', '12345');
      cy.get('#modals').should('contain', 'идентификатор заказа');

      // Закрываем модальное окно
      cy.get('#modals').find('button').click();

      // Проверяем, что модальное окно закрылось
      cy.get('#modals').children().should('have.length', 0);

      // Проверяем, что конструктор пуст
      cy.get('[class*=burger_constructor]')
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
    });
  });
});

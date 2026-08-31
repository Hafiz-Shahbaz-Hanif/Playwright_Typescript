@ui @checkout
Feature: Shopping cart and checkout
  As a signed-in customer
  I want to add products to my cart and check out
  So that I can buy the tools I need

  Background:
    Given I am signed in as a customer

  @smoke @e2e
  Scenario: Add a single product and complete checkout
    When I add the first catalogue product to my cart
    And I open the cart
    Then the cart contains that product with quantity 1
    When I proceed through checkout and pay by "Bank Transfer"
    Then the order is confirmed

  Scenario: Cart keeps the quantity chosen on the product page
    When I open the first catalogue product
    And I set the quantity to 3 and add it to the cart
    And I open the cart
    Then the cart contains that product with quantity 3

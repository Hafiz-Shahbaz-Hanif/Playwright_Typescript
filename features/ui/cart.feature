@ui @cart
Feature: Shopping cart
  As a shopper
  I want products I add to appear in my cart
  So that I can review them before checkout

  Scenario Outline: Adding the first "<term>" result puts it in the cart
    When I add the first "<term>" search result to my cart
    And I open the cart
    Then the cart contains that product

    Examples:
      | term        |
      | hammer      |
      | pliers      |
      | screwdriver |
      | saw         |
      | drill       |
      | sander      |
      | chisel      |
      | measure     |
      | safety      |
      | wood        |
      | bolt        |

  Scenario Outline: The cart keeps the quantity chosen on the product page (<qty>)
    When I open the first "hammer" search result
    And I set the quantity to <qty> and add it to the cart
    And I open the cart
    Then the cart contains that product with quantity <qty>

    Examples:
      | qty |
      | 1   |
      | 2   |
      | 3   |
      | 4   |
      | 5   |
      | 7   |
      | 10  |

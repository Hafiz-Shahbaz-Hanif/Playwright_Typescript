@ui @catalogue
Feature: Browsing and sorting the catalogue
  As a shopper
  I want to sort the catalogue and open products
  So that I can compare tools

  Background:
    Given the products page is open

  @smoke
  Scenario: The catalogue shows a page of products
    Then at least 1 product is shown

  Scenario Outline: Sorting by "<option>" orders the products
    When I sort the catalogue by "<option>"
    Then the products are sorted <direction> by <key>

    Examples:
      | option             | direction  | key   |
      | Name (A - Z)        | ascending  | name  |
      | Name (Z - A)        | descending | name  |
      | Price (Low - High)  | ascending  | price |
      | Price (High - Low)  | descending | price |

  Scenario Outline: Opening the product at position <index> shows its details
    When I open the product at position <index>
    Then the product details page shows that product's name and price

    Examples:
      | index |
      | 0     |
      | 1     |
      | 2     |
      | 3     |
      | 4     |
      | 5     |
      | 6     |
      | 7     |

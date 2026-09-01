@ui @catalogue
Feature: Product catalogue search
  As a shopper
  I want to search the catalogue
  So that I can quickly find the tool I need

  Background:
    Given the products page is open

  @smoke
  Scenario: Searching narrows the catalogue to matching products
    When I search for "hammer"
    Then every product in the results contains "hammer"
    And at least 1 product is shown

  Scenario Outline: Searching for "<term>" returns matching products
    When I search for "<term>"
    Then at least 1 product is shown

    Examples: tool keywords
      | term        |
      | pliers      |
      | wrench      |
      | screwdriver |
      | saw         |
      | drill       |
      | sander      |
      | chisel      |
      | measure     |
      | safety      |
      | wood        |
      | bolt        |
      | cutter      |

    Examples: case-insensitive
      | term   |
      | HAMMER |
      | Pliers |
      | wOoD   |

  Scenario Outline: Searching for "<term>" returns no products
    When I search for "<term>"
    Then 0 products are shown

    Examples:
      | term                       |
      | definitely-not-a-real-tool |
      | zzzzzzzz                    |
      | 9999-nonexistent           |

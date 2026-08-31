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

  Scenario: Searching for an unknown term returns no products
    When I search for "definitely-not-a-real-tool"
    Then 0 products are shown

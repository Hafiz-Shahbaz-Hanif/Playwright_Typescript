@api @booking @data-driven
Feature: Partial update of bookings (PATCH /booking/{id})
  As an authenticated API consumer
  I want to change one field at a time
  So that PATCH is proven to touch only what I send

  Background:
    Given I am authenticated against the booking API

  Scenario Outline: Patch the price to <price> and keep the rest
    Given a booking exists for "Grace" "Hopper" with total price 300
    When I patch that booking's total price to <price>
    Then the booking's total price is <price>
    And the booking's first name is still "Grace"

    Examples:
      | price |
      | 1     |
      | 50    |
      | 275   |
      | 450   |
      | 999   |
      | 1234  |

  Scenario Outline: Patch the first name to "<name>" and keep the price
    Given a booking exists for "Old" "Name" with total price 275
    When I patch that booking's first name to "<name>"
    Then the booking's total price is 275

    Examples:
      | name      |
      | Katherine |
      | Dorothy   |
      | Mary      |
      | Christine |
      | Melba     |
      | Adele     |

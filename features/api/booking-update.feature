@api @booking @data-driven
Feature: Full update of bookings (PUT /booking/{id})
  As an authenticated API consumer
  I want to replace a booking's core fields
  So that a full update is proven across many values

  Background:
    Given I am authenticated against the booking API

  Scenario Outline: Replace a booking with "<firstname> <lastname>" priced <price>
    Given a booking exists for "Seed" "Record" with total price 100
    When I fully update that booking to "<firstname>" "<lastname>" priced <price>
    Then the booking reads back as "<firstname>" "<lastname>" priced <price>

    Examples:
      | firstname | lastname  | price |
      | Ada       | Byron     | 150   |
      | Grace     | Murray    | 275   |
      | Joan      | Clarke    | 60    |
      | Radia     | Perlman   | 830   |
      | Hedy      | Lamarr    | 410   |
      | Annie     | Easley    | 95    |
      | Evelyn    | Granville | 505   |
      | Mary      | Keller    | 720   |
      | Shafi     | Goldwasser| 999   |
      | Frances   | Allen     | 1     |
      | Carol     | Shaw      | 333   |
      | Sophie    | Wilson    | 288   |

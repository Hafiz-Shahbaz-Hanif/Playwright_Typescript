@api @booking @auth
Feature: Booking API authentication (POST /auth)
  As an API consumer
  I want predictable token behaviour
  So that only valid credentials unlock write access

  Scenario: Valid credentials return a token
    When I request a token with username "admin" and password "password123"
    Then a token is returned

  Scenario Outline: Invalid credentials return 200 with no token
    When I request a token with username "<username>" and password "<password>"
    Then the auth response has status 200 and no token

    Examples:
      | username | password    |
      | admin    | wrong       |
      | nobody   | password123 |
      |          | password123 |
      | admin    |             |
      | Admin    | Password123 |

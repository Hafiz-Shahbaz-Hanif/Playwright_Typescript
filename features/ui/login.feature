@ui @auth
Feature: Customer authentication
  As a returning customer of the Toolshop
  I want to sign in to my account
  So that I can check out faster and see my order history

  Background:
    Given the login page is open

  @smoke
  Scenario: Sign in with valid credentials
    When I sign in with valid customer credentials
    Then I should be signed in and see my account menu

  Scenario Outline: Sign in is rejected for invalid credentials
    When I sign in with email "<email>" and password "<password>"
    Then I should see the login error "<message>"

    Examples:
      | email                                   | password    | message                       |
      | customer@practicesoftwaretesting.com    | wrong-pass  | Invalid email or password     |
      | not-a-user@example.com                  | welcome01   | Invalid email or password     |

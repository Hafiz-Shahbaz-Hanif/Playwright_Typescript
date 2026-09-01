@ui @auth
Feature: Customer authentication
  As a returning customer of the Toolshop
  I want to sign in to my account
  So that I can check out faster and see my order history

  # The Toolshop locks an account after 3 failed attempts, so the negative
  # scenarios use distinct unknown emails rather than hammering the real
  # customer account with wrong passwords.

  Background:
    Given the login page is open

  @smoke
  Scenario: Sign in with valid credentials
    When I sign in with valid customer credentials
    Then I should be signed in and see my account menu

  Scenario Outline: Sign in is rejected for an unknown account "<email>"
    When I sign in with email "<email>" and password "welcome01"
    Then I should see the login error "Invalid email or password"

    Examples:
      | email                        |
      | stranger.one@example.com     |
      | not.a.customer@example.org   |
      | unknown.user@toolshop.test   |
      | ghost.account@example.net    |
      | never.registered@example.dev |

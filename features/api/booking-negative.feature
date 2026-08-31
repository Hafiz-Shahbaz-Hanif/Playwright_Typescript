@api @booking @negative
Feature: Booking API error handling
  As an API consumer
  I want predictable errors for bad input and missing auth
  So that my client can react correctly

  Scenario: Rejecting authentication with bad credentials
    When I request a token with username "nope" and password "wrong"
    Then the auth response has status 200 and no token

  Scenario: Creating a booking without the mandatory price is rejected
    When I create a booking with a payload missing the price
    Then the response status is 500

  Scenario: Fetching a non-existent booking returns 404
    When I fetch a booking with id 999999999
    Then the response status is 404

  Scenario: Updating a booking without a token is forbidden
    Given a booking exists for "Locked" "Down"
    When I attempt to update that booking without a token
    Then the update is rejected with status 403

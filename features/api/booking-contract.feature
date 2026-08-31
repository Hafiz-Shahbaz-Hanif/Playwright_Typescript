@api @booking @contract
Feature: Booking API contract and non-functional checks
  As an API consumer
  I want the API to honour its published contract and be responsive
  So that integrations stay reliable

  @smoke
  Scenario: The service health endpoint is up
    Then the health endpoint reports the service is up

  Scenario: A booking response honours the published schema and time budget
    Given a booking exists for "Contract" "Check" with total price 199
    When I fetch that booking
    Then the response body matches the booking schema
    And the response arrives within the response-time budget

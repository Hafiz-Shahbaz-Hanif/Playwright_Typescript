@api @booking
Feature: Booking API lifecycle (restful-booker)
  As an API consumer
  I want to manage bookings over REST
  So that downstream systems stay in sync

  @smoke
  Scenario: Create a booking and read it back
    When I create a booking for "Hafiz" "QA" with total price 275
    Then the create response returns a numeric booking id
    And fetching that booking returns the same details

  Scenario: Authenticated full update of a booking
    Given I am authenticated against the booking API
    And a booking exists for "Ada" "Lovelace"
    When I update that booking's last name to "Byron"
    Then the booking's last name is "Byron"

  Scenario: Partial update only changes the supplied fields
    Given I am authenticated against the booking API
    And a booking exists for "Grace" "Hopper" with total price 300
    When I patch that booking's total price to 450
    Then the booking's total price is 450
    And the booking's first name is still "Grace"

  Scenario: Delete a booking
    Given I am authenticated against the booking API
    And a booking exists for "Temp" "Record"
    When I delete that booking
    Then fetching that booking returns status 404

@api @booking @negative
Feature: Booking API error handling
  As an API consumer
  I want predictable errors for bad input and missing auth
  So that my client can react correctly

  Scenario Outline: Creating a booking without the "<field>" field is rejected
    When I create a booking missing the <field> field
    Then the response status is a client or server error

    Examples:
      | field         |
      | firstname     |
      | lastname      |
      | totalprice    |
      | depositpaid   |
      | bookingdates  |

  Scenario Outline: Fetching a non-existent booking id <id> returns 404
    When I fetch a booking with id <id>
    Then the response status is 404

    Examples:
      | id        |
      | 999999999 |
      | 888888888 |
      | 777777777 |
      | 123456789 |
      | 2147483647|

  Scenario: Updating a booking without a token is forbidden
    Given a booking exists for "Locked" "Down"
    When I attempt to update that booking without a token
    Then the update is rejected with status 403

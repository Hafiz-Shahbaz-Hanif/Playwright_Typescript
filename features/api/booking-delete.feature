@api @booking @data-driven
Feature: Deleting bookings (DELETE /booking/{id})
  As an authenticated API consumer
  I want deleted bookings to be gone
  So that a subsequent GET returns 404

  Background:
    Given I am authenticated against the booking API

  Scenario Outline: Delete the booking for "<firstname> <lastname>"
    Given a booking exists for "<firstname>" "<lastname>"
    When I delete that booking
    Then fetching that booking returns status 404

    Examples:
      | firstname | lastname |
      | Delete    | One      |
      | Delete    | Two      |
      | Delete    | Three    |
      | Delete    | Four     |
      | Delete    | Five     |
      | Delete    | Six      |

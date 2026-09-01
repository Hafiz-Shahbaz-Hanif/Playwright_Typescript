@api @booking @data-driven
Feature: Filtering the booking list (GET /booking?firstname=&lastname=)
  As an API consumer
  I want to find bookings by name
  So that the list filter is proven for many names

  Scenario Outline: A booking for "<firstname> <lastname>" is found by the name filter
    Given a booking exists for "<firstname>" "<lastname>"
    When I filter bookings by firstname "<firstname>" and lastname "<lastname>"
    Then the filtered results contain that booking

    Examples:
      | firstname  | lastname   |
      | Filterone  | Alpha      |
      | Filtertwo  | Bravo      |
      | Filterthree| Charlie    |
      | Filterfour | Delta      |
      | Filterfive | Echo       |
      | Filtersix  | Foxtrot    |
      | Filterseven| Golf       |
      | Filtereight| Hotel      |
      | Filternine | India      |
      | Filterten  | Juliet     |
      | Filtereleven | Kilo     |
      | Filtertwelve | Lima     |

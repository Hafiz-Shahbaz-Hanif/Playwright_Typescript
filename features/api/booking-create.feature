@api @booking @data-driven
Feature: Creating bookings with varied data (restful-booker)
  As an API consumer
  I want to create bookings across a wide range of valid inputs
  So that the create + read round-trip is proven for every field combination

  Scenario Outline: Create "<firstname> <lastname>" and read it back
    When I create a booking "<firstname>" "<lastname>" priced <price> deposit <deposit> staying "<checkin>" to "<checkout>" needing "<needs>"
    Then the create response returns a numeric booking id
    And the stored booking matches what I sent

    Examples: names and prices
      | firstname | lastname   | price | deposit | checkin    | checkout   | needs      |
      | Hafiz     | Hanif      | 275   | true    | 2026-09-01 | 2026-09-07 | Breakfast  |
      | Ada       | Lovelace   | 100   | false   | 2026-10-10 | 2026-10-12 | Late check-in |
      | Grace     | Hopper     | 999   | true    | 2026-11-01 | 2026-11-30 | Parking    |
      | Alan      | Turing     | 1     | false   | 2027-01-01 | 2027-01-02 | None       |
      | Katherine | Johnson    | 450   | true    | 2026-12-24 | 2026-12-26 | Cot        |
      | Edsger    | Dijkstra   | 320   | false   | 2026-09-15 | 2026-09-20 | Quiet room |
      | Barbara   | Liskov     | 560   | true    | 2026-10-01 | 2026-10-08 | Sea view   |
      | Donald    | Knuth      | 780   | true    | 2026-11-11 | 2026-11-15 | Extra bed  |
      | Margaret  | Hamilton   | 210   | false   | 2027-02-14 | 2027-02-18 | Breakfast  |
      | Linus     | Torvalds   | 640   | true    | 2026-09-05 | 2026-09-09 | Early check-in |

    Examples: boundary and unusual inputs
      | firstname | lastname   | price | deposit | checkin    | checkout   | needs      |
      | A         | B          | 0     | false   | 2026-09-01 | 2026-09-02 | None       |
      | Jean      | O'Brien    | 5000  | true    | 2026-09-01 | 2026-12-31 | Long stay  |
      | Renee     | Dubois     | 42    | false   | 2026-09-30 | 2026-10-01 | Breakfast  |
      | Sven      | Ake        | 175   | true    | 2026-09-01 | 2026-09-08 | Halal meals |
      | Priya     | Sharma     | 265   | true    | 2026-11-20 | 2026-11-27 | Airport pickup |
      | Chen      | Wei        | 388   | false   | 2026-10-05 | 2026-10-10 | High floor |
      | Omar      | Farooq     | 512   | true    | 2026-12-01 | 2026-12-05 | Prayer mat |
      | Ingrid    | Nilsson    | 149   | false   | 2027-03-01 | 2027-03-04 | Ski storage |
      | Tomas     | Muller     | 233   | true    | 2026-09-18 | 2026-09-22 | Gym access |
      | Yuki      | Tanaka     | 421   | false   | 2026-10-12 | 2026-10-16 | Tea kettle |
      | Fatima    | Zahra      | 610   | true    | 2026-11-03 | 2026-11-10 | Connecting rooms |
      | Diego     | Costa      | 199   | false   | 2026-09-25 | 2026-09-28 | Breakfast  |
      | Nadia     | Petrova    | 355   | true    | 2026-12-15 | 2026-12-20 | Late checkout |
      | Kwame     | Mensah     | 288   | false   | 2027-01-10 | 2027-01-14 | Extra towels |

@retry
Feature: retry

  Scenario: a scenario that passes the second time
    Given stuff happens
    When a step that passes the second time

  Scenario: a scenario that fails every time
    Given stuff happens
    Then it fails

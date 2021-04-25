Feature: scenario outlines

  Scenario Outline: basic templated scenario #<number>
    When stuff happens
    Then the result is <number>
    Examples:
    | number |
    | 1      |
    | 2      |
    | 3      |


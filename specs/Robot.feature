Feature: Robot Control
           In order to simulate a robot
           As a nerd having fun
           I want to give the robot commands

    @passing
    Scenario Outline: Various command combinations
        Given I am running the robot controller
        And I have set the initial location as "<Location>"
        And I have entered commands "<Commands>"
        When I run the robot
        Then the output should be <ExpectedX>,<ExpectedY>,<ExpectedDirection>

    Examples:
        | Location | Commands         | ExpectedX | ExpectedY | ExpectedDirection
        | N 0 0    | M1R1M4L3M2       | 4         | 99        | S
        | N 99 99  | M1M1M1M1M1       | 99        | 4         | N
        | S 99 0   | M1M1M1M1M1       | 99        | 95        | S
        | W 0 0    | M10M10M10M10M10  | 50        | 0         | W
        | W 0 0    | M10L1M10M10M10   | 90        | 70        | S
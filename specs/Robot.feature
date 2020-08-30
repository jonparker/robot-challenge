Feature: Robot Control
           In order to simulate a robot
           As a nerd having fun
           I want to give the robot commands

    @passing
    Scenario Outline: Various command combinations
        Given I am running the robot controller
        And I have set the initial location as "<X>", "<Y>", N
        And I have entered command 1 as "<First>"
        And I have entered command 2 as "<Second>"
        And I have entered command 3 as "<Third>"
        And I have entered command 4 as "<Forth>"
        And I have entered command 5 as "<Fifth>"
        When I run the robot
        Then the output should be <ExpectedX>,<ExpectedY>,<ExpectedDirection>

    Examples:
        | X  | Y  | Direction | First | Second | Third | Forth | Fifth | ExpectedX | ExpectedY | ExpectedDirection
        | 0  | 0  | N         | M1    | R1     | M4    | L3    | M2    | 4         | 99        | S
        | 0  | 0  | S         | M5    | R2     | M10   | R1    | L1    | 0         | 95        | N
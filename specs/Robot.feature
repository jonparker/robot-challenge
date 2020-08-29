Feature: Toy Robot Simulator
           In order to simulat a toy robot
           As a nerd having fun
           I want to give the robot commands

    @passing
    Scenario Outline: Various command combinations
        Given I am running the toy robot simulator
        And I have set the initial location as "<X>", "<Y>", N
        And I have entered the 1st "<First>" command
        And I have entered the 2nd "<Second>" command
        And I have entered the 3rd "<Third>" command
        When I run the robot
        Then the output should be <ExpectedX>,<ExpectedY>,<ExpectedDirection>

    Examples:
        | X  | Y  | Direction | First | Second | Third | ExpectedX | ExpectedY | ExpectedDirection
        | 0  | 0  | N         | M1    | R1     | M4    | 4         | 1         | E
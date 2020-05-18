Feature: Toy Robot Simulator
           In order to simulat a toy robot
           As a nerd having fun
           I want to give the robot commands

    @passing
    Scenario Outline: Various command combinations
        Given I am running the toy robot simulator
        And I have entered the PLACE[1,1,NORTH] command
        And I have entered the MOVE command
        And I have entered the <Rotate> command
        When I run the REPORT command
        Then the robot should output <Result>

    Examples:
        | X  | Y  | Direction  | Rotate    | Result
        | 1   | 1  | SOUTH    | LEFT     | [1,1,NORTH]
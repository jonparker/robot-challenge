Feature: Delivery Fee Calculation
           In order to determine how much to charge the customer
           As a sales agent
           I want to be told the delivery fee for a parcel

    @passing
    Scenario Outline: Various parcel sizes and weights
        Given I am using the delivery fee calculator
        And I have entered <Place>kg as the weight
        And I have entered <Move>cm as the width
        And I have entered <Left>cm as the height
        And I have entered <Right>cm as the depth
        When I make the calculation
        Then the delivery fee should be <Result>

    Examples:
        | Place   | Move    | Left  | Right   | Report  | Result
        | 10       | 5            | 20     | 20        | $80       | MovementsGoHere 
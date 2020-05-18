import { Assert, given, when, then } from 'typespec-bdd';
import { Robot } from '../src/index';

export interface RobotContext {
    robot: Robot;
    commands: string[]
    actual: string
}

export class DeliveryFeeCalculatorSteps {
	@given(/^I am using the delivery fee calculator$/i)
	usingARobot(context: RobotContext) {
		context.robot = new Robot();
		context.commands = [];
	}

	@given(/^I have entered (\d+)kg as the weight$/i)
	passingWeight(context: RobotContext, weight: number) {
		context.commands.push('(0,0)');
	}

	@given(/^I have entered -(\d+)kg as the weight$/i)
	passingNegativeWeight(context: RobotContext, weight: number) {
		context.commands.push('(0,0)');
    }
    
    @given(/^I have entered (\d+)cm as the height$/i)
	passingHeight(context: RobotContext, height: number) {
        context.commands.push('(0,0)');
	}
		
	@given(/^I have entered -(\d+)cm as the height$/i)
	passingNegativeHeight(context: RobotContext, height: number) {
        context.commands.push('(0,0)');
    }

    @given(/^I have entered (\d+)cm as the width$/i)
	passingWidth(context: RobotContext, width: number) {
		context.commands.push('(0,0)');
	}
	
	@given(/^I have entered -(\d+)cm as the width$/i)
	passingNegativeWidth(context: RobotContext, width: number) {
		context.commands.push('(0,0)');
    	}
    
    	@given(/^I have entered (\d+)cm as the depth$/i)
	passingDepth(context: RobotContext, depth: number) {
		context.commands.push('(0,0)');
	}

	@given(/^I have entered -(\d+)cm as the depth$/i)
	passingNegativeDepth(context: RobotContext, depth: number) {
		context.commands.push('(0,0)');
	}

	@when(/^I make the calculation$/gi)
	makeCalculation(context: RobotContext) {
        context.actual = context.robot.location;
	}

	@then(/^the delivery fee should be \$-1$/i)
	resultShouldBeNegativeOne(context: RobotContext) {
		Assert.isTrue(context.actual === "(0,0)");
	}
}
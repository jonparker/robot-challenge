import { Assert, given, when, then } from 'typespec-bdd';
import { Robot } from '../src/Robot';

export interface RobotContext {
    commands: string[]
    actual: string
}

export class DeliveryFeeCalculatorSteps {
	@given(/^I am running the toy robot simulator$/i)
	usingARobot(context: RobotContext) {
		//context.robot = Robot();
		context.commands = [];
	}

	@given(/^I have entered the PLACE \d,\d command$/i)
	placeCommand(context: RobotContext, x: number, y: number) {
        context.commands.push(`(${x}, ${y})`);
    }

    @given(/^I have entered the PLACE \d,\d,(.+) command$/i)
	placeWithDirectionCommand(context: RobotContext, x: number, y: number, direction: string) {
        context.commands.push(`(${x}, ${y}, ${direction})`);
    }

    @given(/^I have entered the MOVE command$/i)
	moveCommand(context: RobotContext) {
		context.commands.push('MOVE');
	}

	@given(/^I have entered the LEFT command$/i)
	rotateLeftCommand(context: RobotContext) {
		context.commands.push('LEFT');
    }
    
    @given(/^I have entered the RIGHT command$/i)
	rotateRightCommand(context: RobotContext) {
		context.commands.push('RIGHT');
    }

	@when(/^I run the REPORT command$/gi)
	makeCalculation(context: RobotContext) {
        context.actual = Robot(context.commands).Report();
	}

	@then(/^the robot should output (.+)$/i)
	verifyReportOutput(context: RobotContext, expectedReport: string) {
        Assert.isTrue(context.actual === expectedReport);
	}
}
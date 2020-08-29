import { cons } from 'fp-ts/lib/ReadonlyArray';
import { Assert, given, when, then } from 'typespec-bdd';
import { RobotControl } from '../src/Robot';

export interface RobotContext {
	firstCommand: RobotControl.MoveCommand;
	secondCommand: RobotControl.MoveCommand;
	thirdCommand: RobotControl.MoveCommand;
	initialLocation: RobotControl.Location;
	actualFinalLocation: RobotControl.Location;
	parseRepeat: (command: string) => number;
}

export class DeliveryFeeCalculatorSteps {

	@given(/^I am running the toy robot simulator$/i)
	usingARobot(context: RobotContext) {
		context.parseRepeat = (command: string) => {
			if (command.length == 1){
				return 1;
			}
			return Number.parseInt(command.substring(1));
		};
	}

	@given(/^I have set the initial location as (\"\d+\"), (\"\d+\"), (.+)$/i)
	initialLocationCommand(context: RobotContext, x: number, y: number, direction: RobotControl.CompassReading) {
		context.initialLocation = { orientation: direction, x, y };
    }

    @given(/^I have entered the 1st (\"(.*)\d+\") command$/i)
	firstCommandWithRepeat(context: RobotContext, command: string) {
		context.firstCommand = { type: RobotControl.parseCommandType(command[0]) , repeat: context.parseRepeat(command) };
	}

	@given(/^I have entered the 2nd (\"(.*)\d+\") command$/i)
	secondCommandWithRepeat(context: RobotContext, command: string) {
		context.secondCommand = { type: RobotControl.parseCommandType(command[0]) , repeat: context.parseRepeat(command) };
	}

	@given(/^I have entered the 3rd (\"(.*)\d+\") command$/i)
	thirdCommandWithRepeat(context: RobotContext, command: string) {
		context.thirdCommand = { type: RobotControl.parseCommandType(command[0]) , repeat: context.parseRepeat(command) };
	}

	@when(/^I run the robot$/gi)
	runRobot(context: RobotContext) {
		context.actualFinalLocation = RobotControl.Robot(
			context.initialLocation, [context.firstCommand, context.secondCommand, context.thirdCommand]);
	}

	@then(/^the output should be (\d),(\d),(.*)$/i)
	verifyOutput(context: RobotContext, x: number, y: number, orientation: string) {
		Assert.isTrue(x == context.actualFinalLocation.x);
		Assert.isTrue(y == context.actualFinalLocation.y);
		Assert.isTrue(orientation == context.actualFinalLocation.orientation);
		//Assert.areIdentical(orientation, context.actualFinalLocation.orientation);
		//Assert.areIdentical({ orientation, x, y }, context.actualFinalLocation);
	}
}
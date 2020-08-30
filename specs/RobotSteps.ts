import { Assert, given, when, then } from 'typespec-bdd';
import { RobotControl } from '../src/Robot';

export interface RobotContext {
	firstCommand: RobotControl.MoveCommand;
	secondCommand: RobotControl.MoveCommand;
	thirdCommand: RobotControl.MoveCommand;
	commands: RobotControl.MoveCommand[];
	initialLocation: RobotControl.Location;
	actualFinalLocation: RobotControl.Location;
	parseRepeat: (command: string) => number;
}

export class RobotScenarioSteps {

	@given(/^I am running the robot controller$/i)
	usingARobot(context: RobotContext) {
		context.parseRepeat = (command: string) => command.length == 1 ? 1 : Number.parseInt(command.substring(1));
		context.commands = [];
	}

	@given(/^I have entered command (\d+) as (\"(.*)\d+\")$/i)
	nthCommand(context: RobotContext, commandNumber: number, command: string) {
		context.commands[commandNumber-1] = { type: RobotControl.parseCommandType(command[0]) , repeat: context.parseRepeat(command) };
	}

	@given(/^I have set the initial location as (\"\d+\"), (\"\d+\"), (\".+\")$/i)
	initialLocationCommand(context: RobotContext, x: number, y: number, direction: RobotControl.CompassReading) {
		context.initialLocation = { orientation: direction, x, y };
    }

    @when(/^I run the robot$/gi)
	runRobot(context: RobotContext) {
		context.actualFinalLocation = RobotControl.Robot(context.initialLocation, context.commands);
	}

	@then(/^the output should be (\d+),(\d+),(.*)$/i)
	verifyOutput(context: RobotContext, x: number, y: number, orientation: string) {
		Assert.isTrue(x == context.actualFinalLocation.x, `x: ${x} was expected but got ${context.actualFinalLocation.x}`);
		Assert.isTrue(y == context.actualFinalLocation.y, `y: ${y} was expected but got ${context.actualFinalLocation.y}`);
		Assert.isTrue(orientation == context.actualFinalLocation.orientation, 
			`orientation: ${orientation} was expected but got ${context.actualFinalLocation.orientation}`);
	}
}
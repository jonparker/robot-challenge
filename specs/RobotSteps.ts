import { Assert, given, when, then } from 'typespec-bdd';
import { Robot, robotParser, Location } from '../src/Robot';

export interface RobotContext {
	commands: string;
	initialLocation: string;
	actualFinalLocation: Location;
	parseRepeat: (command: string) => number;
}

export class RobotScenarioSteps {

	@given(/^I am running the robot controller$/i)
	usingARobot(context: RobotContext) {
		context.parseRepeat = (command: string) => command.length === 1 ? 1 : Number.parseInt(command.substring(1));
	}

	@given(/^I have entered commands (".*")$/i)
	enteredCommands(context: RobotContext, commands: string) {
		context.commands = commands;
	}

	@given(/^I have set the initial location as (\".*")$/i)
	initialLocationCommand(context: RobotContext, location: string) {
		context.initialLocation = location;
    }

    @when(/^I run the robot$/gi)
	runRobot(context: RobotContext) {
		context.actualFinalLocation = Robot(context.initialLocation, context.commands);
	}

	@then(/^the output should be (\d+),(\d+),(.*)$/i)
	verifyOutput(context: RobotContext, x: number, y: number, orientation: string) {
		Assert.isTrue(x === context.actualFinalLocation.x, `x: ${x} was expected but got ${context.actualFinalLocation.x}`);
		Assert.isTrue(y === context.actualFinalLocation.y, `y: ${y} was expected but got ${context.actualFinalLocation.y}`);
		
		Assert.isTrue(robotParser.parseDirection(orientation) === context.actualFinalLocation.orientation, 
			`orientation: ${orientation} was expected but got ${context.actualFinalLocation.orientation}`);
	}
}
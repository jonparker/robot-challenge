import * as E from 'fp-ts/lib/Either';
import * as R from 'ramda';

export namespace RobotControl {

    // Grid boundaries
    const minX = 0, minY = 0, maxX = 99, maxY = 99;

    // Movement function definitions
    type Increment = (num: number) => number;
    type Decrement = (num: number) => number;

    // Move in X coordinates
    let incrementX: Increment = x => x == maxX ? minX : x + 1;
    let decrementX: Decrement = x => x == minX ? maxX : x - 1;

    // Move in Y coordinates
    let incrementY: Increment = y => y == maxY ? minY : y + 1;
    let decrementY: Decrement = y => y == minY ? maxY : y - 1;

    // Directions & Compass definitions
    type Direction = 'Left' | 'Right';
    type CompassReading = 'N' | 'S' | 'E' | 'W';

    type rotateMap = { [key in CompassReading] : (directionToMove: Direction) => CompassReading };

    // Rotation mappings
    const rotateMappings: rotateMap = {
        'N': (directionToRotate) => directionToRotate == 'Left' ? 'W' : 'E',
        'S': (directionToRotate) => directionToRotate == 'Left' ? 'E' : 'W',
        'E': (directionToRotate) => directionToRotate == 'Left' ? 'N' : 'S',
        'W': (directionToRotate) => directionToRotate == 'Left' ? 'S' : 'N'
    };

    // Robot Location
    export interface Location { orientation: CompassReading, x: number, y: number };

    // Robot command type
    export type CommandType = 'M' | 'L' | 'R';

    // Robot move command
    export type MoveCommand = { type: CommandType, repeat: number }

    // Take the current location of the robot and a list of commands and return the final location of the robot
    type RunRobot = (currentLocation: Location, command: MoveCommand[]) => Location;

    type MoveNPostiions = (currentLocation: Location, repeat: number) => Location;

    type MovementMap = { [key in CommandType]: MoveNPostiions };

    type MoveSteps = (movementMap: MovementMap, currentLocation: Location, command: MoveCommand) => Location;

    const movementMap: MovementMap = {
        'L': (currentLocation, repeat) => {
            const newLocation = { ...currentLocation, orientation: rotateMappings[currentLocation.orientation]("Left") };
            return repeat == 1 ? newLocation : move(movementMap, newLocation, { type: 'L', repeat: repeat - 1 });
        },
        'R': (currentLocation, repeat) => {
            const newLocation = { ...currentLocation, orientation: rotateMappings[currentLocation.orientation]("Right") };
            return repeat == 1 ? newLocation : move(movementMap, newLocation, { type: 'R', repeat: repeat - 1 });
        },
        'M': (currentLocation, repeat) => {
            let newLocation: Location;
            switch (currentLocation.orientation) {
                case 'N':
                    newLocation = { ...currentLocation, y: incrementY(currentLocation.y) };
                    break;
                case 'S':
                    newLocation = { ...currentLocation, y: decrementY(currentLocation.y) };
                    break;
                case 'E':
                    newLocation = { ...currentLocation, x: incrementX(currentLocation.x) };
                    break;
                case 'W':
                    newLocation = { ...currentLocation, x: decrementX(currentLocation.x) };
                    break;
                default:
                    newLocation = currentLocation;
                    break;
            }
            return repeat == 1 ? newLocation : move(movementMap, newLocation, { type: 'M', repeat: repeat - 1 });
        }
    };

    const move: MoveSteps = (movementMap, currentLocation, command) => {
        return movementMap[command.type](currentLocation, command.repeat);
    };

    export const Robot: RunRobot = (currentLocation, [firstCommand, ...restOfCommands]) => restOfCommands.length ?
        Robot(move(movementMap, currentLocation, firstCommand), restOfCommands) : 
        move(movementMap, currentLocation, firstCommand);

    // // Examples
    // const initialLocation: Location = { orientation: 'N', x: 0, y: 0 };
    // const commandList: MoveCommand[] = [{ type: 'M', repeat: 1}];

    // console.log(`Initial location: ${JSON.stringify(initialLocation)}`);
    // const finalLocation = Robot(initialLocation, commandList);
    // console.log(`Commands: ${JSON.stringify(commandList)}`);
    // console.log(`Final location: ${JSON.stringify(finalLocation)}`);

    // const initialLocation2: Location = { orientation: 'N', x: 0, y: 0 };
    // const commandList2: MoveCommand[] = [
    //     { type: 'M', repeat: 1},
    //     { type: 'R', repeat: 1 },
    //     { type: 'M', repeat: 4},
    //     { type: 'L', repeat: 3},
    //     { type: 'M', repeat: 2}
    // ];

    // console.log(`Initial location: ${JSON.stringify(initialLocation2)}`);
    // const finalLocation2 = Robot(initialLocation2, commandList2);
    // console.log(`Commands: ${JSON.stringify(commandList2)}`);
    // console.log(`Final location: ${JSON.stringify(finalLocation2)}`);

    // // Answer to example:
    // // Orientation: S, x: 4, y: 99
    // const expectedFinalLocation = { orientation: 'S', x: 4, y: 99 };
    // const result = finalLocation2.orientation == expectedFinalLocation.orientation && finalLocation2.x == expectedFinalLocation.x && 
    //     finalLocation2.y == expectedFinalLocation.y;
    // console.log(`Test result: ${result ? 'Pass' : 'Fail'}`);
}
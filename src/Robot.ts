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
    export type CompassReading = 'N' | 'S' | 'E' | 'W';

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


    // Helper for parsing command type
    export function parseCommandType(command: string): CommandType {
        const commandTypeStr = command.toUpperCase();
        let commandType: RobotControl.CommandType;
        switch (commandTypeStr) {
            case 'L':
                commandType = 'L';
                break;
            case 'R':
                commandType = 'R';
                break;
            case 'M':
                commandType = 'M';
                break;
            default:
                throw Error('Invalid command type');
        }
        return commandType;
    }

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
}
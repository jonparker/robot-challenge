export namespace RobotControl {

    enum CommandType { Rotate, Move }
    enum DirectionValue { Left, Right }
    const minX = 0, minY = 0, maxX = 99, maxY = 99;
    type Increment = (num: number, increments: number) => number;
    type Decrement = (num: number, increments: number) => number;

    export interface RobotCommand { CommandType: CommandType, repeat: number }
    interface Rotate extends RobotCommand { Direction: DirectionValue, CommandType: CommandType.Rotate }
    interface Move extends RobotCommand { CommandType: CommandType.Move }

    const RotateRobot = (currentLocation: Location, rotate: Rotate): Location => {
        const newLocation = { ...currentLocation, orientation: rotateMappings[currentLocation.orientation](rotate.Direction) };
        return rotate.repeat == 1 ? newLocation : RotateRobot(newLocation, { ...rotate, repeat: rotate.repeat - 1 });
    };
    
    const MoveRobot = (currentLocation: Location, move: Move): Location => {
        switch (currentLocation.orientation) {
            case 'N':
                return { ...currentLocation, y: incrementY(currentLocation.y, move.repeat) };
            case 'S':
                return { ...currentLocation, y: decrementY(currentLocation.y, move.repeat) };
            case 'E':
                return { ...currentLocation, x: incrementX(currentLocation.x, move.repeat) };
            case 'W':
                return { ...currentLocation, x: decrementX(currentLocation.x, move.repeat) };
            default:
                return currentLocation;
        }
    }

    const isRotateCommand = (cmd: RobotCommand) : cmd is Rotate => cmd.CommandType == CommandType.Rotate;
    const isMoveCommand = (cmd: RobotCommand) : cmd is Move => cmd.CommandType == CommandType.Move;
    type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location;

    export const Robot: RunRobot = (currentLocation, commands) => commands.reduce<Location>((acc: Location, current: RobotCommand) =>
        isMoveCommand(current) ? MoveRobot(acc, current) : isRotateCommand(current) ? RotateRobot(acc, current) : acc, currentLocation);

    let incrementX: Increment = (x, incrementBy) => 
        Array.from(Array(incrementBy).keys()).map(_ => 1).reduce((acc, _) => acc == maxX ? minX : acc + 1, x);

    let decrementX: Decrement = (x, decrementBy) =>
        Array.from(Array(decrementBy).keys()).reduce((acc, _) => acc == minX ? maxX : acc - 1, x);
    
    let incrementY: Increment = (y, incrementBy) => 
        Array.from(Array(incrementBy).keys()).reduce((acc, _) => acc == maxY ? minY : acc + 1, y);

    let decrementY: Decrement = (y, decrementBy) =>
        Array.from(Array(decrementBy).keys()).reduce((acc, _) => acc == minY ? maxY : acc - 1, y);

    // Directions & Compass definitions
    export type CompassReading = 'N' | 'S' | 'E' | 'W';

    type rotateMap = { [key in CompassReading] : (directionToMove: DirectionValue) => CompassReading };

    // Rotation mappings
    const rotateMappings: rotateMap = {
        'N': (directionToRotate) => directionToRotate == DirectionValue.Left ? 'W' : 'E',
        'S': (directionToRotate) => directionToRotate == DirectionValue.Left ? 'E' : 'W',
        'E': (directionToRotate) => directionToRotate == DirectionValue.Left ? 'N' : 'S',
        'W': (directionToRotate) => directionToRotate == DirectionValue.Left ? 'S' : 'N'
    };

    type Portal = { B?: {x: number, y: number}, O?: {x: number, y: number }};
    
    // Robot Location
    export interface Location { 
        portals: Portal,
        orientation: CompassReading, x: number, y: number };

    export function parseRobotCommand(command: string, repeat: number) : RobotCommand {
        const commandTypeStr = command.toUpperCase();
        switch (commandTypeStr) {
            case 'L':
                return { Direction: DirectionValue.Left, repeat, CommandType: CommandType.Rotate } as Rotate;
            case 'R':
                return { Direction: DirectionValue.Right, repeat, CommandType: CommandType.Rotate } as Rotate;
            case 'M':
                return { repeat, CommandType: CommandType.Move } as Move;
            default:
                throw Error(`Invalid command ${commandTypeStr}`);
        }
    }
}
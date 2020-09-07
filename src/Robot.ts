export namespace RobotControl {

    enum CommandTypeEnum {
        Rotate,
        Move
    };

    enum DirectionValue {
        Left,
        Right
    }
    
    export interface RobotCommand {
        CommandType: CommandTypeEnum
        repeat: number
    }

    interface Rotate extends RobotCommand {
        Direction: DirectionValue
        CommandType: CommandTypeEnum.Rotate
    }

    interface Move extends RobotCommand {
        CommandType: CommandTypeEnum.Move
    }

    const RotateRobot = (currentLocation: Location, rotate: Rotate): Location => {
        return { ...currentLocation, orientation: rotateMappings[currentLocation.orientation](rotate.Direction) };
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

    const isRotateCommand = (cmd: RobotCommand) : cmd is Rotate => cmd.CommandType == CommandTypeEnum.Rotate;
    const isMoveCommand = (cmd: RobotCommand) : cmd is Move => cmd.CommandType == CommandTypeEnum.Move;
    
    // Take the current location of the robot and a list of commands and return the final location of the robot
    type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location;

    export const Robot: RunRobot = (currentLocation, commands) => 
        commands.reduce<Location>((acc: Location, current: RobotCommand, idx, arr) => {
            console.log('index: ' + idx);
            if (isMoveCommand(current))
                return MoveRobot(acc, current);
            else if (isRotateCommand(current))
                return RotateRobot(acc, current);
            else
                return acc;
        }, currentLocation);

    // Grid boundaries
    const minX = 0, minY = 0, maxX = 99, maxY = 99;

    // Movement function definitions
    type Increment = (num: number, increments: number) => number;
    type Decrement = (num: number, increments: number) => number;

    // Move in X coordinates
    let incrementX: Increment = (x, incrementBy) => x == maxX ? (minX + incrementBy) : incrementBy == 1 ? x + 1 : incrementX(x + 1, incrementBy - 1);
    let decrementX: Decrement = (x, decrementBy) => x == minX ? (maxX - decrementBy) : decrementBy == 1 ? x - 1 : decrementX(x - 1, decrementBy - 1);

    // Move in Y coordinates
    let incrementY: Increment = (y, incrementBy) => y == maxY ? (minY + incrementBy) : incrementBy == 1 ? y + 1 : incrementY(y + 1, incrementBy - 1);
    let decrementY: Decrement = (y, decrementBy) => y == minY ? (maxY - decrementBy) : decrementBy == 1 ? y - 1 : decrementY(y - 1, decrementBy - 1);

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
                return { Direction: DirectionValue.Left, repeat, CommandType: CommandTypeEnum.Rotate } as Rotate;
            case 'R':
                return { Direction: DirectionValue.Right, repeat, CommandType: CommandTypeEnum.Rotate } as Rotate;
            case 'M':
                return { repeat, CommandType: CommandTypeEnum.Move } as Move;
            default:
                throw Error(`Invalid command ${commandTypeStr}`);
        }
    }
}
import { dir } from "console";

export namespace RobotControl {

    enum CommandType { Rotate, Move }
    enum DirectionValue { Left, Right }

    export interface RobotCommand { CommandType: CommandType, repeat: number }
    interface Rotate extends RobotCommand { Direction: DirectionValue, CommandType: CommandType.Rotate }
    interface Move extends RobotCommand { CommandType: CommandType.Move }

    const RotateRobot = (currentLocation: Location, rotate: Rotate): Location => {
        const rotateMapping = rotateMappings.find(m => m.currentDirection === currentLocation.orientation);
        const newLocation = { ...currentLocation, orientation: rotateMapping?.rotate(rotate.Direction) || currentLocation.orientation };
        return rotate.repeat === 1 ? newLocation : RotateRobot(newLocation, { ...rotate, repeat: rotate.repeat - 1 });
    };
    
    const MoveRobot = (currentLocation: Location, move: Move): Location => {
        switch (currentLocation.orientation) {
            case CompassReading.North:
                return { ...currentLocation, y: incrementY(currentLocation.y, move.repeat) };
            case CompassReading.South:
                return { ...currentLocation, y: decrementY(currentLocation.y, move.repeat) };
            case CompassReading.East:
                return { ...currentLocation, x: incrementX(currentLocation.x, move.repeat) };
            case CompassReading.West:
                return { ...currentLocation, x: decrementX(currentLocation.x, move.repeat) };
            default:
                return currentLocation;
        }
    }

    const isRotateCommand = (cmd: RobotCommand) : cmd is Rotate => cmd.CommandType === CommandType.Rotate;
    const isMoveCommand = (cmd: RobotCommand) : cmd is Move => cmd.CommandType === CommandType.Move;
    type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location;

    export const Robot: RunRobot = (currentLocation, commands) => commands.reduce<Location>((acc: Location, current: RobotCommand) =>
        isMoveCommand(current) ? MoveRobot(acc, current) : isRotateCommand(current) ? RotateRobot(acc, current) : acc, currentLocation);

    type Increment = (num: number, increments: number) => number;
    type Decrement = (num: number, increments: number) => number;

    let incrementX: Increment = (x, incrementBy) => (x + incrementBy) % 100;
    let decrementX: Decrement = (x, decrementBy) => (x - decrementBy) >= 0 ? x - decrementBy : 100 + (x - decrementBy);
    let incrementY: Increment = (y, incrementBy) => (y + incrementBy) % 100;
    let decrementY: Decrement = (y, decrementBy) => (y - decrementBy) >= 0 ? y - decrementBy : 100 + (y - decrementBy);

    export enum CompassReading { North, South, East, West };
    
    interface RotateMapping {
        currentDirection: CompassReading,
        rotate: (directionToRotate: DirectionValue) => CompassReading
    }

    const rotateMappings: RotateMapping[] = [
        { currentDirection: CompassReading.North, rotate: (directionToRotate: DirectionValue) => directionToRotate == DirectionValue.Left ? CompassReading.West : CompassReading.East },
        { currentDirection: CompassReading.South, rotate: (directionToRotate: DirectionValue) => directionToRotate == DirectionValue.Left ? CompassReading.East : CompassReading.West },
        { currentDirection: CompassReading.East, rotate: (directionToRotate: DirectionValue) => directionToRotate == DirectionValue.Left ? CompassReading.North : CompassReading.South },
        { currentDirection: CompassReading.West, rotate: (directionToRotate: DirectionValue) => directionToRotate == DirectionValue.Left ? CompassReading.South : CompassReading.North },
    ];

    type Portal = { B?: {x: number, y: number}, O?: {x: number, y: number }};
    
    export interface Location { portals: Portal, orientation: CompassReading, x: number, y: number };

    export const parseDirection = (direction: string) : CompassReading => {
        const mappings: Record<string, CompassReading> = {
            'N': CompassReading.North,
            'S': CompassReading.South,
            'E': CompassReading.East,
            'W': CompassReading.West
        };
        return mappings[direction];
    }

    export const parseInitialLocation = (direction: string, xStr: string, yStr: string): Location => {
        const x = Number.parseInt(xStr);
        const y = Number.parseInt(yStr);

        if (isNaN(x) || isNaN(y)) {
            throw Error(`Invalid initial location ${xStr} ${yStr}`);
        }

        return { x, y, orientation: parseDirection(direction), portals: {} } as RobotControl.Location;
    }

    export const parseRobotCommand = (command: string, repeat: number) : RobotCommand => 
        ({
            'L': { Direction: DirectionValue.Left, repeat, CommandType: CommandType.Rotate },
            'R': { Direction: DirectionValue.Right, repeat, CommandType: CommandType.Rotate },
            'M': { repeat, CommandType: CommandType.Move }
        } as Record<string, Rotate | Move>
        )[command.toUpperCase()];
}
export namespace RobotControl {

    enum CommandType { Rotate, Move }
    enum Direction { Left, Right }

    export interface RobotCommand { CommandType: CommandType, repeat: number }
    export enum Compass { North = 'North', South = 'South', East = 'East', West = 'West' }
    export interface Location { portals: Portal, orientation: Compass, x: number, y: number };

    interface Rotate extends RobotCommand { Direction: Direction, CommandType: CommandType.Rotate }
    interface Move extends RobotCommand { CommandType: CommandType.Move }
    interface RotateMapping {
        currentDirection: Compass,
        rotate: (directionToRotate: Direction) => Compass
    }

    const rotateMappings: RotateMapping[] = [
        { currentDirection: Compass.North, rotate: (rotate: Direction) => rotate === Direction.Left ? Compass.West : Compass.East },
        { currentDirection: Compass.South, rotate: (rotate: Direction) => rotate === Direction.Left ? Compass.East : Compass.West },
        { currentDirection: Compass.East, rotate: (rotate: Direction) => rotate === Direction.Left ? Compass.North : Compass.South },
        { currentDirection: Compass.West, rotate: (rotate: Direction) => rotate === Direction.Left ? Compass.South : Compass.North },
    ];

    const RotateRobot = (currentLocation: Location, rotate: Rotate): Location => {
        const rotateMapping = rotateMappings.find(m => m.currentDirection === currentLocation.orientation);
        const newLocation = { ...currentLocation, orientation: rotateMapping?.rotate(rotate.Direction) ?? currentLocation.orientation };
        return rotate.repeat === 1 ? newLocation : RotateRobot(newLocation, { ...rotate, repeat: rotate.repeat - 1 });
    };
    
    const MoveRobot = (currentLocation: Location, move: Move): Location => {
        switch (currentLocation.orientation) {
            case Compass.North:
                return { ...currentLocation, y: incrementY(currentLocation.y, move.repeat) };
            case Compass.South:
                return { ...currentLocation, y: decrementY(currentLocation.y, move.repeat) };
            case Compass.East:
                return { ...currentLocation, x: incrementX(currentLocation.x, move.repeat) };
            case Compass.West:
                return { ...currentLocation, x: decrementX(currentLocation.x, move.repeat) };
            default:
                return currentLocation;
        }
    }

    const isRotateCommand = (cmd: RobotCommand) : cmd is Rotate => cmd.CommandType === CommandType.Rotate;
    const isMoveCommand = (cmd: RobotCommand) : cmd is Move => {
        return cmd.CommandType === CommandType.Move;
    };
    type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location;

    export const Robot: RunRobot = (currentLocation, commands) => commands.reduce<Location>((acc: Location, current: RobotCommand) =>
        isMoveCommand(current) ? MoveRobot(acc, current) : isRotateCommand(current) ? RotateRobot(acc, current) : acc, currentLocation);

    type Increment = (num: number, increments: number) => number;
    type Decrement = (num: number, increments: number) => number;

    let incrementX: Increment = (x, incrementBy) => (x + incrementBy) % 100;
    let decrementX: Decrement = (x, decrementBy) => (x - decrementBy) >= 0 ? x - decrementBy : 100 + (x - decrementBy);
    let incrementY: Increment = (y, incrementBy) => (y + incrementBy) % 100;
    let decrementY: Decrement = (y, decrementBy) => (y - decrementBy) >= 0 ? y - decrementBy : 100 + (y - decrementBy);

    type Portal = { B?: {x: number, y: number}, O?: {x: number, y: number }};

    const parseDirection = (direction: string) : Compass => {
        const mappings: Record<string, Compass> = {
            'N': Compass.North,
            'S': Compass.South,
            'E': Compass.East,
            'W': Compass.West
        };
        return mappings[direction];
    }

    const parseInitialLocation = (direction: string, xStr: string, yStr: string): Location | undefined => {
        const x = Number.parseInt(xStr);
        const y = Number.parseInt(yStr);
        return !isNaN(x) && !isNaN(y) ? { x, y, orientation: parseDirection(direction), portals: {} } : undefined;
    }

    const parseRobotCommand = (command: string, repeat: number) : RobotCommand => 
        ({
            'L': { Direction: Direction.Left, repeat, CommandType: CommandType.Rotate },
            'R': { Direction: Direction.Right, repeat, CommandType: CommandType.Rotate },
            'M': { repeat, CommandType: CommandType.Move }
        } as Record<string, Rotate | Move>
        )[command.toUpperCase()];

    export const parser = {
        parseDirection,
        parseInitialLocation,
        parseRobotCommand
    };
}
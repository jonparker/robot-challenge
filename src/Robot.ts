enum CommandType { Rotate, Move }
enum Direction { Left, Right }

interface RobotCommand { CommandType: CommandType, repeat: number }
enum Compass { North = 'North', South = 'South', East = 'East', West = 'West' }
interface Location { portals: Portal, orientation: Compass, x: number, y: number };

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

const runRobot: RunRobot = (currentLocation, commands) => commands.reduce<Location>((acc: Location, current: RobotCommand) =>
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

const parseInitialLocationTokens = (direction: string, xStr: string, yStr: string): Location | undefined => {
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

const parseInitialLocation = (initialLocationStr: string): Location => {
    const [initialDirectionStr, x, y] = initialLocationStr.split(' ');
    const initialLocation = parseInitialLocationTokens(initialDirectionStr, x, y);
    if (!initialLocation)
    {
        console.log(`Initial location ${initialLocationStr} could not be parsed.`);
        throw Error(`Initial location ${initialLocationStr} could not be parsed.`);
    }
    return initialLocation;
}

const parseInput = (initialLocationStr: string, commandsStr: string): { initialLocation: Location, commandList: RobotCommand[] } => {
    const initialLocation = parseInitialLocation(initialLocationStr);
    enum ParseBufferState { CommandChar, CommandCharAndDigit, Empty };
    type CommandInfo = { command: string, repeats?: number };

    let commandTokenList: CommandInfo[] = [];
    let parseBuffer: ParseBufferState = ParseBufferState.Empty;
    
    commandsStr.split('').forEach(cmdChar => {
        const cmdInt = Number.parseInt(cmdChar);
        const cmdIsInt = !isNaN(cmdInt);

        switch (parseBuffer) {
            case ParseBufferState.Empty:
                commandTokenList.push({ command: cmdChar });
                parseBuffer = ParseBufferState.CommandChar;
                break;
            case ParseBufferState.CommandChar:
                if (cmdIsInt)
                {
                    const cmd = commandTokenList.pop();
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: cmdInt });
                    }
                    parseBuffer = ParseBufferState.CommandCharAndDigit;
                }
                else {
                    commandTokenList.push({ command: cmdChar });
                }
                break;
            case ParseBufferState.CommandCharAndDigit:
                if (cmdIsInt) {
                    const cmd = commandTokenList.pop();
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: (10 * (cmd.repeats || 0)) + cmdInt });
                    }
                    parseBuffer = ParseBufferState.Empty;
                }
                else {
                    commandTokenList.push({ command: cmdChar });
                    parseBuffer = ParseBufferState.CommandChar;
                }
                break;
        }
    });

    const commandList = commandTokenList.map(cmd => robotParser.parseRobotCommand(cmd.command, cmd.repeats || 1 ));
    return { initialLocation, commandList };
}

const Robot = (initialLocation: string, commandList: string) => {
    const input = parseInput(initialLocation, commandList);
    return runRobot(input.initialLocation, input.commandList);
}

const robotParser = {
    parseDirection,
    parseInitialLocation,
    parseRobotCommand
};

export { robotParser, Robot, RobotCommand,  Compass, Location };
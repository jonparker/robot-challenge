enum CommandType { Rotate, Move }
enum Direction { Left, Right }
enum Compass { North = 'North', South = 'South', East = 'East', West = 'West' }

interface RobotCommand { CommandType: CommandType, repeat: number }
interface Location { portals: Portal, orientation: Compass, x: number, y: number };
interface Rotate extends RobotCommand { Direction: Direction, CommandType: CommandType.Rotate }
interface Move extends RobotCommand { CommandType: CommandType.Move }
interface RotateMapping { currentDirection: Compass, rotate: (directionToRotate: Direction) => Compass }

type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location;
type Portal = { B?: {x: number, y: number}, O?: {x: number, y: number }};
type Increment = (num: number, increments: number) => number;
type Decrement = (num: number, increments: number) => number;

const incrementX: Increment = (x, incrementBy) => (x + incrementBy) % 100;
const decrementX: Decrement = (x, decrementBy) => (x - decrementBy) >= 0 ? x - decrementBy : 100 + (x - decrementBy);
const incrementY: Increment = (y, incrementBy) => (y + incrementBy) % 100;
const decrementY: Decrement = (y, decrementBy) => (y - decrementBy) >= 0 ? y - decrementBy : 100 + (y - decrementBy);

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

const runRobot: RunRobot = (currentLocation, commands) => commands.reduce<Location>((acc: Location, current: RobotCommand) =>
    isMoveCommand(current) ? MoveRobot(acc, current) : isRotateCommand(current) ? RotateRobot(acc, current) : acc, currentLocation);

const parseDirection = (direction: string) : Compass | Error => {
    const mappings: Record<string, Compass> = {
        'N': Compass.North,
        'S': Compass.South,
        'E': Compass.East,
        'W': Compass.West
    };
    return mappings[direction] ?? Error(`Could not parse direction ${direction}`);
}

const parseInitialLocationTokens = (direction: string, xStr: string, yStr: string): Location | Error => {
    const x = +xStr;
    const y = +yStr;
    const orientation = parseDirection(direction);
    return !isNaN(x) && !isNaN(y) && !isError(orientation) ? { x, y, orientation, portals: {} } :
        isError(orientation) ? orientation : Error(`Could not parse ${xStr} or ${yStr}`);
}

const parseRobotCommand = (command: string, repeat: number) : RobotCommand =>
    ({
        'L': { Direction: Direction.Left, repeat, CommandType: CommandType.Rotate },
        'R': { Direction: Direction.Right, repeat, CommandType: CommandType.Rotate },
        'M': { repeat, CommandType: CommandType.Move }
    } as Record<string, Rotate | Move>
    )[command.toUpperCase()];

const parseInitialLocation = (initialLocationStr: string): Location | Error => {
    const [initialDirectionStr, x, y] = initialLocationStr.split(' ');
    const initialLocation = parseInitialLocationTokens(initialDirectionStr, x, y);
    return isError(initialLocation) ? Error(`Initial location ${initialLocationStr} could not be parsed: ${initialLocation}`) :
        initialLocation;
}

const isError = (some: any) : some is Error => {
    return some.message && some.name && some.stack;
}

const parseCommands = (commandsStr: string): RobotCommand[] | Error => {
    enum ParseBufferState { CommandChar, CommandCharAndDigit, Empty };
    type CommandInfo = { command: string, repeats?: number };

    const commandTokenList: CommandInfo[] = [];
    let parseBuffer: ParseBufferState = ParseBufferState.Empty;

    commandsStr.split('').forEach(cmdChar => {
        const cmdInt = +cmdChar;
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

    return commandTokenList.map(cmd => robotParser.parseRobotCommand(cmd.command, cmd.repeats || 1 ));
}

const Robot = (initialLocation: string, commandList: string) : Location | Error => {
    const location = parseInitialLocation(initialLocation);
    if (isError(location)) return location;

    const commands = parseCommands(commandList);
    if (isError(commands)) return commands;

    return runRobot(location, commands);
}

const robotParser = {
    parseDirection,
    parseInitialLocation,
    parseRobotCommand
};

export { robotParser, Robot, isError, RobotCommand, Compass, Location };
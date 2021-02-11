import {
    isError,
    Rotate,
    Move,
    RobotCommand,
    Location,
    CommandType,
    Compass,
    Direction
} from './Types'
import Parser from './Parser'

interface RotateMapping {
    currentDirection: Compass
    rotate: (directionToRotate: Direction) => Compass
}
type RunRobot = (currentLocation: Location, command: RobotCommand[]) => Location
type Increment = (num: number, increments: number) => number
type Decrement = (num: number, increments: number) => number

const incrementX: Increment = (x, incrementBy) => (x + incrementBy) % 100
const decrementX: Decrement = (x, decrementBy) =>
    x - decrementBy >= 0 ? x - decrementBy : 100 + (x - decrementBy)
const incrementY: Increment = (y, incrementBy) => (y + incrementBy) % 100
const decrementY: Decrement = (y, decrementBy) =>
    y - decrementBy >= 0 ? y - decrementBy : 100 + (y - decrementBy)

const rotateMappings: RotateMapping[] = [
    {
        currentDirection: Compass.N,
        rotate: (rotate: Direction) =>
            rotate === Direction.Left ? Compass.W : Compass.E
    },
    {
        currentDirection: Compass.S,
        rotate: (rotate: Direction) =>
            rotate === Direction.Left ? Compass.E : Compass.W
    },
    {
        currentDirection: Compass.E,
        rotate: (rotate: Direction) =>
            rotate === Direction.Left ? Compass.N : Compass.S
    },
    {
        currentDirection: Compass.W,
        rotate: (rotate: Direction) =>
            rotate === Direction.Left ? Compass.S : Compass.N
    }
]

const RotateRobot = (currentLocation: Location, rotate: Rotate): Location => {
    const rotateMapping = rotateMappings.find(
        (m) => m.currentDirection === currentLocation.orientation
    )
    const newLocation = {
        ...currentLocation,
        orientation:
            rotateMapping?.rotate(rotate.Direction) ??
            currentLocation.orientation
    }
    return rotate.repeat === 1
        ? newLocation
        : RotateRobot(newLocation, { ...rotate, repeat: rotate.repeat - 1 })
}

const MoveRobot = (currentLocation: Location, move: Move): Location => {
    switch (currentLocation.orientation) {
        case Compass.N:
            return {
                ...currentLocation,
                y: incrementY(currentLocation.y, move.repeat)
            }
        case Compass.S:
            return {
                ...currentLocation,
                y: decrementY(currentLocation.y, move.repeat)
            }
        case Compass.E:
            return {
                ...currentLocation,
                x: incrementX(currentLocation.x, move.repeat)
            }
        case Compass.W:
            return {
                ...currentLocation,
                x: decrementX(currentLocation.x, move.repeat)
            }
        default:
            return currentLocation
    }
}

const isRotateCommand = (cmd: RobotCommand): cmd is Rotate =>
    cmd.CommandType === CommandType.Rotate
const isMoveCommand = (cmd: RobotCommand): cmd is Move => {
    return cmd.CommandType === CommandType.Move
}

const runRobot: RunRobot = (currentLocation, commands) =>
    commands.reduce<Location>(
        (acc: Location, current: RobotCommand) =>
            isMoveCommand(current)
                ? MoveRobot(acc, current)
                : isRotateCommand(current)
                ? RotateRobot(acc, current)
                : acc,
        currentLocation
    )

const Robot = (
    initialLocation: string,
    commandList: string
): Location | Error => {
    const location = Parser.parseInitialLocation(initialLocation)
    if (isError(location)) return location

    const commands = Parser.parseCommands(commandList)
    if (isError(commands)) return commands

    return runRobot(location, commands)
}

export default Robot

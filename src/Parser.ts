import { isError, Rotate, Move, RobotCommand, Location, CommandType, Compass, Direction } from './Types'

const parseDirection = (direction: string): Compass | Error => {
    const mappings: Record<string, Compass> = {
        N: Compass.N,
        S: Compass.S,
        E: Compass.E,
        W: Compass.W
    }
    return mappings[direction] ?? Error(`Could not parse direction ${direction}`)
}

const parseInitialLocationTokens = (direction: string, xStr: string, yStr: string): Location | Error => {
    const x = +xStr
    const y = +yStr
    const orientation = parseDirection(direction)
    return !isNaN(x) && !isNaN(y) && !isError(orientation) ? { x, y, orientation } :
        isError(orientation) ? orientation : Error(`Could not parse ${xStr} or ${yStr}`)
}

const parseRobotCommand = (command: string, repeat: number): RobotCommand =>
    ({
        L: { Direction: Direction.Left, repeat, CommandType: CommandType.Rotate },
        R: { Direction: Direction.Right, repeat, CommandType: CommandType.Rotate },
        M: { repeat, CommandType: CommandType.Move }
    } as Record<string, Rotate | Move>
    )[command.toUpperCase()]

const parseInitialLocation = (initialLocationStr: string): Location | Error => {
    const [initialDirectionStr, x, y] = initialLocationStr.split(' ')
    const initialLocation = parseInitialLocationTokens(initialDirectionStr, x, y)
    return isError(initialLocation) ? Error(`Initial location ${initialLocationStr} could not be parsed: ${initialLocation}`) :
        initialLocation
}

const parseCommands = (commandsStr: string): RobotCommand[] | Error => {
    const commandList: RobotCommand[] = []
    let repeats = 0
    let hasRepeats = false

    commandsStr.split('').reverse().forEach(cmdChar => {
        const cmdInt = +cmdChar
        if (isNaN(cmdInt)) {
            commandList.push(parseRobotCommand(cmdChar, repeats || 1))
            hasRepeats = false
            repeats = 0
        }
        else {
            repeats = hasRepeats ? ((cmdInt * 10) + repeats) : cmdInt
            hasRepeats = true
        }
    })
    return commandList.reverse()
}

export default {
    parseDirection,
    parseInitialLocation,
    parseCommands
}

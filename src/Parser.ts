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
    return !isNaN(x) && !isNaN(y) && !isError(orientation) ? { x, y, orientation, portals: {} } :
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
    enum ParseBufferState { CommandChar, CommandCharAndDigit, Empty }
    type CommandInfo = { command: string, repeats?: number }

    const commandTokenList: CommandInfo[] = []
    let parseBuffer: ParseBufferState = ParseBufferState.Empty

    commandsStr.split('').forEach(cmdChar => {
        const cmdInt = +cmdChar
        const cmdIsInt = !isNaN(cmdInt)

        switch (parseBuffer) {
            case ParseBufferState.Empty:
                commandTokenList.push({ command: cmdChar })
                parseBuffer = ParseBufferState.CommandChar
                break
            case ParseBufferState.CommandChar:
                if (cmdIsInt)
                {
                    const cmd = commandTokenList.pop()
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: cmdInt })
                    }
                    parseBuffer = ParseBufferState.CommandCharAndDigit
                }
                else {
                    commandTokenList.push({ command: cmdChar })
                }
                break
            case ParseBufferState.CommandCharAndDigit:
                if (cmdIsInt) {
                    const cmd = commandTokenList.pop()
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: (10 * (cmd.repeats || 0)) + cmdInt })
                    }
                    parseBuffer = ParseBufferState.Empty
                }
                else {
                    commandTokenList.push({ command: cmdChar })
                    parseBuffer = ParseBufferState.CommandChar
                }
                break
        }
    })
    return commandTokenList.map(cmd => parseRobotCommand(cmd.command, cmd.repeats || 1 ))
}

export default {
    parseDirection,
    parseInitialLocation,
    parseCommands
}

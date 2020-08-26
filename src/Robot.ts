enum Direction {
    Left,
    Right
}

type DirectionCommand = { direction: Direction }

type PlaceCommand = { x: number, y: number }

type FirstPlaceCommand =  { x: number, y: number, direction: Direction }

type MoveCommand = { direction: Direction, moves: number }

type ReportCommand = {}

type Command = PlaceCommand | FirstPlaceCommand | DirectionCommand | MoveCommand | ReportCommand

function Robot<T extends Command>(commands: T[], command: T): Command[] {
    const isvalid = isCommandValid(command)
    console.log(isvalid)
    if (isvalid)
        return [...commands, command]
    return commands
}

const isCommandValid = (cmd: Command) : boolean => {
    if (cmd as FirstPlaceCommand) {
        console.log(1); return isFirstPlaceCommandValid(cmd as FirstPlaceCommand)
    }
    if (cmd as MoveCommand) {
        console.log(2); return isMoveCommandValid(cmd as MoveCommand)
    }
    if (cmd as PlaceCommand) {
        console.log(3); return isPlaceCommandValid(cmd as PlaceCommand)
    }
    if (cmd as DirectionCommand) {
        console.log(4); return isDirectionCommandValid(cmd as MoveCommand)
    }
    if (cmd as ReportCommand)
        return isReportCommandValid(cmd as ReportCommand)
    return false
}

const isPlaceCommandValid = (cmd: PlaceCommand) : boolean =>
    cmd.x > -1 && cmd.x < 6 && cmd.y > -1 && cmd.y < 6

const isMoveCommandValid = (cmd: MoveCommand) : boolean => cmd.moves > 0

const isFirstPlaceCommandValid = (cmd: FirstPlaceCommand) : boolean => isPlaceCommandValid({ x: cmd.x, y: cmd.y})

const isReportCommandValid = (cmd: ReportCommand) : boolean => true

const isDirectionCommandValid = (cmd: DirectionCommand) : boolean => cmd.direction == Direction.Left || cmd.direction == Direction.Right;

export { Robot, Direction, MoveCommand, PlaceCommand, DirectionCommand, ReportCommand }
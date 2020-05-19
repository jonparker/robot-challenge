
enum Direction {
    Left,
    Right
}

type DirectionCommand = { direction: Direction }
type PlaceCommand = { x: number, y: number }
type FirstPlaceCommand =  { x: number, y: number, direction: Direction }
type ReportCommand = {}
type Command = PlaceCommand | FirstPlaceCommand | DirectionCommand | ReportCommand

const Robot = (commands: Command[], command: Command): Command[] => validateCommand(command) ? [...commands, command] : commands

const validateCommand = (cmd: Command) : boolean =>
    (cmd as PlaceCommand) !== undefined ? validatePlaceCommand(cmd as PlaceCommand) : true;
const validatePlaceCommand = (cmd: PlaceCommand) : boolean =>
    cmd.x > -1 && cmd.x < 6 && cmd.y > -1 && cmd.y < 6

export { Robot, Direction }
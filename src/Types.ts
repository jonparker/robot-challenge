enum CommandType { Rotate, Move }
enum Direction { Left, Right }
enum Compass { N = 'N', S = 'S', E = 'E', W = 'W' }

type RobotCommand = { CommandType: CommandType, repeat: number }
type Location = { portals: Portal, orientation: Compass, x: number, y: number }
type Portal = { B?: {x: number, y: number}, O?: {x: number, y: number }}
interface Rotate extends RobotCommand { Direction: Direction, CommandType: CommandType.Rotate }
interface Move extends RobotCommand { CommandType: CommandType.Move }

const isError = (some: any): some is Error => some.message && some.name && some.stack

export { isError, Rotate, Move, CommandType, Direction, Compass, RobotCommand, Location, Portal }

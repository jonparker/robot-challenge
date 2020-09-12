enum CommandType { Rotate, Move }
enum Direction { Left, Right }
enum Compass { North = 'North', South = 'South', East = 'East', West = 'West' }

interface RobotCommand { CommandType: CommandType, repeat: number }
interface Location { portals: Portal, orientation: Compass, x: number, y: number };
interface Portal { B?: {x: number, y: number}, O?: {x: number, y: number }};
interface Rotate extends RobotCommand { Direction: Direction, CommandType: CommandType.Rotate }
interface Move extends RobotCommand { CommandType: CommandType.Move }

const isError = (some: any) : some is Error => some.message && some.name && some.stack;

export { isError, Rotate, Move, CommandType, Direction, Compass, RobotCommand, Location, Portal };

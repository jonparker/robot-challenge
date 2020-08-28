import { Robot, Direction, MoveCommand, Curry } from './Robot'

class Runner {

    public run() {
        let robot = Robot([], { x: 1, y: 1, direction: Direction.Left })
        console.log('Initial position:')
        console.log(robot)
        
        const stdin = process.openStdin()
        stdin.addListener("data", d => {

            Curry()

            console.log("You entered: [" + d.toString().trim() + "]")
            const command = d.toString().trim()
            const tokens = command.split(' ')
            const directionToken = tokens[0].toLowerCase()
            const direction = directionToken == 'r' ? Direction.Right : Direction.Left
            const amount = +tokens[1];

            console.log(`Point ${direction == Direction.Left ? 'Left' : 'Right'} and move ${amount}`)

            robot = Robot(robot, <MoveCommand>{ direction: direction, moves: amount })
            
            console.log('Next position:')
            console.log(robot)
        });
    }
}

new Runner().run()
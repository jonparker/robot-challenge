import { Robot, Direction, MoveCommand, Curry } from './Robot'
import * as E from 'fp-ts/lib/Either'
import * as R from 'ramda'

function concat<T extends any[], U extends any[]>(arr1: T, arr2: U): [...T, ...U] {
    return [...arr1, ...arr2];
}

class Runner {   

    public run() {

        const names = ['John', 'Sarah'];
        const genders = ['Male', 'Female'];
        const scores = [100, 60];

        const r1 = concat(names, scores);


        // let robot = Robot([], { x: 1, y: 1, direction: Direction.Left })
        // console.log('Initial position:')
        // console.log(robot)
        //Curry()

        // const isUpperCase = (val: string, key: string) => key.toUpperCase() === key;
        // console.log(R.pickBy(isUpperCase, { a: 1, b: 2, A: 3, B: 4 }))

        // const f = R.pipe(Math.pow, R.negate, R.inc, R.inc)
        // console.log(f(3, 4))

        /*
        const stdin = process.openStdin()
        stdin.addListener("data", d => {

            

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
        */
    }
}

new Runner().run()
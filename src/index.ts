import { Robot, Direction } from './Robot';

class Runner {

    public run() {
        const stdin = process.openStdin();
        stdin.addListener("data", d => {
            console.log("you entered: [" + d.toString().trim() + "]");
            const command = d.toString().trim();
            const robot = Robot([], { x: 1, y: 1, direction: Direction.Left});
            const next = Robot(robot, { x: 5, y: 2, direction: Direction.Left});

            console.log(next);
        });
    }
}

new Runner().run();
import { RobotControl } from './Robot'

export class Examples {
    run() {
        const initialLocation: RobotControl.Location = { orientation: 'N', x: 0, y: 0 };
        const commandList: RobotControl.MoveCommand[] = [{ type: 'M', repeat: 1}];

        console.log(`Initial location: ${JSON.stringify(initialLocation)}`);
        const finalLocation = RobotControl.Robot(initialLocation, commandList);
        console.log(`Commands: ${JSON.stringify(commandList)}`);
        console.log(`Final location: ${JSON.stringify(finalLocation)}`);

        const initialLocation2: RobotControl.Location = { orientation: 'N', x: 0, y: 0 };
        const commandList2: RobotControl.MoveCommand[] = [
            { type: 'M', repeat: 1},
            { type: 'R', repeat: 1 },
            { type: 'M', repeat: 4},
            { type: 'L', repeat: 3},
            { type: 'M', repeat: 2}
        ];

        console.log(`Initial location: ${JSON.stringify(initialLocation2)}`);
        const finalLocation2 = RobotControl.Robot(initialLocation2, commandList2);
        console.log(`Commands: ${JSON.stringify(commandList2)}`);
        console.log(`Final location: ${JSON.stringify(finalLocation2)}`);

        // Answer to example:
        // Orientation: S, x: 4, y: 99
        const expectedFinalLocation = { orientation: 'S', x: 4, y: 99 };
        const result = finalLocation2.orientation == expectedFinalLocation.orientation && finalLocation2.x == expectedFinalLocation.x && 
            finalLocation2.y == expectedFinalLocation.y;
        console.log(`Test result: ${result ? 'Pass' : 'Fail'}`);
    }
}
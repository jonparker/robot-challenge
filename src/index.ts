import { RobotControl } from './Robot'
// import * as E from 'fp-ts/lib/Either'
// import * as R from 'ramda'

class Runner {
    public run() {
        console.info("Enter commands (e.g. R4, M3, L):");
        const stdin = process.openStdin();

        stdin.addListener("data", data => {
            console.log("You entered: [" + data.toString().trim() + "]");
            const command = data.toString().trim();
            const multiPartCommand = command.length > 1;
            const enteredRepeatStr = command.replace(command[0], '');
            const enteredRepeat = +enteredRepeatStr;
            const invalidRepeat = isNaN(enteredRepeat) || enteredRepeat < 1 || enteredRepeat > 100;
            const repeat = multiPartCommand ? (invalidRepeat ? 1 : enteredRepeat) : 1;
            if (invalidRepeat)
            {
                console.log(`You entered an invalid number ${enteredRepeatStr}. 1 will be used instead.`);
            }
            
            const commandTypeStr = command[0].toUpperCase();
            let commandType: RobotControl.CommandType;

            switch (commandTypeStr) {
                case 'L':
                    commandType = 'L';
                    break;
                case 'R':
                    commandType = 'R';
                    break;
                case 'M':
                    commandType = 'M';
                    break;
                default:
                    console.log(`Invalid command type: ${commandTypeStr}`);
                    return;
            }
            
            const initialLocation: RobotControl.Location = { orientation: 'N', x: 0, y: 0 };
            const commands: RobotControl.MoveCommand[] = [{ type: commandType, repeat: repeat }];

            console.log('Initial location:')
            console.log(JSON.stringify(initialLocation));
            console.log('Command:')
            console.log(JSON.stringify(commands));
            
            const finalLocation = RobotControl.Robot(initialLocation, commands);
            
            console.log('Final location:');
            console.log(JSON.stringify(finalLocation));
        });
    }
}

new Runner().run()
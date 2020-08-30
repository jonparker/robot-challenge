import { RobotControl } from './Robot'
import * as readline from 'readline';
import * as fs from 'fs';
import { argv } from 'process';

(async function run() {
    const inputFile = argv[2];
    const readInterface = readline.createInterface({ 
        input: fs.createReadStream(inputFile)
    });

    const data: string[] = [];
    
    await readInterface.on('line', line => {
        data.push(line);
    });

    await readInterface.on('close', () => {
        const [initialLocationStr, commandsStr, ..._] = data;
        const [initialDirectionStr, xStr, yStr] = initialLocationStr.split(' ');

        let initialDirection: RobotControl.CompassReading;
        switch (initialDirectionStr) {
            case 'N':
                initialDirection = 'N';
                break;
            case 'S':
                initialDirection = 'S';
                break;
            case 'E':
                initialDirection = 'E';
                break;
            case 'W':
                initialDirection = 'W';
                break
            default:
                throw Error(`Invalid initial direction ${initialDirectionStr}`);
        }
        const x = Number.parseInt(xStr);
        const y = Number.parseInt(yStr);

        if (isNaN(x) || isNaN(y)) {
            throw Error(`Invalid initial location ${xStr} ${yStr}`);
        }

        const initialLocation: RobotControl.Location = { x, y, orientation: initialDirection};
        const isCommandChar = (char?:string): boolean => char == 'L' || char == 'R' || char == 'M';
        const commandList: RobotControl.MoveCommand[] = [];
        const commandStack: string[] = [];
        const digitStack: number[] = [];

        for(const char of commandsStr) {
            if (isCommandChar(char))
            {
                if (commandStack.length || digitStack.length)
                {
                    if (digitStack.length)
                    {
                        const lastDigit = digitStack.pop() || 0;
                        const repeat = digitStack.length ? 
                            (10 * (digitStack.pop() || 0)) + lastDigit :
                            lastDigit;
                        commandList.push({ type: RobotControl.parseCommandType(commandStack.pop() || ''), repeat });
                    }
                    else {
                        commandList.push({ type: RobotControl.parseCommandType(commandStack.pop() || ''), repeat: 1 })
                    }
                }
                commandStack.push(char);
            }
            else {
                digitStack.push(Number.parseInt(char));
            }
        }
        if (digitStack.length)
        {
            const lastDigit = digitStack.pop() || 0;
            const repeat = digitStack.length ? 
                (10 * (digitStack.pop() || 0)) + lastDigit :
                lastDigit;
            commandList.push({ type: RobotControl.parseCommandType(commandStack.pop() || ''), repeat});
        }

        const finalLocation = RobotControl.Robot(initialLocation, commandList);
        
        console.log(`Final location: ${finalLocation.orientation} ${finalLocation.x} ${finalLocation.y}`);
    });
})();
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

        const initialLocation: RobotControl.Location = { x, y, orientation: initialDirection, portals: {} };
        const isCommandChar = (char?:string): boolean => char == 'L' || char == 'R' || char == 'M' || char == 'B' || char == 'O';
        
        type commandInfo = { command: string, firstDigit: number, secondDigit: number };

        const commandList = commandsStr
            .split('')
            .reduce((commandList: commandInfo[], char: string): commandInfo[] =>
            {
                if (isCommandChar(char))
                    return [...commandList, { command: char, firstDigit: -1, secondDigit: -1 }];
                
                const digit = Number.parseInt(char);
                const previousCommands = [...commandList];
                previousCommands.pop();
                const lastCommand = commandList[commandList.length - 1];
                const firstDigit = lastCommand?.firstDigit > 0 ? lastCommand.firstDigit : digit;
                const secondDigit = lastCommand?.firstDigit > 0 ? digit : -1;
                
                return [...previousCommands, { ...lastCommand, firstDigit, secondDigit }];
            },
            [] as commandInfo[]
        ).map(cmd => {
            const hasFirstDigit = cmd.firstDigit > -1;
            const hasSecondDigit = cmd.secondDigit > -1;
            const repeat = !hasFirstDigit && !hasSecondDigit ? 1 :
                (!hasSecondDigit ? cmd.firstDigit : (10 * cmd.firstDigit) + cmd.secondDigit);
            return RobotControl.parseRobotCommand(cmd.command, repeat);
        });

        const finalLocation = RobotControl.Robot(initialLocation, commandList);
        console.log(`Final location: ${finalLocation.orientation} ${finalLocation.x} ${finalLocation.y}`);
    });
})();
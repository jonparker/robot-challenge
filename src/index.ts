import { RobotControl } from './Robot'
import * as readline from 'readline';
import * as fs from 'fs';
import { argv } from 'process';

class Runner {
    public async run() {

        const inputFile = argv[2];
        const readInterface = readline.createInterface({ 
            input: fs.createReadStream(inputFile)
        });

        const data: string[] = [];
        
        await readInterface.on('line', line => {
            data.push(line);
        });

        await readInterface.on('close', () => {
            const [initialLocationStr, commandsStr, ...junk] = data;
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

            type Node = { prev?:Node, commandVal?:string, digitVal?:number, next?:Node } | null;
            let nodes: Node[] = [];
            let prev: Node = { prev: null, commandVal: undefined, digitVal: undefined, next: null };;
            
            const isCommandChar = (char?:string): boolean => char == 'L' || char == 'R' || char == 'M';

            for(let i = 0; i < commandsStr.length - 1; i++) {
                const commandVal = isCommandChar(commandsStr[i]) ? commandsStr[i] : undefined;
                const digitVal = commandVal == null ? Number.parseInt(commandsStr[i]) : undefined;
                const curr: Node = { prev: prev, commandVal, digitVal: digitVal, next: null };
                if (i > 0)
                {
                    prev.next = curr;
                }
                nodes.push(curr);
                prev = curr;
            }

            

            const commandList = [];
            let lastNode: Node = nodes[0];
            nodes.forEach(n => {
                if (n?.commandVal) {
                    if (n?.prev == undefined)
                    {
                    }
                    else if (n.prev?.commandVal)
                    {
                        commandList.push({ type: n?.commandVal, repeat: 1 });
                    }
                    else {
                        const isDoubleDigit = n?.prev?.prev && n?.prev?.prev.digitVal;
                        const commandType = isDoubleDigit ? n?.prev?.prev?.prev?.commandVal : n?.prev?.prev?.commandVal;
                        const prevDigit = n?.prev?.digitVal || 1;
                        const repeat = isDoubleDigit ? (10 * (n?.prev?.prev?.digitVal || 1)) + prevDigit : prevDigit;
                        commandList.push({ type: commandType, repeat });
                    }
                    //const repeat = isCommandChar(n?.prev?.value) ? 1 : Number.parseInt(n?.prev?.value || '1');
                    
                    //commandList.push({ type: n?.value, repeat });
                }
                lastNode = n;
                // console.log('Command ' + j++);
                // console.log('Val:' + n?.value);
                // console.log('Prev:' + n?.prev?.value);
                // console.log('Next:' + n?.next?.value);
            });

            if (lastNode?.commandVal) {
                commandList.push({ type: lastNode.commandVal, repeat: 1});
            }

            let commands = commandList;
            // let commands = [];
            // let number = 0;
            // let command = '';
            // let hadCommand = true;
            // let previousIsCommand = false;

            // for(let char of commandsStr) {
            //     const digit = Number.parseInt(char);
            //     const isDigit = !isNaN(digit);
            //     if (isDigit) {
            //         if (previousIsCommand)
            //         {
            //             number = digit;
            //         }
            //         else {
            //             commands.push({ command, repeat: (number * 10) + digit});
            //             number = 0;
            //             command = '';
            //             hadCommand = false;
            //         }
            //         previousIsCommand = false;
            //     }
            //     else {
            //         if (hadCommand)
            //         {
            //             commands.push({ command: char, repeat: number == 0 ? 1 : number });
            //             number = 0;
            //             hadCommand = false;
            //             previousIsCommand = false;
            //         }
            //         else {
            //             command = char;
            //             hadCommand = true;
            //             previousIsCommand = true;
            //         }
            //     }
            // }
            
            console.log(JSON.stringify(initialLocation));
            console.log('Commands:');
            commands.forEach(command => console.log(JSON.stringify(command)));
        })

        // const [initialLocationData, ...commands] = data;
        // console.log('initial: ' + initialLocationData);
        // console.log('commands: ' + commands.length);
        // stdin.addListener("data", data => {
        //     console.log("You entered: [" + data.toString().trim() + "]");
        //     const command = data.toString().trim();
        //     const multiPartCommand = command.length > 1;
        //     const enteredRepeatStr = command.replace(command[0], '');
        //     const enteredRepeat = +enteredRepeatStr;
        //     const invalidRepeat = isNaN(enteredRepeat) || enteredRepeat < 1 || enteredRepeat > 100;
        //     const repeat = multiPartCommand ? (invalidRepeat ? 1 : enteredRepeat) : 1;
        //     if (invalidRepeat)
        //     {
        //         console.log(`You entered an invalid number ${enteredRepeatStr}. 1 will be used instead.`);
        //     }
        //     const initialLocation: RobotControl.Location = { orientation: 'N', x: 0, y: 0 };
        //     const commands: RobotControl.MoveCommand[] = [{ type: RobotControl.parseCommandType(command[0]), repeat: repeat }];

        //     console.log('Initial location:')
        //     console.log(JSON.stringify(initialLocation));
        //     console.log('Command:')
        //     console.log(JSON.stringify(commands));
            
        //     const finalLocation = RobotControl.Robot(initialLocation, commands);
            
        //     console.log('Final location:');
        //     console.log(JSON.stringify(finalLocation));
        // });
    }
}

new Runner().run()
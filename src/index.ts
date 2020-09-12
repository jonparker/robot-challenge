import { robotParser, Robot, Compass, Location } from './Robot';
import * as fs from 'fs';
import { argv } from 'process';

const parseInitialLocation = (initialLocationStr: string): Location => {
    const [initialDirectionStr, x, y] = initialLocationStr.split(' ');
    const initialLocation = robotParser.parseInitialLocation(initialDirectionStr, x, y);
    if (!initialLocation)
    {
        console.log(`Initial location ${initialLocationStr} could not be parsed.`);
        throw Error(`Initial location ${initialLocationStr} could not be parsed.`);
    }
    return initialLocation;
}

(async () => {
    const fileContent = (await fs.promises.readFile(argv[2])).toString().split('\n');
    const [initialLocationStr, commandsStr, ..._] = fileContent;
    const initialLocation = parseInitialLocation(initialLocationStr);
    
    enum ParseBufferState { CommandChar, CommandCharAndDigit, Empty };
    type CommandInfo = { command: string, repeats?: number };

    let commandTokenList: CommandInfo[] = [];
    let parseBuffer: ParseBufferState = ParseBufferState.Empty;
    
    commandsStr.split('').forEach(cmdChar => {
        const cmdInt = Number.parseInt(cmdChar);
        const cmdIsInt = !isNaN(cmdInt);

        switch (parseBuffer) {
            case ParseBufferState.Empty:
                commandTokenList.push({ command: cmdChar });
                parseBuffer = ParseBufferState.CommandChar;
                break;
            case ParseBufferState.CommandChar:
                if (cmdIsInt)
                {
                    const cmd = commandTokenList.pop();
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: cmdInt });
                    }
                    parseBuffer = ParseBufferState.CommandCharAndDigit;
                }
                else {
                    commandTokenList.push({ command: cmdChar });
                }
                break;
            case ParseBufferState.CommandCharAndDigit:
                if (cmdIsInt) {
                    const cmd = commandTokenList.pop();
                    if (cmd) {
                        commandTokenList.push({ ...cmd, repeats: (10 * (cmd.repeats || 0)) + cmdInt });
                    }
                    parseBuffer = ParseBufferState.Empty;
                }
                else {
                    commandTokenList.push({ command: cmdChar });
                    parseBuffer = ParseBufferState.CommandChar;
                }
                break;
        }
    });

    const commandList = commandTokenList.map(cmd => robotParser.parseRobotCommand(cmd.command, cmd.repeats || 1 ));
    const finalLocation = Robot(initialLocation, commandList);
    console.log(`Final location: ${Compass[finalLocation.orientation]} ${finalLocation.x} ${finalLocation.y}`);
})();
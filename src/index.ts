import { prompt, list, input } from 'typed-prompts'
import { Command } from './Command';

class Robot {
    location: string;
    Report() {
        return this.location;
    }
    constructor() {
        this.location = "(0,0)";
    }
}


//let foo = new Robot();
//console.log(foo.location);

/*
// Prompt the user for the input
prompt<Command>([
    input('PLACE', 'Enter place coordinates (x,y): '),
    input('MOVE', 'Enter move '),
    input('LEFT', 'Enter Width in cm: '),
    input('RIGHT', 'Enter Depth in cm: '),
    input('REPORT', 'Enter Depth in cm: ')
  ])
  .then((inputs) => {

    for (const command of [ inputs.place, inputs.move, inputs.left, inputs.right, inputs.report])
    {
        console.log(`${command} is not a valid postive whole number. Fractions are not allowed.`);
    }
  });
*/
export  { Robot };
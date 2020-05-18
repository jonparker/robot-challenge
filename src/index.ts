
class Robot {
    location: string;
    constructor() {
        this.location = "(0,0)";
    }
}

let foo = new Robot();
console.log(foo.location);

export  { Robot };
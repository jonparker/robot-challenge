import { Parser } from './Parser';
import { Compass } from './Types';

describe('Parser.parseDirection', () => {
    test.each([
        ['N', Compass.North],
        ['S', Compass.South],
        ['E', Compass.East],
        ['W', Compass.West]
    ])('parseDirection("%s") - %s', (input, expected) => {
        const result = Parser.parseDirection(input);
        expect(result).toBe(expected);
    });
});

describe('Parser.parseRobotCommand', () => {
    type DataRow = { location: string, expectX: number, expectY: number, expectOrientation: Compass};
    test.each`
    location      | expectX | expectY | expectOrientation
    ${'N 0 0'}    | ${0}    | ${0}    | ${Compass.North}
    ${'S 0 0'}    | ${0}    | ${0}    | ${Compass.South}
    ${'E 0 0'}    | ${0}    | ${0}    | ${Compass.East}
    ${'W 0 0'}    | ${0}    | ${0}    | ${Compass.West}
    ${'N 99 99'}  | ${99}   | ${99}   | ${Compass.North}
    ${'S 99 0'}   | ${99}   | ${0}    | ${Compass.South}
    `('parseInitialLocation("$location) - { x: $expectX, y: $expectY, orientation: $expectOrientation, portals: {} }', (row: DataRow) => {
        const result = Parser.parseInitialLocation(row.location);
        expect(result).toEqual({ x: row.expectX, y: row.expectY, orientation: row.expectOrientation, portals: {} });
    });
});
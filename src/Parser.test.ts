import Parser from './Parser'
import { Compass } from './Types'

describe('Parser.parseDirection', () => {
    test.each([
        ['N', Compass.N],
        ['S', Compass.S],
        ['E', Compass.E],
        ['W', Compass.W]
    ])('parseDirection("%s") - %s', (input, expected) => {
        const result = Parser.parseDirection(input)
        expect(result).toBe(expected)
    })
})

describe('Parser.parseRobotCommand', () => {
    type DataRow = {
        location: string
        expectX: number
        expectY: number
        expectOrientation: Compass
    }
    test.each`
        location     | expectX | expectY | expectOrientation
        ${'N 0 0'}   | ${0}    | ${0}    | ${Compass.N}
        ${'S 0 0'}   | ${0}    | ${0}    | ${Compass.S}
        ${'E 0 0'}   | ${0}    | ${0}    | ${Compass.E}
        ${'W 0 0'}   | ${0}    | ${0}    | ${Compass.W}
        ${'N 99 99'} | ${99}   | ${99}   | ${Compass.N}
        ${'S 99 0'}  | ${99}   | ${0}    | ${Compass.S}
    `(
        'parseInitialLocation("$location) - { x: $expectX, y: $expectY, orientation: $expectOrientation }',
        (row: DataRow) => {
            const result = Parser.parseInitialLocation(row.location)
            expect(result).toEqual({
                x: row.expectX,
                y: row.expectY,
                orientation: row.expectOrientation
            })
        }
    )
})

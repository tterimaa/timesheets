import input from "./input.json"

interface Input {
    prop1: string,
    prop2: number
}

const printTestObject = (testInput: Input) => {
    console.log(testInput.prop1);
    console.log(testInput.prop2);
}

printTestObject(input)
import { readFile, readFileSync } from "fs";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

var input = inpfile("./test.txt");

console.time("Run time");
console.log("Solution is: " + test(input).toString());
console.timeEnd("Run time");

function test(input: string[]) {
  return input[0]
    .split("\n")
    .map((x) => parseInt(x))
    .filter((cur, i, arr) => arr.filter((x) => x + cur === 2020).length > 0)
    .reduce((x, y) => x * y);
}

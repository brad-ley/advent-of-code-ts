import { readFile, readFileSync } from "fs";
import * as math from "mathjs";
import { clone, cloneDeep } from "lodash";
import { matchRecursive } from "xregexp";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

// var input = inpfile("./test.txt");
var input = inpfile("./advent.txt");

console.time("Run time");
console.log("Solution is: " + day2pt2(input).toString());
console.timeEnd("Run time");

function day2pt2(input: string[]) {
  function exCommand(com: string, val: number, c: number[]) {
    if (com == 'down'){
      c[2] += val 
    }
    else if ( com == 'up' ){
      c[2] -= val
    }
    else if (com == 'forward') {
      c[0] += val
      c[1] += c[2]*val
    }
    return c
  }
  const lines = <string[]> input[0].split("\n")

  var coords = [0,0,0]
  for (const line of lines){
    const com = line.split(" ")[0]
    const val = parseInt(line.split(" ")[1])
    coords = exCommand(com, val, coords)
  }

  return coords[0] * coords[1]
}

function day2(input: string[]) {
  const directions: { [key: string]: number } = {
    up: math.complex(-1, 0),
    down: math.complex(1, 0),
    forward: math.complex(0, 1),
  };
  let position = input[0]
    .split("\n")
    .map(x => math.multiply(directions[x.split(" ")[0]], x.split(" ")[1]))
    .reduce((x, y) => math.add(x, y));
  return math.re(position) * math.im(position);
}

function day1pt2(input: string[]) {
  var nums = input[0].split("\n").map((x) => parseInt(x));
  // Day1 solution is how I did this originally but this filter method is much prettier
  return nums.filter((current, index, array) => current > array[index - 3])
    .length;
}
function day1(input: string[]) {
  var nums = input[0].split("\n").map((x) => parseInt(x));
  var c = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] - nums[i - 1] > 0) {
      c++;
    }
  }
  return c;
}

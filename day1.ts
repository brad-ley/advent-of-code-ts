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
console.log("Solution is: " + day1pt2(input).toString());
console.timeEnd("Run time");

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

import { readFile, readFileSync } from "fs";
import * as math from "mathjs";
import { clone, cloneDeep } from "lodash";
import { matchRecursive } from "xregexp";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

// var input = inpfile("./other/test.txt");
var input = inpfile("./other/advent.txt");

console.time("Run time");
console.log("Solution is: " + day3pt2(input).toString());
console.timeEnd("Run time");

function day3pt2(input: string[]) {
  var bs = input[0].split("\n");
  var bd = cloneDeep(bs);

  function reduce(bs: string[], targ: number) {
    // targ 0 means find least common, targ 1 means find most common
    // tiebreakers are set to follow AOC rules in else statement
    var i = 0;
    while (bs.length > 1) {
      var c = 0;
      for (const b of bs) {
        if (b[i] === "1") {
          c++;
        }
      }
      if (c < bs.length / 2) {
        var search = (targ ^ 1).toString();
      } else {
        var search = targ.toString();
      }
      bs = bs.filter((x) => x.split("")[i] === search);
      i++;
    }
    return parseInt(bs[0], 2);
  }
  return reduce(bs, 1) * reduce(bd, 0);
}

function day3(input: string[]) {
  var bs = input[0].split("\n");
  var outstr = "";
  for (var ii = 0; ii < bs[0].length; ii++) {
    var count = 0;
    for (const b of bs) {
      if (b[ii] === "1") {
        count++;
      }
    }
    if (count > bs.length / 2) {
      outstr += "1";
    } else {
      outstr += "0";
    }
  }
  function flip(outstr: string) {
    var outinv = "";
    for (var bit of outstr) {
      if (bit == "1") {
        outinv += "0";
      } else {
        outinv += "1";
      }
    }
    return outinv;
  }
  var outinv = flip(outstr);
  return parseInt(outstr, 2) * parseInt(outinv, 2);
}

function day2pt2(input: string[]) {
  function exCommand(com: string, val: number, c: number[]) {
    if (com == "down") {
      c[2] += val;
    } else if (com == "up") {
      c[2] -= val;
    } else if (com == "forward") {
      c[0] += val;
      c[1] += c[2] * val;
    }
    return c;
  }
  const lines = <string[]>input[0].split("\n");

  var coords = [0, 0, 0];
  for (const line of lines) {
    const com = line.split(" ")[0];
    const val = parseInt(line.split(" ")[1]);
    coords = exCommand(com, val, coords);
  }

  return coords[0] * coords[1];
}

function day2(input: string[]) {
  const directions: { [key: string]: number } = {
    up: math.complex(-1, 0),
    down: math.complex(1, 0),
    forward: math.complex(0, 1),
  };
  let position = input[0]
    .split("\n")
    .map((x) => math.multiply(directions[x.split(" ")[0]], x.split(" ")[1]))
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

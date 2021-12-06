import { readFile, readFileSync } from "fs";
import * as math from "mathjs";
import { clone, cloneDeep, range } from "lodash";
import { matchRecursive } from "xregexp";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

// var input = inpfile("./other/test.txt");
var input = inpfile("./other/advent.txt");

console.time("Run time");
console.log("Solution is: " + day6pt2(input).toString());
console.timeEnd("Run time");

function day6pt2(input: string[]) {
  let nums = input[0]
    .split(",")
    .map((x) => parseInt(x.trim()))
    .filter((x) => x);
  const r = range(0, 9);
  var counts: { [key: number]: number } = {};
  // create and populate object
  r.forEach((el) => {
    counts[el] = counts[el] ? (counts[el] += 1) : 0;
  });
  // get initial conditions
  nums.forEach((el) => {
    counts[el] = counts[el] ? (counts[el] += 1) : 1;
  });
  var hold = cloneDeep(counts);
  // iterate
  for (let ii = 0; ii < 256; ii++) {
    r.forEach((el) => {
      if (el > 0 && el != 7) {
        counts[el - 1] = hold[el];
      } else {
        counts[6] = hold[0] + hold[7];
        counts[8] = hold[0];
      }
    });
    var hold = cloneDeep(counts);
  }
  return Object.entries(counts)
    .map((x) => x[1])
    .reduce((acc, cur) => acc + cur);
}

function day6(input: string[]) {
  let nums = input[0]
    .split(",")
    .map((x) => parseInt(x.trim()))
    .filter((x) => x);
  for (let ii = 0; ii < 256; ii++) {
    let N = nums.length;
    for (let n = 0; n < N; n++) {
      if (nums[n] !== 0) {
        nums[n]--;
      } else {
        nums[n] = 6;
        nums.push(8);
      }
    }
  }
  return nums.length;
}

function day5pt2(input: string[]) {
  input = input[0].split("\n");
  var p1 = input.map((x) =>
    x
      .split(" -> ")[0]
      .trim()
      .split(",")
      .map((y) => parseInt(y))
  );
  var p2 = input.map((x) =>
    x
      .split(" -> ")[1]
      .trim()
      .split(",")
      .map((y) => parseInt(y))
  );
  var pts = new Array();
  for (var ii = 0; ii < p1.length; ii++) {
    var dx = p2[ii][0] - p1[ii][0];
    var dy = p2[ii][1] - p1[ii][1];
    var d = Math.max(Math.abs(dx), Math.abs(dy));
    for (var kk = 0; Math.abs(kk) <= Math.abs(d); kk += Math.sign(d)) {
      pts.push([
        p1[ii][0] + Math.abs(kk) * Math.sign(dx),
        p1[ii][1] + Math.abs(kk) * Math.sign(dy),
      ]);
    }
  }
  var counts = {};
  pts.forEach((el) => {
    counts[el] = counts[el] ? (counts[el] += 1) : 1;
  });
  return Object.entries(counts).filter((x) => x[1] > 1).length;
}

function day5(input: string[]) {
  input = input[0].split("\n");
  var p1 = input.map((x) =>
    x
      .split(" -> ")[0]
      .trim()
      .split(",")
      .map((y) => parseInt(y))
  );
  var p2 = input.map((x) =>
    x
      .split(" -> ")[1]
      .trim()
      .split(",")
      .map((y) => parseInt(y))
  );
  var straightpts = new Array();
  for (var ii = 0; ii < p1.length; ii++) {
    if (p1[ii][0] === p2[ii][0]) {
      var start = Math.min(p1[ii][1], p2[ii][1]);
      var stop = Math.max(p1[ii][1], p2[ii][1]);
      for (var kk = start; kk <= stop; kk++) {
        straightpts.push([p1[ii][0], kk]);
      }
    } else if (p1[ii][1] === p2[ii][1]) {
      var start = Math.min(p1[ii][0], p2[ii][0]);
      var stop = Math.max(p1[ii][0], p2[ii][0]);
      for (var kk = start; kk <= stop; kk++) {
        straightpts.push([kk, p1[ii][1]]);
      }
    }
  }
  var counts = {};
  straightpts.forEach((el) => {
    counts[el] = counts[el] ? (counts[el] += 1) : 1;
  });
  return Object.entries(counts).filter((x) => x[1] > 1).length;
}

function day4pt2(input) {
  var vals = input[0].split(",").map((x) => x.trim());
  input.shift();
  var boards = input.map((x) =>
    x
      .split("\n")
      .join(" ")
      .split(" ")
      .filter((y) => y)
      .map((y) => y.trim())
  );
  var foundboards = new Array(boards.length);
  for (let v of vals) {
    for (let b of boards) {
      var found = false;
      var spot = b.indexOf(v);
      if (spot > -1) {
        b[b.indexOf(v)] = parseInt(v);

        var row = Math.floor(spot / 5);
        var rowcheck = range(5 * row, 5 * (row + 1));
        var col = spot - 5 * row;
        var colcheck = range(col, col + 25, 5);
        // if (boards.indexOf(b) == 2) {
        //   console.log(b, v, spot, row, col, rowcheck, colcheck)
        // }
        var rowc = 0;
        var colc = 0;
        for (var r of rowcheck) {
          if (typeof b[r] === "string") {
            break;
          }
          rowc++;
        }
        if (rowc === 5) {
          found = true;
        } else {
          for (var c of colcheck) {
            if (typeof b[c] === "string") {
              break;
            }
            colc++;
          }
        }
        if (colc === 5) {
          found = true;
        }
      }
      if (found) {
        if (boards.length === 1) {
          return (
            b
              .filter((x) => typeof x === "string")
              .reduce((x, y) => parseInt(x) + parseInt(y)) * parseInt(v)
          );
        } else {
          foundboards.push(b);
        }
      }
    }
    for (var f of foundboards) {
      var foundwhere = boards.indexOf(f);
      if (foundwhere > -1) {
        boards = boards.filter((x) => x !== f);
      }
    }
  }
}

function day4(input) {
  var vals = input[0].split(",").map((x) => x.trim());
  input.shift();
  var boards = input.map((x) =>
    x
      .split("\n")
      .join(" ")
      .split(" ")
      .filter((y) => y)
      .map((y) => y.trim())
  );
  for (let v of vals) {
    for (let b of boards) {
      var spot = b.indexOf(v);
      if (spot > -1) {
        b[b.indexOf(v)] = parseInt(v);

        var row = Math.floor(spot / 5);
        var rowcheck = range(5 * row, 5 * (row + 1));
        var col = spot - 5 * row;
        var colcheck = range(col, col + 25, 5);
        // if (boards.indexOf(b) == 2) {
        //   console.log(b, v, spot, row, col, rowcheck, colcheck)
        // }
        var rowc = 0;
        var colc = 0;
        for (var r of rowcheck) {
          if (typeof b[r] === "string") {
            break;
          }
          rowc++;
        }
        if (rowc === 5) {
          var found = true;
        } else {
          for (var c of colcheck) {
            if (typeof b[c] === "string") {
              break;
            }
            colc++;
          }
        }
        if (colc === 5) {
          var found = true;
        }
      }
      if (found) {
        return (
          b
            .filter((x) => typeof x === "string")
            .reduce((x, y) => parseInt(x) + parseInt(y)) * parseInt(v)
        );
      }
    }
  }
}

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

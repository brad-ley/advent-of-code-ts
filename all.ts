import { readFile, readFileSync } from "fs";
import * as math from "mathjs";
import { clone, cloneDeep, range } from "lodash";
import { matchRecursive } from "xregexp";
import { Plotly } from "plotly.js-dist-min";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

var input = inpfile("./other/test.txt");
// var input = inpfile("./other/advent.txt");

console.time("Run time");
console.log("Solution is: " + day11(input).toString());
console.timeEnd("Run time");

function day11(input: string[]) {}

function day10pt2(input: string[]) {
  let lines = input[0].split("\n");
  let openers = ["[", "{", "(", "<"];
  let closers = ["]", "}", ")", ">"];
  let score: { [key: string]: number } = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  let closingscore: { [key: string]: number } = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };
  function findpair(line: string[]) {
    for (var i = 1; i < line.length; i++) {
      if (
        closers.includes(line[i]) &&
        closers.indexOf(line[i]) === openers.indexOf(line[i - 1])
      ) {
        line.splice(i - 1, 2);
        return findpair(line);
      }
    }
    if (!Boolean(score[line.filter((x) => closers.includes(x))[0]])) {
      return line
        .reverse()
        .map((x) => closingscore[closers[openers.indexOf(x)]])
        .reduce((acc, cur) => 5 * acc + cur);
    } else {
      return 0;
    }
  }
  var out = lines
    .map((el) => findpair(el.split("")))
    .filter((x) => x)
    .sort((a, b) => a - b);
  return out[Math.floor(out.length / 2)];
}

function day10(input: string[]) {
  let lines = input[0].split("\n");
  let openers = ["[", "{", "(", "<"];
  let closers = ["]", "}", ")", ">"];
  let score: { [key: string]: number } = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  function findpair(line: string[]) {
    for (var i = 1; i < line.length; i++) {
      if (
        closers.includes(line[i]) &&
        closers.indexOf(line[i]) === openers.indexOf(line[i - 1])
      ) {
        line.splice(i - 1, 2);
        return findpair(line);
      }
    }
    if (score[line.filter((x) => closers.includes(x))[0]]) {
      return score[line.filter((x) => closers.includes(x))[0]];
    } else {
      return 0;
    }
  }
  var tot = 0;
  lines.forEach((el) => (tot += findpair(el.split(""))));
  return tot;
}

function day9pt2(input: string[]) {
  var map = input[0]
    .split("\n")
    .map((x) => x.split("").map((y) => parseInt(y.trim())));
  var lowpoints = [];
  function filterlist(x: number, y: number) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(
      (el) =>
        el[0] >= 0 && el[0] < map.length && el[1] >= 0 && el[1] < map[0].length
    );
  }
  for (var ii = 0; ii < map.length; ii++) {
    for (var kk = 0; kk < map[ii].length; kk++) {
      var checklist = filterlist(ii, kk);
      if (
        checklist.filter((x) => map[x[0]][x[1]] > map[ii][kk]).length ===
        checklist.length
      ) {
        lowpoints.push([ii, kk]);
      }
    }
  }
  var sols = [0, 0, 0];
  for (var l of lowpoints) {
    let [x, y] = l;
    var basin = [[x, y].toString()];
    var oldbasin = [];
    var checked = [];
    while (oldbasin.length !== basin.length) {
      // had to do string conversion in here because array.includes(array) is never true due to pass-by-reference
      oldbasin = cloneDeep(basin);
      // var unchecked = basin.filter(x => !checked.includes(x))
      // for (var pt of unchecked) {
      for (var pt of basin) {
        [x, y] = pt.split(",").map((x) => parseInt(x));
        let nearby = filterlist(x, y);
        for (var el of nearby) {
          if (map[el[0]][el[1]] < 9 && !basin.includes(el.toString())) {
            basin.push(el.toString());
          }
        }
      }
      // checked.push(basin.filter(x => !checked.includes(x)))
      // somehow the commented stuff is actually slower than just rechecking the same points over and over
      // maybe because the comments require more looping through existing arrays?
    }
    sols = sols.sort((a, b) => a - b);
    if (basin.length > sols[0]) {
      sols[0] = basin.length;
    }
  }
  return sols.reduce((acc, cur) => acc * cur);
}

function day9(input: string[]) {
  var map = input[0]
    .split("\n")
    .map((x) => x.split("").map((y) => parseInt(y.trim())));
  var c = 0;
  function filterlist(x: number, y: number) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(
      (el) =>
        el[0] >= 0 && el[0] < map.length && el[1] >= 0 && el[1] < map[0].length
    );
  }
  for (var ii = 0; ii < map.length; ii++) {
    for (var kk = 0; kk < map[ii].length; kk++) {
      var checklist = filterlist(ii, kk);
      if (
        checklist.filter((x) => map[x[0]][x[1]] > map[ii][kk]).length ===
        checklist.length
      ) {
        c += 1 + map[ii][kk];
      }
    }
  }
  return c;
}

function day8pt2(input: string[]) {
  var inp = input[0]
    .split("\n")
    .map((x) => x.split("|")[0])
    .map((x) => x.trim().split(" "));
  var outp = input[0]
    .split("\n")
    .map((x) => x.split("|")[1])
    .map((x) => x.trim().split(" "));
  var code: { [key: number]: string } = {};
  var res = new Array(outp.length);
  for (var ii = 0; ii < inp.length; ii++) {
    var row = inp[ii];
    // these 4 have unique lengths
    code[1] = row.filter((x) => x.length === 2).join();
    code[4] = row.filter((x) => x.length === 4).join();
    code[7] = row.filter((x) => x.length === 3).join();
    code[8] = row.filter((x) => x.length === 7).join();
    // 2,5,6 all have only one of the two vals in 1
    // 5 and 6 have the same, 2 has different
    var twofivesix = row.filter(
      (x) =>
        (x.includes(code[1].split("")[0]) &&
          !x.includes(code[1].split("")[1])) ||
        (!x.includes(code[1].split("")[0]) && x.includes(code[1].split("")[1]))
    );
    var bool256 = twofivesix.map((x) => x.includes(code[1].split("")[0]));
    if (bool256.filter((x) => x).length > 1) {
      bool256 = bool256.map((x) => !x);
    }
    // one true is 2
    code[2] = twofivesix[bool256.indexOf(true)];
    var fivesix = twofivesix.filter((x) => !bool256[twofivesix.indexOf(x)]);
    // 6 has one more element than 5
    code[6] = fivesix.filter((x) => x.length === 6).join();
    code[5] = fivesix.filter((x) => x !== code[6]).join();
    // 0 and 9 have the same num of letters but 9 contains ALL of 4
    var ninezero = row.filter((x) => x.length === 6 && x !== code[6]);
    code[9] = ninezero
      .filter((x) =>
        code[4]
          .split("")
          .map((y) => x.includes(y))
          .every((x) => x)
      )
      .join();
    // 0 is the other one
    code[0] = ninezero.filter((x) => x !== code[9]).join();
    // 3 is now all that is left
    code[3] = row
      .filter(
        (x) =>
          !Object.entries(code)
            .map((x) => x[1])
            .includes(x)
      )
      .join();

    // flip around the key-value pairs in code object
    var edoc = {};
    Object.entries(code).forEach(
      (x) => (edoc[x[1].split("").sort().join("")] = x[0])
    );
    res[ii] = parseInt(
      outp[ii].map((x) => edoc[x.split("").sort().join("")]).join("")
    );
  }
  return res.reduce((acc, cur) => acc + cur);
}

function day8(input: string[]) {
  var outp = input[0]
    .split("\n")
    .map((x) => x.split("|")[1])
    .map((x) => x.trim().split(" "));
  var count: { [length: number]: number } = { 2: 1, 4: 4, 3: 7, 7: 8 }; // length then number corresponding
  return outp
    .map((x) => x.filter((y) => count[y.length]).length)
    .reduce((acc, cur) => acc + cur);
}

function day7pt2(input: string[]) {
  var nums = input[0].split(",").map((x) => parseInt(x.trim()));
  var i = 0;
  var steps = {};
  var r = range(Math.max(...nums) + 1);
  r.forEach((el) =>
    el > 0
      ? (steps[el] = range(1, el + 1).reduce((acc, curr) => acc + curr))
      : (steps[el] = 0)
  );
  var oldtot = steps[Math.max(...nums)] * nums.length; // initialize at max possible val
  do {
    var tot = nums
      .map((x) => steps[Math.abs(x - i)])
      .reduce((acc, curr) => acc + curr);
    if (tot < oldtot) {
      oldtot = cloneDeep(tot);
    } else {
      break;
    }
    i++;
  } while (i < nums.length);
  return oldtot;
}

function day7(input: string[]) {
  var nums = input[0].split(",").map((x) => parseInt(x.trim()));
  var oldtot = Math.max(...nums) * nums.length;
  var i = 0;
  do {
    var tot = nums
      .map((x) => Math.abs(x - i))
      .reduce((acc, curr) => acc + curr);
    console.log(tot, oldtot, i);
    if (tot < oldtot) {
      oldtot = cloneDeep(tot);
    }
    i++;
  } while (i < nums.length);
  return oldtot;
}

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
  var c = [];
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
    c.push(
      Object.entries(counts)
        .map((x) => x[1])
        .reduce((acc, cur) => acc + cur)
    );
    var data = [range(0, c.length), c];
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

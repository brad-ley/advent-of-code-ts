import { readFile, readFileSync } from "fs";
import * as math from "mathjs";
import { clone, cloneDeep } from "lodash";
import { matchRecursive } from "xregexp";

function inpfile(filein: string) {
  return readFileSync(filein, "utf8").trim().split("\n\n");
}

var input = inpfile("../other/test.txt");
// var input = inpfile("../other/advent.txt");

console.time("Run time");
console.log("Solution is: " + day19(input).toString());
console.timeEnd("Run time");

function day19(input: string[]) {
  var rules = input[0].split("\n");
  var mess = input[1].split("\n");
  var rulob = new Object();
  for (var r of rules) {
    rulob[parseInt(r.split(":")[0])] = r.split(":")[1].trim();
  }
  function check(w: string, r: string, bool: boolean[]) {
    for (var ii of rulob[r].split("|")) {
      console.log(ii);
      if (!/\d+/gm.test(rulob[r])) {
        // console.log(r.match(/[a-z]+/gm))
        if (w.includes(r.match(/[a-z]+/gm)[0])) {
          console.log("here");
          return { w: w, r: r, bool: true };
        } else {
          return { w: w, r: r, bool: false };
        }
      }
      // console.log(ii, ii.match(/\d+/gm))
      for (var kk of ii.match(/\d+/gm)) {
        // console.log(kk)
        var out = check(w, kk, bool);
        bool.push(out.bool);
      }
    }
    return out;
  }
  var sum = 0;
  for (const w of mess) {
    console.log(check(w, "0", []));
    // if ( check (w, '0') ){
    // console.log(w)
    // }
  }
  return 5;
}

function day18pt2(input: string[]) {
  function getparen(arg: string, hold: object) {
    var temp = matchRecursive(arg, "\\(", "\\)", "g");
    if (temp.length === 0) {
      hold[arg] = 0;
      return { arg: arg, out: hold };
    }
    for (const ii of temp) {
      getparen(ii, hold);
    }
    temp.push(arg);
    return { arg: temp, out: hold };
  }
  function parseString(ii: string) {
    if (/[0-9]+\+[0-9]+/gm.test(ii)) {
      return (
        parseInt(ii.match(/[0-9]+/gm)[0]) + parseInt(ii.match(/[0-9]+/gm)[1])
      );
    } else if (/[0-9]+\*[0-9]+/gm.test(ii)) {
      return (
        parseInt(ii.match(/[0-9]+/gm)[0]) * parseInt(ii.match(/[0-9]+/gm)[1])
      );
    }
  }
  var sum = 0;
  for (const row of input) {
    var calc = row.replace(/ /g, "");
    var c = 0;
    while (calc.includes("(")) {
      var use = getparen(calc, {});
      use.arg = Array.from(use.arg);
      for (const ii in use.out) {
        var l = ii.split("*");
        var lis = [];
        for (var chunk of l) {
          while (/\*|\+/gm.test(chunk)) {
            const val = parseString(
              chunk.match(/[0-9]+(\*|\+)[0-9]+/gm)[0]
            ).toString();
            chunk =
              val.toString() +
              chunk.replace(chunk.match(/[0-9]+(\*|\+)[0-9]+/gm)[0], "");
          }
          lis.push(parseInt(chunk));
        }
        use.out[ii] = lis.reduce((x, y) => x * y);
      }
      const hold = cloneDeep(use);
      for (const com of hold.arg) {
        for (const sol in hold.out) {
          if (com.includes(sol)) {
            use.arg[hold.arg.indexOf(com)] = com.replace(
              "(" + sol + ")",
              use.out[sol].toString()
            );
          }
        }
      }
      c++;
      calc = use.arg[use.arg.length - 1];
    }

    var l = calc.split("*");
    var lis = [];
    for (var chunk of l) {
      while (/\*|\+/gm.test(chunk)) {
        const val = parseString(
          chunk.match(/[0-9]+(\*|\+)[0-9]+/gm)[0]
        ).toString();
        chunk =
          val.toString() +
          chunk.replace(chunk.match(/[0-9]+(\*|\+)[0-9]+/gm)[0], "");
      }
      lis.push(parseInt(chunk));
      calc = lis.reduce((x, y) => x * y);
      // while (/\*|\+/gm.test(calc)) {
      //   const val = parseString(
      //     calc.match(/[0-9]+(\*|\+)[0-9]+/gm)[0]
      //   ).toString();
      //   calc =
      //     val.toString() +
      //     calc.replace(calc.match(/[0-9]+(\*|\+)[0-9]+/gm)[0], "");
    }
    sum += parseInt(calc);
  }
  return sum;
}

function day18(input: string[]) {
  function getparen(arg: string, hold: object) {
    var temp = matchRecursive(arg, "\\(", "\\)", "g");
    if (temp.length === 0) {
      hold[arg] = 0;
      return { arg: arg, out: hold };
    }
    for (const ii of temp) {
      getparen(ii, hold);
    }
    temp.push(arg);
    return { arg: temp, out: hold };
  }
  function parseString(ii: string) {
    if (/[0-9]+\+[0-9]+/gm.test(ii)) {
      return (
        parseInt(ii.match(/[0-9]+/gm)[0]) + parseInt(ii.match(/[0-9]+/gm)[1])
      );
    } else if (/[0-9]+\*[0-9]+/gm.test(ii)) {
      return (
        parseInt(ii.match(/[0-9]+/gm)[0]) * parseInt(ii.match(/[0-9]+/gm)[1])
      );
    }
  }
  var sum = 0;
  for (const row of input) {
    var calc = row.replace(/ /g, "");
    var c = 0;
    while (calc.includes("(")) {
      var use = getparen(calc, {});
      use.arg = Array.from(use.arg);
      for (const ii in use.out) {
        var h = ii;
        while (/\*|\+/gm.test(h)) {
          const val = parseString(
            h.match(/[0-9]+(\*|\+)[0-9]+/gm)[0]
          ).toString();

          h =
            val.toString() + h.replace(h.match(/[0-9]+(\*|\+)[0-9]+/gm)[0], "");
        }
        use.out[ii] = h;
      }
      const hold = cloneDeep(use);
      for (const com of hold.arg) {
        for (const sol in hold.out) {
          if (com.includes(sol)) {
            use.arg[hold.arg.indexOf(com)] = com.replace(
              "(" + sol + ")",
              use.out[sol].toString()
            );
          }
        }
      }
      c++;
      calc = use.arg[use.arg.length - 1];
    }

    // shit got convoluted here
    while (/\*|\+/gm.test(calc)) {
      const val = parseString(
        calc.match(/[0-9]+(\*|\+)[0-9]+/gm)[0]
      ).toString();

      calc =
        val.toString() +
        calc.replace(calc.match(/[0-9]+(\*|\+)[0-9]+/gm)[0], "");
    }
    sum += parseInt(calc);
  }
  return sum;
}

function day17pt2(input: string[]) {
  var vecset = new Set();
  for (let ii = 0; ii < input.length; ii++) {
    for (let kk = 0; kk < input[ii].length; kk++) {
      if (input[ii][kk] === "#") {
        vecset.add([0, 0, ii, kk]);
      }
    }
  }
  var loops = 0;
  var size = 15;
  var runs = 0;
  var max = 6;
  while (loops < max) {
    var temp = <number[][]>Array.from(vecset.values());
    var tstr = [];
    // having some variable issues. Just need to get a string that is joined by
    // commas to pass around instead of doing pass by reference
    temp.forEach(function (x) {
      tstr.push(x.join(","));
    });
    const hold = cloneDeep(tstr);
    for (let aa = -size; aa < size; aa++) {
      process.stdout.write(`Completed ${runs} of ${2 * size * max}`);
      if (!(runs === 2 * size * max - 1)) {
        process.stdout.write("\r");
      }
      runs++;
      for (let bb = -size; bb < size; bb++) {
        for (let cc = -size; cc < size; cc++) {
          for (let dd = -size; dd < size; dd++) {
            var count = 0;
            for (let ii = -1; ii < 2; ii++) {
              for (let jj = -1; jj < 2; jj++) {
                for (let kk = -1; kk < 2; kk++) {
                  for (let ll = -1; ll < 2; ll++) {
                    if (!(ii === 0 && jj === 0 && kk === 0 && ll === 0)) {
                      if (
                        hold.includes(
                          [aa + ii, bb + jj, cc + kk, dd + ll].join(",")
                        )
                      ) {
                        count++;
                      }
                    }
                  }
                }
              }
            }
            if (hold.includes([aa, bb, cc, dd].join(","))) {
              if (!(count === 2 || count === 3)) {
                tstr = tstr.filter((x) => x !== [aa, bb, cc, dd].join(","));
              }
            } else {
              if (count === 3) {
                tstr.push([aa, bb, cc, dd].join(","));
              }
            }
          }
        }
      }
    }
    vecset = new Set(tstr.map((x) => x.split(",").map((y) => parseInt(y))));
    loops++;
  }
  return vecset.size;
}

function day17(input: string[]) {
  var arrsize = 50;
  var lines = input.map((x) =>
    (
      ".".repeat(Math.ceil(arrsize / 2) - Math.ceil(x.length / 2)) +
      x +
      ".".repeat(Math.floor(arrsize / 2) - Math.floor(x.length / 2))
    ).split("")
  );
  var plane: string[][] = lines;
  while (plane.length < arrsize) {
    plane.push(".".repeat(arrsize).split(""));
    if (plane.length < arrsize) {
      plane.unshift(".".repeat(arrsize).split(""));
    }
  }
  var d3: string[][][] = [lines];
  var emplane = new Array(plane.length);
  for (var i = 0; i < arrsize; i++) {
    emplane[i] = [];
    for (var k = 0; k < arrsize; k++) {
      emplane[i][k] = ".";
    }
  }
  while (d3.length < arrsize) {
    d3.push(cloneDeep(emplane));
    if (d3.length < arrsize) {
      d3.unshift(cloneDeep(emplane));
    }
  }

  var loops = 0;
  while (loops < 6) {
    // while (loops < 1){
    var hold = cloneDeep(d3);
    for (var ii = 0; ii < arrsize; ii++) {
      for (var kk = 0; kk < arrsize; kk++) {
        for (var ll = 0; ll < arrsize; ll++) {
          for (var oo = 0; oo < arrsize; oo++) {
            var count = 0;
            if (hold[ii][kk][ll] === "#") {
              for (var aa = ii - 1; aa < ii + 2; aa++) {
                for (var bb = kk - 1; bb < kk + 2; bb++) {
                  for (var cc = ll - 1; cc < ll + 2; cc++) {
                    for (var dd = oo - 1; dd < oo + 2; dd++) {
                      if (
                        !(ii === aa && kk === bb && ll === cc) &&
                        !(aa === -1 || bb === -1 || cc === -1) &&
                        !(aa === arrsize || bb === arrsize || cc === arrsize)
                      ) {
                        if (hold[aa][bb][cc] === "#") {
                          count++;
                        }
                      }
                    }
                  }
                }
              }
              if (!(count === 3 || count === 2)) {
                d3[ii][kk][ll] = ".";
              }
            } else if (hold[ii][kk][ll] === ".") {
              for (var aa = ii - 1; aa < ii + 2; aa++) {
                for (var bb = kk - 1; bb < kk + 2; bb++) {
                  for (var cc = ll - 1; cc < ll + 2; cc++) {
                    if (
                      !(ii === aa && kk === bb && ll === cc) &&
                      !(aa === -1 || bb === -1 || cc === -1) &&
                      !(aa === arrsize || bb === arrsize || cc === arrsize)
                    ) {
                      if (hold[aa][bb][cc] === "#") {
                        count++;
                      }
                    }
                  }
                }
              }
              if (count === 3) {
                d3[ii][kk][ll] = "#";
              }
            } else {
              console.log("Something broke! I got %s", d3[ii][kk][ll]);
            }
          }
        }
      }
    }
    loops++;
  }
  // console.log(d3.map(x => x.map(x => x.join("")).join("\n")).join("\n--------------\n"))
  var sol = d3
    .map((e) =>
      e.map((y) => y.filter((a) => a !== ".").length).reduce((k, l) => k + l)
    )
    .reduce((x, y) => x + y);
  return sol;
}

function day16pt2(input: string[]) {
  var rules = input[0].split("\n");
  var my = input[1]
    .split(":")[1]
    .trim()
    .split(",")
    .map((x) => parseInt(x));
  var others: number[][] = input[2]
    .split(":")[1]
    .trim()
    .split("\n")
    .map((x) => x.split(",").map((y) => parseInt(y)));
  var ruleob = new Object();
  for (const line of rules) {
    ruleob[line.split(":")[0]] = line
      .split(":")[1]
      .match(/[0-9]+-[0-9]+/gm)
      .map((x) =>
        x
          .split("-")
          .map((x) => parseInt(x))
          .sort((x, y) => x - y)
      );
  }
  var noton = [];
  for (const tic of others) {
    for (const n of tic) {
      var found = false;
      for (const i in ruleob) {
        if (
          (n >= ruleob[i][0][0] && n <= ruleob[i][0][1]) ||
          (n >= ruleob[i][1][0] && n <= ruleob[i][1][1])
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        noton.push(tic);
        break;
      }
    }
  }
  others = others.filter((x) => !noton.includes(x));
  var satisfy = new Object();
  for (var r in ruleob) {
    satisfy[r] = [];
    for (var n = 0; n < others[0].length; n++) {
      for (var row of others) {
        if (
          !(
            (row[n] >= ruleob[r][0][0] && row[n] <= ruleob[r][0][1]) ||
            (row[n] >= ruleob[r][1][0] && row[n] <= ruleob[r][1][1])
          )
        ) {
          break;
        }
        if (row === others[others.length - 1]) {
          satisfy[r].push(n);
        }
      }
    }
  }
  var count = 0;
  var metlist = Object.keys(satisfy);
  while (count < rules.length - 1) {
    for (const ii of metlist) {
      if (satisfy[ii].length === 1) {
        for (const kk in satisfy) {
          if (kk !== ii) {
            if (satisfy[kk].includes(satisfy[ii][0])) {
              satisfy[kk] = satisfy[kk].filter((x) => x !== satisfy[ii][0]);
            }
          }
        }
        count++;
        metlist = metlist.filter((x) => x !== ii);
        break;
      }
    }
  }
  var myticket = new Object();
  for (const ii in satisfy) {
    myticket[ii] = my[satisfy[ii][0]];
  }
  var sol = 1;
  for (const ii in myticket) {
    if (ii.startsWith("departure")) sol *= myticket[ii];
  }
  return sol;
}

function day16(input: string[]) {
  var rules = input[0].split("\n");
  var my = input[1]
    .split(":")[1]
    .trim()
    .split(",")
    .map((x) => parseInt(x));
  var others: number[][] = input[2]
    .split(":")[1]
    .trim()
    .split("\n")
    .map((x) => x.split(",").map((y) => parseInt(y)));
  var ruleob = new Object();
  for (const line of rules) {
    ruleob[line.split(":")[0]] = line
      .split(":")[1]
      .match(/[0-9]+-[0-9]+/gm)
      .map((x) =>
        x
          .split("-")
          .map((x) => parseInt(x))
          .sort((x, y) => x - y)
      );
  }
  var rate = 0;
  for (const tic of others) {
    for (const n of tic) {
      var found = false;
      for (const i in ruleob) {
        if (
          (n >= ruleob[i][0][0] && n <= ruleob[i][0][1]) ||
          (n >= ruleob[i][1][0] && n <= ruleob[i][1][1])
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        rate += n;
      }
    }
  }
  return rate;
}

function day15pt2(input: string[]) {
  var nums = input[0].split(",").map((x) => parseInt(x));
  var my = {};
  for (const num of nums.slice(0, nums.length - 1)) {
    my[num] = nums.indexOf(num);
  }
  var c = 0;
  for (var i in my) {
    c += 1;
  }
  var num = nums[nums.length - 1];
  var end = 30000000;
  // var end = 2020
  // var end = 11
  while (c < end) {
    if (my.hasOwnProperty(num)) {
      var temp = cloneDeep(num);
      num = c - my[num];
      my[temp] = c;
    } else {
      my[num] = c;
      num = 0;
    }
    c++;
    if (c === end - 1) {
      return num;
    }
    if (c % 500000 === 0) {
      console.log("Done %d of %d", c, 30000000);
    }
  }
}

function day15(input: string[]) {
  var nums = input[0].split(",").map((x) => parseInt(x));
  while (nums.length < 2020) {
    // while (nums.length < 10){
    if (nums.filter((x) => x === nums[nums.length - 1]).length > 1) {
      // want to search backwards
      var nr = nums.slice(0, nums.length - 1).reverse();
      nums.push(
        nums.length - 1 - (nr.length - 1 - nr.indexOf(nums[nums.length - 1]))
      );
    } else {
      nums.push(0);
    }
  }
  return nums[nums.length - 1];
}

function day14pt2(input: string[]) {
  function retall(add: string, idx: number, choices: string[]) {
    var hold = cloneDeep(add).split("");
    var num = 2 ** add.split("").filter((x) => x === "X").length;
    if (choices.length === num) {
      return { add: add, idx: idx, choices: choices };
    }
    var newchoices = cloneDeep(choices);
    for (var choice of choices) {
      var chs = cloneDeep(choice).split("");
      var idxn = cloneDeep(chs).slice(idx).indexOf("X");
      chs[idx + idxn] = "0";
      newchoices[choices.indexOf(choice)] = chs.join("");
      chs[idx + idxn] = "1";
      newchoices.push(chs.join(""));
    }
    out = retall(add, idxn + 1, newchoices);
    return { add: out.add, idx: out.idx, choices: out.choices };
  }
  var mem = new Object();
  for (var row of input) {
    if (row.match(/^mask/)) {
      var mask = row.match(/[X\d]+/)[0];
    } else if (row.match(/^mem/)) {
      var idx = parseInt(
        row
          .match(/\[\d+\]/)[0]
          .replace("[", "")
          .replace("]", "")
      );
      var val = parseInt(row.split("=")[1]);
      var add = idx.toString(2);
      add = add.padStart(36, "0");
      var res = "0".repeat(36).split("");
      for (var ii in add.split("")) {
        if (mask[ii] === "0") {
          res[ii] = add[ii];
        } else {
          res[ii] = mask[ii];
        }
      }
      var out = retall(res.join(""), 0, [res.join("")]);
      var mems = out.choices.map((x) => parseInt(x, 2));
      for (var m of mems.sort((x, y) => x - y)) {
        mem[m] = val;
      }
    }
  }

  var tot = 0;
  for (const m in mem) {
    tot += mem[m];
  }
  return tot;
}

function day14(input: string[]) {
  var memsize = 0;
  for (var row of input) {
    if (row.match(/\[\d+\]/)) {
      var dat = row
        .match(/\[\d+\]/)[0]
        .replace("[", "")
        .replace("]", "");
      if (parseInt(dat) > memsize) {
        memsize = parseInt(dat);
      }
    }
  }
  var mem = new Array(memsize);
  for (var row of input) {
    if (row.match(/^mask/)) {
      var mask = row.match(/[X\d]+/)[0];
    }
    if (row.match(/^mem/)) {
      var idx = parseInt(
        row
          .match(/\[\d+\]/)[0]
          .replace("[", "")
          .replace("]", "")
      );
      var val = parseInt(row.split("=")[row.split("=").length - 1]).toString(2);
      val = val.padStart(36, "0");
      var res = "0".repeat(36).split("");
      for (var ii in val.split("")) {
        if (mask[ii] === "X") {
          res[ii] = val[ii];
        } else {
          res[ii] = mask[ii];
        }
      }
      mem[idx] = parseInt(res.join(""), 2);
    }
  }
  return mem.reduce(function (a, b) {
    return a + b;
  });
}

function day13pt2(input: string[]) {
  var time = parseInt(input[0]);
  var raw = input[1].split(",");
  var buses = input[1]
    .split(",")
    .filter((x) => Number(x))
    .map((x) => parseInt(x));

  var found = false;
  var idx = 0;
  var inc = 1;
  var dt = buses.map((x) => Number(raw.indexOf(x.toString())));

  for (var ii in buses) {
    while (!((idx + dt[ii]) % buses[ii] === 0)) {
      idx += inc;
    }
    inc *= buses[ii];
  }
  return idx;
}

function day13(input: string[]) {
  var time = parseInt(input[0]);
  var buses = input[1]
    .split(",")
    .filter((x) => Number(x))
    .map((x) => parseInt(x));

  var ans = buses.map((x) => x - (time % x));
  var hold = cloneDeep(ans).sort((x, y) => x - y);
  return buses[ans.indexOf(hold[0])] * hold[0];
}

function day12pt2(input: string[]) {
  function rad(deg: number) {
    return (deg * math.pi) / 180;
  }
  var waypt = math.complex(10, 1);
  var sum = math.Complex.fromPolar(0, 0);
  for (var inst of input) {
    var dir = inst.match(/[a-zA-z]+/g)[0];
    var len = parseInt(inst.match(/\d+/g)[0]);

    if (dir === "R") {
      waypt = math.multiply(waypt, math.Complex.fromPolar(1, rad(-len)));
    } else if (dir === "L") {
      waypt = math.multiply(waypt, math.Complex.fromPolar(1, rad(len)));
    } else if (dir === "F") {
      sum = math.add(sum, math.multiply(len, waypt));
    } else if (dir === "N") {
      waypt = math.add(waypt, math.Complex.fromPolar(len, rad(90)));
    } else if (dir === "S") {
      waypt = math.add(waypt, math.Complex.fromPolar(len, rad(270)));
    } else if (dir === "E") {
      waypt = math.add(waypt, math.Complex.fromPolar(len, rad(0)));
    } else if (dir === "W") {
      waypt = math.add(waypt, math.Complex.fromPolar(len, rad(180)));
    }
  }
  return Math.round(math.abs(sum.re) + math.abs(sum.im));
}

function day12(input: string[]) {
  function rad(deg: number) {
    return (deg * math.pi) / 180;
  }
  var going = math.Complex.fromPolar(1, 0);
  var sum = math.Complex.fromPolar(0, 0);
  for (var inst of input) {
    var dir = inst.match(/[a-zA-z]+/g)[0];
    var len = parseInt(inst.match(/\d+/g)[0]);

    if (dir === "R") {
      going = math.multiply(going, math.Complex.fromPolar(1, rad(-len)));
    } else if (dir === "L") {
      going = math.multiply(going, math.Complex.fromPolar(1, rad(len)));
    } else if (dir === "F") {
      sum = math.add(sum, math.multiply(len, going));
    } else if (dir === "N") {
      sum = math.add(sum, math.Complex.fromPolar(len, rad(90)));
    } else if (dir === "S") {
      sum = math.add(sum, math.Complex.fromPolar(len, rad(270)));
    } else if (dir === "E") {
      sum = math.add(sum, math.Complex.fromPolar(len, rad(0)));
    } else if (dir === "W") {
      sum = math.add(sum, math.Complex.fromPolar(len, rad(180)));
    }
  }
  return math.abs(sum.re) + math.abs(sum.im);
}

function day11pt2(input: string[]) {
  function arraysEqual(_arr1, _arr2) {
    var fnd = false;
    const arr1 = _arr1.map((x) => x.join(""));
    const arr2 = _arr2.map((x) => x.join(""));
    try {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          break;
        }
        if (i === arr1.length - 1) {
          fnd = true;
        }
      }
    } catch {
    } finally {
      return fnd;
    }
    // return fnd
  }
  var arr = input.map((x) => x.split(""));
  var old = cloneDeep(arr);
  function mapper(arr: string[][], old: string[][]) {
    for (var ii in old) {
      for (var kk in old[ii]) {
        if (!(old[ii][kk] === ".")) {
          var empcount = 0;
          var looks = 0;
          for (var iii = Number(ii) - 1; iii < Number(ii) + 2; iii++) {
            for (var kkk = Number(kk) - 1; kkk < Number(kk) + 2; kkk++) {
              if (!(iii === Number(ii) && kkk === Number(kk))) {
                looks++;
                var curi = Number(iii);
                var curk = Number(kkk);

                try {
                  while (old[curi][curk] === ".") {
                    if (curi < Number(ii)) {
                      curi--;
                    } else if (curi > Number(ii)) {
                      curi++;
                    }
                    if (curk < Number(kk)) {
                      curk--;
                    } else if (curk > Number(kk)) {
                      curk++;
                    }
                  }
                } catch {} //}
                var top = Number(curi) === -1 || Number(curi) === old.length;
                var side =
                  Number(curk) === -1 || Number(curk) === old[ii].length;
                if (top || side) {
                  empcount++;
                } else {
                  if (!(old[curi][curk] === "#")) {
                    empcount++;
                  }
                }
                if (empcount === 8) {
                  arr[ii][kk] = "#";
                }
                if (looks === 8 && empcount <= 3) {
                  arr[ii][kk] = "L";
                }
              }
            }
          }
        }
      }
    }
    return { arr: arr, old: old };
  }
  do {
    var out = mapper(arr, old);
    arr = out.arr;
    old = cloneDeep(arr);
    process.stdout.write("\r");
  } while (!arraysEqual(out.arr, out.old));
  var outsit = arr.map((x) => x.filter((y) => y === "#").join(""));
  var outcount = outsit.join("").length;
  return outcount;
}

function day11(input: string[]) {
  function arraysEqual(_arr1, _arr2) {
    var fnd = false;
    const arr1 = _arr1.map((x) => x.join(""));
    const arr2 = _arr2.map((x) => x.join(""));
    try {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          break;
        }
        if (i === arr1.length - 1) {
          fnd = true;
        }
      }
    } catch {
    } finally {
      return fnd;
    }
    // return fnd
  }
  var arr = input.map((x) => x.split(""));
  var old = cloneDeep(arr);
  function mapper(arr: string[][], old: string[][]) {
    for (var ii in old) {
      for (var kk in old[ii]) {
        if (!(old[ii][kk] === ".")) {
          var empcount = 0;
          var looks = 0;
          for (var iii = Number(ii) - 1; iii < Number(ii) + 2; iii++) {
            for (var kkk = Number(kk) - 1; kkk < Number(kk) + 2; kkk++) {
              if (!(iii === Number(ii) && kkk === Number(kk))) {
                looks++;
                // corner cases
                var top: boolean =
                  Number(iii) === -1 || Number(iii) === old.length;
                var side: boolean =
                  Number(kkk) === -1 || Number(kkk) === old[ii].length;
                // edge cases
                if (top || side) {
                  empcount += 1;
                }
                // bulk cases
                else {
                  if (!(old[iii][kkk] === "#")) {
                    empcount++;
                  }
                }
                if (empcount === 8) {
                  arr[ii][kk] = "#";
                }
                if (looks === 8 && empcount <= 4) {
                  arr[ii][kk] = "L";
                }
              }
            }
          }
        }
      }
    }
    return { arr: arr, old: old };
  }
  do {
    var out = mapper(arr, old);
    arr = out.arr;
    old = cloneDeep(arr);
  } while (!arraysEqual(out.arr, out.old));
  var outsit = arr.map((x) => x.filter((y) => y === "#").join(""));
  var outcount = outsit.join("").length;
  return outcount;
}

function day10(input: number[]) {
  var adps = input.sort((x, y) => x - y);
  var diffs = new Array(adps.length);
  diffs[0] = adps[0];
  for (var ii = 1; ii < adps.length; ii++) {
    diffs[ii] = adps[ii] - adps[Number(ii) - 1];
  }
  diffs.push(3);

  var ones = diffs.filter((x) => x == 1).length;
  var threes = diffs.filter((x) => x == 3).length;

  return ones * threes;
}

function day10pt2(input: number[]) {
  function countones(diffs: number[]) {
    var i = 0;
    var count = 0;
    var lcount = new Array();
    do {
      if (diffs[i] === 1) {
        count++;
      } else {
        lcount.push(count);
        count = 0;
      }
      i++;
    } while (i < diffs.length);
    return lcount; /* the last 1 has to stay where it is since it is already 3 away */
  }
  var adps = input.sort((x, y) => x - y);
  var diffs = new Array(adps.length);
  diffs[0] = adps[0];
  for (var ii = 1; ii < adps.length; ii++) {
    diffs[ii] = adps[ii] - adps[Number(ii) - 1];
  }
  diffs.push(3);
  var longones = countones(diffs);
  const x = [0, 1, 2, 3, 4];
  const y = [1, 1, 2, 4, 7];
  var sol = 1;
  for (var i of longones) {
    sol *= y[x.indexOf(i)];
  }

  return sol;
}

function day9(nums: number[], search: number = 25) {
  function looper(nums: number[], search: number, ii: number) {
    for (var kk = ii - search; kk < ii; kk++) {
      for (var ll = kk; ll < ii; ll++) {
        if (nums[kk] + nums[ll] === nums[ii]) {
          return true;
        }
      }
    }
    return false;
  }
  for (var ii = search; ii < nums.length; ii++) {
    if (!looper(nums, search, ii)) {
      return nums[ii];
    }
  }
}

function day9pt2(nums: number[], targnum: number) {
  /* leaving this in here as the original solution even though the updated
    one is two orders of magnitude faster ... */
  /* for (var aa = 0; aa < nums.length; aa++) { */
  /* var imin = aa; */
  /* var imax = aa + 1; */
  /* do { */
  /*   var s = nums.slice(imin, imax).reduce(function (a, b) { */
  /*     return a + b; */
  /*   }); */
  /*   if (s === targnum) { */
  /*     let sols = nums.slice(imin, imax).sort(); */
  /*     return sols[0] + sols[sols.length - 1]; */
  /*   } */
  /*   imax++; */
  /* } while (s < targnum); */
  /* } */
  /* } */
  for (var aa = 0; aa < nums.length - 1; aa++) {
    var ee = aa;
    var s = nums[aa];
    do {
      ee++;
      s += nums[ee];
      if (s === targnum) {
        let sols = nums.slice(aa, ee).sort();
        return sols[0] + sols[sols.length - 1];
      }
    } while (s < targnum);
  }
}

function day8(filein: string) {
  var lines = readFileSync(filein, "utf8").trim().split("\n");
  var count = 0;
  function nop(lines: string[], n: number) {
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + 1 };
  }
  function acc(lines: string[], n: number) {
    count += parseInt(lines[n].split(" ")[lines[n].split(" ").length - 1]);
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + 1 };
  }
  function jmp(lines: string[], n: number) {
    var ind = parseInt(lines[n].split(" ")[lines[n].split(" ").length - 1]);
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + ind };
  }
  var n = 0;
  do {
    if (lines[n].split(" ")[0] == "nop") {
      var out = nop(lines, n);
      lines = out.lines;
      n = out.n;
    } else if (lines[n].split(" ")[0] == "acc") {
      var out = acc(lines, n);
      lines = out.lines;
      n = out.n;
    } else if (lines[n].split(" ")[0] == "jmp") {
      var out = jmp(lines, n);
      lines = out.lines;
      n = out.n;
    }
  } while (lines[n] !== "poo");
  return count;
}

function day8pt2(filein: string) {
  var lines = readFileSync(filein, "utf8").trim().split("\n");
  function nop(lines: string[], n: number, count: number) {
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + 1, c: count };
  }
  function acc(lines: string[], n: number, count: number) {
    count += parseInt(lines[n].split(" ")[lines[n].split(" ").length - 1]);
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + 1, c: count };
  }
  function jmp(lines: string[], n: number, count: number) {
    var ind = parseInt(lines[n].split(" ")[lines[n].split(" ").length - 1]);
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    return { lines: lines, n: n + ind, c: count };
  }
  function op(lines: string[], n: number) {
    var count = 0;
    var savelines = [...lines];
    var f = false;
    do {
      try {
        if (lines[n].split(" ")[0] == "nop") {
          var out = nop(lines, n, count);
          lines = out.lines;
          n = out.n;
          count = out.c;
        } else if (lines[n].split(" ")[0] == "acc") {
          var out = acc(lines, n, count);
          lines = out.lines;
          n = out.n;
          count = out.c;
        } else if (lines[n].split(" ")[0] == "jmp") {
          var out = jmp(lines, n, count);
          lines = out.lines;
          n = out.n;
          count = out.c;
        }
      } catch {
        /* should get to here if and only if n is larger than the array */
        f = true;
        break;
      }
    } while (lines[n] !== "poo");
    return { found: f, count: count };
  }

  for (var line of lines) {
    var newlines = [...lines];
    var out = { found: false, count: 0 };
    if (line.includes("nop")) {
      newlines[lines.indexOf(line)] = line.replace("nop", "jmp");
      out = op(newlines, 0);
    } else if (line.includes("jmp")) {
      newlines[lines.indexOf(line)] = line.replace("jmp", "nop");
      out = op(newlines, 0);
    }
    if (out.found) {
      break;
    }
  }
  return out.count;
}

function day7(filein: string) {
  const lines = readFileSync(filein, "utf8").trim().split("\n");
  var rules = new Object();
  var hasnum = /\d/;
  for (var rule of lines) {
    var lis = rule.split(" bag");
    var outer = lis[0].trim();
    var inner = lis.slice(1, lis.length).filter((x) => hasnum.test(x));
    rules[outer] = new Array();
    for (var str of inner) {
      var sp = str.split(" ");
      rules[outer].push(
        sp
          .slice(
            sp.indexOf(str.match(/\d/)[0]),
            sp.indexOf(str.match(/\d/)[0]) + 3
          )
          .join(" ")
      );
    }
  }

  var mybag = "shiny gold";
  var possibles = new Array();

  function canhold(targs: string[]): string[] {
    var poss = new Array();
    for (var targ of targs) {
      console.log("-----------------\n" + "targ: " + targ);
      for (var bag in rules) {
        if (rules[bag].filter((x) => x.includes(targ)).length) {
          console.log("YES! ", bag, rules[bag]);
          poss.push(bag);
        }
      }
      var set = new Set(poss);
      poss = Array.from(set);
    }
    if (!poss.length) {
      return poss;
    } else {
      var ret = poss.concat(canhold(poss));
      var s = new Set(ret);
      ret = Array.from(s); /* get rid of duplicates! */
      return ret;
    }
  }

  var recur = canhold([mybag]);
  return recur.length;
}

function day7pt2(filein: string) {
  const lines = readFileSync(filein, "utf8").trim().split("\n");
  var rules = new Object();
  var hasnum = /\d/;
  for (var rule of lines) {
    var lis = rule.split(" bag");
    var outer = lis[0].trim();
    var inner = lis.slice(1, lis.length).filter((x) => hasnum.test(x));
    rules[outer] = new Array();
    for (var str of inner) {
      var sp = str.split(" ");
      rules[outer].push(
        sp
          .slice(
            sp.indexOf(str.match(/\d/)[0]),
            sp.indexOf(str.match(/\d/)[0]) + 3
          )
          .join(" ")
      );
    }
  }

  var thisbag = 0;
  function musthold(targ: string, curr: number, outmult: number) {
    if (!rules[targ].length) {
      return { inside: rules[targ], curr: curr, outmult: outmult };
    }
    for (var ins of rules[targ]) {
      var newins = [ins].map((x) =>
        x.split(" ").slice(1, x.split(" ").length).join(" ")
      )[0];
      var numadd = [ins].map((x) => parseInt(x.match(/\d/)))[0];
      var curbag = numadd * outmult;
      thisbag += curbag;
      var out = musthold(newins, curr, curbag);
    }
    return { inside: out.inside, curr: thisbag, outmult: out.outmult };
  }
  var mybag = "shiny gold";
  var recur = musthold(mybag, 0, 1);
  return recur.curr;
}

function day6(filein: string) {
  const ans = readFileSync(filein, "utf8").trim().split("\n\n");
  var count = 0;
  for (var group of ans) {
    var set = new Set();
    var groupl = group.split("\n").join("").split("");
    for (var pers of groupl) {
      set.add(pers);
    }
    count += set.size;
  }
  return count;
}

function day6pt2(filein: string) {
  const ans = readFileSync(filein, "utf8").trim().split("\n\n");
  var count = 0;
  for (var group of ans) {
    var req = group.split("\n").length;
    var groupl = group.split("\n").join("").split("");
    var set = new Set(groupl);
    var arr = Array.from(set.values());
    for (var lett of arr) {
      if (groupl.filter((x) => x === lett).length === req) {
        count++;
      }
    }
  }
  return count;
}

function day5(filein: string) {
  const tix = readFileSync(filein, "utf8").trim().split("\n");
  function parseSeat(
    tic: string,
    cf: number,
    cb: number,
    count: number,
    key1: string,
    key2: string
  ) {
    const lett = tic[count];
    if (count === tic.length) {
      return cf;
    } else {
      if (lett === key1) {
        cb = math.floor((cb - cf) / 2) + cf;
      } else if (lett === key2) {
        cf = cb - math.floor((cb - cf) / 2);
      }
      count++;
      var seat = parseSeat(tic, cf, cb, count, key1, key2);
    }
    return seat;
  }
  var sID = 0;
  for (var tic of tix) {
    var count = 0;
    var cb = 127;
    var cf = 0;
    var cl = 0;
    var cr = 7;
    var row = parseSeat(tic.substring(0, 7), cf, cb, count, "F", "B");
    var col = parseSeat(tic.substring(7, tic.length), cl, cr, count, "L", "R");

    var csID = row * 8 + col;
    if (csID > sID) {
      sID = csID;
    }
  }
  return sID;
}

function day5pt2(filein: string) {
  const tix = readFileSync(filein, "utf8").trim().split("\n");
  function parseSeat(
    tic: string,
    cf: number,
    cb: number,
    count: number,
    key1: string,
    key2: string
  ) {
    const lett = tic[count];
    if (count === tic.length) {
      return cf;
    } else {
      if (lett === key1) {
        cb = math.floor((cb - cf) / 2) + cf;
      } else if (lett === key2) {
        cf = cb - math.floor((cb - cf) / 2);
      }
      count++;
      var seat = parseSeat(tic, cf, cb, count, key1, key2);
    }
    return seat;
  }
  var sID = [];
  for (var tic of tix) {
    var count = 0;
    var cb = 127;
    var cf = 0;
    var cl = 0;
    var cr = 7;
    var row = parseSeat(tic.substring(0, 7), cf, cb, count, "F", "B");
    var col = parseSeat(tic.substring(7, tic.length), cl, cr, count, "L", "R");

    var csID = row * 8 + col;
    sID.push(csID);
  }
  var prevID: number = 0;
  for (var ID of sID.sort()) {
    if (ID === prevID + 2) {
      break;
    }
    prevID = ID;
  }
  return ID - 1;
}

function day4(filein: string) {
  const inplist = readFileSync(filein, "utf8").trim().split("\n\n");

  var fullcount = 0;
  for (var i of inplist) {
    var count = 0;
    var row = i.split("\n");
    for (var j of row) {
      count += j.split(" ").length;
    }

    if (count == 8) {
      fullcount++;
    } else if (count == 7) {
      if (!row.join("").includes("cid:")) {
        fullcount++;
      }
    }
  }

  return fullcount;
}

function day4pt2(filein: string) {
  const inplist = readFileSync(filein, "utf8").trim().split("\n\n");

  var fullcount = 0;
  for (var i of inplist) {
    var t = 0;
    var b = 0;
    var count = 0;
    var row = i.split("\n");
    for (var j of row) {
      count += j.trim().split(" ").length;
    }

    if (count == 8) {
      t = 1;
    } else if (count == 7 && !row.join("").includes("cid:")) {
      t = 1;
    }

    if (t == 1) {
      for (var ent of row) {
        var entlist = ent.trim().split(" ");
        for (var entry of entlist) {
          var key = entry.trim().split(":")[0];
          var val = entry.trim().split(":")[1];
          if (key == "byr") {
            if (Number(val) < 1920 || Number(val) > 2002) {
              b = 1;
              break;
            }
          } else if (key == "iyr") {
            if (Number(val) < 2010 || Number(val) > 2020) {
              b = 1;
              break;
            }
          } else if (key == "eyr") {
            if (Number(val) < 2020 || Number(val) > 2030) {
              b = 1;
              break;
            }
          } else if (key == "hgt") {
            if (val.substring(val.length - 2) == "cm") {
              if (isNaN(Number(val.substring(0, val.length - 2)))) {
                b = 1;
                break;
              } else if (
                Number(val.substring(0, val.length - 2)) < 150 ||
                Number(val.substring(0, val.length - 2)) > 193
              ) {
                b = 1;
                break;
              }
            } else if (val.substring(val.length - 2) == "in") {
              if (isNaN(Number(val.substring(0, val.length - 2)))) {
                b = 1;
                break;
              } else if (
                Number(val.substring(0, val.length - 2)) < 59 ||
                Number(val.substring(0, val.length - 2)) > 76
              ) {
                b = 1;
                break;
              }
            } else {
              b = 1;
              break;
            }
          } else if (key == "hcl") {
            let reg = new RegExp("^#[a-f0-9]{6}$");
            if (!reg.test(val)) {
              b = 1;
              break;
            }
          } else if (key == "ecl") {
            const allowed = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
            if (!allowed.includes(val)) {
              b = 1;
              break;
            }
          } else if (key == "pid") {
            let preg = new RegExp("^[0-9]{9}$");
            if (!preg.test(val)) {
              b = 1;
              break;
            }
          }
        }
      }
      if (b != 1) {
        fullcount++;
      }
    }
  }

  return fullcount;
}

function day3(filein: string, right: number = 3, down: number = 1) {
  const treerows = readFileSync(filein, "utf8").trim().split("\n");
  var path = [...treerows];
  var column = 0;
  var count = 0;
  const downloops = treerows.length / down;
  for (var i = 0; i < downloops; i++) {
    var idx = i * down;
    if (treerows[idx][column] == "#") {
      count++;
      path[idx] =
        treerows[idx].substring(0, column) +
        "X" +
        treerows[i].substring(column + 1);
    } else {
      path[idx] =
        treerows[i].substring(0, column) +
        "O" +
        treerows[i].substring(column + 1);
    }
    column = (column + right) % treerows[0].length;
  }
  return count;
}

function day3pt2(filein: string) {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];
  var sols = 1;
  for (var i in slopes) {
    sols *= day3(filein, slopes[i][0], slopes[i][1]);
  }
  return sols;
}

function day2(filein: string) {
  const str = readFileSync(filein, "utf8");
  const strlist = str.trim().split("\n");

  const rulelist = strlist.map((x) => {
    const minilist = x.split(":")[0].split(" ");
    return [
      minilist[0].split("-").map((val) => {
        return parseInt(val);
      }),
      minilist[1],
    ];
  });

  const passlist = strlist.map((x) => {
    return x.split(":")[1].trim();
  });

  var allowed = 0;
  for (var ii = 0; ii < rulelist.length; ii++) {
    var count = 0;
    for (var kk = 0; kk < passlist[ii].length; kk++) {
      if (passlist[ii][kk] == rulelist[ii][1]) {
        count++;
      }
    }
    if (count >= rulelist[ii][0][0] && count <= rulelist[ii][0][1]) {
      allowed++;
    }
  }

  return allowed;
}

function day2pt2(filein: string) {
  const str = readFileSync(filein, "utf8");
  const strlist = str.trim().split("\n");

  const rulelist = strlist.map((x) => {
    const minilist = x.split(":")[0].split(" ");
    return [
      minilist[0].split("-").map((val) => {
        return parseInt(val);
      }),
      minilist[1],
    ];
  });

  const passlist = strlist.map((x) => {
    return x.split(":")[1].trim();
  });

  var allowed = 0;
  for (var ii = 0; ii < rulelist.length; ii++) {
    var count = 0;
    if (passlist[ii][Number(rulelist[ii][0][0]) - 1] == rulelist[ii][1]) {
      count++;
    }

    if (passlist[ii][Number(rulelist[ii][0][1]) - 1] == rulelist[ii][1]) {
      count++;
    }
    if (count == 1) {
      allowed++;
    }
  }

  return allowed;
}

/* Note that the day1 solutions use async readFile so they do not work with a return value or proper timing */
function day1(filein: string) {
  readFile(filein, "utf8", function (err, data) {
    const strlist = data.toString().trim().split("\n");
    var intlist = [];
    strlist.forEach(function (val) {
      intlist.push(parseInt(val));
    });
    var intlist2 = [];
    intlist.forEach(function (val) {
      intlist2.push(2020 - val);
    });

    console.time("Main");
    let intersect = intlist.filter((x) => intlist2.includes(x));
    var solstring = (intersect[0] * intersect[1]).toString();

    console.log("The solution is: " + solstring);
    console.timeEnd("Main");
  });
}

function day1pt2(filein: string) {
  readFile(filein, "utf8", function (err, data) {
    const strlist = data.toString().trim().split("\n");
    var intlist = [];
    strlist.forEach(function (val) {
      intlist.push(parseInt(val));
    });

    console.time("Main");
    var sol = 0;

    for (var ii = 0; ii < intlist.length; ii++) {
      for (var ij = ii; ij < intlist.length; ij++) {
        for (var ik = ij; ik < intlist.length; ik++) {
          if (intlist[ii] + intlist[ij] + intlist[ik] == 2020) {
            sol = intlist[ii] * intlist[ij] * intlist[ik];
            break;
          }
        }
        if (sol != 0) {
          break;
        }
      }
      if (sol != 0) {
        break;
      }
    }

    console.log("Solution is: " + sol.toString());

    console.timeEnd("Main");
  });
}

import { readFile, readFileSync } from "fs";
import * as math from "mathjs";

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
    /* console.log(path[i], column, treerows[0].length - 1) */
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
    /* var count = group.split("\n").join("").split("").filter(x => x==req).length */
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
    /* for (var sing of targ){ */
    if (!rules[targ].length) {
      /* console.log('base case') */
      return { inside: rules[targ], curr: curr, outmult: outmult };
    }
    for (var ins of rules[targ]) {
      var newins = [ins].map((x) =>
        x.split(" ").slice(1, x.split(" ").length).join(" ")
      )[0];
      var numadd = [ins].map((x) => parseInt(x.match(/\d/)))[0];
      var curbag = numadd * outmult;
      thisbag += curbag;
      /* console.log(newins, numadd, outmult, thisbag) */
      var out = musthold(newins, curr, curbag);
    }
    return { inside: out.inside, curr: thisbag, outmult: out.outmult };
  }
  /* } */
  var mybag = "shiny gold";
  var recur = musthold(mybag, 0, 1);
  return recur.curr;
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
    /* console.log(ind) */
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    /* console.log(lines) */
    return { lines: lines, n: n + ind };
  }
  var n = 0;
  do {
    /* console.log(lines, n) */
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
    /* console.log(ind) */
    lines = lines
      .slice(0, n)
      .concat(["poo"])
      .concat(lines.slice(n + 1, lines.length));
    /* console.log(lines) */
    return { lines: lines, n: n + ind, c: count };
  }
  function op(lines: string[], n: number) {
    var count = 0;
    var savelines = [...lines];
    do {
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
      if (n === lines.length) {
        break;
      }
    } while (lines[n] !== "poo");
    if (n == lines.length) {
      return { found: true, count: count };
    } else {
      return { found: false, count: count };
    }
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

function day9(filein: string) {
  var nums = readFileSync(filein, "utf8")
    .trim()
    .split("\n")
    .map((x) => parseInt(x));
  var prevlen = 25;
  function looper(nums: number[], prevlen: number, ii: number) {
    for (var kk = ii - prevlen; kk < ii; kk++) {
      for (var ll = kk; ll < ii; ll++) {
        if (nums[kk] + nums[ll] === nums[ii]) {
          return true;
        }
      }
    }
    return false;
  }
  for (var ii = prevlen; ii < nums.length; ii++) {
    if (!looper(nums, prevlen, ii)) {
      return nums[ii];
    }
  }
}

function day9pt2(filein: string) {
  var nums = readFileSync(filein, "utf8")
    .trim()
    .split("\n")
    .map((x) => parseInt(x));
  var targnum = day9(filein);
  for (var aa = 0; aa < nums.length; aa++) {
    var imin = aa;
    var imax = aa + 1;
    do {
      var s = nums.slice(imin, imax).reduce(function (a, b) {
        return a + b;
      });
      if (s === targnum) {
        let sols = nums.slice(imin, imax).sort();
        return sols[0] + sols[sols.length - 1];
      }
      imax++;
    } while (s < targnum);
  }
}

/* console.log("Solution is: " + day9pt2("./test.txt").toString()); */
console.time("Run time");
console.log("Solution is: " + day9pt2("./advent.txt").toString());
console.timeEnd("Run time");

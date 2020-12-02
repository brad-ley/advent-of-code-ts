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

console.time("Run time");
console.log("Solution is: " + day2pt2("./advent.txt").toString());
console.timeEnd("Run time");

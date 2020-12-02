import { readFile } from "fs";
import * as math from "mathjs";

function day1 (filein:string) {
    readFile(filein, 'utf8', function(err, data){
            const strlist = data.toString().trim().split('\n')
            var intlist = []
            strlist.forEach(function (val) {
                intlist.push(parseInt(val))
            })
            var intlist2 = []
            intlist.forEach( function (val) {
                intlist2.push(2020 - val)
            } )

            console.time("Main")
            let intersect = intlist.filter( x => intlist2.includes(x) )
            var solstring = ( intersect[0] * intersect[1] ).toString()

            console.log("The solution is: " + solstring)
            console.timeEnd("Main")

    });
}

function day1pt2 (filein:string) {
    readFile(filein, 'utf8', function(err, data){
            const strlist = data.toString().trim().split('\n')
            var intlist = []
            strlist.forEach(function (val) {
                intlist.push(parseInt(val))
            })
            
            console.time("Main")
            var sol = 0;

            for (var ii=0; ii < intlist.push(); ii++) {
                for (var ij=0; ij < ii; ij++) {
                    for (var ik=0; ik < ij; ik++) {
                        if (intlist[ii] + intlist[ij] + intlist[ik] == 2020){
                            sol = intlist[ii] * intlist[ij] * intlist[ik]
                            break
                    }}
                }
            };

            console.log("Solution is: " + sol.toString())

            console.timeEnd("Main")
    });

}

day1pt2('./advent.txt');

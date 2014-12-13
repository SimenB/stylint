// check for 0 0 0 0 or 50px 0 50px 0 type mistakes

module.exports = function checkForEfficiency(line) {
    // the array we'll make soon of the str
    var arr = [];

    // turn the line into an array
    arr = line.split(' ');

    // console.log(arr);

    // create an array from the line with all white space removed
    arr = arr.filter(function(str) { return str.length > 0; });

    // console.log(arr);

    // if margin or padding we run the tests
    if (arr[0] === 'margin' || arr[0] === 'padding') {
        // if line is potentially inefficient it needs to be at least this long
        if (arr.length > 1) {
            // ex: margin 0 5px
            if (arr.length === 3) {
                // ex margin 0 0
                if (arr[1] === arr[2])  {
                    return true;
                    // console.log('this line could be more succinctly written as: ', arr[0], arr[1]);
                }
            }
            // ex margin 0 5px 10px
            else if (arr.length === 4) {
                // ex margin 0 5px 0
                if (arr[1] === arr[3]) {
                    return true;
                    // console.log('this line could be more succinctly written as: ', arr[0], arr[1], arr[2]);
                }
            }
            // ex margin 0 50px 10px 7px
            else if (arr.length === 5) {
                // ex margin 0 5px 0 5px
                if (arr[1] === arr[3] && arr[2] === arr[4]) {
                    return true;
                    // console.log('this line could be more succinctly written as: ', arr[0], arr[1], arr[2]);
                }
                // ex margin 0 5px 5px 5px
                else if (arr[1] !== arr[3] && arr[2] === arr[4]) {
                    return true;
                    // console.log('this line could be more succinctly written as: ', arr[0], arr[1], arr[2], arr[3]);
                }
            }
        }
    }
}
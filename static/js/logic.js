// const URL = '/results'
// const xhr = new XMLHttpRequest()
// Get a reference to the table body
var tbody = d3.select("tbody");
var predictions;
// Select the reset and filter buttons
var predictButton = d3.select("#predict-btn");
var resetButton = d3.select("#clear-btn");
var inputArray = {
    "#cement": getRandomArbitrary(102, 540), "#blast_furnace_slage": getRandomArbitrary(0, 359),
    "#fly_ash": getRandomArbitrary(0, 200), "#water": getRandomArbitrary(122, 247),
    "#superplasticizer": getRandomArbitrary(0, 33), "#coarse_aggregate": getRandomArbitrary(801, 1150), "#fine_aggregate": getRandomArbitrary(594, 993)
}

predictButton.on('click', runEnter);

function getRandomArbitrary(min, max) {
    return precise(Math.random() * (max - min) + min);
}

function precise(x) {
    return Number.parseFloat(x).toPrecision(4);
}
function getUserInput() {
    var inputValue = [];
    console.log(inputArray);
    Object.entries(inputArray).forEach(entry => {
        const [key, value] = entry;
        console.log(key, value);
        console.log(key);
        var input = d3.select(key).property('value');

        if (input != "") {
            inputValue.push({ key: input });
        }
        else {
            inputValue.push({ key: value });
        }
    });
    return inputValue;

}
function buildTable(data, output) {
    tbody.html("");
    
    for (i = 1; i <= 365; i++) {
        var row = tbody.append("tr");
        data.push({'key':i});
        data.push({'key':precise(output[i-1])})
        data.forEach(d => {

            var cell = row.append('td');
            //console.log(key);
            //console.log(value);
            cell.text(Object.values(d));


        });
        data.pop();
        data.pop();
    }
    // Create event handlers for clicking the buttons or pressing the enter key

}
function runEnter() {
    d3.event.preventDefault();
    console.log("hello")
    var user_input = getUserInput();
    // var key_value={'mix':user_input}
    // $.get(
    //     url="result",
    //     data=key_value, 
    //     success=function(data) {
    //        console.log(JSON.parse(data))
    //     }
    // );

    var result = $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "/results",
        traditional: "true",
        async: false,
        data: JSON.stringify(user_input),
        dataType: "json",
        success: function (data) {
            return data;
        },
    });
    console.log(result)
    var response = result.responseJSON
    console.log(response);
    console.log(user_input);
    buildTable(user_input,response);


    // console.log(user_input);
    // console.log(results)
}
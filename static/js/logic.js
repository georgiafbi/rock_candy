// const URL = '/results'
// const xhr = new XMLHttpRequest()
// Get a reference to the table body
var tbody = d3.select("tbody");
var predictions;
var components = ["Cement", "Blast Furnace Slage", "Fly Ash", "Water", "Superplasticizer", "Coarse Aggregate", "Fine Aggregate"]
// Select the reset and filter buttons
var predictButton = d3.select("#predict-btn");
var resetButton = d3.select("#clear-btn");
function randomInput(){
    var inputArray=[
        {"#cement": getRandomArbitrary(102, 540)},
        {"#blast_furnace_slage": getRandomArbitrary(0, 359)},
        {"#fly_ash": getRandomArbitrary(0, 200)},
        {"#water": getRandomArbitrary(122, 247)},
        {"#superplasticizer": getRandomArbitrary(0, 33)},
        {"#coarse_aggregate": getRandomArbitrary(801, 1150)},
        {"#fine_aggregate": getRandomArbitrary(594, 993)},
        {"#age": getRandomArbitrary(1, 365)},
        {"#age": getRandomArbitrary(1, 365)}
    ]
    return inputArray
}

predictButton.on('click', runEnter);
resetButton.on('click', resetData);
function getRandomArbitrary(min, max) {
    return precise(Math.random() * (max - min) + min);
}

function precise(x) {
    return Number.parseFloat(x).toPrecision(4);
}
function getUserInput() {
    var inputValuesJSON = [];
    var inputValues = [];

    for(var i=0;i<8;i++){
        var entry=randomInput()[i]
        var key = Object.keys(entry)[0];
        var value=Object.values(entry)[0];
        var input = d3.select(key).property("value");
        console.log(key, value);
        console.log(input);
        if (input !="") {
            inputValuesJSON.push({ key: input });
            inputValues.push(input);
        }
        else {
            inputValuesJSON.push({ key: value });
            inputValues.push(value);
        }
    }
    console.log(inputValuesJSON,inputValues);
    return [inputValuesJSON, inputValues];

}
function oneYear() {
    days = [];
    for (i = 1; i <= 365; i++) {
        days.push(i)
    }
    return days;
}
function buildBar(xdata, ydata) {
    var traceBar = {
        x: xdata,
        y: ydata,
        type: 'bar'
    };
    var layout = {
        title: 'Component Amount',
        xaxis: { title: 'Component' },
        yaxis: { title: 'Mass (kg)' }
    };

    var dataBar = [traceBar];
    Plotly.newPlot('bar', dataBar, layout);

}
function buildLine(xdata, ydata) {
    var ydata = ydata.map(x=> x * 145.038);
    var trace = {
        x: xdata,
        y: ydata,
        type: 'line'
    };
    var layout = {
        title: 'Concrete Compressive Strength Over A Year',
        xaxis: { title: 'Age (days)' },
        yaxis: { title: 'Compressive Strenght (PSI)' }
    };
    var dataLine = [trace];
    Plotly.newPlot('line', dataLine, layout);
}
function buildTable(data, output) {
    // tbody.html("");
    var output = output.map(x=> x * 145.038);
    var row = tbody.append("tr");
    data.push({ 'key': precise(output) })
    data.forEach(d => {

        var cell = row.append('td');
        //console.log(key);
        //console.log(value);
        cell.text(Object.values(d));


    });
    // Create event handlers for clicking the buttons or pressing the enter key

}
function resetData() {
    d3.event.preventDefault()
    tbody.html("");

}
function runEnter() {
    d3.event.preventDefault();

    var user_input = getUserInput();
    console.log(user_input);

    var table_results = $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "/table_results",
        traditional: "true",
        async: false,
        data: JSON.stringify(user_input[0]),
        dataType: "json",
        success: function (data) {
            return data;
        },
    });
    var graph_results = $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "/graph_results",
        traditional: "true",
        async: false,
        data: JSON.stringify(user_input[0].slice(0,-1)),
        dataType: "json",
        success: function (data) {
            return data;
        },
    });
    var graph_response = graph_results.responseJSON
    var table_response = table_results.responseJSON

    buildBar(components, user_input[1].slice(0,-1));
    buildLine(oneYear(), graph_response);
    buildTable(user_input[0], table_response);



    // console.log(user_input);
    // console.log(results)
}
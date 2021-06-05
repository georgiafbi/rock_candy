// const URL = '/results'
// const xhr = new XMLHttpRequest()
// Get a reference to the table body
var tbody = d3.select("tbody");
var predictions;
var components = ["pH", "Hardness", "Solids", "Chloramines", "Sulfate", "Conductivity", "Organic Carbon","Trihalomethanes","Turbidity"]
// Select the reset and filter buttons
var predictButton = d3.select("#predict-btn");
var resetButton = d3.select("#clear-btn");
function randomInput() {
    var inputArray = [
        { "#ph": getRandomArbitrary(0, 14) },
        { "#hardness": getRandomArbitrary(47, 323) },
        { "#solids": getRandomArbitrary(321, 61200) },
        { "#chloramines": getRandomArbitrary(0.35, 13.1) },
        { "#sulfate": getRandomArbitrary(129, 481) },
        { "#conductivity": getRandomArbitrary(181, 753) },
        { "#organic_carbon": getRandomArbitrary(2.2, 28.3) },
        { "#trihalomethanes": getRandomArbitrary(0.70, 124) },
        { "#turbidity": getRandomArbitrary(1.45, 6.74) },
        
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

    for (var i = 0; i < 9; i++) {
        var entry = randomInput()[i]
        var key = Object.keys(entry)[0];
        var value = Object.values(entry)[0];
        var input = d3.select(key).property("value");
        // console.log(key, value);
        // console.log(input);
        if (input != "") {
            inputValuesJSON.push({ key: input });
            inputValues.push(input);
        }
        else {
            inputValuesJSON.push({ key: value });
            inputValues.push(value);
        }
    }
    // console.log(inputValuesJSON, inputValues);
    return [inputValuesJSON, inputValues];

}
function buildPie(xdata, ydata) {
    var traceBar = {
        labels: xdata,
        values: ydata,
        type: 'pie',
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true
    };
    

    var dataBar = [traceBar];
    Plotly.newPlot('pie', dataBar);//, layout);

}
function buildTable(data, output) {
    // tbody.html("");
    console.log(output)
    potable="";
    if(output>0){
        potable="Yes"
    }
    else{
        potable="No"
    }
    console.log(potable)
    var row = tbody.append("tr");
    data.push({ 'key': potable })
    data.forEach(d => {
        console.log(d)
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
    var pie_chart = document.getElementById('pie')
   
    Plotly.purge(pie_chart);
    
    $('.form-control').each(function () {
        $(this).val("");
        x = 1;
    });
    $('.form-control').first().focus();

}
function runEnter() {
    d3.event.preventDefault();

    var user_input = getUserInput();
    // console.log(user_input);

    var water_table_results = $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "/water_results",
        traditional: "true",
        async: false,
        data: JSON.stringify(user_input[0]),
        dataType: "json",
        success: function (data) {
            return data;
        },
    });
    console.log(water_table_response)
    var water_table_response = water_table_results.responseJSON

    buildPie(components, user_input[1].slice(0, -1));
   
    buildTable(user_input[0], water_table_response);

}

function color() {

    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);




    return randomColor;
}
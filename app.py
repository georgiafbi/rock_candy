import os
import joblib
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
import numpy as np
from sklearn.preprocessing import StandardScaler
app = Flask(__name__)
conrete = 0
# load, no need to initialize the loaded_rf
rfr_model = joblib.load("random_forest_regression.joblib")
scaler=StandardScaler()


@app.route("/results", methods=["POST"])
def results():
    c_list=[]
    c_matrix=[]
    

    if request.method == 'POST':
        conrete = request.get_json()
        for qty in conrete:
            c_list.append(float(qty['key']))
    for i in range(1,366):
        
        new_list=c_list.copy()
        new_list.append(i)
        
        c_matrix.append(new_list)  

    np_matrix=np.array(c_matrix)
    scaler.fit(np_matrix)
    np_matrix_scaled=scaler.transform(np_matrix)
    pred=rfr_model.predict(np_matrix_scaled)
    pred=list(pred)
         
 
    return jsonify(pred)

@app.route("/graph")
def graphs():
    return render_template("graph.html")

@app.route("/table")
def table():
    return render_template('table.html')

@app.route("/")
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

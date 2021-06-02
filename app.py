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


@app.route("/table_results", methods=["POST"])
def table_results():
    # load, no need to initialize the loaded_rf
    rfr_model = joblib.load("random_forest_regression.joblib")
    scaler=StandardScaler()
    c_list=[]
    

    if request.method == 'POST':
        concrete = request.get_json()
        print(concrete)
        for qty in concrete:
            c_list.append(float(qty['key'])) 

    np_matrix=np.array(c_list).reshape(1,-1)
    # print(np_matrix)
    # scaler.fit(np_matrix)
    # np_matrix_scaled=scaler.transform(np_matrix)
    # print(np_matrix_scaled)
    pred=rfr_model.predict(np_matrix)
    pred=list(pred)
    
 
    return jsonify(pred)

@app.route("/graph_results", methods=["POST"])
def graph_results():
    # load, no need to initialize the loaded_rf
    rfr_model = joblib.load("random_forest_regression.joblib")
    scaler=StandardScaler()
    c_list=[]
    c_matrix=[]
    

    if request.method == 'POST':
        concrete = request.get_json()
        print("concrete:",concrete)
        for qty in concrete:
            c_list.append(float(qty['key']))
    for i in range(1,366):
        
        new_list=c_list.copy()
        new_list.append(i)
        
        c_matrix.append(new_list)  

    np_matrix=np.array(c_matrix)
   
    # scaler.fit(np_matrix)
    # np_matrix_scaled=scaler.transform(np_matrix)
    pred=rfr_model.predict(np_matrix)
    pred=list(pred)
     
 
    return jsonify(pred)

@app.route("/table")
def table():
    return render_template('table.html')

@app.route("/")
def home():
   
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

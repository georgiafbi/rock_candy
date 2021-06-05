import joblib
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
app = Flask(__name__)

@app.route("/water_results", methods=["POST"])
def water_results():
    water_model=joblib.load("water_model.joblib")
    water_list=[]
    if request.method == 'POST':
        water=request.get_json()
        print(water)
        print(water)
        for element in water:
            water_list.append(float(element['key']))
    np_matrix=np.array(water_list).reshape(1,-1)
    print(np_matrix)
    pred=water_model.predict(np_matrix)
    pred=list(pred)
    print(pred)
    
 
    return jsonify(int(pred[0]))
    



@app.route("/table_results", methods=["POST"])
def table_results():
    # load, no need to initialize the loaded_rf
    rfr_model = joblib.load("random_forest_regression.joblib")
    
    c_list=[]
    

    if request.method == 'POST':
        concrete = request.get_json()
        print(concrete)
        for qty in concrete:
            c_list.append(float(qty['key'])) 

    np_matrix=np.array(c_list).reshape(1,-1)
    
    pred=rfr_model.predict(np_matrix)
    pred=list(pred)
    
 
    return jsonify(pred)

@app.route("/graph_results", methods=["POST"])
def graph_results():
    # load, no need to initialize the loaded_rf
    rfr_model = joblib.load("random_forest_regression.joblib")
    
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
@app.route("/water")
def water():
    return render_template('water.html')

@app.route("/table")
def table():

    return render_template('table.html')

@app.route("/")
def home():
    best_params_html=pd.read_csv('Resources/best_params.csv',index_col=[0]).to_html()
    best_features_html=pd.read_csv('Resources/best_features.csv',index_col=[0]).to_html()
    rfr_stats_html=pd.read_csv('Resources/rfr_stats.csv',index_col=[0]).to_html()
    
    return render_template('index.html',best_params_table=best_params_html,best_features_table=best_features_html,rfr_stats_table=rfr_stats_html)


if __name__ == '__main__':
    app.run(debug=True)

# # Update sklearn to prevent version mismatches
# !pip install sklearn --upgrade

# # install joblib. This will be used to save your model. 
# # Restart your kernel after installing 
# !pip install joblib

import pandas as pd

import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
    
def training_data():
    #extracts dataframe column names
    def df_col_names(df):
        return df.columns.tolist()
    #renames dataframe column names
    def rename_cols(df,renamed_columns):
        df_columns=df_col_names(df)
        columns_dict={}
        for i in range(len(df_columns)):
            columns_dict[df_columns[i]]=renamed_columns[i]

        return df.rename(columns=columns_dict)

    #assigns the data to X and y
    def input_output(df):
        col_names=df_col_names(df)
        X =new_df[col_names[:-1]]
        y=new_df[col_names[-1]].values.ravel()
        return X, y
    # Read the csv file into a pandas DataFrame
    data_path="Resources/Concrete_Data.csv"
    df=pd.read_csv(data_path)

    #desired column names
    new_column_names=["cement","blast_furnace_slage","fly_ash","water","superplasticizer","coarse_aggregate",
                           "fine_aggregate","age","compressive_strength"]
    #creates new dataframe from original dataframe with renamed columns
    new_df=rename_cols(df,new_column_names)
    real_df=new_df
#     for i in range(50):
#         new_df.loc[len(new_df)] = 0.0
        
    new_df.head()

    # Assign the data to X and y
    X,y=input_output(new_df)
    #scale X data
#     
#     scale=StandardScaler()
#     X=scale.fit_transform(X)

    # Use train_test_split to create training and testing data

    ### BEGIN SOLUTION


    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,random_state=42)
    

    return X_train,X_test,y_train,y_test,real_df,X,y
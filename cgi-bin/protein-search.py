#!/usr/bin/python
# -*- coding: UTF-8 -*-
import csv
import cgi
import sys
import json
import os
import glob
import re

path = '/home/inkwchoi/Documents/Work/DrSun/data/'
#path = '/var/www/html/public/software/protein_search/data/'

#This program receives query containing key (protein name or gene name) and flag indicating which key is used
#then search the data file for a matching row
#if there is a matching row, return data of entire row in JSON
#if no match, return error message
 
def error(result):
    sys.stdout.write('Content-Type: text/plain\n\n')
    sys.stdout.write(result)

def output(result):
    sys.stdout.write('Content-Type: application/json\n\n')
    sys.stdout.write(result)

def get_column(keyType):
    if keyType == 'gene':
        return 6
    elif keyType == 'prot':
        return 0
    else:
        return -1 #invalid keyType

def search_data(key, keyType):
    #use the key and the key type to find the row with this key
    column = get_column(keyType)
    if column < 0:
        return None

    for file_name in glob.glob(path+'*.csv'):
        with open(file_name) as csvfile:
            file_reader = csv.reader(csvfile, delimiter=',', quotechar='|')
            column_names = next(file_reader)
            for row in file_reader:
                if (re.search(key, row[column])):
                #if (row[column] == key):
                    #create dict
                    data = {}
                    for i in range(0, len(row)):
                        #format column name
                        col_name = column_names[i].lower()
                        if col_name.find("(") > 0:
                            col_name = col_name[col_name.find("(") + 1:col_name.find(")")]
                        data[col_name] = row[i]
                    jsonfied_data = json.dumps(data)
                    return jsonfied_data
            return None

def main():
    form = cgi.FieldStorage()
    fail=0
    try:
        #change column name to all lower case and remove space
        key = str(form['key'].value)
        keyType = str(form['keyType'].value)
    except:
        fail=1
    else:
        if key == "":
            fail=1

    if fail == 1:
        error('ERROR: invalid protein name or gene name')
        raise SystemExit

    protein = search_data(key, keyType)
    
    #if none
    if protein == None:
        #return error
        error("No matching protein was found. Please check the protein or gene name and try again.")
    else:
        output(protein)

    raise SystemExit

if __name__ == "__main__":
    main()
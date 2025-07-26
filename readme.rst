#########################################
Long Play - Weather Data Radial Heat Map
#########################################


#########
Updates
#########

**Note:** Metrostat is sunsetting the format of bulk data this chart relies on.
I am working on a `new website <https://climateradial.com/>`_ to pull the data in 
the new format but it's split into years so needs a database back end to do. The upshot
of that is there are now ready-made cities for the chart so you can see it in action.



**2/26/2025** - Last few years, more scale work

**1/15/2025** - Temperature scale

**1/10/2025** - Added scales and more data types

**1/6/2025** - First alpha version, fixed a degree symbol bug

################
How to Use
################

Simply run the index file and load in a CSV file of `Metrostat weather data <https://dev.meteostat.net/bulk>`_

If you would like a working example you can visit the 
`website <https://climateradial.com/>`_



.. image:: grand_rapids.jpg
  :width: 810
  :alt: Chart example

Grand Rapids Michigan US data from 1963-2025  

Daily High Temperature (Fahrenheit) 

Inner rings are older years  
  

###############
Loading In Data
###############
  
Load in daily archival data from  `Metrostat <https://dev.meteostat.net/bulk>`_
 
`Vist a Metrostat Station Page <https://meteostat.net/en/place/us/grand-rapids?s=72635&t=2025-01-11/2025-01-18>`_
   
and the parameter in the URL you want is **s**, copy that number and put it in to:
   
https://bulk.meteostat.net/v2/daily/{station}.csv.gz
   
You will have to unzip the archive with 7-Zip if you are on Windows

###############
Other Notes
###############

This is not great code, I am more of an artist than a programmer. There are a lot of things I want to do with this but open sourcing it means you can do what you want with it as well.

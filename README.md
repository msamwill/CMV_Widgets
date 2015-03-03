Search
===============

CMV Version: 1.3.2

This widget is very similar to the the find widget.  It is a copy of the find widget with a few changes.  One, find task was replaced with a query task.  The configuration file allows you to specify the properties for the query.  In addition, you can define some properties for the grid.  Such as the fields you want displayed in the grid.  An autocomplete feature was added.  And finally the hightlight feature has been changed to only highlight and zoom when rows are selected in the grid.  If only one row is returned from the query task, the feature is zoomed to and highlighted. 


##Description:
Allows user to Search feature classes and display multiple fields in grid.  Screen shot:
 
![URL Field](https://github.com/msamwill/CMV_Widgets/blob/master/README.md)
 

##Usage 
In viewer.js (see below for descriptions of parameters): 
```javascript      
 search: {
		        include: true,
		        id: 'search',
		        type: 'titlePane',
		        canFloat: false,
		        path: 'gis/dijit/Search',
		        title: 'Search',
		        open: false,
		        position: 0,
		        options: 'config/search'
		    },

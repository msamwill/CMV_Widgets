Search
===============

CMV Version: 1.3.2

This widget is very similar to the the find widget.  It began as a copy of the widget replacing the find task with a query task.  an autocomplete feature has been added and the ability to display multiple fields in search results. The hightlight feature has been changed to only highlight and zoom when rows are selected in the grid.  If only one row is returned from the search results the feature is zoomed to and highlighted. 


##Description:
Allows user to Search feature classes and display multiple fields in grid.  T
 
![URL Field](https://github.com/msamwill/cmv-widgets/blob/master/AppSettings_Widget/URL_Screenshot.PNG)
 

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

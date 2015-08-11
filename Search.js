define([
	'dojo/_base/declare',
   	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
    'dojo/aspect',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/on',
	'dojo/keys',
	'dojo/store/Memory',
	'dgrid/OnDemandGrid',
	'dgrid/Selection',
    'dgrid/Keyboard',
    'dgrid/extensions/ColumnResizer',
    'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphicsUtils',
	'esri/tasks/QueryTask',
    'esri/tasks/query',
	'esri/geometry/Extent',
	'dojo/text!./Search/templates/Search.html',
	'dojo/i18n!./Search/nls/resource',
    'dojo/string',
    'dijit/Dialog',
    'dijit/form/Form',
	'dijit/form/FilteringSelect',
	'dijit/form/ValidationTextBox',
	'dijit/form/CheckBox',
	'xstyle/css!./Search/css/Search.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, aspect, domConstruct, lang, array, on, keys, Memory, OnDemandGrid, Selection, Keyboard, ColumnResizer, GraphicsLayer, Graphic, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, graphicsUtils, QueryTask, Query, Extent, SearchTemplate, i18n, String, Dialog) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: SearchTemplate,
		baseClass: 'gis_SearchDijit',
		i18n: i18n,
        
	    lastselectedQuery: null,
		lastSearchString: '',
		stagedSearch: null,
        lastSort: '',
		//parcelid: "",
		//_setParcelidAttr: function (value) {
		//    //alert("in setparcel id = " + value);
		//    this._set("parcelid", value);

		//    if (this.parentWidget && !this.parentWidget.open) {
		//        this.parentWidget.toggle();
		//    }
		//    this.searchTextDijit.set('value', value);
		//    this.search();
		//},

		// Spatial Reference. uses the map's spatial reference if none provided
		spatialReference: null,
		// Use 0.0001 for decimal degrees (wkid 4326)
		// or 500 for meters/feet
		pointExtentSize: null,
	    // default symbology for found features

		
		defaultSymbols: {
			point: {
				type: 'esriSMS',
				style: 'esriSMSCircle',
				size: 25,
				color: [0, 255, 255, 32],
				angle: 0,
				xoffset: 0,
				yoffset: 0,
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 2
				}
			},
			polyline: {
				type: 'esriSLS',
				style: 'esriSLSSolid',
				color: [0, 255, 255, 255],
				width: 3
			},
			polygon: {
				type: 'esriSFS',
				style: 'esriSFSSolid',
				color: [0, 255, 255, 32],
				outline: {
					type: 'esriSLS',
					style: 'esriSLSSolid',
					color: [0, 255, 255, 255],
					width: 3
				}
			}
		},
		postCreate: function () {
			this.inherited(arguments);

			if (this.spatialReference === null) {
				this.spatialReference = this.map.spatialReference.wkid;
			}
			if (this.pointExtentSize === null) {
				if (this.spatialReference === 4326) { // special case for geographic lat/lng
					this.pointExtentSize = 0.0001;
				} else {
					this.pointExtentSize = 500; // could be feet or meters
				}
			}

			this.createGraphicLayers();

		    //amw decided they don't like the close of the widet to end the drawing.
		    if (this.parentWidget && this.parentWidget.toggleable) {
		        this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
		            this.onLayoutChange(this.parentWidget.open);
		        })));
		    }

            //amw added to fix ie bug
		    this.own(aspect.after(this, 'resize', lang.hitch(this, function () {
		        if (this.resultsGrid != 'undefined') {
		            if (this.lastSort > "") {
		                this.resultsGrid.updateSortArrow(this.lastSort, true);
		            }
		        }
              })), true);
		    
		    // auto complete search 
		    this.own(on(this.searchTextDijit, 'keyup', lang.hitch(this, function (evt) {
		            this.handleOnKeyUp(evt);
		    })));

			this.queryIdx = 0;

			// add an id so the queries becomes key/value pair store
			var k = 0, queryLen = this.queries.length;
			for (k = 0; k < queryLen; k++) {
				this.queries[k].id = k;
			}

			// add the queries to the drop-down list
			if (queryLen > 1) {
				var queryStore = new Memory({
					data: this.queries
				});
				this.querySelectDijit.set('store', queryStore);
				this.querySelectDijit.set('value', this.queryIdx);
			} else {
				this.querySelectDom.style.display = 'none';
			}

		},
		startup: function () {
		    if (this.parcelid > "") {
		        if (this.parentWidget && !this.parentWidget.open) {
		            this.parentWidget.toggle();
		        }
		        this.searchTextDijit.set('value', this.parcelid);
		        this.search();
		    }
		    
		},
		handleOnKeyUp: function (evt) {
		    var id = evt.target.id;
		    var selectedQuery = this.queries[this.queryIdx];
		    var searchText = "";

		    if (evt) {
		        if (evt.keyCode == dojo.keys.ENTER) {
		            if (dojo.byId(id).value != '') {
		                this.search();
		                return;
		            }
		        }
		        
		        if ((!((evt.keyCode >= 46 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91) || (evt.keyCode > 95 && evt.keyCode < 106) || evt.keyCode == 8 || evt.keyCode == 110 || evt.keyCode == 188)) || (evt.keyCode == 86 && evt.ctrlKey) || (evt.keyCode == 88 && evt.ctrlKey)) {
		            evt = (evt) ? evt : event;
		            evt.cancelBubble = true;
		            if (evt.stopPropagation) evt.stopPropagation();
		            return;
		        }

		        searchText = dojo.byId(id).value.trim();
		        if (!selectedQuery || !searchText || searchText.length === 0) {
		            return;
		        }
		       		        
		        if (searchText != '') {
		            if (this.lastSearchString != searchText) {
		                this.lastSearchString = searchText;
		                // Clear any staged search
		                clearTimeout(this.stagedSearch);
		                if (selectedQuery.minChars && (searchText.length >= selectedQuery.minChars)) {
		                    // Stage a new search, which will launch if no new searches show up before the timeout
		                    this.stagedSearch = setTimeout(lang.hitch(this, function () {
		                        this.search();
		                    }), 500);
		                }
		            }
		        } else {
		            //cleared out text should we clear the grid?
		            this.lastSearchString = searchText;
		            this.clearResults();
		        }
		    }
		},
		onLayoutChange: function (open) {
		    // if user opens widget set focus to search text
		    if (open) {
		       dojo.byId('searchTextDijit').focus();
		    }
		},
		createGraphicLayers: function () {
			var pointSymbol = null,
				polylineSymbol = null,
				polygonSymbol = null;
			var pointRenderer = null,
				polylineRenderer = null,
				polygonRenderer = null;

			var symbols = lang.mixin({}, this.symbols);
			// handle each property to preserve as much of the object heirarchy as possible
			symbols = {
				point: lang.mixin(this.defaultSymbols.point, symbols.point),
				polyline: lang.mixin(this.defaultSymbols.polyline, symbols.polyline),
				polygon: lang.mixin(this.defaultSymbols.polygon, symbols.polygon)
			};

			// points
			this.pointGraphics = new GraphicsLayer({
				id: 'searchGraphics_point',
				title: 'Search'
			});

			if (symbols.point) {
				pointSymbol = new SimpleMarkerSymbol(symbols.point);
				pointRenderer = new SimpleRenderer(pointSymbol);
				pointRenderer.label = 'Search Results (Points)';
				pointRenderer.description = 'Search results (Points)';
				this.pointGraphics.setRenderer(pointRenderer);
			}

			// poly line
			this.polylineGraphics = new GraphicsLayer({
				id: 'searchGraphics_line',
				title: 'Search Graphics'
			});

			if (symbols.polyline) {
				polylineSymbol = new SimpleLineSymbol(symbols.polyline);
				polylineRenderer = new SimpleRenderer(polylineSymbol);
				polylineRenderer.label = 'Search Results (Lines)';
				polylineRenderer.description = 'Search Results (Lines)';
				this.polylineGraphics.setRenderer(polylineRenderer);
			}

			// polygons
			this.polygonGraphics = new GraphicsLayer({
				id: 'searchGraphics_polygon',
				title: 'Search Graphics'
			});

			if (symbols.polygon) {
				polygonSymbol = new SimpleFillSymbol(symbols.polygon);
				polygonRenderer = new SimpleRenderer(polygonSymbol);
				polygonRenderer.label = 'Search Results (Polygons)';
				polygonRenderer.description = 'Search Results (Polygons)';
				this.polygonGraphics.setRenderer(polygonRenderer);
			}

			this.map.addLayer(this.polygonGraphics);
			this.map.addLayer(this.polylineGraphics);
			this.map.addLayer(this.pointGraphics);
		},
		search: function () {
			var selectedQuery = this.queries[this.queryIdx];
			var searchText = this.searchTextDijit.get('value');
			searchText = searchText.replace(/-/g, '') //amw remove dashes
			if (!selectedQuery || !searchText || searchText.length === 0) {
				return;
			}
			if (selectedQuery.minChars && (searchText.length < selectedQuery.minChars)) {
			    this.searchResultsNode.innerHTML = 'You must enter at least ' + selectedQuery.minChars + ' characters.';
				this.searchResultsNode.style.display = 'block';
				return;
			}

			//this.destroyResultsGrid();
			this.createResultsGrid(selectedQuery);
			this.clearResultsGrid();
			this.clearFeatures();
			domConstruct.empty(this.searchResultsNode);

			if (!selectedQuery || !selectedQuery.url || !selectedQuery.where || !selectedQuery.outFields || !selectedQuery.dgridColumns || !selectedQuery.dgridSort) {
				return;
			}

		    //create query parameters
			var qt = new QueryTask(selectedQuery.url);
			var query = new Query();
			query.where = String.substitute(selectedQuery.where, [searchText]);
			query.returnGeometry = true;
			query.outFields = selectedQuery.outFields;
			
			
			this.searchResultsNode.innerHTML = this.i18n.searching;
			this.searchResultsNode.style.display = 'block';

			qt.execute(query, lang.hitch(this, 'showResults'));
		},
		createResultsGrid: function (selectedQuery) {
		    if (!this.resultsStore) {
		        this.resultsStore = new Memory({
		            idProperty: 'id',
		            data: []
		        });
		    } 

            //if grid has already been created but we have changed the query update columns and sort
		    if (this.resultsGrid && this.lastselectedQuery != selectedQuery) {
		        if (this.resultsStore) {
		            this.resultsStore.setData([]);
		        }
		        this.resultsGrid._setColumns(selectedQuery.dgridColumns);
		        this.resultsGrid.updateSortArrow(selectedQuery.dgridSort, true);
		    }


		    if (!this.resultsGrid) {
		        var Grid = declare([OnDemandGrid, Keyboard, Selection], {
		            _customSelectionHandler: function(event, target){
		                // Never clear for RMB, instead of clearing for RMB + unselected
		                if(event.button !== 2 ){
		                    this._singleSelectionHandler(event, target);
		                }
		                
		            }});

		        this.resultsGrid = new Grid({
		            selectionMode: 'custom',
		            cellNavigation: false,
		            showHeader: true,
		            store: this.resultsStore,
		            columns: selectedQuery.dgridColumns,
		            sort: selectedQuery.dgridSort
		            //minRowsPerPage: 250,
		            //maxRowsPerPage: 500
		        }, this.searchResultsGrid);
		        this.resultsGrid.startup();
		        this.resultsGrid.on('dgrid-select', lang.hitch(this, 'selectFeature'));
		        this.resultsGrid.on('.dgrid-content .dgrid-row:contextmenu', lang.hitch(this, 'rightClickFeature'));
		        this.resultsGrid.on('dgrid-sort', lang.hitch(this, 'setLastSort'));
		    }

		    if (!this.rcDialog) {
		        this.rcDialog = new Dialog({
		            title: "Right Click Dialog Column Name",
		            content: "Column Value",
		            style: "background-color:#FFFFFF; border-style:solid; border-width:2px; border-color:#000; height:150px; width:350px; padding:10px;"
		        });
		    }
		    
		},
		showResults: function (results) {
		    var resultText = '';
			this.resultIdx = 0;
			this.results = [];
			var selectedQuery = this.queries[this.queryIdx];

            //build results array that includes dynamic columns
			if (results.features.length > 0) {
			    var unique = 0;
			    array.forEach(results.features, function (feature) {
			        var x = {feature: feature, id: unique};
			        unique++;
			        for (var key in selectedQuery.dgridColumns) {
			            if (selectedQuery.dgridColumns.hasOwnProperty(key)) {
			                x[key] = feature.attributes[key];
			            }
			        }
			        this.results.push(x);
			    }, this);
			}

			if (this.results.length > 0) {
				var s = (this.results.length === 1) ? '' : this.i18n.resultsLabel.multipleResultsSuffix;
				resultText = this.results.length + ' ' + this.i18n.resultsLabel.labelPrefix + s + ' ' + this.i18n.resultsLabel.labelSuffix;
				if (this.results.length === 1) {
				    this.clearFeatures();
				    this.highlightFeature(this.results[0].feature.geometry);
				};
				this.showResultsGrid();
			} else {
			    resultText = this.i18n.resultsLabel.noResults;
			}
			this.searchResultsNode.innerHTML = resultText;
		},
		showResultsGrid: function () {
		    var selectedQuery = this.queries[this.queryIdx];
		    
            this.resultsGrid.store.setData(this.results);
			this.resultsGrid.refresh();

			if (selectedQuery && selectedQuery.hideGrid !== true) {
				this.searchResultsGrid.style.display = 'block';
			}
		},
		highlightFeature: function (geometry) {
		    switch (geometry.type) {
		        case 'point':
		            // only add points to the map that have an X/Y
		            if (geometry.x && geometry.y) {
		                graphic = new Graphic(geometry);
		                this.pointGraphics.add(graphic);
		            }
		            break;
		        case 'polyline':
		            // only add polylines to the map that have paths
		            if (geometry.paths && geometry.paths.length > 0) {
		                graphic = new Graphic(geometry);
		                this.polylineGraphics.add(graphic);
		            }
		            break;
		        case 'polygon':
		            // only add polygons to the map that have rings
		            if (geometry.rings && geometry.rings.length > 0) {
		                graphic = new Graphic(geometry, null, {
		                    ren: 1
		                });
		                this.polygonGraphics.add(graphic);
		            }
		            break;
		        default:
		    };

		    // zoom to layer extent
		    var zoomExtent = null;
		    //If the layer is a single point then extents are null
		    // if there are no features in the layer then extents are null
		    // the result of union() to null extents is null

		    if (this.pointGraphics.graphics.length > 0) {
		        zoomExtent = this.getPointFeaturesExtent(this.pointGraphics.graphics);
		    }
		    if (this.polylineGraphics.graphics.length > 0) {
		        if (zoomExtent === null) {
		            zoomExtent = graphicsUtils.graphicsExtent(this.polylineGraphics.graphics);
		        } else {
		            zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polylineGraphics.graphics));
		        }
		    }
		    if (this.polygonGraphics.graphics.length > 0) {
		        if (zoomExtent === null) {
		            zoomExtent = graphicsUtils.graphicsExtent(this.polygonGraphics.graphics);
		        } else {
		            zoomExtent = zoomExtent.union(graphicsUtils.graphicsExtent(this.polygonGraphics.graphics));
		        }
		    }

		    if (zoomExtent) {
		        this.zoomToExtent(zoomExtent);
		    }
		},
        selectFeature: function (event) {
			var result = event.rows;

			// zoom to feature
			if (result.length) {
				var data = result[0].data;
				if (data) {
					var feature = data.feature;
					if (feature) {
					    this.clearFeatures();
					    this.highlightFeature(feature.geometry);
						//var extent = feature.geometry.getExtent();
						//if (!extent && feature.geometry.type === 'point') {
						//	extent = this.getExtentFromPoint(feature);
						//}
						//if (extent) {
						//	this.zoomToExtent(extent);
						//}
					}
				}
			}
        },
        rightClickFeature: function (event) {
            event.preventDefault();
            var column = this.resultsGrid.cell(event).column.field;
            var item = this.resultsGrid.row(event).data[column];
            this.rcDialog.set("title", this.resultsGrid.cell(event).column.label);
            this.rcDialog.set("content", item);
            this.rcDialog.show();
            //alert('Value of Column ' + column + ' is ' + item);
        },
        setLastSort: function (event) {
            this.lastSort = event.sort;
        },
		zoomToExtent: function (extent) {
			this.map.setExtent(extent.expand(3.0));
		},
		clearResults: function () {
		    this.results = null;
		    //this.data = null;
			this.clearResultsGrid();
			this.clearFeatures();
			this.searchFormDijit.reset();
			this.querySelectDijit.setValue(this.queryIdx);
			domConstruct.empty(this.searchResultsNode);
		},
		clearResultsGrid: function () {
			if (this.resultStore) {
				this.resultsStore.setData([]);
			}
			if (this.resultsGrid) {
				this.resultsGrid.refresh();
			}
			this.searchResultsNode.style.display = 'none';
			this.searchResultsGrid.style.display = 'none';
		},
		clearFeatures: function () {
			this.pointGraphics.clear();
			this.polylineGraphics.clear();
			this.polygonGraphics.clear();
		},
		getPointFeaturesExtent: function (pointFeatures) {
			var extent = graphicsUtils.graphicsExtent(pointFeatures);
			if (extent === null && pointFeatures.length > 0) {
				extent = this.getExtentFromPoint(pointFeatures[0]);
			}

			return extent;
		},
		getExtentFromPoint: function (point) {
			var sz = this.pointExtentSize; // hack
			var pt = point.geometry;
			var extent = new Extent({
				'xmin': pt.x - sz,
				'ymin': pt.y - sz,
				'xmax': pt.x + sz,
				'ymax': pt.y + sz,
				'spatialReference': {
					wkid: this.spatialReference
				}
			});
			return extent;
		},
		_onQueryChange: function (queryIdx) {
			if (queryIdx >= 0 && queryIdx < this.queries.length) {
			    this.queryIdx = queryIdx;
			    dojo.byId('searchTextDijit').focus();
			    dojo.byId('searchTextHelp').innerHTML = this.queries[queryIdx].help;
			}
		}
	});
});
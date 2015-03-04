define({
	map: true,
	queries: [
	    {
            description: 'Find A Fire Station Location By Name',
            url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer/1',
            where: "FDNAME LIKE '${0}%' ",
            outFields: ["SITEID", "FDNAME", "ADDRESS"],
            dgridColumns: {
                SITEID: "ID",
                FDNAME: "NAME",
                ADDRESS: "ADDRESS"
            },
            dgridSort: [ {attribute: "NAME", descending: false}],
            minChars: 3
        },
        {
            description: 'Find A Police Station Location By Name',
            url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer/2',
            where: "FDNAME LIKE '${0}%' ",
            outFields: ["SITEID", "PDNAME", "ADDRESS"],
            dgridColumns: {
                SITEID: "ID",
                PDNAME: "NAME",
                ADDRESS: "ADDRESS"
            },
            dgridSort: [ {attribute: "PDNAME", descending: false}],
            minChars: 3
        }
		
        //{
        //    description: 'Find Parcel By Site Address',
        //    url: 'http://'  + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/3',
        //    where: "UPPER(PROP_ADDRESS) + UPPER(PROP_CITY) LIKE '%${0}%'",
        //    outFields: ['JOIN_STRAP', 'PROP_ADDRESS', 'PROP_CITY'],
        //    dgridColumns: {
        //        "JOIN_STRAP": "STRAP",
        //        "PROP_ADDRESS": "PROP ADDRESS",
        //        "PROP_CITY": "PROP CITY"
        //    },
        //    dgridSort: [{ attribute: "JOIN_STRAP", descending: false }],
        //    minChars: 3
        //},
		//{
		//	description: 'Find Owner By Name',
		//	url: 'http://'  + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/2',
		//	where: "UPPER(OWN_NAME1) LIKE '%${0}%' OR UPPER(OWN_NAME2) LIKE '%${0}%'",
		//	outFields: ['JOIN_STRAP', 'OWN_NAME1', 'OWN_NAME2'],
		//	dgridColumns: {
		//	    "JOIN_STRAP": "STRAP",
		//	    "OWN_NAME1": "OWN_NAME1",
		//	    "OWN_NAME2": "OWN_NAME2"
		//	},
		//	dgridSort: [{ attribute: "JOIN_STRAP", descending: true }],
		//	minChars: 3
		//},
		//{
		//	description: 'Find Subdivision By Name',
		//	url: 'http://'  + GISServerName +  '/arcgis/rest/services/Toggle_Subdivisions/MapServer/0',
		//	where: "UPPER(CNVYNAME) LIKE '%${0}%' ",
		//	outFields: ['CNVYNAME'],
		//	dgridColumns: {
		//	    "CNVYNAME": "NAME"
		//	},
		//	dgridSort: [{ attribute: "JOIN_STRAP", descending: false }],
		//	minChars: 4
		//}
	]
});
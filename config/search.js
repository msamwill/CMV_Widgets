define({
	map: true,
	//amw this is custom code I use to pass in a parcel id number on widget startup via a query string and have
	//search widget automatically execute search.  Leave this set to false.
	parcelid: false,
	queries: [
	    { //one begins with train
	        description: 'Find an Incident Point by Description',
			// map service must contain a shape field 
	        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer/15',
	        where: "Upper(DESCRIPTION) LIKE Upper('${0}%') ",
	        outFields: ["FCODE", "DESCRIPTION"],
	        dgridColumns: {
				FCODE: {
					label: "INC TYPE",
					sortable: true
				},
				DESCRIPTION: {
					label: "DESC",
					sortable: true
				}
	        },
	        dgridSort: [{ attribute: "FCODE", descending: false }],
	        minChars: 3
	    },
        { //one begins with I-64
            description: 'Find a Traffic Camera by Description',
			// map service must contain a shape field
            url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer/8',
            where: "Upper(DESCRIP) LIKE Upper('${0}%') ",
            outFields: ["DESCRIP", "URL"],
            dgridColumns: {
                DESCRIP: {
					label: "DESCRIPTION",
					sortable: true
				},
                URL: {
					label: "URL",
					sortable: true
				}
            },
            dgridSort: [{ attribute: "DESCRIPTION", descending: false }],
            minChars: 3
        }
		
        //{
        //    description: 'Find Parcel By Strap',
        //    help: "Enter all or part of the Parcel ID number, e.g. 253005372500003010 or 253005",
        //    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/0',
        //    where: "JOIN_STRAP LIKE '${0}%' ",
        //    outFields: ["JOIN_STRAP", "NAME", "PROP_ADDRESS"],
        //    dgridColumns: {
        //        JOIN_STRAP: {
        //            label: "STRAP",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        NAME: {
        //            label: "OWNER",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        PROP_ADDRESS: {
        //            label: "ADDRESS",
        //            sortable: true
        //            //className: "WDTH120"
        //        }
        //    },
        //    dgridSort: [
        //        { attribute: "JOIN_STRAP", descending: false },
        //        { attribute: "NAME", descending: false },
        //        { attribute: "PROP_ADDRESS", descending: false }
        //    ],
        //    minChars: 3
        //},
        //{
        //    description: 'Find Parcel By Site Address',
        //    help: "The ' % ' can be used as a wildcard to replace unknown portions of a your search text, e.g. 255 % Wilson",
        //    url: 'http://'  + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/0',
        //    where: "UPPER(PROP_ADDRESS) + UPPER(PROP_CITY) LIKE '%${0}%'",
        //    outFields: ['JOIN_STRAP', 'PROP_ADDRESS', 'PROP_CITY'],
        //    dgridColumns: {
        //        JOIN_STRAP: {
        //            label: "STRAP",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        PROP_ADDRESS: {
        //            label: "ADDRESS",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        PROP_CITY: {
        //            label: "CITY",
        //            sortable: true
        //            //className: "WDTH120"
        //        }
        //    },
        //    dgridSort: [
        //        { attribute: "PROP_ADDRESS", descending: false },
        //        { attribute: "PROP_CITY", descending: false },
        //        { attribute: "JOIN_STRAP", descending: false }
        //    ],
        //    minChars: 3
        //},
		//{
		//    description: 'Find Owner By Name',
		//    help: "The ' % ' can be used as a wildcard to replace unknown portions of a your search text, e.g. Smi% J",
		//	url: 'http://'  + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/3',
		//	where: "UPPER(OWN_NAME1) LIKE '${0}%' OR UPPER(MAIL_TO) LIKE '${0}%'",
		//	outFields: ['JOIN_STRAP', 'OWN_NAME1', 'MAIL_TO'],
		//	dgridColumns: {
		//	    JOIN_STRAP: {
		//	        label: "STRAP",
		//	        sortable: true
		//	        //className: "WDTH120"
		//	    },
		//	    OWN_NAME1: {
		//	        label: "OWN_NAME1",
		//	        sortable: true
		//	        //className: "WDTH120"
		//	    },
		//	    MAIL_TO: {
		//	        label: "MAIL_TO",
		//	        sortable: true
		//	        //className: "WDTH120"
		//	    }
		//	},
		//	dgridSort: [
        //        { attribute: "OWN_NAME1", descending: true },
        //        { attribute: "MAIL_TO", descending: true },
        //        { attribute: "JOIN_STRAP", descending: false }
		//	],
		//	minChars: 3
		//},
        //{
        //    description: 'Find Tangible By Acct',
        //    help: "Enter all or part of the Account number, e.g. 20119530 or 20119",
        //    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/6',
        //    where: "ACCT LIKE '${0}%' ",
        //    outFields: ["ACCT", "NAME", "SITE_ADDRESS","STRAP"],
        //    dgridColumns: {
        //        ACCT: {
        //            label: "ACCOUNT",
        //            sortable: true
        //        },
        //        NAME: {
        //            label: "OWNER",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        SITE_ADDRESS: {
        //            label: "ADDRESS",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        STRAP: {
        //            label: "TRC",
        //            field: "STRAP",
        //            renderCell: function (object, value, node, options) {
        //                node.innerHTML = "<a target=\"_blank\" href=\"http://" + ReportServerName + "/ReportServer/Pages/ReportViewer.aspx?%2fPCPA+Office+Wide%2fTRC%2fTRC&acct=" + object.ACCT + "&dbname=t_prod \">Tangible Record Card</a>";
        //            }
        //        }
        //    },
        //    dgridSort: [
        //        { attribute: "JOIN_STRAP", descending: false },
        //        { attribute: "NAME", descending: false },
        //        { attribute: "ADDRESS", descending: false }
        //    ],
        //    minChars: 3
        //},
        //{
        //    description: 'Find Section By RTS',
        //    help: "Enter all or part of the RTS number, e.g. 253005 or 2530",
        //    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/19',
        //    where: "FRSTDIVID LIKE '${0}%' ",
        //    outFields: ['FRSTDIVID'],
        //    dgridColumns: {
        //        FRSTDIVID: {
        //            label: "RTS",
        //            sortable: true
        //            //className: "WDTH120"
        //        }
        //    },
        //    dgridSort: [{ attribute: "FRSTDIVID", descending: false }],
        //    minChars: 3
        //},
		//{
		//    description: 'Find Subdivision By Name',
		//    help: "The ' % ' can be used as a wildcard to replace unknown portions of a your search text, e.g. %Point",
		//    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/25',
		//    where: "UPPER(CNVYNAME) LIKE '${0}%' ",
		//    outFields: ['CNVYNAME', 'RTS', 'CNVYDSGNTR', 'PB', 'PP', 'OR_BOOK', 'OP'],
		//	dgridColumns: {
		//	    CNVYNAME: {
		//	        label: "NAME",
		//	        sortable: true
		//	    },
		//	    RTS: {
		//	        label: "RTS",
		//	        sortable: true
		//	    },
		//	    CNVYDSGNTR: {
		//	        label: "NUMBER",
		//	        sortable: true
		//	    },
		//	    PB: {
		//	        label: "PB",
		//	        sortable: true
		//	    },
		//	    PP: {
		//	        label: "PP",
		//	        sortable: true
		//	    },
		//	    OR_BOOK: {
		//	        label: "OR BOOK",
		//	        sortable: true
		//	    },
		//	    OP: {
		//	        label: "OR PAGE",
		//	        sortable: true
		//	    }

		//	},
		//	dgridSort: [{ attribute: "CNVYNAME", descending: false }],
		//	minChars: 4
		//},
        //{
        //    description: 'Find Subdivision By Number',
        //    help: "Enter all or part of the sub number, e.g. 687552 or 6875",
        //    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/25',
        //    where: "CNVYDSGNTR LIKE '${0}%' ",
        //    outFields: ['CNVYNAME', 'RTS', 'CNVYDSGNTR', 'PB', 'PP', 'OR_BOOK', 'OP'],
        //    dgridColumns: {
        //        CNVYDSGNTR: {
        //            label: "NUMBER",
        //            sortable: true
        //        },
        //        CNVYNAME: {
        //            label: "NAME",
        //            sortable: true
        //        },
        //        RTS: {
        //            label: "RTS",
        //            sortable: true
        //        },
        //        PB: {
        //            label: "PB",
        //            sortable: true
        //        },
        //        PP: {
        //            label: "PP",
        //            sortable: true
        //        },
        //        OR_BOOK: {
        //            label: "OR BOOK",
        //            sortable: true
        //        },
        //        OP: {
        //            label: "OR PAGE",
        //            sortable: true
        //        }

        //    },
        //    dgridSort: [{ attribute: "CNVYDSGNTR", descending: false }],
        //    minChars: 3
        //},
        //{
        //    description: 'Find by OR Book/Page',
        //    help: "Enter using format of OR_BK/OR_PG. ",
        //    url: 'http://' + GISServerName + '/arcgis/rest/services/mapapp/cama/MapServer/5',
        //    where: "OR_BK + '/' + OR_PG LIKE '%${0}%'",
        //    outFields: ['JOIN_STRAP', 'OR_BK', 'OR_PG'],
        //    dgridColumns: {
        //        JOIN_STRAP: {
        //            label: "STRAP",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        OR_BK: {
        //            label: "BOOK",
        //            sortable: true
        //            //className: "WDTH120"
        //        },
        //        OR_PG: {
        //            label: "PAGE",
        //            sortable: true
        //            //className: "WDTH120"
        //        }
        //    },
        //    dgridSort: [
        //        { attribute: "OR_BK", descending: false },
        //        { attribute: "OR_PG", descending: false },
        //        { attribute: "JOIN_STRAP", descending: false }
        //    ],
        //    minChars: 3
        //}
	]
});
function ParamlessDemoDriver() {
    this.countries = null;
    this.view_definition = null;
    this.view_object = null;
    this.prepareListOfCountries();
    this.prepareViewDefinition();
}

ParamlessDemoDriver.prototype.onParamChange = function (name) {
    if (name == "param1") {
        this.view_object.setParamValue(
            "param2",
            this.view_object.getParamValue("param1")
        );
    }
}

ParamlessDemoDriver.prototype.registerView = function (view) {
    this.view_object = view;
}

ParamlessDemoDriver.prototype.getViewDefinition = function (callback) {
    callback(this.view_definition);
}

ParamlessDemoDriver.prototype.getParamValues = function (name, search, callback) {
    if (name === "param3" || name === "param3x") {
        callback([
            { value: "v1", caption: "Value 1" },
            { value: "v2", caption: "Value 2" },
            { value: "v3", caption: "Value 3" }
        ]);
    } else if (name === "param2") {
        if (!search) return callback([]);
        serach = search.trim().toLowerCase();
        var options = this.countries
            .filter(function (x) { return x.lcname.indexOf(search) >= 0; });
        callback(options.map(function (x) { return x.name; }));
    }
}

ParamlessDemoDriver.prototype.getDrawData = function (options, callback) {
    var length_in_days = 145;
    var ts = new Date();
    ts = new Date(ts.getTime() - length_in_days * 24 * 60 * 60 * 1000);

    var res = {
        timeseries: [],
        timepoints: [],
        scatterseries: [],
        dataseries: []
    };

    var ts1 = [];
    var ts2 = [];
    var ts3 = [];
    var ds1 = [];
    var ds2 = [];
    var r1 = [];
    var tp1 = [];
    var tp2 = [];
    var d = ts.getTime();
    var ts1_curr = 1;
    var ts2_curr = 2;
    var ts3_curr = 3;
    for (var i = 0; i <= length_in_days; i++) {
        //d += 24 * 60 * 60 * 1000; // advance single day
        d += 15 * 60 * 1000; // advance 15 min
        ts1.push({ epoch: d, val: ts1_curr });
        ts2.push({ epoch: d, val: ts2_curr });
        ts3.push({ epoch: d, val: ts3_curr });
        ts1_curr += 0.5 * (Math.random() - 0.5);
        ts2_curr += 0.2 * (Math.random() - 0.5);
        ts3_curr += 0.1 * (Math.random() - 0.5);
        ts1_curr = Math.max(ts1_curr, 0);
        ts2_curr = Math.max(ts2_curr, 0);
        ts3_curr = Math.max(ts3_curr, 0);

        if (i % 3 == 2) {
            tp1.push({ epoch: d, title: "Event A " + i });
        }
        if (i % 6 == 2) {
            tp2.push({ epoch: d - 7 * 60 * 60 * 1000, title: "Event B " + i });
        }
        r1.push({ x: ts1_curr, y: ts2_curr });
    }

    this.countries.slice(0, 10)
        .forEach(function (x) {
            ds1.push({ name: x.name, val: x.name.length });
        });
    ds2.push({ name: "Total", val: 100, status: "ok" });
    ds2.push({ name: "New", val: 0, status: "ok" });
    ds2.push({ name: "Errors", val: 5, status: "warning" });

    res.timeseries.push({ name: "s1", values: ts1 });
    res.timeseries.push({ name: "s2", values: ts2 });
    res.timeseries.push({ name: "s3", values: ts3 });
    res.timepoints.push({ name: "p1", values: tp1 });
    res.timepoints.push({ name: "p2", values: tp2 });
    res.dataseries.push({ name: "c1", values: ds1 });
    res.dataseries.push({ name: "c2", values: ds2 });
    res.scatterseries.push({ name: "r1", values: r1 });

    callback(null, res);
}

//////////////////////////////////////////////////////////////////////////////////////

ParamlessDemoDriver.prototype.prepareViewDefinition = function (callback) {
    var res = {
        title: "Demo dashboard",
        hide_sidebar: true,
        parameters: [],
        blocks: [
            {
                panels: [
                    {
                        widgets: [
                            {
                                type: "kpi",
                                title: "Widget KPI",
                                dataseries: ["c2"],
                                options: {
                                }
                            },
                            {
                                title: "Widget 1",
                                help: "An example of a time-series plot with a label for y axis",
                                timeseries: ["s1"],
                                options: {
                                    height: 100,
                                    y_axis_label: "Some label"
                                }
                            },
                            {
                                title: "Widget 1x",
                                help: "A second example of time-series plot",
                                timeseries: ["s2"],
                                options: {
                                    height: 100
                                }
                            },
                            {
                                title: "Widget with fixed y-domain",
                                timeseries: ["s1", "s2"],
                                options: {
                                    height: 100,
                                    ydomain_min: 0,
                                    ydomain_max: 10
                                }
                            },
                            {
                                type: "histogram",
                                dataseries: ["c1"],
                                options: {
                                    height: 200,
                                    margin_bottom: 100,
                                    y_axis_label: "Some label"
                                }
                            },
                            {
                                type: "scatterplot",
                                title: "Scatter plot",
                                scatterseries: ["r1"],
                                options: {
                                    height: 200,
                                    x_axis_label: "Random X",
                                    y_axis_label: "Random Y"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    this.view_definition = res;
}


ParamlessDemoDriver.prototype.prepareListOfCountries = function () {

    var countries = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua And Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia And Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo",
        "Congo, The Democratic Republic Of The",
        "Cook Islands",
        "Costa Rica",
        "Cote D'ivoire",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "East Timor",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands (malvinas)",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guinea",
        "Guinea-bissau",
        "Guyana",
        "Haiti",
        "Heard Island And Mcdonald Islands",
        "Holy See (vatican City State)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran, Islamic Republic Of",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakstan",
        "Kenya",
        "Kiribati",
        "Korea, Democratic People's Republic Of",
        "Korea, Republic Of",
        "Kosovo",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libyan Arab Jamahiriya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia, The Former Yugoslav Republic Of",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia, Federated States Of",
        "Moldova, Republic Of",
        "Monaco",
        "Mongolia",
        "Montserrat",
        "Montenegro",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "Netherlands Antilles",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestinian Territory, Occupied",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Reunion",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Saint Helena",
        "Saint Kitts And Nevis",
        "Saint Lucia",
        "Saint Pierre And Miquelon",
        "Saint Vincent And The Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome And Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia And The South Sandwich Islands",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard And Jan Mayen",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan, Province Of China",
        "Tajikistan",
        "Tanzania, United Republic Of",
        "Thailand",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad And Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks And Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "United States Minor Outlying Islands",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Viet Nam",
        "Virgin Islands, British",
        "Virgin Islands, U.s.",
        "Wallis And Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];
    this.countries = countries.map(function (x) {
        return { name: x, lcname: x.toLowerCase() };
    })
}

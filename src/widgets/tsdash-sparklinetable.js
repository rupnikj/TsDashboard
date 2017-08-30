TsDashboard = TsDashboard || {};
TsDashboard.Widgets = TsDashboard.Widgets || {};

TsDashboard.Widgets.getDateTimeString = function (d) {
    if (!d) {
        d = new Date();
    }
    return moment(d).format('YYYY-MM-DD hh:mm:ss');
}

TsDashboard.Widgets.drawSparklineTable = function (config) {
    var p = {
        chart_div: "#someChart",
        data: null,
        spark_height: 15,
        columns: 3,
        title_clip_prefix: null,
        title_clip_after: null,
        col_names: null,
        first_col_width: 150
    };

    // If we have user-defined parameters, override the defaults.
    if (config !== "undefined") {
        for (var prop in config) {
            p[prop] = config[prop];
        }
    }
    if (p.col_names == null) {
        p.col_names = [];
        for (var i = 0; i < p.columns; i++) {
            p.col_names.push("");
        }
    }

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse;
    // create a line function that can convert data[] into x and y points
    var sparkline = d3.svg.line()
        .interpolate("linear")
        .x(function (d) { return xscale(d.epoch); })
        .y(function (d) { return yscale(d.val); });
    // Bands area
    var bandsarea = d3.svg.area()
        .x(function (d) { return xscale(d.epoch); })
        .y0(function (d) { return yscale(d.val); })
        .y1(function (d) { return yscale(0); });

    // remove the previous drawing
    $(p.chart_div).empty();

    var data = p.data;
    var colNo = p.columns;
    var rowNo = Math.floor((p.data.length - 1) / colNo) + 1;

    // create headers
    var thead = $("<thead></thead>");
    var theadtr = $("<tr></tr>");
    for (var i = 0; i < p.col_names.length; i++) {
        var csswidth = i == 0 ? " style='white-space:nowrap' " : "";
        theadtr.append("<th" + csswidth + ">" + p.col_names[i] + "</th>");
    }
    thead.append(theadtr);

    // create body
    var tbody = $("<tbody></tbody>");

    // combine into a table
    var table = $("<table class=\"table\"></table>");
    table.append(thead);
    table.append(tbody);
    $(p.chart_div).append(table);

    // style
    $(p.chart_div).css('overflow', 'auto');
    $(p.chart_div).css('height', p.height);
    $(p.chart_div).css('margin-bottom', p.margin_bottom);

    for (var i = 0; i <= rowNo; i++) {
        // create row
        var row = $("<tr></tr>");
        tbody.append(row);
        // add columns
        for (var j = 0; j < colNo; j++) {
            var dataIdx = i * colNo + j;
            if (dataIdx >= p.data.length) continue;
            var datum = data[dataIdx].values;
            var title = data[dataIdx].title;
            var pipeline = data[dataIdx].pipeline;
            var url = data[dataIdx].url;

            if (j == 0) {
                var ctitle = title;
                if (p.title_clip_after != null) {
                    p.title_clip_after.forEach(function (val) {
                        if (ctitle.indexOf(val) >= 0) {
                            ctitle = ctitle.substring(0, ctitle.indexOf(val));
                        }
                    });
                }
                if (p.title_clip_prefix != null) {
                    if (ctitle.startsWith(p.title_clip_prefix) >= 0) {
                        ctitle = ctitle.substr(p.title_clip_prefix.length);
                    }
                }
                var titleTd = $("<td style='background-color:black !important; width:" + p.first_col_width
                    + "px; word-break:break-all;'>" + ctitle + "</td>");
                row.append(titleTd);
            }
            var imgTd = $("<td " + url + " style='background-color:black !important; border-left: thin solid #282828; width:"
                + ((table.width() - p.first_col_width) / colNo).toFixed() + "px;'></td>");
            var imgDiv = document.createElement("div");
            imgTd.append(imgDiv);
            row.append(imgTd);

            var width = imgTd.width();

            datum.forEach(function (d) {
                d.date = TsDashboard.Widgets.getDateTimeString(d.epoch);
            });
            // xscale will fit all values from data.date within pixels 0-width
            var xscale = d3.time.scale()
                .domain([d3.min(datum, function (d) { return d.epoch; }),
                d3.max(datum, function (d) { return d.epoch; })])
                .range([0, width]);
            // yscale will fit all walues from data.val within pixels 0-width
            var yscale = d3.scale.linear()
                .domain([d3.min(datum, function (d) { return d.val; }),
                d3.max(datum, function (d) { return d.val; })])
                .range([p.spark_height, 0]);


            var svg = d3.select(imgDiv)
                .append("svg")
                .attr("width", width)
                .attr("height", p.spark_height);
            svg.append("path")
                .attr("d", sparkline(datum))
                .attr("stroke", "#147BB1")
                .style("stroke-width", 1.0)
            svg.append("path")
                .style("fill", "#147BB1")
                .style("fill-opacity", 0.8)
                .style("stroke", "none")
                .attr("fill", "#147BB1")
                .attr("d", bandsarea(datum));
        }
    }
}

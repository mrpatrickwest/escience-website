/**
 * Created by westp on 3/6/17.
 */

function displayDescription() {
    displayItem(themeQuery, "https://tw.rpi.edu/xslt/escience/escience-description.xsl", "description");
}

function displayItem(query, xslt, id) {
    var endpoint = "https://tw.rpi.edu/endpoint/books?query=" + encodeURIComponent(query);
    $.ajax(endpoint, {
        type: "get",
        dataType: "xml",
        success: function(data, status) {
            translateXml(data, xslt, id);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log("query failed " + JSON.stringify(xhr));
        }
    });
};

function translateXml(xml, xslt, id) {
    $.ajax(xslt, {
        type: "get",
        dataType: "text",
        success: function(data, status) {
            var xsl = $.parseXML(data);
            translateWithXSLT(xsl, xml, id);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log("getting xslt failed " + JSON.stringify(xhr));
        }
    });
}

function translateWithXSLT(xsl, xml, id) {
    //console.log("got back " + xml);
    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    var description = xsltProcessor.transformToFragment(xml, document);
    //console.log("appending result " + description + " to " + id);
    $("#" + id).append(description);
}

function getProjectNames() {
    var endpoint = "https://tw.rpi.edu/endpoint/books?query=PREFIX+tw%3A+%3Chttp%3A%2F%2Ftw.rpi.edu%2Fschema%2F%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+time%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Ftime%23%3E%0D%0A%0D%0Aselect+%3Fname+where%0D%0A%7B%0D%0A%3Fproject+a+foaf%3AProject+.%0D%0A%3Fproject+tw%3AhasThemeReference+%3Chttp%3A%2F%2Ftw.rpi.edu%2Finstances%2FSemanticeScience%3E+.%0D%0A%3Fproject+tw%3AhasAcronym+%3Fname+.%0D%0A%7D+ORDER+BY+%3Fname&stylesheet=%2Fendpoint%2Fxml-to-html.xsl&output=json";
    $.ajax(endpoint, {
        type: "get",
        dataType: "json",
        success: function(data, status) {
            if(data.results && data.results.bindings) {
                var bindings = data.results.bindings;
                for(i = 0; i < bindings.length; i++) {
                    var name = bindings[i].name.value;
                    name = name.replace(/\s+/g, '-').toLowerCase();
                    var html = [
                        '<div class="project">',
                        '    <div class="project-descript" id="' + name + '-descript">',
                        '        <div class="project-description" id="' + name + '-description"></div>',
                        '    </div>',
                        '    <div class="project-info" id="' + name + '-info">',
                        '        <div class="project-people" id="' + name + '-people">',
                        '        </div>',
                        '        <div class="project-sponsors" id="' + name + '-sponsors">',
                        '        </div>',
                        '    </div>',
                        '</div>'
                    ].join('');
                    $("#projects").append(html);
                }
                getDescriptions(data.results.bindings);
                getPeople(data.results.bindings);
                getSponsors(data.results.bindings);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log("failed to get projects " + JSON.stringify(xhr));
        }
    });
}

// projects is the list of projects associated with this theme
function getDescriptions(projects) {
    for(i = 0; i < projects.length; i++) {
        var name = projects[i].name.value;
        var query = themeProjectQuery.replace("PROJECT_NAME", name);
        var xslt = "https://tw.rpi.edu/xslt/escience/escience-project-description.xsl";
        name = name.replace(/\s+/g, '-').toLowerCase();
        var id = name + "-descript";
        displayItem(query, xslt, id);
    }
}

// projects is the list of projects associated with this theme
function getPeople(projects) {
    for(var i = 0; i < projects.length; i++) {
        var projectName = projects[i].name.value;
        //console.log("getting people for " + projectName);
        var endpoint = "https://tw.rpi.edu/endpoint/books?output=json&query=";
        endpoint += encodeURIComponent(projectPIQuery.replace("PROJECT_NAME", projectName));
        $.ajax(endpoint, {
            type: "get",
            context: projectName,
            dataType: "json",
            success: function (data, status) {
                //console.log("got back people info " + JSON.stringify(data));
                if (data.results && data.results.bindings) {
                    var bindings = data.results.bindings;
                    if(bindings.length > 0) {
                        var html = '<div class="heading">Investigators</div>';
                        html += '<ul class="ulist">';
                        for (var j = 0; j < bindings.length; j++) {
                            var name = bindings[j].name.value;
                            var page = bindings[j].page.value;
                            html += '<li class="ulist-item"><a href="' + page + '">' + name + '</a></li>';
                        }
                        html += '</ul>';
                        var pName = this.replace(/\s+/g, '-').toLowerCase();
                        $("#" + pName + "-people").append(html);
                    }
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("failed to get people for project " + projectName + ": " + JSON.stringify(xhr));
            }
        })
    }
}

// projects is the list of projects associated with this theme
function getSponsors(projects) {
    for(var i = 0; i < projects.length; i++) {
        var projectName = projects[i].name.value;
        console.log("getting sponsors for " + projectName);
        var endpoint = "https://tw.rpi.edu/endpoint/books?output=json&query=";
        endpoint += encodeURIComponent(projectSponsorQuery.replace("PROJECT_NAME", projectName));
        $.ajax(endpoint, {
            type: "get",
            context: projectName,
            dataType: "json",
            success: function (data, status) {
                console.log("got back sponsors info " + JSON.stringify(data));
                if (data.results && data.results.bindings) {
                    var bindings = data.results.bindings;
                    if(bindings.length > 0) {
                        var html = '<div class="heading sponsor-heading">Sponsors</div>';
                        for (var j = 0; j < bindings.length; j++) {
                            var name = bindings[j].name.value;
                            console.log("name = " + name);
                            var page = bindings[j].page.value;
                            console.log("page = " + page);
                            var logo = bindings[j].logo.value;
                            console.log("logo = " + logo);
                            var acronym = bindings[j].acronym.value;
                            console.log("acronym = " + acronym);
                            html += '<div class="projspons">';
                            if (logo && logo != "") {
                                html += '<div class="projspons-imgdiv">';
                                html += '<img class="projspons-img" src="' + logo + '">';
                                html += '</div>';
                                html += '<div class="projspons-name">';
                                html += '<a href="' + page + '">' + name + '</a>';
                                html += '</div>';
                            } else if(acronym && acronym != "") {
                                html += '<div class="projspons-name">';
                                html += '<a href="' + page + '">' + acronym + '</a>';
                                html += '</div>';
                            } else {
                                html += '<div class="projspons-name">';
                                html += '<a href="' + page + '">' + name + '</a>';
                                html += '</div>';
                            }
                            html += '</div>';
                        }
                        var pName = this.replace(/\s+/g, '-').toLowerCase();
                        $("#" + pName + "-sponsors").append(html);
                    }
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("failed to get people for project " + projectName + ": " + JSON.stringify(xhr));
            }
        })
    }
}

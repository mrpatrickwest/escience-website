/**
 * Created by westp on 2/8/17.
 */
var themeQuery = [
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'PREFIX owl: <http://www.w3.org/2002/07/owl#>',
    'PREFIX tw: <http://tw.rpi.edu/schema/>',
    'PREFIX twi: <http://tw.rpi.edu/instances/>',
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX time: <http://www.w3.org/2006/time#>',
    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
    'DESCRIBE <http://tw.rpi.edu/instances/SemanticeScience>'
].join('');

var themeProjectQuery = [
'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
'PREFIX owl: <http://www.w3.org/2002/07/owl#>',
'PREFIX tw: <http://tw.rpi.edu/schema/>',
'PREFIX twi: <http://tw.rpi.edu/instances/>',
'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
'PREFIX time: <http://www.w3.org/2006/time#>',
'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
'DESCRIBE ?project ?logo',
'WHERE {',
'?project tw:hasAcronym ?name .',
'FILTER (str(?name)="PROJECT_NAME") .',
'?project rdf:type foaf:Project .',
'?project tw:hasThemeReference twi:SemanticeScience .',
'OPTIONAL {',
'?project foaf:logo ?logo .',
'}',
'}'
].join('');

var projectPIQuery = [
'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
' PREFIX owl: <http://www.w3.org/2002/07/owl#>',
' PREFIX tw: <http://tw.rpi.edu/schema/>',
' PREFIX twi: <http://tw.rpi.edu/instances/>',
' PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
' PREFIX time: <http://www.w3.org/2006/time#>',
' PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
' SELECT ?name ?page',
' WHERE {',
' ?project tw:hasAcronym ?acronym .',
' FILTER (str(?acronym)="PROJECT_NAME") .',
' ?project tw:hasAgentWithRole ?role .',
' ?person tw:hasRole ?role .',
' { ?role rdf:type tw:PrincipalInvestigator . } UNION { ?role rdf:type tw:CoInvestigator . }',
' ?person a foaf:Person .',
' OPTIONAL {',
' ?role tw:hasDateTimeCoverage ?duration .',
' ?duration tw:asEnd ?ending .',
' }',
' FILTER ( ! BOUND (?ending) )',
' ?person tw:page ?page .',
' ?person foaf:name ?name .',
' OPTIONAL { ?person foaf:lastName ?lname . }',
' } ORDER BY ?lname'
].join('');

var projectSponsorQuery = [
'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
' PREFIX owl: <http://www.w3.org/2002/07/owl#>',
' PREFIX tw: <http://tw.rpi.edu/schema/>',
' PREFIX twi: <http://tw.rpi.edu/instances/>',
' PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
' PREFIX time: <http://www.w3.org/2006/time#>',
' PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
' SELECT ?name ?page ?acronym ?logo',
' WHERE {',
' ?project tw:hasAcronym ?projacronym .',
' FILTER (str(?projacronym)="PROJECT_NAME") .',
' ?project tw:hasSponsor ?sponsor .',
' ?sponsor foaf:name ?name .',
' ?sponsor tw:page ?page .',
' OPTIONAL { ?sponsor tw:hasAcronym ?acronym . }',
' OPTIONAL { ?sponsor foaf:logo ?logo }',
' } ORDER BY ?name'
].join('');


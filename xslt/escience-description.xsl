<?xml version="1.0"?>
<!DOCTYPE xsl:stylesheet [
        <!ENTITY tw "http://tw.rpi.edu/schema/">
        <!ENTITY here "http://tw.rpi.edu/instances/">
        <!ENTITY foaf "http://xmlns.com/foaf/0.1/">
        ]>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
                xmlns:tw="&tw;"
                xmlns:time="http://www.w3.org/2006/time#"
                xmlns:owl="http://www.w3.org/2002/07/owl#"
                xmlns:s="http://www.w3.org/2005/sparql-results#"
                xmlns:exsl="http://exslt.org/common"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:foaf="&foaf;"
                xmlns:dc="http://purl.org/dc/terms/"
                xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:key name="tw:Theme-nodes"
             match="tw:Theme|*[rdf:type/@rdf:resource='&tw;Theme']"
             use="@rdf:about"/>

    <xsl:template name="get-theme-description">
        <xsl:param name="themeuri"/>
        <xsl:variable name="theme" select="key('tw:Theme-nodes',$themeuri)"/>
        <xsl:copy-of select="$theme/dc:description"/>
    </xsl:template>

    <xsl:template match="/">
        <xsl:call-template name="get-theme-description">
            <xsl:with-param name="themeuri">http://tw.rpi.edu/instances/SemanticeScience</xsl:with-param>
        </xsl:call-template>
    </xsl:template>
</xsl:stylesheet>

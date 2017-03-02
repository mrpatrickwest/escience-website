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
                xmlns:tw="http://tw.rpi.edu/schema/"
                xmlns:time="http://www.w3.org/2006/time#"
                xmlns:owl="http://www.w3.org/2002/07/owl#"
                xmlns:s="http://www.w3.org/2005/sparql-results#"
                xmlns:exsl="http://exslt.org/common"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:foaf="http://xmlns.com/foaf/0.1/"
                xmlns:dc="http://purl.org/dc/terms/"
                xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="foaf:Project|*[rdf:type/@rdf:resource='&foaf;Project']"
                  mode="display">
        <xsl:param name="root" select="/"/>
        <xsl:variable name="project" select="."/>
        <xsl:variable name="logo">
            <xsl:choose>
                <xsl:when test="$project/foaf:logo/rdfs:Resource">
                    <xsl:value-of select="$project/foaf:logo/rdfs:Resource/@rdf:about"/>
                </xsl:when>
                <xsl:when test="$project/foaf:logo/@rdf:resource">
                    <xsl:value-of select="$project/foaf:logo/@rdf:resource"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>https://tw.rpi.edu/web/tw-logo-v2.png</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <div class="project-logo-name">
            <div class="project-logo"><img class="project-img" src="{$logo}"/></div>
            <xsl:if test="foaf:name">
                <div class="project-name"><xsl:value-of select="foaf:name"/></div>
            </xsl:if>
        </div>
        <div class="project-description">
            <xsl:value-of select="$project/tw:hasShortDescription"/>
        </div>
    </xsl:template>

    <xsl:template match="rdf:RDF">
        <xsl:apply-templates select="//foaf:Project|//*[rdf:type/@rdf:resource='&foaf;Project']" mode="display"/>
    </xsl:template>

    <xsl:template match="/">
        <xsl:apply-templates select="rdf:RDF"/>
    </xsl:template>
</xsl:stylesheet>


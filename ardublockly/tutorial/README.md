# KniwwelinoBlockly Tutorial

The tutorial tool is a visual help to start using KniwwelinoBlockly. It relies on tutorial data available on a dokuwiki.

## Browser Cross Domain Scripting (CORS)

The tutorial needs to access a dokuwiki usually deployed on another domain/subdomain, that's cross domain scripting. To avoid cross domain scripting limitation the dokuwiki server as to be configured to allow cross domain scripting.
Here is an apache server configuration example on dokuwiki side :

```
Header set Access-Control-Allow-Origin "{url of dokuwiki like: https://code.kniwwelino.lu}"
Header set Access-Control-Allow-Headers "Content-Type, origin, accept"
Header set Access-Control-Allow-Methods "POST, GET"
Header set Access-Control-Expose-Headers "Location"

RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ /CORS.html [QSA,L]
```

A file named CORS.html file as to be created in the root folder as defined in the configuration above or created somewhere else with another name. This file is needed to avoid 404 on preflight requests. Ideally this file could contain HTML content (just in case of a WAF-like network element is checking the content regarding the content type...):

```
<html><head></head><body></body></html>
```

## URL parameters

**tuto**: the dokuwiki relative path of the tutorial to use.

example for en/tutorial/tutorial1:

```
?tuto=en%2Ftutorial%2Ftutorial1
```

## Dokuwiki structure

Example of structure in the english (en) namespace:

```
en
    tutorial
        tutorial1
            description
            level1
            step1
                description
                solution
                solution1
        tutorial2
            description
            level2
            step1
                description
                solution
            step2
                description
                solution1
                solution2
```

A Tutorial should have:
 
- a description (HTML file) with at least one image (for the index page)
- one or more steps
- optional: a difficulty level 

Each steps should have:
- a descrition (HTML file)
- one or multiple XML solutions

## VALIDATION

Current validation is starting from the lowest xml depth.

Validation is performed automatically and on-demand.

Automatic feedback is provided by:

- highlighting identical blocks
- a pop-up when everything is correct

On-demand feedback is provided by clicking the correcponding button :

- a pop-up with some analysis result:

    - number of blocks with the correct type name
    - number of missing blocks
    - number of extra blocks
    - number of blocks that perfectly fit

## Used libraries

- requirejs: MIT (through a bootstrap as long as all other parts of KniwwelinoBlockly are not using requirejs)
    - text: MIT
    - json: MIT
- jQuery: MIT
- canvasloader: MIT
- vkBeautify: MIT
- zlib.js: MIT

## TODO

Nice to have:

- restart feature
- save tutorial+workspace state
- validate partial branches with specific highlighting color for correct block sequences


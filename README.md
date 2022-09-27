
# Org chart generator 📝  
Org chart generator written in plain javascript.

Codes are written in ES2015+ (ES6+) if you want to support ancient browsers you can use babel.

In addition, ecmascript module(ESM) structure is used.

## Get Started 🚀
## Basic Usage/Example without NPM
~~~html  
<!DOCTYPE html>
<html>
    <head>
        <title>Org Chart Basic Example</title>
    </head>
    <body>
        <div id="example">
            <button id="zoomInBtn">Zoom In</button>
            <button id="zoomOutBtn">Zoom Out</button>
            
            <div id="svgAdd" style="width: 500px;">
                
            </div>
        </div>
        <script type="module">
            import {OrgChart} from './src/modules/OrgChart.js';

            //---OPTIONS

            // OPTION 1 -> import with esm module
            import Example_Data from './Example_Data.json' assert {type: 'json'};


            // OPTION 2 -> import with fetch (http get method)
            
            /*let response = await fetch(url);

            if (response.ok) { // if HTTP-status is 200-299
                // get the response body (the method explained below)
                let Example_Data = await response.json();
            } 
            else {
                alert("HTTP-Error: " + response.status);
            }*/


            //OPTION 3 -> Static Data
            /*
            const Example_Data=[
            
                {
                    "Id":"1",
                    "Name":"A1",
                    "ParentId":null
                },
                {
                    "Id":"2",
                    "Name":"A2",
                    "ParentId":null
                },
                {
                    "Id":"3",
                    "Name":"A3",
                    "ParentId":null
                },
                {
                    "Id":"4",
                    "Name":"B1",
                    "ParentId":["1","2","3"]
                },
                {
                    "Id":"5",
                    "Name":"C1",
                    "ParentId":["4"]
                }, 
                {
                    "Id":"6",
                    "Name":"C2",
                    "ParentId":["4"]
                }
            ]*/

            const newOrgChart = new OrgChart({
                WhereToAdd:"#svgAdd",
                JSON_Data:Example_Data
            })
        
            document.getElementById("zoomInBtn").addEventListener("click", function() {
                var old = document.getElementById("svgAdd").offsetWidth;
                document.getElementById("svgAdd").style.width = (old +100)+"px";
            });

            document.getElementById("zoomOutBtn").addEventListener("click", function() {              
                var old = document.getElementById("svgAdd").offsetWidth;
                document.getElementById("svgAdd").style.width = (old -100)+"px";
            });

        </script>
    </body>
</html>
~~~  

## Example json format 🔥  
~~~json 
[
    {
        "Id":"1",
        "Name":"A1",
        "ParentId":null
    },
    {
        "Id":"2",
        "Name":"A2",
        "ParentId":null
    },
    {
        "Id":"3",
        "Name":"A3",
        "ParentId":null
    },
    {
        "Id":"4",
        "Name":"B1",
        "ParentId":["1","2","3"]
    },
    {
        "Id":"5",
        "Name":"C1",
        "ParentId":["4"]
    }, 
    {
        "Id":"6",
        "Name":"C2",
        "ParentId":["4"]
    }
]
~~~  

## Methods to pull json data. You can pull from your own server in different ways.🔥  

### Option 1 
~~~json 
//import with esm module
import Example_Data from './Example_Data.json' assert {type: 'json'};
~~~  
### Option 2 
~~~json 
//import with fetch (http get method)      
let response = await fetch(url);

if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let Example_Data = await response.json();
} 
else {
    alert("HTTP-Error: " + response.status);
}
~~~  


    
## The library I used to generate the colors✨  
Thank you jsrdescamps
https://www.cssscript.com/generating-color-palettes-with-pure-javascript-jpalette/


 

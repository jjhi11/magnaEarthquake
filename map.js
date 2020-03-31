
    
    require([
      // ArcGIS
      "esri/Map",
      "esri/views/MapView",
      "esri/views/SceneView",
      "esri/layers/FeatureLayer",
      "esri/layers/SceneLayer",
      "esri/layers/ElevationLayer",
      "esri/layers/ImageryLayer",
      "esri/layers/MapImageLayer",
      "esri/layers/SceneLayer",
      "esri/layers/GroupLayer",
      "esri/Ground",
      "esri/core/watchUtils",
      "esri/layers/support/DimensionalDefinition",
      "esri/layers/support/MosaicRule",
      // Widgets
      "esri/widgets/Home",
      "esri/widgets/Zoom",
      "esri/widgets/Compass",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/BasemapToggle",
      "esri/widgets/ScaleBar",
      "esri/widgets/Attribution",
      "esri/widgets/LayerList",
      "esri/widgets/Locate",
      "esri/widgets/NavigationToggle",
      "esri/layers/GraphicsLayer",
      "esri/symbols/SimpleFillSymbol",
      "esri/Graphic",
      "esri/tasks/support/FeatureSet",
      "esri/tasks/support/Query",
      "esri/tasks/QueryTask",
      //DGrid
      "dstore/Memory",
      "dojo/data/ObjectStore",
      "dojo/data/ItemFileReadStore",
      "dojox/grid/DataGrid",
      "dgrid/OnDemandGrid",
      "dgrid/Selection",
      "dgrid/List",
      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",
      // Calcite Maps
      "calcite-maps/calcitemaps-v0.10",
      
      // Calcite Maps ArcGIS Support
      "calcite-maps/calcitemaps-arcgis-support-v0.10",
      "dojo/query",
      "dojo/domReady!"
    ], function(Map, MapView, SceneView, FeatureLayer, SceneLayer, ElevationLayer, ImageryLayer, MapImageLayer, SceneLayer, GroupLayer, Ground, watchUtils, DimensionalDefinition, MosaicRule, Home, Zoom, Compass, Search, Legend, Expand, SketchViewModel, BasemapToggle, ScaleBar, Attribution, LayerList, Locate, NavigationToggle, GraphicsLayer, SimpleFillSymbol, Graphic, FeatureSet, Query, QueryTask, Memory, ObjectStore, ItemFileReadStore, DataGrid, OnDemandGrid, Selection, List, Collapse, Dropdown, CalciteMaps, CalciteMapArcGISSupport, query) {
      /******************************************************************
       *
       * Create the map, view and widgets
       * 
       ******************************************************************/

      var worldElevation = ElevationLayer({
        url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      });
    
    
            bedrockElevation = new ElevationLayer ({
                url: "https://tiles.arcgis.com/tiles/ZzrwjTRez6FJiOq4/arcgis/rest/services/ForgeRasterFromTin/ImageServer"
            });

            magnaScene = new WebScene ({
                portalItem: {
                id: "8df0f2ead6e74ab1969f7f49686f8875"}
    
    
            });

      // Map
    //   var map = new Map({
    //             basemap: "topo",
    //             //ground: "world-elevation",
    //             ground: new Ground({
    //                 layers: [ worldElevation  ],
    //                     navigationConstraint: {
    //                       type: "none"
    //                     }
    //                })
    //         });
      
      // View
      var mapView = new SceneView({
                container: "mapViewDiv",
                map: map,
                center: [-112.08, 40.73],
                zoom: 14.5,
                padding: {
                    top: 50,
                    bottom: 0
                },
                //viewingMode: "local",
                // highlightOptions: {
                //     color: [255, 255, 0, 1],
                //     haloColor: "white",
                //     haloOpacity: 0.9,
                //     fillOpacity: 0.2
                //   },
                ui: {
                    components: []
                }
            });
      // Popup and panel sync
      mapView.when(function(){
        CalciteMapArcGISSupport.setPopupPanelSync(mapView);
      });
      

//layers
      bedrockSymbology = new SceneLayer ({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Extrusion_SubsurfaceOnly/SceneServer",
        title: "Subsurface Bedrock",
        opacity: 0.4,
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }],
    });

    // bedrockSymbology = new SceneLayer ({
    //     url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/ExtrudeBetweenTest_WSL1/SceneServer",
    //     title: "Subsurface Bedrock",
    //     opacity: 0.4,
    //     // elevationInfo: [{
    //     //     mode: "on-the-ground"
    //     // }],
    // });





        boundary = new FeatureLayer ({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/3",
            title: "FORGE Boundary",
            elevationInfo: [{
                mode: "on-the-ground"
            }],
        });

        wells = new FeatureLayer ({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/4",
            title: "Wells",
            elevationInfo: [{
                mode: "on-the-ground"
            }], 
        });

        roads = new FeatureLayer ({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/1",
            title: "Roads",
            elevationInfo: [{
                mode: "on-the-ground"
            }], 
        });

        

      CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);
      // Map widgets
      var home = new Home({
        view: mapView
      });
      mapView.ui.add(home, "top-left");
      var zoom = new Zoom({
        view: mapView
      });
      mapView.ui.add(zoom, "top-left");
      var compass = new Compass({
        view: mapView
      });
      mapView.ui.add(compass, "top-left");
      
      var basemapToggle = new BasemapToggle({
        view: mapView,
        secondBasemap: "satellite"
      });

      // geolocate user position
      var locateWidget = new Locate({
        view: mapView,   // Attaches the Locate button to the view
      });

mapView.ui.add(locateWidget, "top-left");




     
            mapView.map.add(water);




            layerList = new LayerList({
                view: mapView,
                //container: "legendDiv",
                listItemCreatedFunction: function(event) {
                    const item = event.item;
                    //console.log(item);
                    if (item.layer.type != "group") { // don't show legend twice
                        item.panel = {
                            content: "legend",
                            open: true
                        }
                        item.actionsSections = [
                            // [{
                            //     title: "Layer information",
                            //     className: "esri-icon-description",
                            //     id: "information"
                            // }],
                            [{
                                title: "Increase opacity",
                                className: "esri-icon-up",
                                id: "increase-opacity"
                            }, {
                                title: "Decrease opacity",
                                className: "esri-icon-down",
                                id: "decrease-opacity"
                            }]
                        ];
                    }
                }
            });
            
 //legend expand widget
 var expandLegend = new Expand({
    view: mapView,
    content: layerList,
    //group: "top-left",
    expandTooltip: "Expand Legend",
    expanded: false
  })

//legend expand widget
var legend = new Expand({
view: mapView,
content: layerList,
//group: "top-left",
expandTooltip: "Expand Legend",
expanded: true
})

            //layerlist action for opacity
            
            layerList.on("trigger-action", function(event) {
            
                console.log(event);
                
                
                
                // Capture the action id.
                var id = event.action.id;
                
                var title = event.item.title;
                
                if (title === "FORGE Boundary") {
                                    layer = boundary;
                                } else if (title === "Land Ownership") {
                                    layer = landownership;
                                } else if (title === "Wells") {
                                    layer = wells;
                                } else if (title === "Geologic Units") {
                                    layer = geologicUnits;
                                } else if (title === "Roads") {
                                    layer = roads;
                                } else if (title === "PLSS") {
                                    layer = plss;
                                } else if (title === "Field Office") {
                                    layer = office;
                                } else if (title === "Power Line") {
                                    layer = power;
                                } else if (title === "Water Levels") {
                                    layer = waterLevel;
                                } else if (title === "Water Chemistry") {
                                    layer = waterChemistry;
                                } else if (title === "Seismometers") {
                                    layer = seismoms;
                                } else if (title === "Seismicity 1850 to 2016") {
                                    layer = seismicity;
                                } else if (title === "Benchmarks") {
                                    layer = benchmarks;
                                } else if (title === "Isotherms at 1km depth") {
                                    layer = iso1km;
                                } else if (title === "Isotherms at 2km depth") {
                                    layer = iso2km;
                                } else if (title === "Isotherms at 3km depth") {
                                    layer = iso3km;
                                } else if (title === "Isotherms at 4km depth") {
                                    layer = iso4km;
                                } else if (title === "Heat Flow Isotherms") {
                                    layer = heatflow;
                                } else if (title === "Shallow Well Temperatures") {
                                    layer = shallowWells;
                                } else if (title === "Intermediate Well Temperatures") {
                                    layer = intermediateWells;
                                } else if (title === "Deep Well Temperatures") {
                                    layer = deepWells;
                                } else if (title === "Geologic Lines") {
                                    layer = geologicLines;
                                } else if (title === "Geologic Labels") {
                                    layer = geologicLabels;
                                } else if (title === "Geologic Symbols") {
                                    layer = geologicSymbols;
                                }


                if (id === "information") {
                
                  // if the information action is triggered, then
                  // open the item details page of the service layer
                  //window.open(title.url);
                
                layerInformation(title);
                
                
                
                } else                 if (id === "increase-opacity") {
                                    // if the increase-opacity action is triggered, then
                                    // increase the opacity of the GroupLayer by 0.25
                
                                    if (layer.opacity < 1) {
                                        layer.opacity += 0.1;
                                    }
                                } else if (id === "decrease-opacity") {
                                    // if the decrease-opacity action is triggered, then
                                    // decrease the opacity of the GroupLayer by 0.25
                
                                    if (layer.opacity > 0) {
                                        layer.opacity -= 0.1;
                                    }
                                }
                });
            
            
                        // Basemap events
                        query("#selectBasemapPanel").on("change", function(e) {
                            if (e.target.value == "ustopo") {
                                // setup the ustopo basemap global variable.
                                var ustopo = new Basemap({
                                    baseLayers: new TileLayer({
                                        url: "https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"
                                    }),
                                    title: "usTopographic",
                                    id: "ustopo"
                                });
                                mapView.map.basemap = ustopo;
                                // if mapview use basemaps defined in the value-vector=, but if mapview use value=
                            } else if (map.mview == "map") {
                                mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
                            } else { // =="scene"
                                mapView.map.basemap = e.target.value;
                            }
                        });

    // watch for when the screenshot panel is open

    // query(".calcite-panels .panel .panel-collapse").on("show.bs.collapse", function() {
    //     console.log("Screenshot Panel Open");

    // });

//screenshot code

// the button that triggers area selection mode
const screenshotBtn = document.getElementById("screenshotBtn");

// the orange mask used to select the area
const maskDiv = document.getElementById("maskDiv");

// element where we display the print preview
const screenshotDiv = document.getElementById("screenshotDiv");


// add an event listener to trigger the area selection mode
screenshotBtn.addEventListener("click", function() {
  screenshotBtn.classList.add("active");
  mapView.container.classList.add("screenshotCursor");
  let area = null;

  // listen for drag events and compute the selected area
  const dragHandler = mapView.on("drag", function(event) {
    // prevent navigation in the view
    event.stopPropagation();

    // when the user starts dragging or is dragging
    if (event.action !== "end") {
      // calculate the extent of the area selected by dragging the cursor
      const xmin = clamp(
        Math.min(event.origin.x, event.x),
        0,
        mapView.width
      );
      const xmax = clamp(
        Math.max(event.origin.x, event.x),
        0,
        mapView.width
      );
      const ymin = clamp(
        Math.min(event.origin.y, event.y),
        0,
        mapView.height
      );
      const ymax = clamp(
        Math.max(event.origin.y, event.y),
        0,
        mapView.height
      );
      var pixelRatio = 2;
      area = {
        x: xmin,
        y: ymin,
        width: (xmax - xmin) * pixelRatio,
        height: (ymax - ymin) * pixelRatio
      };
      console.log(area);
      // set the position of the div element that marks the selected area
      setMaskPosition(area);
    }
    // when the user stops dragging
    else {
      // remove the drag event listener from the SceneView
      dragHandler.remove();
      // the screenshot of the selected area is taken
      mapView
        .takeScreenshot({ area: area, format: "png" })
        .then(function(screenshot) {
          // display a preview of the image
          showPreview(screenshot);

          // create the image for download
          document.getElementById("downloadBtn").onclick = function() {
            const text = document.getElementById("textInput").value;
            // if a text exists, then add it to the image
            if (text) {
              const dataUrl = getImageWithText(screenshot, text);
              downloadImage(
                "FORGE_Screenshot.png",
                dataUrl
              );
            }
            // otherwise download only the webscene screenshot
            else {
              downloadImage(
                "FORGE_Screenshot.png",
                screenshot.dataUrl
              );
            }
          };

          // the screenshot mode is disabled
          screenshotBtn.classList.remove("active");
          mapView.container.classList.remove("screenshotCursor");
          setMaskPosition(null);
        });
    }
  });

  function setMaskPosition(area) {
    if (area) {
      maskDiv.classList.remove("hide");
      maskDiv.style.left = area.x + "px";
      maskDiv.style.top = area.y + "px";
      maskDiv.style.width = area.width + "px";
      maskDiv.style.height = area.height + "px";
    } else {
      maskDiv.classList.add("hide");
    }
  }

  function clamp(value, from, to) {
    return value < from ? from : value > to ? to : value;
  }
});

// creates an image that will be appended to the DOM
// so that users can have a preview of what they will download
function showPreview(screenshot) {
    console.log(screenshot);
  screenshotDiv.classList.remove("hide");
  // add the screenshot dataUrl as the src of an image element
  const screenshotImage = document.getElementsByClassName(
    "js-screenshot-image"
  )[0];
  screenshotImage.width = screenshot.data.width;
  screenshotImage.height = screenshot.data.height;
  screenshotImage.src = screenshot.dataUrl;
}

// returns a new image created by adding a custom text to the webscene image
function getImageWithText(screenshot, text) {
  const imageData = screenshot.data;

  // to add the text to the screenshot we create a new canvas element
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.height = imageData.height;
  canvas.width = imageData.width;

  // add the screenshot data to the canvas
  context.putImageData(imageData, 0, 0);
  context.font = "20px Arial";
  context.fillStyle = "#000";
  context.fillRect(
    0,
    imageData.height - 40,
    context.measureText(text).width + 20,
    30
  );

  // add the text from the textInput element
  context.fillStyle = "#fff";
  context.fillText(text, 10, imageData.height - 20);

  return canvas.toDataURL();
}

function downloadImage(filename, dataUrl) {
  // the download is handled differently in Microsoft browsers
  // because the download attribute for <a> elements is not supported
  if (!window.navigator.msSaveOrOpenBlob) {
    // in browsers that support the download attribute
    // a link is created and a programmatic click will trigger the download
    const element = document.createElement("a");
    element.setAttribute("href", dataUrl);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } else {
    // for MS browsers convert dataUrl to Blob
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // download file
    window.navigator.msSaveOrOpenBlob(blob, filename);
  }
}
// button to hide the print preview html element
document
  .getElementById("closeBtn")
  .addEventListener("click", function() {
    screenshotDiv.classList.add("hide");
  });


// Load

isResponsiveSize = mapView.widthBreakpoint === "xsmall";
updateView(isResponsiveSize);

// Breakpoints

mapView.watch("widthBreakpoint", function(breakpoint) {
    console.log("watching breakpoint");
    console.log(breakpoint);
  switch (breakpoint) {
    case "xsmall":
      updateView(true);
      break;
    case "small":
    case "medium":
    case "large":
    case "xlarge":
      updateView(false);
      break;
    default:
  }
});

function updateView(isMobile) {
    console.log("Is Mobile");
  setLegendMobile(isMobile);
}


function setLegendMobile(isMobile) {
  var toAdd = isMobile ? expandLegend : legend;
  var toRemove = isMobile ? legend : expandLegend;

  mapView.ui.remove(toRemove);
  mapView.ui.add(toAdd, "top-left");
}


    });

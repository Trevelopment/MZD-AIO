/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: FuelConsumptionCtrl.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: apeter9
 Date: 1-08-2013
 __________________________________________________________________________

 Description: IHU GUI FuelConsumptionCtrl)
  
 Revisions: 
 v0.1 (01-08-2013)  Initial implementation (to 0.3.05 spec) (apeter9)
 v0.2 (02-20-2013)  Changes in layout and bar images (atiwarc)
 v0.3 (03-14-2013)  Implementation of UMP Control panel (atiwarc)
 v0.4 (04-24-2013)  Spec Migration to 3.56 (UMP3 support and Spec changes)(atiwarc)
 v0.5 (05-15-2013)  Go back implementation (atiwarc)
__________________________________________________________________________

 */

log.addSrcFile("FuelConsumptionCtrl.js", "common");
// Alternative logging for development (avoid spew from "common")
//log.addSrcFile("FuelConsumptionCtrl.js", "FuelConsumptionCtrl");
//log.setLogLevel("FuelConsumptionCtrl", "debug");

function FuelConsumptionCtrl(uiaId, parentDiv, controlId, properties)
{    
//    log.debug("FuelConsumptionCtrl constructor called...");

    this.uiaId = uiaId;
    this.parentDiv = parentDiv;
    this.controlId = controlId;
    this.divElt = null;
    this._switchViewButtonCtrl = null;
    this._umpPanelStatus = false;
    this._cumulativeBarValue = null;
    
    this._initialEVMode = new Array();
    /******************************************************/
    /* Values required by _createStructure (before _init) */
    /******************************************************/

    // Total # of bars available in Current Drive Fuel Economy (CDFE) graph
    // (15 historical + 1 slot for new data to be animated into position)
    this._totalCDFEBars = 11;

    // The index of the youngest historical data in the CDFE graph
    this._youngestCDFEDataIdx = this._totalCDFEBars - 2;

    // The index of the slot for new data in the CDFE graph
    this._newCDFEDataIdx = this._totalCDFEBars - 1;
    
    // The current bar of CDFE graph
    this._currentCDFEDataIdx = this._totalCDFEBars;
    /**********************New Initialization of CDFE Bars *************************************************/
    
    this._totalCDFEBarsRight = 6;

    // The index of the youngest historical data in the CDFE graph
    this._youngestCDFEDataIdxRight = this._totalCDFEBarsRight - 2;

    // The index of the slot for new data in the CDFE graph
    this._newCDFEDataIdxRight = this._totalCDFEBarsRight - 1;
    
    /************************End of Initialization of CFER Bars ******************************************/
    
    // Total # of bars (historical + current + new) available in Cumulative Fuel Economy by Reset (CFER) graph
    this._totalCFERBars = 6;
    
    // The index of the youngest historical data in the CFER graph
    this._youngestCFERDataIdx = this._totalCFERBars - 2;

    // The index of the slot for new data in the CFER graph
    this._newCFERDataIdx = this._totalCFERBars - 1;
    
    // The index of the current data in the CFER graph
    this._currentCFERDataIdx = this._totalCFERBars;

    // Has the current CFER data been initialized yet?
    this._currentCFERDataInitialized = false;

    

    // Table of numerical values used in setting CSS styles programmatically 
    // NOTE: Changing these values requires matching changes in SCSS source file!
    this._CSSConstants = 
    {
        //
        // CDFE Graph Constants
        //

        // Width (in pixels) of a bar
        "CDFEGraphBarWidth"         : 21,
        
        // Space between/around bars
        "CDFEGraphBarSpacing"       : 2,
        "CDFEGraphBarMargin"        : 3,

        // Width/height (in pixels) of the visible graph area
        // (no labels, title or "hidden" bar)
        "CDFEGraphVisibleWidth"     : (((this._totalCDFEBars - 1) * 21) +   // Bars
                                        ((this._totalCDFEBars - 1) * 1) +   // Space between bars
                                        (1 * 1)),                           // Left & right margins (e.g. 500)
        "CDFEGraphVisibleHeight"    : 109,

        // Width (in pixels) of the active graph area
        // (including "hidden" bar, but no labels or title)
        "CDFEGraphActiveWidth"      : ((this._totalCDFEBars * 21) +         // Bars
                                        ((this._totalCDFEBars - 1) * 1) +   // Space between bars
                                        (1 * 1)),                           // Left & right margins (e.g. 533)

 /*******************************************New CDFE Graph Constants************************************************/
  //
  // CDFE Graph Constants
  //

  // Width (in pixels) of a bar
  "CDFEGraphBarWidthRight"         : 44,
  // Space between/around bars
  "CDFEGraphBarSpacingRight"       : 3,
  "CDFEGraphBarMarginRight"        : 2,

  // Width/height (in pixels) of the visible graph area
  // (no labels, title or "hidden" bar)
  "CDFEGraphVisibleWidthRight"     : (((this._totalCDFEBarsRight - 1) * 44) +   // Bars
                                  ((this._totalCDFEBarsRight - 2) * 3) +   // Space between bars
                                  (2 * 2)),                           // Left & right margins (e.g. 500)
  "CDFEGraphVisibleHeightRight"    : 109,

  // Width (in pixels) of the active graph area
  // (including "hidden" bar, but no labels or title)
  "CDFEGraphActiveWidthRight"      : ((this._totalCDFEBarsRight * 44) +         // Bars
                                 ((this._totalCDFEBarsRight - 1) * 3) +   // Space between bars
                                 (2 * 2)),                           // Left & right margins (e.g. 533)

/*******************************************End of New CDFE Graph Constants************************************************/

        //
        // CFER Graph Constants
        //

        // Width (in pixels) of a bar
        "CFERGraphBarWidth"         :50,
        
        // Space between/around bars
        "CFERGraphBarSpacing"       : 28,
        "CFERGraphBarMargin"        : 17,

        // Width/height (in pixels) of the visible graph area
        // (including "hidden" bar, but no labels or title)
        "CFERGraphVisibleWidth"     : (((this._totalCFERBars - 1) * 50) +   // Bars
                                        ((this._totalCFERBars - 2) * 28) +  // Space between bars
                                        (1 * 17)),                          // Left & right margins (e.g. 500)
        "CFERGraphVisibleHeight"    : 109,

        // Width (in pixels) of the active graph area
        // (including "hidden" bar, but no labels or title)
        "CFERGraphActiveWidth"      : ((this._totalCFERBars * 50) +         // Bars
                                        ((this._totalCFERBars - 1) * 28) +  // Space between bars
                                        (1 * 17)),                          // Left & right margins (e.g. 580)
    };

    /******************************************************/
    /******************************************************/
    /******************************************************/

    this._cbCDFELineFadeAnimationEnd = null;
    this._cbCDFELeftAnimationEnd = null;
    this._cbCFERLeftAnimationEnd = null;

    this._CDFELineGraphCanvasDC = null;
    this._CDFELineGraphInTransition = false;

    this._CDFEGraphBarValues  = null;
    this._CDFEGraphLineValues = null;
    this._CFERGraphBarValues  = null;
    
    /**************************************Initialization of functions********************************************/
   
    this._cbCDFELineFadeAnimationEndRight = null;
    this._cbCDFELeftAnimationEndRight = null;
    this._cbCFERLeftAnimationEndRight = null;

    this._CDFELineGraphCanvasDCRight = null;
    this._CDFELineGraphInTransitionRight = false;

    this._CDFEGraphBarValuesRight  = null;
    this._CDFEGraphLineValuesRight = null;
    this._CFERGraphBarValuesRight  = null;
    this._CDFEDiscBarValuesRight = null;
    this._CDFEEvModeRight = new Array();
    
    /**************************************End ofInitialization of functions********************************************/
    

    //@formatter:off
    this.properties =
    {
        "subMap"                    : null,
        "mode"                      : "",
        "fuelEfficientyTitleId"     : "",
        "fuelEfficientyTitleText"   : "",
        "switchViewLabelId"         : "",
        "switchViewLabelText"       : "",
        "switchViewButtonCallback"  : null,
        "fuelEfficiencyData"        : null,
        "currentFuelConfig"         : null,
        "cumulativeFuelConfig"      : null,
        "umpButtonConfig" 		   :  null,
        "defaultSelectCallback"    : null,
        "defaultSlideCallback" 	   : null,
        "defaultHoldStartCallback" : null,
        "defaultHoldStopCallback"  : null,
        "dataList" 				   : null,
        "umpStyle" 				   : null,
        "hasScrubber" 			   : false,
        "umpPanelStatus"		   : false
    };
    //@formatter:on

    // Copy properties from the app
    for (var key in properties)
    {
        this.properties[key] = properties[key];
    }

	//preload images 
    this.imagesCount = 0;
	this._preload('FuelConsBar_Narrow.png','FuelConsBar_NarrowCurrent.png','FuelConsBar_NarrowGreen.png', 'FuelConsBar_NarrowGreenCurrent.png', 'FuelConsBar_wide.png', 'FuelConsBar_wide_green.png','FuelConsBar_WideCurrent.png','FuelConsBarCap_Narrow.png','FuelConsBarCap_wide.png','GeneratedEnergy_NarrowCurrent.png','GeneratedEnergy_NarrowGreen.png','GeneratedEnergy_NarrowGreenCurrent.png','GeneratedEnergy_NarrowPurple.png','GeneratedEnergy_Wide_Green.png','GeneratedEnergy_WidePurple.png');
	
    // Create DOM elements
    this._createStructure();
}

/*******************/
/* Private Methods */
/*******************/

FuelConsumptionCtrl.prototype._init = function()
{
//    log.debug("FuelConsumptionCtrl: _init() called...");

    // Historical data displayed by CDFE graph
    this._CDFEGraphBarValues = new Array();
    this._CDFEGraphLineValues = new Array();
    this._CDFEDiscValues = new Array();
    /************************************Historical data displayed by CDFE graph Right***********************************/
    
    this._CDFEGraphBarValuesRight = new Array();
    this._CDFEDiscBarValuesRight = new Array();
    
    /************************************End of Historical data displayed by CDFE graph Right ***********************************/
    // Historical/current data displayed by CFER graph
    this._CFERGraphBarValues = new Array();

    // The callback function used to remove the animation on the CDFE line graph at the end of its fade-in
    this._cbCDFELineFadeAnimationEnd = this._onCDFELineFadeAnimationEnd.bind(this);

    // The callback function used to reset the CDFE graph after left animation (insertion) completes
    this._cbCDFELeftAnimationEnd = this._onCDFELeftAnimationEnd.bind(this);
    
    /**********************************New function Added ****************************************/
    
 // The callback function used to reset the CDFE graph after left animation (insertion) completes
    this._cbCDFELeftAnimationEndRight = this._onCDFELeftAnimationEndRight.bind(this);
    
    /***********************************End of New function ****************************************/

    // The callback function used to reset the CFER graph after left animation (insertion) completes
    this._cbCFERLeftAnimationEnd = this._onCFERLeftAnimationEnd.bind(this);

    // Set the canvas' width & height attributes to match CSS, so pixels are 1:1
    this.CDFELineGraphCanvas.width = this._CSSConstants["CDFEGraphActiveWidth"];
    this.CDFELineGraphCanvas.height = this._CSSConstants["CDFEGraphVisibleHeight"];

    // The drawing context for the CDFE line graph canvas overlay
    this._CDFELineGraphCanvasDC = this.CDFELineGraphCanvas.getContext("2d");

    // Now that the DOM structure is established,
    // set the horizontal positions of the graph bars
    this._setCDFEGraphBarPositions();
    
    /**********************************New Function Added*****************************************/
    
    
    this._setCDFEGraphBarPositionsRight();
    
    
    /********************************End of New Function Added*****************************************/
    
    this._setCFERGraphBarPositions();

    // Set the CDFE graph title text
    this.properties.currentFuelConfig.titleText = this._translateString(this.properties.currentFuelConfig.titleId,
                                                                        this.properties.currentFuelConfig.titleText,
                                                                        this.properties.subMap);
    this.CDFEGraphTitle.innerHTML = this._stringToHTML(this.properties.currentFuelConfig.titleText);


    
    // Set the CFER graph title text
    this.properties.cumulativeFuelConfig.titleText = this._translateString(this.properties.cumulativeFuelConfig.titleId,
                                                                           this.properties.cumulativeFuelConfig.titleText,
                                                                           this.properties.subMap);
    this.CFERGraphTitle.innerHTML = this._stringToHTML(this.properties.cumulativeFuelConfig.titleText);

    // Set the fuel efficiency title text
    this.properties.fuelEfficiencyTitleText = this._translateString(this.properties.fuelEfficiencyTitleId,
                                                                    this.properties.fuelEfficiencyTitleText,
                                                                    this.properties.subMap);
    this.properties.fuelEfficiencyTypeText = this._translateString(this.properties.fuelEfficiencyTypeId,
            this.properties.fuelEfficiencyTypeText,
            this.properties.subMap);

    this.fuelEfficiencyTitle.innerHTML = this._stringToHTML(this.properties.fuelEfficiencyTitleText);
    this.fuelEfficiencyThisDrive.innerHTML = this._stringToHTML(this.properties.fuelEfficiencyTypeText);
    // Initialize the graphs
    this.initializeCurrentDriveFuelGraphRight(this.properties.currentFuelConfig.initialBarValues);
    this.initializeCumulativeFuelGraph(this.properties.cumulativeFuelConfig.initialBarValues);

    // Set the fuel efficiency data
    this.setFuelEfficiency(this.properties.fuelEfficiencyData);
}

FuelConsumptionCtrl.prototype._next = function(count)
{
	this.imagesCount++;
	if(this.imagesCount >= count)
	{
		this.divElt.className = "FuelConsumptionCtrl";
	}
}

FuelConsumptionCtrl.prototype._preload = function()
{
	var images = new Array();
	var prefix = './apps/ecoenergy/controls/FuelConsumption/images/';
	for(var i = 0; i < this._preload.arguments.length; i++)
	{
		images[i] = new Image();
		images[i].src = prefix + this._preload.arguments[i];
		images[i].onload = this._next.bind(this, this._preload.arguments.length);
	}
}

FuelConsumptionCtrl.prototype._createStructure = function()
{
//    log.debug("FuelConsumptionCtrl: _createStructure() called...");

    // Create the div for control
    this.divElt = document.createElement('div');
    this.divElt.className = "FuelConsumptionCtrl FuelConsumptionCtrlHiddenOpacity";
	// Create the div for ump panel	
	this.umpPanelDiv = document.createElement('div');
	//(this.properties.umpPanelStatus) ? this.umpPanelDiv.className = "UmpPanelDivEnable" : this.umpPanelDiv.className = "UmpPanelDivDisable";
	this.umpPanelDiv.className = "UmpPanelDivDisable";
    this.umpPanelDiv.style.left = "-60px";
    // Create the container div for all of the graphs
    this.graphsArea = document.createElement('div');
    this.graphsArea.className = 'FuelConsumptionCtrlGraphsArea';

    /***************************************/
    /* Create DOM structure for CDFE graph */
    /***************************************/

    // CDFE graph top-level DIV
    this.CDFEGraph = document.createElement('div');
    this.CDFEGraph.className = 'FuelConsumptionCtrlCDFEGraph';
    
    /******************************Created New graph Div *****************************************/
    
    // CDFE graph top-level DIV 2
    this.CDFEGraphRight = document.createElement('div');
    this.CDFEGraphRight.className = 'FuelConsumptionCtrlCDFEGraphRight';
    
    /******************************End of Created New graph Div **********************************/

    // CDFE graph X-axis label
    this.CDFEGraphXAxisLabel = document.createElement('div');
    this.CDFEGraphXAxisLabel.className = 'FuelConsumptionCtrlCDFEGraphXAxisLabel';
    this.CDFEGraph.appendChild(this.CDFEGraphXAxisLabel);

    // CDFE graph Y-axis label
    this.CDFEGraphYAxisLabel = document.createElement('div');
    this.CDFEGraphYAxisLabel.className = 'FuelConsumptionCtrlCDFEGraphYAxisLabel';
    this.CDFEGraph.appendChild(this.CDFEGraphYAxisLabel);

    // Add axis labels to CDFE graph
    this._addCDFEGraphAxisLabels(this.CDFEGraphXAxisLabel,
                                 this.CDFEGraphYAxisLabel);

    // CDFE graph title
    this.CDFEGraphTitle = document.createElement('h2');
    this.CDFEGraphTitle.className = 'FuelConsumptionCtrlCDFEGraphTitle';
    this.CDFEGraph.appendChild(this.CDFEGraphTitle);

    // Clipping mask for active CDFE graph area
    this.CDFEGraphClipMask = document.createElement('div');
    this.CDFEGraphClipMask.className = 'FuelConsumptionCtrlCDFEGraphClipMask';
    
    /*****************************************New Mask for CDFE graph*********************************/
    
    // Clipping mask for active CDFE graph Right area
    this.CDFEGraphClipMaskRight = document.createElement('div');
    this.CDFEGraphClipMaskRight.className = 'FuelConsumptionCtrlCDFEGraphClipMaskRight';
    
    /*****************************************End of New Mask for CDFE graph*********************************/

    // Active graphing area for CDFE graph
    this.CDFEGraphArea = document.createElement('div');
    this.CDFEGraphArea.className = 'FuelConsumptionCtrlCDFEGraphArea';

    /***************************************New Active Graphing Area for CDFE graph right***************/
    
    // Active graphing area for CDFE graph Right
    this.CDFEGraphAreaRight = document.createElement('div');
    this.CDFEGraphAreaRight.className = 'FuelConsumptionCtrlCDFEGraphAreaRight';
    
    /***************************************End of Active Graphing Area for CDFE graph right***************/
    // Create CDFE graph bars
    for (var i = 1; i <= this._totalCDFEBars; i++)
    {
        var curCDFEBar = document.createElement('div');
        curCDFEBar.id = 'CDFEBar' + i;
        
        var CDFEBarCap = document.createElement('div');
        CDFEBarCap.className = 'FuelConsumptionCtrlCDFEBarGraphCap';
        
        switch (i)
        {
            case this._newCDFEDataIdx:
            	curCDFEBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
            	 this.CDFECurrentBar = curCDFEBar;
            	 
                break;
            case this._currentCDFEDataIdx:
            	curCDFEBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
            	
                break;
            default:
            	curCDFEBar.className = 'FuelConsumptionCtrlCDFEBarGraphCore';
                break;
        }
        
        curCDFEBar.appendChild(CDFEBarCap);
        this.CDFEGraphArea.appendChild(curCDFEBar);
    }

    /*************************************New CDFE Graph Bars**********************************/
    
 // Create CDFE graph Right bars
    for (var i = 1; i <= this._totalCDFEBarsRight; i++)
    {
        var curCDFEBarRight = document.createElement('div');
        curCDFEBarRight.id = 'CDFEBarRight' + i;
        curCDFEBarRight.className = 'FuelConsumptionCtrlCDFEBarGraphCoreRight';
        var CDFEBarCapRight = document.createElement('div');
        CDFEBarCapRight.className = 'FuelConsumptionCtrlCDFEBarGraphCapRight';
        curCDFEBarRight.appendChild(CDFEBarCapRight);
        this.CDFEGraphAreaRight.appendChild(curCDFEBarRight);
    }
    
    /*************************************End of New CDFE Graph Bars**********************************/
    // Create canvas for drawing line graphs
    this.CDFELineGraphCanvas = document.createElement('canvas');
    this.CDFELineGraphCanvas.id = 'FuelConsumptionCtrlCDFELineGraphCanvas';
    this.CDFELineGraphCanvas.className = 'FuelConsumptionCtrlHiddenCDFELineGraphCanvas';
    this.CDFEGraphArea.appendChild(this.CDFELineGraphCanvas);

    // Attach the active graphing area to the CDEF graph clip mask
    this.CDFEGraphClipMask.appendChild(this.CDFEGraphArea);

    /**************************New CDFE Clip Mask Attach*******************************************/
    
    // Attach the active graphing area to the CDEF graph clip mask
    this.CDFEGraphClipMaskRight.appendChild(this.CDFEGraphAreaRight);
    
    /**************************End of New CDFE Clip Mask Attach*******************************************/
    
    // Attach the clip mask to the CDFE graph
    this.CDFEGraph.appendChild(this.CDFEGraphClipMask);
    
    /**************************New clip mask to the CDFE graph*******************************************/
    
    // Attach the clip mask to the CDFE graph Right
    this.CDFEGraphRight.appendChild(this.CDFEGraphClipMaskRight);
    
    /**************************End of New clip mask to the CDFE graph*******************************************/
    
    // Attach the CDFE graph to its parent
    this.graphsArea.appendChild(this.CDFEGraph);
    
    /**************************New CDFE graph to its parent*******************************************/
    
    // Start stand alone graph for the hev disc graph
    if(this.properties.ctrlStyle === "hevstyle")
    {
    	// CDFE Disc graph top-level DIV
        this.CDFEDiscGraph = document.createElement('div');
        this.CDFEDiscGraph.className = 'FuelConsumptionCtrlCDFEDiscGraph';
    	
    // Clipping Disc mask for active CDFE graph area
        this.CDFEDiscGraphClipMask = document.createElement('div');
        this.CDFEDiscGraphClipMask.className = 'FuelConsumptionCtrlCDFEDiscGraphClipMask';	
    	
     // Active graphing area for CDFE Disc graph
        this.CDFEDiscGraphArea = document.createElement('div');
        this.CDFEDiscGraphArea.className = 'FuelConsumptionCtrlCDFEDiscGraphArea';	
    	
    	 // Create Disc CDFE graph bars
        for (var i = 1; i <= this._totalCDFEBars; i++)
        {
            var curCDFEDiscBar = document.createElement('div');
            curCDFEDiscBar.id = 'CDFEDiscBar' + i;
            
            switch (i)
            {
                case this._newCDFEDataIdx:
                	curCDFEDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrent';
                	this.CDFECurrentDiscBar = curCDFEDiscBar;
                	 
                    break;
                case this._currentCDFEDataIdx:
                	curCDFEDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrent';
                	
                    break;
                default:
                	curCDFEDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCore';
                    break;
            }
            
                        
            
            this.CDFEDiscGraphArea.appendChild(curCDFEDiscBar);
         }
    	
    	// Attach the active graphing area to the CDEF Disc graph clip mask
        this.CDFEDiscGraphClipMask.appendChild(this.CDFEDiscGraphArea);
    	
    	// Attach the clip mask to the CDFE Disc graph
        this.CDFEDiscGraph.appendChild(this.CDFEDiscGraphClipMask);
    	
    	// Attach the CDFE Disc graph to its parent
        this.graphsArea.appendChild(this.CDFEDiscGraph);
        
        
        /************* For the 10 Min bar graph data with Discs *************/
     // CDFE Disc graph top-level DIV
        this.CDFEDiscGraphRight = document.createElement('div');
        this.CDFEDiscGraphRight.className = 'FuelConsumptionCtrlCDFEDiscGraphRight';
    	
    // Clipping Disc mask for active CDFE graph area
        this.CDFEDiscGraphClipMaskRight = document.createElement('div');
        this.CDFEDiscGraphClipMaskRight.className = 'FuelConsumptionCtrlCDFEDiscGraphClipMaskRight';	
    	
     // Active graphing area for CDFE Disc graph
        this.CDFEDiscGraphAreaRight = document.createElement('div');
        this.CDFEDiscGraphAreaRight.className = 'FuelConsumptionCtrlCDFEDiscGraphAreaRight';	
    	
    	 // Create Disc CDFE graph bars
        for (var k = 1; k <= this._totalCDFEBarsRight; k++)
        {
            var curCDFEDiscBarRight = document.createElement('div');
            curCDFEDiscBarRight.id = 'CDFEDiscBarRight' + k;
            curCDFEDiscBarRight.className = 'FuelConsumptionCtrlHevCDFEDiscGraphCoreRight';
            this.CDFEDiscGraphAreaRight.appendChild(curCDFEDiscBarRight);
         }
    	
    	// Attach the active graphing area to the CDEF Disc graph clip mask
        this.CDFEDiscGraphClipMaskRight.appendChild(this.CDFEDiscGraphAreaRight);
    	
    	// Attach the clip mask to the CDFE Disc graph
        this.CDFEDiscGraphRight.appendChild(this.CDFEDiscGraphClipMaskRight);
       
    	// Attach the CDFE Disc graph to its parent
        this.graphsArea.appendChild(this.CDFEDiscGraphRight);
        
    }
    // Attach the CDFE graph to its parent Right
    this.graphsArea.appendChild(this.CDFEGraphRight);
    /**************************End of CDFE graph to its parent*******************************************/

    /***************************************/
    /* Create DOM structure for CFER graph */
    /***************************************/

    // CFER graph top-level DIV
    this.CFERGraph = document.createElement('div');
    this.CFERGraph.className = 'FuelConsumptionCtrlCFERGraph';

    // CFER graph X-axis label
    this.CFERGraphXAxisLabel = document.createElement('div');
    this.CFERGraphXAxisLabel.className = 'FuelConsumptionCtrlCFERGraphXAxisLabel';
    this.CFERGraph.appendChild(this.CFERGraphXAxisLabel);

    // CFER graph Y-axis label
    this.CFERGraphYAxisLabel = document.createElement('div');
    this.CFERGraphYAxisLabel.className = 'FuelConsumptionCtrlCFERGraphYAxisLabel';
    this.CFERGraph.appendChild(this.CFERGraphYAxisLabel);

    // Add axis labels to CFER graph
    this._addCFERGraphAxisLabels(this.CFERGraphXAxisLabel,
                                 this.CFERGraphYAxisLabel);

    // CFER graph title
    this.CFERGraphTitle = document.createElement('h2');
    this.CFERGraphTitle.className = 'FuelConsumptionCtrlCFERGraphTitle';
    this.CFERGraph.appendChild(this.CFERGraphTitle);

    // Clipping mask for active CFER graph area
    this.CFERGraphClipMask = document.createElement('div');
    this.CFERGraphClipMask.className = 'FuelConsumptionCtrlCFERGraphClipMask';

    // Active graphing area for CFER graph
    this.CFERGraphArea = document.createElement('div');
    this.CFERGraphArea.className = 'FuelConsumptionCtrlCFERGraphArea';

    // Create CFER graph bars
    for (var j = 0; j < this._totalCFERBars; j++) {
        var curCFERBar = document.createElement('div');
        curCFERBar.id = 'CFERBar' + (j + 1);
        //var currentValue = document.createElement('div');
        //currentValue.id = 'CFERBarValueCurrent';
        //currentValue.className = 'FuelConsumptionCtrlCFERBarValueCurrent';
        var CFERBarCap = document.createElement('div');
        CFERBarCap.className = 'FuelConsumptionCtrlCFERBarGraphCap';
        switch (j)
        {
            case this._newCFERDataIdx:
                curCFERBar.className = 'FuelConsumptionCtrlCFERBarGraphCore';
                break;
            case this._currentCFERDataIdx:
                curCFERBar.className = 'FuelConsumptionCtrlCFERBarGraphCore';
                
                //this.CFERCurrentBar = curCFERBar;
                break;
            default:
                curCFERBar.className = 'FuelConsumptionCtrlCFERBarGraphCore';
                break;
        }
        CFERBarCap.style.marginTop = '-3px';
        curCFERBar.appendChild(CFERBarCap);
        this.CFERGraphArea.appendChild(curCFERBar);
    }
    
    this.CFERCurrenBarMask = document.createElement('div');
    this.CFERCurrenBarMask.className = 'FuelConsumptionCtrlCFERBarGraphCurrentMask';
    
    var CurrentCFERBarCap = document.createElement('div');
    CurrentCFERBarCap.className = 'FuelConsumptionCtrlCFERBarGraphCap';
    CurrentCFERBarCap.style.marginTop = '-3px';
    
    this.CFERCurrentBar = document.createElement('div');
    this.CFERCurrentBar.id = 'CFERBar10';
    this.CFERCurrentBar.className = 'FuelConsumptionCtrlCFERBarGraphCoreCurrent';
    
    this.CFERCurrentBar.appendChild(CurrentCFERBarCap);
    
    this.CFERCurrenBarMask.appendChild(this.CFERCurrentBar);
    
    // Create a div for the current Graph value and attach to the parent div
    this.CFERCurrentBarValue = document.createElement('div');
    this.CFERCurrentBarValue.className = 'FuelConsumptionCtrlCFERCurrentBarValue';
     
    // Create a div for text of bar value and attach to CFERCurrentBarValueCFERCurrentBarValue
    this.CFERCurrentBarValueText = document.createElement('div');
    this.CFERCurrentBarValueText.className = 'FuelConsumptionCtrlCFERBarValueCurrent';
    this.CFERCurrentBarValueText.id = 'CFERBarValueCurrent';
    this.CFERCurrentBarValue.appendChild(this.CFERCurrentBarValueText);
    
    // Attach the active graphing area to the CFER graph clip mask
    this.CFERGraphClipMask.appendChild(this.CFERGraphArea);

    // Attach the clip mask to the CFER graph
    this.CFERGraph.appendChild(this.CFERGraphClipMask);

    // Attach the CFER graph to its parent
    this.graphsArea.appendChild(this.CFERGraph);

    /*********************************************************/
    /* Create DOM structure for Avg. Fuel Efficiency display */
    /*********************************************************/

    // Fuel efficiency top-level DIV
    this.fuelEfficiencyArea = document.createElement('div');
    this.fuelEfficiencyArea.className = 'FuelConsumptionCtrlFuelEfficiencyArea';
    
    // Fuel efficiency title
    this.fuelEfficiencyTitle = document.createElement('h2');
    // Fuel efficiency value display
    this.fuelEfficiencyValue = document.createElement('div');
    this.fuelEfficiencyUnit = document.createElement('div');
    this.fuelEfficiencyThisDrive = document.createElement('div');
    
    //TODO::Fuel Consumption HEV Style
    if(this.properties.ctrlStyle === "hevstyle"){
        this.fuelEfficiencyTitle.className = 'FuelConsumptionCtrlFuelEfficiencyTitleHev';
        this.fuelEfficiencyThisDrive.className = 'FuelConsumptionCtrlFuelEfficiencyThisDriveHev';
        this.fuelEfficiencyValue.className = 'FuelConsumptionCtrlFuelEfficiencyValueHev';
        this.fuelEfficiencyUnit.className = 'FuelConsumptionCtrlFuelEfficiencyUnitHev';
        //Fuel efficiency HR region
        this.fuelEfficiencyHevDivider = document.createElement("div");
        this.fuelEfficiencyHevDivider.className = 'FuelConsumptionCtrlFuelEfficiencyHevDivider';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevDivider);
        
        //Fuel Efficiency OneDrive Title
        this.fuelEfficiencyHevOneDriveTitle = document.createElement("div");
        this.fuelEfficiencyHevOneDriveTitle.className = 'FuelConsumptionCtrlHevOneDriveText';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevOneDriveTitle);
        this.properties.oneDriveText =
            this._translateString(this.properties.oneDriveTextId,
                                  this.properties.oneDriveText,
                                  this.properties.subMap);
        this.fuelEfficiencyHevOneDriveTitle.innerHTML = this.properties.oneDriveText;
        
        //Fuel Efficiency EVDistance Title
        this.fuelEfficiencyHevEVDistanceTitle = document.createElement("div");
        this.fuelEfficiencyHevEVDistanceTitle.className = 'FuelConsumptionCtrlHevEVDistanceText';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevEVDistanceTitle);
        this.properties.evDistanceText =
            this._translateString(this.properties.evDistanceTextId,
                                  this.properties.evDistanceText,
                                  this.properties.subMap);
        this.fuelEfficiencyHevEVDistanceTitle.innerHTML =  this.properties.evDistanceText;
        
        //Fuel Efficiency Distance Value
        this.fuelEfficiencyHevDistanceValue = document.createElement("div");
        this.fuelEfficiencyHevDistanceValue.className = 'FuelConsumptionCtrlHevDistanceValue';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevDistanceValue);
        
        //Fuel Efficiency Distance Unit
        this.fuelEfficiencyHevDistanceUnit = document.createElement("div");
        this.fuelEfficiencyHevDistanceUnit.className = 'FuelConsumptionCtrlHevDistanceUnit';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevDistanceUnit);
        
        //Fuel Efficiency Percent Value
        this.fuelEfficiencyHevPercentValue = document.createElement("div");
        this.fuelEfficiencyHevPercentValue.className = 'FuelConsumptionCtrlHevPercentValue';
        this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyHevPercentValue);
        
        // 20 special case for HEV
        
        this.halfKmLabel1 = document.createElement('div');
        this.halfKmLabel1.className = 'FuelConsumptionCtrlHalfWayLabel1';
        this.halfKmLabel1.innerHTML = '20';
        
        this.halfKmLabel2 = document.createElement('div');
        this.halfKmLabel2.className = 'FuelConsumptionCtrlHalfWayLabel2';
        this.halfKmLabel2.innerHTML = '20';
        
        this.divElt.appendChild(this.halfKmLabel1);
        this.divElt.appendChild(this.halfKmLabel2);
    }
    else{
        this.fuelEfficiencyTitle.className = 'FuelConsumptionCtrlFuelEfficiencyTitle';
        this.fuelEfficiencyThisDrive.className = 'FuelConsumptionCtrlFuelEfficiencyThisDrive';
        this.fuelEfficiencyValue.className = 'FuelConsumptionCtrlFuelEfficiencyValue';
        this.fuelEfficiencyUnit.className = 'FuelConsumptionCtrlFuelEfficiencyUnit';
    }

    this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyTitle);
    this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyThisDrive);
    this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyValue);
	
    // create container for disc value indicator
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	this.oneDiscValue = document.createElement('div');
    	this.oneDiscValue.className = 'FuelConsumptionCtrlOneDiscValue';
    	
    	 this.properties.whText =
             this._translateString(this.properties.whUnitId,
                                   this.properties.whText,
                                   this.properties.subMap);
    	this.oneDiscValue.innerHTML = '=30'+this.properties.whText;
    	this.oneDiscImage = document.createElement('div');
    	this.oneDiscImage.className = 'FuelConsumptionCtrlOneDiscIndicator';
    	
    	this.divElt.appendChild(this.oneDiscValue);
    	this.divElt.appendChild(this.oneDiscImage);
    }
    
    this.fuelEfficiencyArea.appendChild(this.fuelEfficiencyUnit);
    
    // Add graphs area to control's top-level container
    this.divElt.appendChild(this.graphsArea);

    // Add fuel efficiency area to control's top-level container
    this.divElt.appendChild(this.fuelEfficiencyArea);
    this.divElt.appendChild(this.CFERCurrentBarValue);
    this.divElt.appendChild(this.CFERCurrenBarMask);
	// Attach control to parent        
    this.parentDiv.appendChild(this.divElt);
    this.parentDiv.appendChild(this.umpPanelDiv);
    
    var umpConfig = {
        "buttonConfig" : this.properties['umpButtonConfig'],
        "defaultSelectCallback" : this.properties['defaultSelectCallback'],
        "defaultLongPressCallback" : this.properties['defaultLongPressCallback'],
        "defaultScrubberCallback" : this.properties['defaultScrubberCallback'],
        "defaultHoldStartCallback" : this.properties['defaultHoldStartCallback'],
        "defaultHoldStopCallback" : this.properties['defaultHoldStopCallback'],
        "umpStyle" : this.properties['umpStyle'],
        "hasScrubber" : this.properties['hasScrubber'],
        "scrubberConfig" : this.properties['scrubberConfig'],
        "retracted" : true
    };
    //@formatter:on
    log.debug("Instantiating umpCtrl...");
    this.umpCtrl = framework.instantiateControl(this.uiaId, this.umpPanelDiv, "Ump3Ctrl", umpConfig);
  	
  	// "Switch View" button control
    //@formatter:off
    var btnInstanceProperties =
    {
        "selectCallback" : this._switchViewButtonHandler.bind(this),
        "enabledClass" : "FuelConsumptionCtrlSwitchView",
        "disabledClass" : null,
        "focusedClass": null,
        "downClass" : "FuelConsumptionCtrlSwitchViewDown",
        "heldClass" : null,
        "appData" : this.properties.appData,
        "label" : this.properties.switchViewLabelText,
        "labelId" : this.properties.switchViewLabelId,
        "subMap" : this.properties.subMap,
    };
    //@formatter:on
    if(this.properties.mode !== 'ending' )
    {
    this._switchViewButtonCtrl = framework.instantiateControl(this.uiaId,
                                                              this.fuelEfficiencyArea,
                                                              "ButtonCtrl",
                                                              btnInstanceProperties);
    }

  
    this._init();
}


/****************************************/
/* Translation & text utility functions */
/****************************************/

/*
 * Utility function to look up a translatable string ID and/or accept a default text string.
 */
FuelConsumptionCtrl.prototype._translateString = function(strId, strText, subMap)
{
//    log.debug("_translateString called: strId = " + strId + ", strText = " + strText);

    var translatedText = null;

    if (strId)
    {
        translatedText = framework.localize.getLocStr(this.uiaId, strId, subMap);
    }
    else if (strText)
    {
        translatedText = strText;
    }

    return translatedText;
}

/*
 * Utility function to make a text string suitable for HTML block-rendering
 */
FuelConsumptionCtrl.prototype._stringToHTML = function(textStr)
{
//    log.debug("_stringToHTML called: textStr = " + textStr);

    var htmlText;

    if (textStr)
    {
        htmlText = textStr + "<br/>";
    }
    else
    {
        htmlText = "";
    }

    return htmlText;
}


/*********************************************************/
/* Utility functions for the CDFE graph & its animations */
/*********************************************************/

/*
 * Utility function to add axis labels to the CDFE graph
 */
FuelConsumptionCtrl.prototype._addCDFEGraphAxisLabels = function(xDiv, yDiv)
{
//    log.debug("FuelConsumptionCtrl: _addCDFEGraphAxisLabels() called...");

    // NOTE:  We're assuming 15 labels.  Should this change,
    //        we'd need to revisit this
	var barVal = 60;
    for (var i = 0; i < 6; i++)
    {
        var barLabel = document.createElement('span');
        barLabel.innerHTML = barVal;
        barLabel.style.position = 'absolute';
        barLabel.style.left = this._CSSConstants["CDFEGraphBarMarginRight"] +
                                (i * (this._CSSConstants["CDFEGraphBarWidthRight"] +
                                        this._CSSConstants["CDFEGraphBarSpacingRight"]) - 18) + 'px';
        barLabel.style.width = this._CSSConstants["CDFEGraphBarWidthRight"] + 'px';
        xDiv.appendChild(barLabel);
        barVal -= 10;
    }

        var barLabel = document.createElement('span');
        barLabel.innerHTML = (this._totalCDFEBarsRight - 1);
        barLabel.style.position = 'absolute';
        barLabel.style.left = this._CSSConstants["CDFEGraphBarMarginRight"] +
                                (8 * (this._CSSConstants["CDFEGraphBarWidthRight"] )+
                                        this._CSSConstants["CDFEGraphBarSpacingRight"] - 19) + 'px';
        barLabel.style.width = this._CSSConstants["CDFEGraphBarWidthRight"] + 'px';
        xDiv.appendChild(barLabel);

  
    this.yLimitValueLabelCDFE = document.createElement('span');
    this.yLimitValueLabelCDFE.innerHTML = this.properties.currentFuelConfig.yAxisLimitValue;
    yDiv.appendChild(this.yLimitValueLabelCDFE);
    
    var yUnitLabel = document.createElement('span');
    yUnitLabel.style.position = 'absolute';
    yUnitLabel.style.width = '100px';
    yUnitLabel.style.top = '90px';
    
    var yZeroLabel = document.createElement('span');
    this.properties.currentFuelConfig.yAxisLabelText =
        this._translateString(this.properties.currentFuelConfig.yAxisLabelId,
                              this.properties.currentFuelConfig.yAxisLabelText,
                              this.properties.subMap);
    yUnitLabel.innerHTML = this.properties.currentFuelConfig.yAxisLabelText;
    var xAxisLabelMinuteText =  this._translateString(this.properties.xAxisLabelMinuteId,
            this.properties.xAxisLabelMinuteText, this.properties.subMap);
    
    yZeroLabel.innerHTML = '0'+xAxisLabelMinuteText;
    yZeroLabel.style.position = 'absolute';
    yZeroLabel.style.width = '60px';
    yZeroLabel.style.top = '115px';
    yZeroLabel.style.left = '466px';
    this.yZeroLabelCDFE = yUnitLabel;
    yDiv.appendChild(yUnitLabel);
    yDiv.appendChild(yZeroLabel); 
}

/*
 * Utility function to set the horizontal positions of the CDFE graph bars
 */
FuelConsumptionCtrl.prototype._setCDFEGraphBarPositions = function()
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarPositions() called...");

    var leftInc = this._CSSConstants["CDFEGraphBarWidth"] +
                    this._CSSConstants["CDFEGraphBarSpacing"];
    var currentLeft = this._CSSConstants["CDFEGraphBarMargin"];

    for (var i = 1; i <= this._totalCDFEBars; i++)
    {
        var bar = document.getElementById('CDFEBar' + i);
        if (bar)
        {
            bar.style.left = currentLeft + 'px';
        }
        
              
        // Adding new disc logic for hevstyle
        if(this.properties.ctrlStyle === 'hevstyle')
        {
        	var disc = document.getElementById('CDFEDiscBar' + i);
        	if(disc)
        	{
        		disc.style.left =  currentLeft + 'px';
        	}
        }
        
        currentLeft += leftInc;
    }
}
/**********************************New Defination of function**********************************/

FuelConsumptionCtrl.prototype._setCDFEGraphBarPositionsRight = function()
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarPositions() called...");

    var leftIncRight = this._CSSConstants["CDFEGraphBarWidthRight"] +
                    this._CSSConstants["CDFEGraphBarSpacingRight"];
    var currentLeftMarginRight = this._CSSConstants["CDFEGraphBarMarginRight"];

    for (var i = 1; i <= this._totalCDFEBarsRight; i++)
    {
        var barRight = document.getElementById('CDFEBarRight' + i);
        if (barRight)
        {
            barRight.style.left = currentLeftMarginRight + 'px';
        }
        
     // Adding new disc logic for hevstyle
        if(this.properties.ctrlStyle === 'hevstyle')
        {
        	var disc = document.getElementById('CDFEDiscBarRight' + i);
        	if(disc)
        	{
        		disc.style.left =  currentLeftMarginRight + 'px';
        	}
        }
        
        currentLeftMarginRight += leftIncRight;
    }
}

/**********************************End of New Defination of function**********************************/
/*
 * Utility function to enable/disable fade transitions for the CDFE line graph
 */
FuelConsumptionCtrl.prototype._setCDFELineGraphFadeTransitions = function(isEnabled)
{
//    log.debug("FuelConsumptionCtrl: _setCDFELineGraphFadeTransitions() called: isEnabled = " + isEnabled);

    var lineGraphCanvas = document.getElementById('FuelConsumptionCtrlCDFELineGraphCanvas');
    if (lineGraphCanvas)
    {
        var transitionStr;

        if (isEnabled)
        {
            log.debug ('  enabling canvas opacity transition');
            transitionStr = 'opacity 0.6s linear 0s';
        }
        else
        {
            log.debug ('  disabling canvas opacity transition');
            transitionStr = 'none';
        }

        lineGraphCanvas.style.OTransition = transitionStr;
    }
}

/*
 * Utility function to enable/disable height transitions for the CDFE graph bars
 * (except the "hidden" new value bar)
 */
FuelConsumptionCtrl.prototype._setCDFEGraphBarHeightTransitions = function(isEnabled)
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeightTransitions() called: isEnabled = " + isEnabled);

    var transitionStr;

    // TODO: Figure out why this needs to be backwards to work!
    if (!isEnabled)
    {
        transitionStr = 'height 0.6s ease 0s';
    }
    else
    {
        transitionStr = 'none';
    }

    for (var i = 0; i <= this._youngestCDFEDataIdx; i++)
    {
        var bar = document.getElementById('CDFEBar' + (i + 1));
        if (bar)
        {
            bar.style.OTransition = transitionStr;
        }
        if(this.properties.ctrlStyle === 'hevstyle')
        {
        	var disc = document.getElementById('CDFEDiscBar' + (i + 1));
        	if (disc)
            {
        		disc.style.OTransition = transitionStr;
            }
        }
    }
}

FuelConsumptionCtrl.prototype._setCDFEGraphBarHeightTransitionsRight = function(isEnabled)
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeightTransitions() called: isEnabled = " + isEnabled);

    var transitionStr;

    // TODO: Figure out why this needs to be backwards to work!
    if (!isEnabled)
    {
        transitionStr = 'height 0.6s ease 0s';
    }
    else
    {
        transitionStr = 'none';
    }

    for (var i = 0; i <= this._youngestCDFEDataIdxRight; i++)
    {
        var bar = document.getElementById('CDFEBarRight' + (i + 1));
        if (bar)
        {
            bar.style.OTransition = transitionStr;
        }
        
        if(this.properties.ctrlStyle === 'hevstyle')
        {
        	var disc = document.getElementById('CDFEDiscBarRight' + (i + 1));
            if (disc)
            {
            	disc.style.OTransition = transitionStr;
            }
        }
    }
}



/*
 * Utility function to set the height of a single CDFE graph bar (e.g. the just-inserted one)
 */
FuelConsumptionCtrl.prototype._setCDFEGraphBarHeight = function(barIdx,HEVMode)
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeight() called: barIdx = " + barIdx);

    var bar = document.getElementById('CDFEBar' + (barIdx + 1));
    if (bar)
    {
        bar.style.height = this._scaleDataToGraphY(this._CSSConstants["CDFEGraphVisibleHeight"],
                                                   this._CDFEGraphBarValues[barIdx],
                                                   this.properties.currentFuelConfig.yAxisLimitValue,
                                                   false) + 'px';
        
        
    }
    
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	 	var disc = document.getElementById('CDFEDiscBar' + (barIdx + 1));
    	    if (disc)
    	    {
    	    	/*disc.style.height = this._scaleDataToGraphY(this._CSSConstants["CDFEGraphVisibleHeight"],
    	                                                   this._CDFEDiscValues[barIdx],
    	                                                   this.properties.currentFuelConfig.yAxisLimitValue,
    	                                                   false) + 'px';*/
                if(HEVMode)
                {
             	   bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrentGreenHighLighted';
             	   disc.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrentGreenHighLighted';
                }
                else
                {
             	   bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
             	   disc.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrent';
                }
    	    	disc.style.height =  this._CDFEDiscValues[barIdx]+'px';
    	    	
    	    }
    }
}


FuelConsumptionCtrl.prototype._setCDFEGraphBarHeightRight = function(barIdx)
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeight() called: barIdx = " + barIdx);

    var bar = document.getElementById('CDFEBarRight' + (barIdx + 1));
    if (bar)
    {
        bar.style.height = this._scaleDataToGraphY(this._CSSConstants["CDFEGraphVisibleHeightRight"],
                                                   this._CDFEGraphBarValuesRight[barIdx],
                                                   this.properties.currentFuelConfig.yAxisLimitValue,
                                                   false) + 'px';
    }
}

/*
 * Utility function to set the heights of all of the CDFE graph bars
 */
FuelConsumptionCtrl.prototype._setCDFEGraphBarHeights = function()
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeights() called...");

    // Cache reused values
    var graphHeight = this._CSSConstants["CDFEGraphVisibleHeight"];
    var yLimit = this.properties.currentFuelConfig.yAxisLimitValue;

    for (var i = 0; i < this._totalCDFEBars; i++)
    {
        var bar = document.getElementById('CDFEBar' + (i + 1));
        if (bar)
        {
            bar.style.height = this._scaleDataToGraphY(graphHeight,
                                                       this._CDFEGraphBarValues[i],
                                                       yLimit,
                                                       false) + 'px';
        }
        
        if(this.properties.ctrlStyle === 'hevstyle')
        {
        	var disc = document.getElementById('CDFEDiscBar' + (i + 1));
            if (disc)
            {
            	/*disc.style.height = this._scaleDataToGraphY(graphHeight,
                                                           this._CDFEDiscValues[i],
                                                           yLimit,
                                                           false) + 'px'; */
            	disc.style.height = this._CDFEDiscValues[i]+'px';
            }
        }
    }
}

FuelConsumptionCtrl.prototype._setCDFEGraphBarHeightsRight = function()
{
//    log.debug("FuelConsumptionCtrl: _setCDFEGraphBarHeights() called...");

    // Cache reused values
    var graphHeight = this._CSSConstants["CDFEGraphVisibleHeightRight"];
    var yLimit = this.properties.currentFuelConfig.yAxisLimitValue;
   
    for (var i = 0; i < this._totalCDFEBarsRight; i++)
    {
        var bar = document.getElementById('CDFEBarRight' + (i + 1));
       
        if (bar)
        {
            bar.style.height = this._scaleDataToGraphY(graphHeight,
                                                       this._CDFEGraphBarValuesRight[i],
                                                       yLimit,
                                                       false) + 'px';
        }
        if(this.properties.ctrlStyle === 'hevstyle')
        { 
	        var disc = document.getElementById('CDFEDiscBarRight' + (i + 1));
	        if (disc)
	        {
	        	disc.style.height = this._CDFEDiscBarValuesRight[i]+ 'px';
	        }
        }    
    }
}

/*
 * Utility function to render an interval of the CDFE line graph, using a canvas overlay
 */
FuelConsumptionCtrl.prototype._drawCDFELineGraphInterval = function(startIdx, endIdx, clearCanvas)
{
//    log.debug("FuelConsumptionCtrl: _drawCDFELineGraphInterval() called...");

    if ((typeof(startIdx) === 'number') &&
        (typeof(endIdx) === 'number') &&
        (startIdx < endIdx) &&
        (startIdx >= 0) &&
        (endIdx < this._totalCDFEBars))
    {
        // Horizontal distance between bar centers
        var barInterval = this._CSSConstants["CDFEGraphBarWidth"] +
                          this._CSSConstants["CDFEGraphBarSpacing"];

        // Center of leftmost (oldest) bar in interval
        var leftX = (this._CSSConstants["CDFEGraphBarSpacing"] +
                    (this._CSSConstants["CDFEGraphBarWidth"] / 2)) +
                    (barInterval * startIdx);

        // Center of next bar
        var rightX = leftX + barInterval;
        var leftY;
        var rightY;

        // Constants
        var graphHeight = this._CSSConstants["CDFEGraphVisibleHeight"];
        var yLimit = this.properties.currentFuelConfig.yAxisLimitValue;

        // Reset the canvas (if needed)
        if (clearCanvas)
        {
            this.CDFELineGraphCanvas.width = this.CDFELineGraphCanvas.width;
        }

        // Set up for drawing
        this._CDFELineGraphCanvasDC.lineWidth = 2;
        this._CDFELineGraphCanvasDC.beginPath();
        this._CDFELineGraphCanvasDC.strokeStyle = "#00CC00";

        // Initialize leftY & rightY
        if (this._CDFEGraphLineValues[startIdx])
        {
            leftY = this._scaleDataToGraphY(graphHeight,
                                            this._CDFEGraphLineValues[startIdx],
                                            yLimit,
                                            true);
        }
        else
        {
            leftY = null;
        }

        for (var i = startIdx + 1; i <= endIdx; i++)
        {
            // Scale value as rightY
            if (this._CDFEGraphLineValues[i])
            {
                rightY = this._scaleDataToGraphY(graphHeight,
                                                 this._CDFEGraphLineValues[i],
                                                 yLimit,
                                                 true);
            }
            else
            {
                rightY = null;
            }

            // If we have both endpoints, ...
            if (leftY && rightY)
            {
                // ... draw the line segment between them
                this._CDFELineGraphCanvasDC.moveTo(leftX, leftY);
                this._CDFELineGraphCanvasDC.lineTo(rightX, rightY);
            }

            // Advance to next value
            leftY = rightY;
            leftX = rightX;
            rightX += barInterval;
        }

        // Stroke the path
        this._CDFELineGraphCanvasDC.stroke();
    }
}

/*
 * Shortcut utility function to render the entire CDFE line graph
 */
FuelConsumptionCtrl.prototype._drawCDFELineGraph = function()
{
//    log.debug("FuelConsumptionCtrl: _drawCDFELineGraph() called...");

    this._drawCDFELineGraphInterval(0, this._newCDFEDataIdx, true);
}

/*
 * Utility function for resetting the CDFE graph
 * (redraw it with the "new" bar hidden on the right-hand side)
 */
//
FuelConsumptionCtrl.prototype._resetCDFEGraph = function(animateBars)
{
//    log.debug("FuelConsumptionCtrl: _resetCDFEGraph() called: animateBars = " + animateBars);

    // Make sure left transitions are OFF for the CDFE graph active area while we redraw it
    this.CDFEGraphArea.style.OTransition = 'none';
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	 this.CDFEDiscGraphArea.style.OTransition = 'none';
    }
    
    // Enable/disable height transitions for the CDFE graph bars
    this._setCDFEGraphBarHeightTransitions(animateBars);
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	
    	for(var i = 0; i <= 10; i++)
    	{
    		var bar = document.getElementById('CDFEBar'+(i+1));
    		var disc = document.getElementById('CDFEDiscBar' +(i+1));
    		if(this._initialEVMode[i] && bar)
    		{
    			bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrentGreen';
    			disc.className = 'FuelConsumptionCtrlHevCDFEDiscBg_Green';
    			if(i == 9)
    			{
    				this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrentGreenHighLighted';
        			this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrentGreenHighLighted';
        			break;
    			}
    				
    		}
    		else
    		{
    			if(i == 9 || i == 10)
    			{
    				this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrent';
        			this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
        			bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
        			disc.className = 'FuelConsumptionCtrlHevCDFEBarGraphCoreCurrent';
    			}
    			else
    			{
    				bar.className = 'FuelConsumptionCtrlCDFEBarGraphCore';
        			disc.className = 'FuelConsumptionCtrlHevCDFEBarGraphCore';
    			}
    		}
    	}
    }
    else
    {
    	this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrent';
    }
    // Reposition the CDFE graph active area & reconstruct the bar/line graph
    // (should be no visible difference afterwards)
    this.CDFEGraphArea.style.left = '0px';
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	 this.CDFEDiscGraphArea.style.left = '0px';
    }
    this._setCDFEGraphBarHeights();

    
    // Disable/enable height transitions for the CDFE graph bars
    this._setCDFEGraphBarHeightTransitions(!animateBars);
}

FuelConsumptionCtrl.prototype._resetCDFEGraphRight = function(animateBars)
{
//    log.debug("FuelConsumptionCtrl: _resetCDFEGraph() called: animateBars = " + animateBars);

    // Make sure left transitions are OFF for the CDFE graph active area while we redraw it
    this.CDFEGraphAreaRight.style.OTransition = 'none';
    
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	this.CDFEDiscGraphAreaRight.style.OTransition = 'none';
    }

    // Enable/disable height transitions for the CDFE graph bars
    this._setCDFEGraphBarHeightTransitionsRight(animateBars);
    
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	for(var i = 0; i < 5; i++)
    	{
    		var bar = document.getElementById('CDFEBarRight'+(i+1));
    		var disc = document.getElementById('CDFEDiscBarRight' +(i+1));
    		if(this._CDFEEvModeRight[i] && bar)
    		{
    			bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreGreenRight';
    			disc.className = 'FuelConsumptionCtrlHevCDFEDiscGraphCoreGreenRight';
    		}
    		else
    		{
    			bar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreRight';
    			disc.className = 'FuelConsumptionCtrlHevCDFEDiscGraphCoreRight';
    		}
    	}
    }
   
    
    // Reposition the CDFE graph active area & reconstruct the bar/line graph
    // (should be no visible difference afterwards)
    this.CDFEGraphAreaRight.style.left = '0px';
    if(this.properties.ctrlStyle === 'hevstyle')
    {
    	this.CDFEDiscGraphAreaRight.style.left = '0px';
    }
    this._setCDFEGraphBarHeightsRight();

    // Disable/enable height transitions for the CDFE graph bars
    this._setCDFEGraphBarHeightTransitionsRight(!animateBars);
}

/*
 * Callback function for removing the animation on the CDFE line graph at the end of its fade-in
 */
FuelConsumptionCtrl.prototype._onCDFELineFadeAnimationEnd = function(e)
{
//    log.debug("FuelConsumptionCtrl: _onCDFELineFadeAnimationEnd() called");

    // Remove the event listener that got us here
    this.CDFELineGraphCanvas.removeEventListener('oTransitionEnd', this._cbCDFELineFadeAnimationEnd, false);

    // Stop propagating the event
    e.stopPropagation();
    
    // Disable the line graph fade animation
    this._setCDFELineGraphFadeTransitions(false);
}

/*
 * Callback function for resetting the CDFE graph at the end of a slide-left (insertion) animation
 */
FuelConsumptionCtrl.prototype._onCDFELeftAnimationEnd = function(e)
{
//    log.debug("FuelConsumptionCtrl: _onCDFELeftAnimationEnd() called...");

    // Remove the event listener that got us here
    this.CDFEGraphArea.removeEventListener('oTransitionEnd', this._cbCDFELeftAnimationEnd, false);

    // Stop propagating the event
    e.stopPropagation();

    // We're no longer in the transition
    this._CDFELineGraphInTransition = false;

    // Reset the CDFE graph without bar animations
    this._resetCDFEGraph(false);
}


/************************************ New Function Added************************************************/
FuelConsumptionCtrl.prototype._onCDFELeftAnimationEndRight = function(e)
{
//    log.debug("FuelConsumptionCtrl: _onCDFELeftAnimationEndRight() called...");

    // Remove the event listener that got us here
    this.CDFEGraphAreaRight.removeEventListener('oTransitionEnd', this._cbCDFELeftAnimationEndRight, false);

    // Stop propagating the event
    e.stopPropagation();

    // We're no longer in the transition
    this._CDFELineGraphInTransition = false;

    // Reset the CDFE graph without bar animations
    this._resetCDFEGraph(false);
}
/************************************End of New Function Added************************************************/


/*********************************************************/
/* Utility functions for the CFER graph & its animations */
/*********************************************************/

/*
 * Utility function to add axis labels to the CFER graphadd
 */
FuelConsumptionCtrl.prototype._addCFERGraphAxisLabels = function(xDiv, yDiv)
{
//    log.debug("FuelConsumptionCtrl: _addCFERGraphAxisLabels() called...");

    var leftInc = this._CSSConstants["CFERGraphBarWidth"] +
                    this._CSSConstants["CFERGraphBarSpacing"];
    var currentLeft = this._CSSConstants["CFERGraphBarMargin"];

    for (var i = 0; i <= this._currentCFERDataIdx; i++)
    {
        var span = document.createElement('span');

        span.style.position = 'absolute';
        span.style.left = currentLeft + 'px';
        span.style.width = this._CSSConstants["CFERGraphBarWidth"] + 'px';
        span.style.textAlign = 'center';
        
        if (i === (this._currentCFERDataIdx - 1))
        {
            this.properties.cumulativeFuelConfig.xAxisLabelText =
                this._translateString(this.properties.cumulativeFuelConfig.xAxisLabelId,
                                      this.properties.cumulativeFuelConfig.xAxisLabelText,
                                      this.properties.subMap);
            span.innerHTML = this._stringToHTML(this.properties.cumulativeFuelConfig.xAxisLabelText);
            span.style.marginLeft = '-8px';
            span.style.width = '71px';
        }
        else
        {
           if(i != this._currentCFERDataIdx)
           {
        		span.innerHTML = (this._currentCFERDataIdx - i) + '';
           }
        	
        }
        
        
        currentLeft += leftInc;
        xDiv.appendChild(span);
    }

   
    this.yLimitValueLabelCFER = document.createElement('span');
    this.yLimitValueLabelCFER.innerHTML = this.properties.cumulativeFuelConfig.yAxisLimitValue;
    yDiv.appendChild(this.yLimitValueLabelCFER);

    var yZeroLabel = document.createElement('span');
    this.properties.cumulativeFuelConfig.yAxisLabelText =
        this._translateString(this.properties.cumulativeFuelConfig.yAxisLabelId,
                              this.properties.cumulativeFuelConfig.yAxisLabelText,
                              this.properties.subMap);
    yZeroLabel.innerHTML = this._stringToHTML(this.properties.cumulativeFuelConfig.yAxisLabelText);
    yZeroLabel.style.position = 'absolute';
    yZeroLabel.style.width = '60px';
    if(this.properties.ctrlStyle === "hevstyle")
	{
	  yZeroLabel.style.top = '90px';
	}
	else
	{
	yZeroLabel.style.top = (this._CSSConstants["CFERGraphVisibleHeight"] - 47) + 'px';
	}
    this.yZeroLabelCFER = yZeroLabel;
    yDiv.appendChild(yZeroLabel);
}

/*
 * Utility function to set the horizontal positions of the CFER graph bars
 */
FuelConsumptionCtrl.prototype._setCFERGraphBarPositions = function()
{
//    log.debug("FuelConsumptionCtrl: _setCFERGraphBarPositions() called...");

    var leftInc = this._CSSConstants["CFERGraphBarWidth"] +
                    this._CSSConstants["CFERGraphBarSpacing"];
    var currentLeft = this._CSSConstants["CFERGraphBarMargin"];

    for (var i = 1; i <= this._totalCFERBars; i++)
    {
        var bar = document.getElementById('CFERBar' + i);
        if (bar)
        {
            bar.style.left = currentLeft + 'px';
        }

        currentLeft += leftInc;
    }
}

/*
 * Utility function to enable/disable height transitions for the CFER graph bars
 * (except the "hidden" new value bar)
 */
FuelConsumptionCtrl.prototype._setCFERGraphBarHeightTransitions = function(isEnabled)
{
//    log.debug("FuelConsumptionCtrl: _setCFERGraphBarHeightTransitions() called: isEnabled = " + isEnabled);

    var transitionStr;
    
    // TODO: Figure out why this needs to be backwards to work!
    if (!isEnabled)
    {
        transitionStr = "height 0.6s ease 0s";
    }
    else
    {
        transitionStr = "none";
    }

    for (var i = 0; i <= this._currentCFERDataIdx; i++)
    {
        var bar = document.getElementById('CFERBar' + (i + 1));
        if (bar)
        {
            bar.style.OTransition = transitionStr;
            if(i==5)
        	{
            	bar.style.OTransition = "none";
        	}
        }
    }
}

/*
 * Utility function to set the height of single CFER graph bar (e.g. the just-inserted one)
 */
FuelConsumptionCtrl.prototype._setCFERGraphBarHeight = function(barIdx)
{
//    log.debug("FuelConsumptionCtrl: _setCFERGraphBarHeight() called: barIdx = " + barIdx);
	
    var bar = document.getElementById('CFERBar' + (barIdx + 1));
    if (bar)
    {
    	
        bar.style.height = this._scaleDataToGraphY(this._CSSConstants["CFERGraphVisibleHeight"],
                                                   this._CFERGraphBarValues[barIdx],
                                                   this.properties.cumulativeFuelConfig.yAxisLimitValue,
                                                   false) + 'px';
          
    }
}

FuelConsumptionCtrl.prototype._setCFERGraphBarHeightNew = function(barIdx)
{
//    log.debug("FuelConsumptionCtrl: _setCFERGraphBarHeight() called: barIdx = " + barIdx);
	
    var bar = document.getElementById('CFERBar' + (barIdx + 1));
    if (bar)
    {
    	
        bar.style.height = this._scaleDataToGraphY(this._CSSConstants["CFERGraphVisibleHeight"],
                                                   this._CFERGraphBarValues[barIdx + 1],
                                                   this.properties.cumulativeFuelConfig.yAxisLimitValue,
                                                   false) + 'px';
        
        // Set the height of the current bar value to retain its display positioon on top of current bar
        this.CFERCurrentBarValue.style.height = this._scaleDataToGraphY(this._CSSConstants["CFERGraphVisibleHeight"],
                this._CFERGraphBarValues[barIdx + 1],
                this.properties.cumulativeFuelConfig.yAxisLimitValue,
                false) + 'px';
    }
}



/*
 * Utility function to set the heights of all of the CFER graph bars
 */
FuelConsumptionCtrl.prototype._setCFERGraphBarHeights = function()
{
//    log.debug("FuelConsumptionCtrl: _setCFERGraphBarHeights() called...");

    // Cache reused values
    var graphHeight = this._CSSConstants["CFERGraphVisibleHeight"];
    var yLimit = this.properties.cumulativeFuelConfig.yAxisLimitValue;

    for (var i = 0; i < this._totalCFERBars; i++)
    {
        var bar = document.getElementById('CFERBar' + (i + 1));
        if (bar)
        {
            bar.style.height = this._scaleDataToGraphY(graphHeight,
                                                       this._CFERGraphBarValues[i],
                                                       yLimit,
                                                       false) + 'px';
        }
    }
}

/*
 * Utility function for resetting the CFER graph
 * (redraw it with the "new" bar hidden on the right-hand side)
 */
FuelConsumptionCtrl.prototype._resetCFERGraph = function(animateBars)
{
//    log.debug("FuelConsumptionCtrl: _resetCFERGraph() called: animateBars = " + animateBars);

    // Make sure left transitions are OFF for the CFER graph active area while we redraw it
    this.CFERGraphArea.style.OTransition = 'none';

    // Enable/disable height transitions for the CFER graph bars
    this._setCFERGraphBarHeightTransitions(animateBars);

    // Reposition the CFER graph active area & reconstruct the bar graph
    // (should be no visible difference afterwards)
    this.CFERGraphArea.style.left = '0px';
    this._setCFERGraphBarHeights();

    // Disable/enable height transitions for the CFER graph bars
    this._setCFERGraphBarHeightTransitions(!animateBars);
}

/*
 * Callback function for resetting the CFER graph at the end of a slide-left (insertion) animation
 */
FuelConsumptionCtrl.prototype._onCFERLeftAnimationEnd = function(e)
{
//    log.debug("FuelConsumptionCtrl: _onCFERLeftAnimationEnd() called...");

    // Remove the event listener that got us here
    this.CFERGraphArea.removeEventListener('oTransitionEnd', this._cbCFERLeftAnimationEnd, false);
    
    // Stop propagating the event
    e.stopPropagation();
    
    // Reset the CFER graph without bar animations
    this._resetCFERGraph(false);
}


/***************************/
/* Other utility functions */
/***************************/

/*
 * Utility function to convert a graph's data point to a Y-coordinate
 */
FuelConsumptionCtrl.prototype._scaleDataToGraphY = function(maxY, dataValue, maxDataValue, invertY)
{
//    log.debug("FuelConsumptionCtrl: _scaleDataToGraphY() called: maxY = " + maxY +
//                "dataValue = " + dataValue + ", maxDataValue = " + maxDataValue +
//                "invertY = " + invertY);

    var yVal = Math.floor(dataValue / maxDataValue * maxY);

    if (invertY)
    {
        yVal = maxY - yVal;
    }
    
    return yVal;
}

/*
 * Callback for "Switch View" button selections -- when called, trigger the
 * configured application callback.
 */
FuelConsumptionCtrl.prototype._switchViewButtonHandler = function(buttonObj, appData, params)
{
//    log.debug("FuelConsumptionCtrl: _onCFERLeftAnimationEnd() called: buttonObj = " + buttonObj +
//              ", appData = " + appData + ", params = " + params);

    if (typeof(this.properties.switchViewButtonCallback) === "function")
    {
        this.properties.switchViewButtonCallback(this, appData, null);
    }
    else
    {
        log.warn("FuelConsumptionCtrl: no valid switchViewButtonCallback configured");
    }
}

/******************/
/* Public Methods */
/******************/

FuelConsumptionCtrl.prototype.initializeCurrentDriveFuelGraph = function(initialBarValues)
{
    log.debug("FuelConsumptionCtrl: initializeCurrentDriveFuelGraph() called: initialBarValues = " +
                initialBarValues);
    if (initialBarValues)
    {
        // Initial bar values are in youngest-first order, while displayed values are
        // in left-to-right order (oldest first).  Copy the initialBarValues array to
        // this._CDFEGraphBarValues, reversing the order & initializing any omitted
        // data to zero.
        for (var ibvIdx = 0; ibvIdx <= this._youngestCDFEDataIdx; ibvIdx++)
        {
            if (initialBarValues[ibvIdx])
            {
                this._CDFEGraphBarValues[this._youngestCDFEDataIdx - ibvIdx] = initialBarValues[ibvIdx];
            }
            else
            {
                this._CDFEGraphBarValues[this._youngestCDFEDataIdx - ibvIdx] = 0;
            }
        }

        // Initialize the "hidden" slot for new data
        this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
    }

     // Initialize the CDFE graph with bar animations
    this._resetCDFEGraph(true);
  
}

// to initialise the HEV fuel eco bar graph with the disc
FuelConsumptionCtrl.prototype.initialiseHEVFuelGraph = function(initialBarValues, intialDiscValues, initialEVModes, initialHalfDiscs)
{

    if (initialBarValues)
    {
        // Initial bar values are in youngest-first order, while displayed values are
        // in left-to-right order (oldest first).  Copy the initialBarValues array to
        // this._CDFEGraphBarValues, reversing the order & initializing any omitted
        // data to zero.
        for (var ibvIdx = 0; ibvIdx <= this._youngestCDFEDataIdx; ibvIdx++)
        {
            if ((initialBarValues[ibvIdx] !== null) && (initialBarValues[ibvIdx] !== undefined))
            {
                this._CDFEGraphBarValues[this._youngestCDFEDataIdx - ibvIdx] = initialBarValues[ibvIdx];
                //this._initialHalfDisc[this._youngestCDFEDataIdx - ibvIdx] = initialHalfDiscs[ibvIdx];
                this._initialEVMode[this._youngestCDFEDataIdx - ibvIdx] = initialEVModes[ibvIdx];
            }
            else
            {
                this._CDFEGraphBarValues[this._youngestCDFEDataIdx - ibvIdx] = 0;
                //this._initialHalfDisc[this._youngestCDFEDataIdx - ibvIdx] = 0;
                this._initialEVMode[this._youngestCDFEDataIdx - ibvIdx] = false;
            }
            if(intialDiscValues)
            {
            	if(initialHalfDiscs[ibvIdx])
            	{
            		this._CDFEDiscValues[this._youngestCDFEDataIdx - ibvIdx] = intialDiscValues[ibvIdx] * 13 + 7;
            	}
            	else
            	{
            		this._CDFEDiscValues[this._youngestCDFEDataIdx - ibvIdx] = intialDiscValues[ibvIdx] * 13;
            	}
            }
            else
            {
            	this._CDFEDiscValues[this._youngestCDFEDataIdx - ibvIdx] = 0;
            }
        }

        // Initialize the "hidden" slot for new data
        this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
        this._CDFEDiscValues[this._newCDFEDataIdx] = 0;
    }

     // Initialize the CDFE graph with bar animations
    this._resetCDFEGraph(true);

}


FuelConsumptionCtrl.prototype.initializeCurrentDriveFuelGraphRight = function(initialBarValues)
{
	if (initialBarValues)
    {
        // Initial bar values are in youngest-first order, while displayed values are
        // in left-to-right order (oldest first).  Copy the initialBarValues array to
        // this._CDFEGraphBarValues, reversing the order & initializing any omitted
        // data to zero.
        for (var ibvIdx = 0; ibvIdx <= this._youngestCDFEDataIdxRight; ibvIdx++)
        {
            if (initialBarValues[ibvIdx])
            {
                this._CDFEGraphBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = initialBarValues[ibvIdx];
            }
            else
            {
                this._CDFEGraphBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = 0;
            }
            
        }

        // Initialize the "hidden" slot for new data
        this._CDFEGraphBarValuesRight[this._newCDFEDataIdxRight] = 0;
    }
	
	// Initialize the CDFE graph with bar animations
    this._resetCDFEGraphRight(true);

}

FuelConsumptionCtrl.prototype.initializeHEVCurrentDriveFuelGraphRight = function(initialBarValues, initialLDiscValues, initialHalfDiscs, evModes)
{
	if (initialBarValues)
    {
        // Initial bar values are in youngest-first order, while displayed values are
        // in left-to-right order (oldest first).  Copy the initialBarValues array to
        // this._CDFEGraphBarValues, reversing the order & initializing any omitted
        // data to zero.
        for (var ibvIdx = 0; ibvIdx <= this._youngestCDFEDataIdxRight; ibvIdx++)
        {
            if (initialBarValues[ibvIdx])
            {
                this._CDFEGraphBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = initialBarValues[ibvIdx];
                if(initialHalfDiscs[ibvIdx])
                {
                	this._CDFEDiscBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = initialLDiscValues[ibvIdx] * 13 + 7;
                }
                else
                {
                	this._CDFEDiscBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = initialLDiscValues[ibvIdx] * 13;
                }
                this._CDFEEvModeRight[this._youngestCDFEDataIdxRight - ibvIdx] = evModes[ibvIdx];
            }
            else
            {
                this._CDFEGraphBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = 0;
                this._CDFEDiscBarValuesRight[this._youngestCDFEDataIdxRight - ibvIdx] = 0;
            }
           
        }

        // Initialize the "hidden" slot for new data
        this._CDFEGraphBarValuesRight[this._newCDFEDataIdxRight] = 0;
        this._CDFEDiscBarValuesRight[this._newCDFEDataIdxRight] = 0;
    }
	
	// Initialize the CDFE graph with bar animations
    this._resetCDFEGraphRight(true);
}


FuelConsumptionCtrl.prototype.insertCurrentDriveFuelGraph = function(currentBarValue)
{
    log.debug("FuelConsumptionCtrl: insertCurrentDriveFuelGraph() called: currentBarValue = " +
                currentBarValue);

    // Add the new bar value to the data set
    if (typeof(currentBarValue) === 'number')
    {
    	this._CDFEGraphBarValues[this._newCDFEDataIdx] = currentBarValue;
    }
    else
    {
        this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
    }


    // Update the new value's bar in the CDFE graph
    this._setCDFEGraphBarHeight(this._newCDFEDataIdx);

   
    this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCore';
    
    // Turn on left transitions for the CDFE graph (for the next animation)
    this.CDFEGraphArea.style.OTransition = 'left 0.6s ease 0s';

    
    // Attach an event listener to the CDFE graph area so we can detect when
    // the slide animation ends (and reset the graph for the next animation)
    this.CDFEGraphArea.addEventListener('oTransitionEnd', this._cbCDFELeftAnimationEnd, false);

    // Set the graph's position, triggering the animation
    // ("normal" left - (width of one bar + bar spacing))
    this.CDFEGraphArea.style.left = '-' + (this._CSSConstants["CDFEGraphBarWidth"] + 
                                            this._CSSConstants["CDFEGraphBarSpacing"]) + 'px';
    this._CDFELineGraphInTransition = true;

    // Update the data sets to discard the oldest historical data
    for (var i = 0; i <= this._youngestCDFEDataIdx; i++)
    {
        this._CDFEGraphBarValues[i] = this._CDFEGraphBarValues[i + 1];
    }

    // Re-initialize the "hidden" slot for new data
    this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
}

// inser new bar graph for HEV disc bars
FuelConsumptionCtrl.prototype.insertHEVFuelGraph = function(currentBarValue, currentDiscs, currentHEVMode, currentHalfDisc)
{
	// Add the new bar value to the data set
    if (typeof(currentBarValue) === 'number')
    {
    	this._CDFEGraphBarValues[this._newCDFEDataIdx] = currentBarValue;
    	if(currentHalfDisc)
    	{
    		this._CDFEDiscValues[this._newCDFEDataIdx] = currentDiscs * 13 + 7;
    	}
    	else
    	{
    		this._CDFEDiscValues[this._newCDFEDataIdx] = currentDiscs * 13;
    	}
    	this._initialEVMode[this._newCDFEDataIdx] = currentHEVMode; 
    }
    else
    {
        this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
        this._CDFEDiscValues[this._newCDFEDataIdx] = 0;
        this._initialEVMode[this._newCDFEDataIdx] = false;
    }

    if(currentHEVMode)
    {
    	this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrentGreen';
    	this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEDiscBg_Green';
    }
    else
    {
    //	this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCore';
    //	this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCore';
    }
    // Update the new value's bar in the CDFE graph
    this._setCDFEGraphBarHeight(this._newCDFEDataIdx,currentHEVMode);
    
    // Turn on left transitions for the CDFE graph (for the next animation)
    this.CDFEGraphArea.style.OTransition = 'left 0.6s ease 0s';
    this.CDFEDiscGraphArea.style.OTransition = 'left 0.6s ease 0s';
    
    // Attach an event listener to the CDFE graph area so we can detect when
    // the slide animation ends (and reset the graph for the next animation)
    this.CDFEGraphArea.addEventListener('oTransitionEnd', this._cbCDFELeftAnimationEnd, false);

    // Set the graph's position, triggering the animation
    // ("normal" left - (width of one bar + bar spacing))
    this.CDFEGraphArea.style.left = '-' + (this._CSSConstants["CDFEGraphBarWidth"] + 
                                            this._CSSConstants["CDFEGraphBarSpacing"]) + 'px';
    
    this.CDFEDiscGraphArea.style.left = '-' + (this._CSSConstants["CDFEGraphBarWidth"] + 
            this._CSSConstants["CDFEGraphBarSpacing"]) + 'px';
    
    this._CDFELineGraphInTransition = true;
    // Update the data sets to discard the oldest historical data
    for (var i = 0; i <= this._youngestCDFEDataIdx; i++)
    {
        this._CDFEGraphBarValues[i] = this._CDFEGraphBarValues[i + 1];
        this._CDFEDiscValues[i] = this._CDFEDiscValues[i + 1];
        this._initialEVMode[i] = this._initialEVMode[i+1]; 
    }

   //if(currentHEVMode)
    if(this._initialEVMode[8])
   {
    	this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCoreCurrentGreen';
    	this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEDiscBg_Green';
    }
    else
    {
    	this.CDFECurrentBar.className = 'FuelConsumptionCtrlCDFEBarGraphCore';
    	this.CDFECurrentDiscBar.className = 'FuelConsumptionCtrlHevCDFEBarGraphCore';
    }
    // Re-initialize the "hidden" slot for new data
    this._CDFEGraphBarValues[this._newCDFEDataIdx] = 0;
    this._CDFEDiscValues[this._newCDFEDataIdx] = 0;
}


FuelConsumptionCtrl.prototype.insertCurrentDriveFuelGraphRight = function(currentBarValue)
{
    log.debug("FuelConsumptionCtrl: insertCurrentDriveFuelGraph() called: currentBarValue = " +
                currentBarValue + ", currentLineValue = ");

    // Add the new bar value to the data set
    if (typeof(currentBarValue) === 'number')
    {
        this._CDFEGraphBarValuesRight[this._newCDFEDataIdxRight] = currentBarValue;
    }
    else
    {
        this._CDFEGraphBarValuesRight[this._newCDFEDataIdxRight] = 0;
    }

    // Update the new value's bar in the CDFE graph
    this._setCDFEGraphBarHeightRight(this._newCDFEDataIdxRight);

    // Turn on left transitions for the CDFE graph (for the next animation)
    this.CDFEGraphAreaRight.style.OTransition = 'left 0.6s ease 0s';

    // Attach an event listener to the CDFE graph area so we can detect when
    // the slide animation ends (and reset the graph for the next animation)
    this.CDFEGraphAreaRight.addEventListener('oTransitionEnd', this._cbCDFELeftAnimationEndRight, false);

    // Set the graph's position, triggering the animation
    // ("normal" left - (width of one bar + bar spacing))
    this.CDFEGraphAreaRight.style.left = '-' + (this._CSSConstants["CDFEGraphBarWidthRight"] + 
                                            this._CSSConstants["CDFEGraphBarSpacingRight"]) + 'px';

    // Update the data sets to discard the oldest historical data
    for (var i = 0; i <= this._youngestCDFEDataIdxRight; i++)
    {
        this._CDFEGraphBarValuesRight[i] = this._CDFEGraphBarValuesRight[i + 1];
    }

    // Re-initialize the "hidden" slot for new data
    this._CDFEGraphBarValuesRight[this._newCDFEDataIdx] = 0;
}

FuelConsumptionCtrl.prototype.initializeCumulativeFuelGraph = function(initialBarValues)
{
    log.debug("FuelConsumptionCtrl: initializeCumulativeFuelGraph() called: initialBarValues = " +
                initialBarValues);

    if (initialBarValues)
    {
        // Initial bar values are in youngest-first order, while displayed values are
        // in left-to-right order (oldest first).  Copy the initialBarValues array to
        // this._CFERGraphBarValues, reversing the order & initializing any omitted
        // data to zero.
        for (var ibvIdx = 0; ibvIdx <= this._youngestCFERDataIdx; ibvIdx++)
        {
            if (initialBarValues[ibvIdx])
            {
                this._CFERGraphBarValues[this._youngestCFERDataIdx - ibvIdx] = initialBarValues[ibvIdx];
            }
            else
            {
                this._CFERGraphBarValues[this._youngestCFERDataIdx - ibvIdx] = 0;
            }
        }

        // Initialize the "hidden" slot for new data
        this._CFERGraphBarValues[this._newCFERDataIdx] = 0;
    }

    // Initialize the CFER graph with bar animations
    this._resetCFERGraph(true);
}

FuelConsumptionCtrl.prototype.insertCurrentCumulativeFuelGraph = function(newResetValue)
{
	var currentBarValue = 0.0;
	this._cumulativeBarValue = '0.0';
	this.updateCurrentCumulativeFuelGraph(currentBarValue);
    // Add the new bar value to the data set
    if (typeof(currentBarValue) === 'number')
    {
        this._CFERGraphBarValues[this._newCFERDataIdx] = newResetValue;
    }
    else
    {
        this._CFERGraphBarValues[this._newCFERDataIdx] = 0.0;
    }
    
    // Update the new value's bar in the CFER graph
    this._setCFERGraphBarHeight(this._newCFERDataIdx);

    // Turn on left transitions for the CFER graph (for the next animation)
    this.CFERGraphArea.style.OTransition = 'left 0.6s ease 0s';

    // Attach an event listener to the CFER graph area so we can detect when
    // the slide animation ends (and reset the graph for the next animation)
    this.CFERGraphArea.addEventListener('oTransitionEnd', this._cbCFERLeftAnimationEnd, false);

    // Set the graph's position, triggering the animation
    // ("normal" left - (width of one bar + bar spacing))
    this.CFERGraphArea.style.left = '-' + (this._CSSConstants["CFERGraphBarWidth"] +
                                            this._CSSConstants["CFERGraphBarSpacing"]) + 'px';

    // Update the data set to discard the oldest historical data
    for (var i = 0; i <= this._currentCFERDataIdx; i++)
    {
        this._CFERGraphBarValues[i] = this._CFERGraphBarValues[i + 1];
    }

    // Re-initialize the "hidden" slot for new data
    this._CFERGraphBarValues[this._newCFERDataIdx] = 0;
}

FuelConsumptionCtrl.prototype.updateCurrentCumulativeFuelGraph = function(currentBarValue, unitRange)
{
    log.debug("FuelConsumptionCtrl: updateCurrentCumulativeFuelGraph() called: currentBarValue = " +
                currentBarValue);
       
    // Save the current bar value
    var tempNumber = currentBarValue;
    
    if(currentBarValue == null)
    {
    	currentBarValue = 0;
    	tempNumber = '--.-';
    }
    else if( currentBarValue == 0)
    {
    	tempNumber = '0.0';
    }
    
    currentBarValue = parseFloat(currentBarValue);
    this._cumulativeBarValue = tempNumber;
    
    // Check if current bar value exceeds the unit range 
    if(currentBarValue > unitRange)
    {
    	currentBarValue = unitRange;
    }
    
    if (typeof(currentBarValue) === 'number')
    {
        this._CFERGraphBarValues[10] = currentBarValue;
    }
    else
    {
        this._CFERGraphBarValues[10] = 0.0;
        tempNumber = '0.0';
    }
    

    
    var currentValueDiv = document.getElementById("CFERBarValueCurrent");
    currentValueDiv.className = 'FuelConsumptionCtrlCFERBarValueCurrent';
    
    currentValueDiv.innerHTML = this._stringToHTML(tempNumber);
    // Update the current bar
    var bar = document.getElementById('CFERBar' + 10);
    if (bar)
    {
    	// Make sure transitions are enabled for the current bar
        bar.style.OTransition = 'height 0.6s ease 0s';
        this.CFERCurrentBarValue.style.OTransition = 'height 0.6s ease 0s';
        // Set the bar's height
        this._setCFERGraphBarHeightNew(9);
    }
}

FuelConsumptionCtrl.prototype.setFuelEfficiency = function(fuelEfficiencyData)
{
    log.debug("FuelConsumptionCtrl: setFuelEfficiency() called: fuelEfficiency = " +
                fuelEfficiencyData.fuelEfficiency + " " +
                fuelEfficiencyData.fuelEfficiencyUnit);

    // Purge any "remembered" data
    this.properties.fuelEfficiencyData = new Object();

    if (fuelEfficiencyData &&
        (fuelEfficiencyData.fuelEfficiency || fuelEfficiencyData.fuelEfficiency == 0)  &&
        fuelEfficiencyData.fuelEfficiencyUnit)
    {
        // Remember the passed-in data
        this.properties.fuelEfficiencyData.fuelEfficiency = fuelEfficiencyData.fuelEfficiency;
        this.properties.fuelEfficiencyData.fuelEfficiencyUnit = fuelEfficiencyData.fuelEfficiencyUnit;

        // Translate the fuel efficiency unit (e.g. "MPG" or "KML") into a readable unit string (e.g. "mpg" or "km/L")
        var fuelEfficiencyUnitText = this._translateString(this.properties.fuelEfficiencyData.fuelEfficiencyUnit,
                                                           this.properties.fuelEfficiencyData.fuelEfficiencyUnit,
                                                           this.properties.subMap);

        // Set the displayed data/unit string
        // **** Add the fuel efficiency "km/L"
        // calculate km/L if the fuel efficiency unit is "L/100km"
        if (fuelEfficiencyUnitText == "L/100km")
        {
                  // Prevent Divide-By-Zero Error
              if (parseFloat(this.properties.fuelEfficiencyData.fuelEfficiency) > 0)   
              {
                    this.fuelEfficiencyValue.innerHTML = this.properties.fuelEfficiencyData.fuelEfficiency + 
                    "</br>" + "</br>" + "</br>" + ((235.214/parseFloat(this.properties.fuelEfficiencyData.fuelEfficiency)).toFixed(1)).toString();
              }
              else
              {   
                    this.fuelEfficiencyValue.innerHTML = this.properties.fuelEfficiencyData.fuelEfficiency + "</br>" + "</br>" + "</br>" + "0.0";
              }
        }
        // calculate km/L if the fuel efficiency unit is "mpg"
        else
        {   
                    this.fuelEfficiencyValue.innerHTML = this.properties.fuelEfficiencyData.fuelEfficiency + 
                    "</br>" + "</br>" + "</br>" + ((parseFloat(this.properties.fuelEfficiencyData.fuelEfficiency)*0.4251).toFixed(1)).toString();
        }
           this.fuelEfficiencyUnit.innerHTML = fuelEfficiencyUnitText + "</br>" + "</br>" + "</br>" + "MPG";
           // **** End of the fuel efficiency "km/L"        
    }
    else
    {
        log.warn("Invalid fuel efficiency data received -- blanking display");

        this.fuelEfficiencyValue.innerHTML = "--.-";
        this.fuelEfficiencyUnit.innerHTML = "";
    }
}

FuelConsumptionCtrl.prototype.setEvDrvDistance = function(evObj)
{
	
	var driveDisUnit = this._translateString(evObj.unitId, evObj.unitId, this.properties.subMap);
	this.fuelEfficiencyHevDistanceUnit.innerHTML = this._stringToHTML(driveDisUnit);
	
	if(evObj.driveDistance !== null)
	{	
		this.fuelEfficiencyHevDistanceValue.innerHTML = evObj.driveDistance;
	}
	else
	{
		this.fuelEfficiencyHevDistanceValue.innerHTML = "--.-" ;
	}
	
	if(evObj.percentValue !== null)
	{
		this.fuelEfficiencyHevPercentValue.innerHTML = "("+evObj.percentValue+"%)";
	}	
	else
	{
		this.fuelEfficiencyHevPercentValue.innerHTML = "(--)" ;
	}
}

FuelConsumptionCtrl.prototype.setUnitInformation = function(obj)
{
	this.properties.cumulativeFuelConfig.yAxisLimitValue = obj.yAxisLimitValue;
	this.properties.currentFuelConfig.yAxisLimitValue = obj.yAxisLimitValue;
	this.properties.cumulativeFuelConfig.yAxisLabelId = obj.yAxisLabelId;
	this.properties.currentFuelConfig.yAxisLabelId = obj.yAxisLabelId;
	
	this.properties.cumulativeFuelConfig.yAxisLabelText =
        this._translateString(this.properties.cumulativeFuelConfig.yAxisLabelId,
                              this.properties.cumulativeFuelConfig.yAxisLabelText,
                              this.properties.subMap);

	this.properties.currentFuelConfig.yAxisLabelText =
        this._translateString(this.properties.currentFuelConfig.yAxisLabelId,
                              this.properties.currentFuelConfig.yAxisLabelText,
                              this.properties.subMap);
	
	this.yZeroLabelCDFE.innerHTML = this.properties.currentFuelConfig.yAxisLabelText;
	this.yLimitValueLabelCDFE.innerHTML = this.properties.currentFuelConfig.yAxisLimitValue;
	this.yZeroLabelCFER.innerHTML = '<br/>' + this.properties.cumulativeFuelConfig.yAxisLabelText;
	this.yLimitValueLabelCFER.innerHTML = this.properties.cumulativeFuelConfig.yAxisLimitValue;
}
/*
  * toggle Ump panel | status == "hidePanel" OR status == "showPanel"
  */
FuelConsumptionCtrl.prototype.toggleUmpPanel = function(status)
{
	if(status == "hidePanel")
	{
		this.umpPanelDiv.className = "UmpPanelDivDisable";
		this.umpCtrl.setRetracted(true);
		this._umpPanelStatus = false;
	}
	else if(status == "showPanel")
	{
		this.umpPanelDiv.className = "UmpPanelDivEnable";
		this.umpCtrl.setRetracted(false);
		this._umpPanelStatus = true;
	}
	else
	{
		log.warn("_triggerUmpPanel called with an unxpected argument: "+status);
	}
}

/**
 * Context capture
 * TAG: framework, public
 * =========================
 * @return {object} - capture data
 */

FuelConsumptionCtrl.prototype.getContextCapture = function()
{
    log.debug("FuelConsumptionCtrl: getContextCapture() called...");
    var controlContextCapture = this.umpCtrl.getContextCapture();
    return controlContextCapture;
};


FuelConsumptionCtrl.prototype.finishPartialActivity = function()
{
    log.debug("FuelConsumptionCtrl: finishPartialActivity() called...");
    this.umpCtrl.finishPartialActivity();
}


/**
 * Context restore
 * TAG: framework, public
 * =========================
 * @return {object} - capture data
 */

FuelConsumptionCtrl.prototype.restoreContext = function(controlContextCapture)
{
    log.debug("EcoEffectCtrl: restoreContext() "+ controlContextCapture);
    this.umpCtrl.restoreContext(controlContextCapture);
};


/*
 * Forward all multicontroller events to our only child control, the "SwitchView" button
 */
FuelConsumptionCtrl.prototype.handleControllerEvent = function(eventId)
{
    log.debug("FuelConsumptionCtrl: handleControllerEvent() called: " + eventId);
    
    // Pass-through
    if(this._umpPanelStatus && this.umpCtrl)
    {
    	response = this.umpCtrl.handleControllerEvent(eventId);
        return response;
    }
    else if(!this._umpPanelStatus && this._switchViewButtonCtrl)
    {
        response = this._switchViewButtonCtrl.handleControllerEvent(eventId);
        return response;
    }
}

FuelConsumptionCtrl.prototype.cleanUp = function()
{
    // Clean up the "Switch View" child button control
    if (this._switchViewButtonCtrl)
    {
        this._switchViewButtonCtrl.cleanUp();
    }
	 if(this.umpCtrl)
	 {
	 	this.umpCtrl.cleanUp();
	 }
}

framework.registerCtrlLoaded("FuelConsumptionCtrl");
/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: NowPlaying4Ctrl.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: apeter9
 Date: 05.01.2013
 __________________________________________________________________________

 Description: IHU GUI NowPlaying4Ctrl

 Revisions:
 v0.1 (01-May-2013) Initial revision
 __________________________________________________________________________

 */

log.addSrcFile("NowPlaying4Ctrl.js", "common");
//log.addSrcFile("NowPlaying4Ctrl.js", "NowPlaying4Ctrl");
// log.setLogLevel("NowPlaying4Ctrl", "debug");

function NowPlaying4Ctrl(uiaId, parentDiv, controlId, properties)
{
    this.uiaId = uiaId;         // (String) UIA ID of the App instantiating this control
    this.controlId = controlId; // (String) ID of this control as assigned by GUIFramework
    this.parentDiv = parentDiv; // (HTMLElement) Reference to the parent div of this control
    this.divElt = null;         // (HTMLElement) Reference to the top level div element of this control

    this.umpCtrl = null;

    // Constants
    this._constants = {
                        MAX_HD_SUBSTATION_COUNT : 8,
                        MAX_RATING_METER_STAR_COUNT : 5,
                        MAX_RATING_IMG_HEIGHT : 29,
                        MAX_RATING_IMG_WIDTH : 146
                      };

    this._styles = {
        "Style0":{"_ctrlTitle"            : "NowPlaying4CtrlHidden",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImage"         : "NowPlaying4CtrlHidden",
                  "_artworkImageBorder"   : "NowPlaying4CtrlHidden",
                  "_audioTitleFrame"      : "NowPlaying4CtrlHidden",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlHidden",
                  "_audioTitle"           : "NowPlaying4CtrlHidden",
                  "_detailLine1Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine1"          : "NowPlaying4CtrlHidden",
                  "_detailLine2Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine2"          : "NowPlaying4CtrlHidden",
                  "_detailLine3Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine3"          : "NowPlaying4CtrlHidden",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style1":{"_ctrlTitle"            : "NowPlaying4CtrlTitle",
                  "_trackDisplay"         : "NowPlaying4CtrlTrackDisplay",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlDetailLine3Frame",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlDetailLine3IconFrame",
                  "_detailLine3"          : "NowPlaying4CtrlDetailLine3",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style2":{"_ctrlTitle"            : "NowPlaying4CtrlTitleFull",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHdDisplayIconImage",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlDetailLine3Frame",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlDetailLine3IconFrame",
                  "_detailLine3"          : "NowPlaying4CtrlDetailLine3",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style3":{"_ctrlTitle"            : "NowPlaying4CtrlTitleFull",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlHidden",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitleStyle3",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1BlockFrame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1Block",
                  "_detailLine2Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine2"          : "NowPlaying4CtrlHidden",
                  "_detailLine3Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine3"          : "NowPlaying4CtrlHidden",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style4":{"_ctrlTitle"            : "NowPlaying4CtrlTitle",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHdDisplayIconImage",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlDetailLine3Frame",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlDetailLine3IconFrame",
                  "_detailLine3"          : "NowPlaying4CtrlDetailLine3",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style5":{"_ctrlTitle"            : "NowPlaying4CtrlTitle",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine3"          : "NowPlaying4CtrlHidden",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlPhoneNumber",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlDistanceDirection",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlRatingMeterFrame",
                  "_rmStarNum1"           : "NowPlaying4CtrlRmStarHollow",
                  "_rmStarNum2"           : "NowPlaying4CtrlRmStarHollow",
                  "_rmStarNum3"           : "NowPlaying4CtrlRmStarHollow",
                  "_rmStarNum4"           : "NowPlaying4CtrlRmStarHollow",
                  "_rmStarNum5"           : "NowPlaying4CtrlRmStarHollow",
                 },
        "Style6":{"_ctrlTitle"            : "NowPlaying4CtrlTitle",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleBlockFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitleBlock",
                  "_detailLine1Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine1"          : "NowPlaying4CtrlHidden",
                  "_detailLine2Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine2"          : "NowPlaying4CtrlHidden",
                  "_detailLine3Frame"     : "NowPlaying4CtrlHidden",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlHidden",
                  "_detailLine3"          : "NowPlaying4CtrlHidden",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
        "Style7":{"_ctrlTitle"            : "NowPlaying4CtrlTitle",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlLoadingImageFrame",
                  "_artworkImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImage"         : "NowPlaying4CtrlHidden",
                  "_artworkImageBorder"   : "NowPlaying4CtrlHidden",
                  "_ctrlSubtitle"         : "NowPlaying4CtrlSubtitle",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleBlockFrame",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlDetailLine3Frame",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlDetailLine3IconFrame",
                  "_detailLine3"          : "NowPlaying4CtrlDetailLine3",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },// ---MZDMOD---
		"Style8":{"_ctrlTitle"            : "NowPlaying4CtrlTitleFull",
                  "_trackDisplay"         : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconFrameLeft"   : "NowPlaying4CtrlTitleIconFrameLeft",
                  //"_ctrlTitleIconImageLeft"   : "NowPlaying4CtrlTitleIconImageLeft",
				          "_ctrlTitleIconFrame"   : "NowPlaying4CtrlHidden",
                  "_ctrlTitleIconImage"   : "NowPlaying4CtrlTitleIconImage",
                  "_hdDisplayFrame"       : "NowPlaying4CtrlHidden",
                  "_hdDisplayIconImage"   : "NowPlaying4CtrlHidden",
                  "_hdSubstNum1"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum2"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum3"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum4"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum5"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum6"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum7"          : "NowPlaying4CtrlHidden",
                  "_hdSubstNum8"          : "NowPlaying4CtrlHidden",
                  "_loadingImageFrame"    : "NowPlaying4CtrlHidden",
                  "_artworkImageFrame"    : "NowPlaying4CtrlArtworkImageDiv",
                  "_artworkImage"         : "NowPlaying4CtrlArtworkImage",
                  "_artworkImageBorder"   : "NowPlaying4CtrlArtworkImageBorder",
                  "_audioTitleFrame"      : "NowPlaying4CtrlAudioTitleFrame",
                  "_audioTitleIconFrame"  : "NowPlaying4CtrlAudioTitleIconFrame",
                  "_audioTitle"           : "NowPlaying4CtrlAudioTitle",
                  "_detailLine1Frame"     : "NowPlaying4CtrlDetailLine1Frame",
                  "_detailLine1IconFrame" : "NowPlaying4CtrlDetailLine1IconFrame",
                  "_detailLine1"          : "NowPlaying4CtrlDetailLine1",
                  "_detailLine2Frame"     : "NowPlaying4CtrlDetailLine2Frame",
                  "_detailLine2IconFrame" : "NowPlaying4CtrlDetailLine2IconFrame",
                  "_detailLine2"          : "NowPlaying4CtrlDetailLine2",
                  "_detailLine3Frame"     : "NowPlaying4CtrlDetailLine3Frame",
                  "_detailLine3IconFrame" : "NowPlaying4CtrlDetailLine3IconFrame",
                  "_detailLine3"          : "NowPlaying4CtrlDetailLine3",
                  "_unformattedTextFrame"       : "NowPlaying4CtrlHidden",
                  "_unformattedText"            : "NowPlaying4CtrlHidden",
                  "_phoneNumberIconFrame" : "NowPlaying4CtrlHidden",
                  "_phoneNumber"          : "NowPlaying4CtrlHidden",
                  "_distanceDirectionIconFrame" : "NowPlaying4CtrlHidden",
                  "_distanceDirection"    : "NowPlaying4CtrlHidden",
                  "_ratingMeterFrame"     : "NowPlaying4CtrlHidden",
                  "_rmStarNum1"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum2"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum3"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum4"           : "NowPlaying4CtrlHidden",
                  "_rmStarNum5"           : "NowPlaying4CtrlHidden",
                 },
    };

    //@formatter:off
    this.properties = {
    	"ctrlStyle"                 : "",
    	"ctrlTitleObj"              : null,
      "ctrlSubtitleObj"           : null,
    	"hdConfigObj"               : null,
    	"trackCount"                : 0,
    	"currentTrackNum"           : 0,
    	"loadingIcon"               : false,
    	"audioTitleObj"             : null,
    	"detailLine1Obj"            : null,
    	"detailLine2Obj"            : null,
    	"detailLine3Obj"            : null,
    	"unformattedTextObj"        : null,
      "artworkImagePath"          : "",
    	"noArtworkImagePath"        : "",
    	"phoneNumber"               : "",
    	"distanceDirection"         : "",
    	"rating"                    : 0,
    	"umpConfig"                 : null,
    };
    //@formatter:on

    for (var i in properties)
    {
        this.properties[i] = properties[i];
    }

    this._createStructure();
}

NowPlaying4Ctrl.prototype._init = function()
{
    // Configure the control, based on the passed-in instantiation properties
    this.setNowPlayingConfig(this.properties);
};

NowPlaying4Ctrl.prototype._createStructure = function()
{
    // create the div for control
    this.divElt = document.createElement('div');
        this.divElt.className = "NowPlaying4Ctrl";
        this.divElt.id = this.controlId;

    // create div for control title
    this._ctrlTitle = document.createElement('div');
    this._ctrlTitle.className = "NowPlaying4CtrlTitle";
        this.divElt.appendChild(this._ctrlTitle);

    // create span for track display
    this._trackDisplay = document.createElement("span");
    this._trackDisplay.className = "NowPlaying4CtrlTrackDisplay";
        this.divElt.appendChild(this._trackDisplay);

  	// ---MZDMOD---
  	// Only for style8
  	// create div for control title's icon, left most
  	// CSS file also updated to set to left of title
    this._ctrlTitleIconFrameLeft = document.createElement('div');
    this._ctrlTitleIconFrameLeft.className = "NowPlaying4CtrlTitleIconFrameLeft";
        this.divElt.appendChild(this._ctrlTitleIconFrameLeft);

    // create div for control title's icon
    this._ctrlTitleIconFrame = document.createElement('div');
    this._ctrlTitleIconFrame.className = "NowPlaying4CtrlTitleIconFrame";
        this.divElt.appendChild(this._ctrlTitleIconFrame);

    // create image for control title's icon
    this._ctrlTitleIconImage = document.createElement('img');
    this._ctrlTitleIconImage.className = "NowPlaying4CtrlTitleIconImage";
        this._ctrlTitleIconFrame.appendChild(this._ctrlTitleIconImage);

     // create div for loading image
    this._loadingImageFrame = document.createElement('div');
    this._loadingImageFrame.className = "NowPlaying4CtrlHidden";
        this.divElt.appendChild(this._loadingImageFrame);

    // create div for HD display
    this._hdDisplayFrame = document.createElement('div');
    this._hdDisplayFrame.className = "NowPlaying4CtrlHdDisplayFrame";
        this.divElt.appendChild(this._hdDisplayFrame);

    // create image for HD display's icon
    this._hdDisplayIconImage = document.createElement('img');
    this._hdDisplayIconImage.className = "NowPlaying4CtrlHdDisplayIconImage";
        this._hdDisplayFrame.appendChild(this._hdDisplayIconImage);

    // create div's for HD substation indicators
    for (var hdSubstNum = 1; hdSubstNum <= this._constants.MAX_HD_SUBSTATION_COUNT; hdSubstNum++)
    {
        this["_hdSubstNum" + hdSubstNum] = document.createElement('div');
        this["_hdSubstNum" + hdSubstNum].style.left = (35 + ((hdSubstNum - 1) * 14)) + "px";
        this["_hdSubstNum" + hdSubstNum].innerText = "" + hdSubstNum;
        this._hdDisplayFrame.appendChild(this["_hdSubstNum" + hdSubstNum]);
    }

    // create div for artwork image
    this._artworkImageFrame = document.createElement('div');
    this._artworkImageFrame.className = "NowPlaying4CtrlArtworkImageDiv";
        this.divElt.appendChild(this._artworkImageFrame);

    // create img for artwork image
    this._artworkImage = document.createElement('img');
    this._artworkImage.className = "NowPlaying4CtrlArtworkImage";
    	this._artworkImageFrame.appendChild(this._artworkImage);

    // create div for artwork image border
    this._artworkImageBorder = document.createElement('div');
    this._artworkImageBorder.className = "NowPlaying4CtrlArtworkImageBorder";
    	this._artworkImageFrame.appendChild(this._artworkImageBorder);

    // create div for audio info box
    this._infoBox = document.createElement('div');
    this._infoBox.className = "NowPlaying4CtrlInfoBox";
        this.divElt.appendChild(this._infoBox);

    // create div for control subtitle
    this._ctrlSubtitle = document.createElement('div');
    this._ctrlSubtitle.className = "NowPlaying4CtrlSubtitle";
        this._infoBox.appendChild(this._ctrlSubtitle);

    // create div for song title line
    this._audioTitleFrame = document.createElement('div');
    this._audioTitleFrame.className = "NowPlaying4CtrlAudioTitleFrame";
        this._infoBox.appendChild(this._audioTitleFrame);

    // create div for song title's icon
    this._audioTitleIconFrame = document.createElement('div');
    this._audioTitleIconFrame.className = "NowPlaying4CtrlAudioTitleIconFrame";
        this._audioTitleFrame.appendChild(this._audioTitleIconFrame);

    // create span for song title
    this._audioTitle = document.createElement("span");
    this._audioTitle.className = "NowPlaying4CtrlAudioTitle";
        this._audioTitleFrame.appendChild(this._audioTitle);

    // create div for artist name line
    this._detailLine1Frame = document.createElement('div');
    this._detailLine1Frame.className = "NowPlaying4CtrlDetailLine1Frame";
        this._infoBox.appendChild(this._detailLine1Frame);

    // create div for artist name's icon
    this._detailLine1IconFrame = document.createElement('div');
    this._detailLine1IconFrame.className = "NowPlaying4CtrlDetailLine1IconFrame";
        this._detailLine1Frame.appendChild(this._detailLine1IconFrame);

    // create span for artist name
    this._detailLine1 = document.createElement('div');
    this._detailLine1.className = "NowPlaying4CtrlDetailLine1";
        this._detailLine1Frame.appendChild(this._detailLine1);

    // create div for album title line
    this._detailLine2Frame = document.createElement('div');
    this._detailLine2Frame.className = "NowPlaying4CtrlDetailLine2Frame";
        this._infoBox.appendChild(this._detailLine2Frame);

    // create div for album title's icon
    this._detailLine2IconFrame = document.createElement('div');
    this._detailLine2IconFrame.className = "NowPlaying4CtrlDetailLine2IconFrame";
        this._detailLine2Frame.appendChild(this._detailLine2IconFrame);

    // create span for album title
    this._detailLine2 = document.createElement('div');
    this._detailLine2.className = "NowPlaying4CtrlDetailLine2";
        this._detailLine2Frame.appendChild(this._detailLine2);

    // create div for "other" line
    this._detailLine3Frame = document.createElement('div');
    this._detailLine3Frame.className = "NowPlaying4CtrlDetailLine3Frame";
        this._infoBox.appendChild(this._detailLine3Frame);

    // create div for "other"'s icon
    this._detailLine3IconFrame = document.createElement('div');
    this._detailLine3IconFrame.className = "NowPlaying4CtrlDetailLine3IconFrame";
        this._detailLine3Frame.appendChild(this._detailLine3IconFrame);

    // create span for "other"
    this._detailLine3 = document.createElement('div');
    this._detailLine3.className = "NowPlaying4CtrlDetailLine3";
        this._detailLine3Frame.appendChild(this._detailLine3);

    //create div for unformatted Text Frame
    this._unformattedTextFrame = document.createElement('div');
    this._unformattedTextFrame.className = "NowPlaying4CtrlUnformattedTextFrame";
    this._infoBox.appendChild(this._unformattedTextFrame);

    // create div for unformattedText
    this._unformattedText = document.createElement('div');
    this._unformattedText.className = "NowPlaying4CtrlUnformattedText";
        this._unformattedTextFrame.appendChild(this._unformattedText);

    // create div for phone number's icon
    this._phoneNumberIconFrame = document.createElement('div');
    this._phoneNumberIconFrame.style.backgroundImage = "url(common/controls/NowPlaying4/images/IcnAhaPhone.png)";
    this._phoneNumberIconFrame.className = "NowPlaying4CtrlPhoneNumberIconFrame";
        this.divElt.appendChild(this._phoneNumberIconFrame);

    // create span for phone number
    this._phoneNumber = document.createElement("span");
    this._phoneNumber.className = "NowPlaying4CtrlPhoneNumber";
        this.divElt.appendChild(this._phoneNumber);

    // create div for phone number's icon
    this._distanceDirectionIconFrame = document.createElement('div');
    this._distanceDirectionIconFrame.style.backgroundImage = "url(common/controls/NowPlaying4/images/IcnAhaGlobe.png)";
    this._distanceDirectionIconFrame.className = "NowPlaying4CtrlDistanceDirectionIconFrame";
        this.divElt.appendChild(this._distanceDirectionIconFrame);

    // create span for distance & direction
    this._distanceDirection = document.createElement("span");
    this._distanceDirection.className = "NowPlaying4CtrlDistanceDirection";
        this.divElt.appendChild(this._distanceDirection);

    // create div for rating meter
    this._ratingMeterFrame = document.createElement('div');
    this._ratingMeterFrame.className = "NowPlaying4CtrlRatingMeterFrame";
        this.divElt.appendChild(this._ratingMeterFrame);

    // create alternate div for custom rating meter
    this._customRatingDiv = document.createElement('div');
    this._customRatingDiv.className = "NowPlaying4CtrlCustomRatingDiv";
        this.divElt.appendChild(this._customRatingDiv);

    // create div's for rating meter stars
    for (var rmStarNum = 1; rmStarNum <= this._constants.MAX_RATING_METER_STAR_COUNT; rmStarNum++)
    {
        this["_rmStarNum" + rmStarNum] = document.createElement('div');
        this["_rmStarNum" + rmStarNum].style.left = ((rmStarNum - 1) * 29) + "px";
        this._ratingMeterFrame.appendChild(this["_rmStarNum" + rmStarNum]);
    }

    // attach control to parent
    this.parentDiv.appendChild(this.divElt);

    log.debug("Instantiating umpCtrl...");
    this.umpCtrl = framework.instantiateControl(this.uiaId,
                                                this.divElt,
                                                "Ump3Ctrl",
                                                this.properties.umpConfig);
    this._init();
};

NowPlaying4Ctrl.prototype._updateTrackDisplay = function()
{
    var trackDisplayStr = "" + this.properties.currentTrackNum;

    if (this.properties.trackCount > 0)
    {
        trackDisplayStr += "/" + this.properties.trackCount;
    }

    this._trackDisplay.innerText = trackDisplayStr;
};

NowPlaying4Ctrl.prototype._updateRatingMeter = function()
{
    var rmStarClassName;

    this._customRatingDiv.className = "NowPlaying4CtrlHidden";
    if (this.properties.rating === -1 || this.properties.ctrlStyle !== "Style5")
    {
        this._ratingMeterFrame.className = "NowPlaying4CtrlHidden";
        log.debug("Rating only visible in Style5");
    }
    else
    {
        this._ratingMeterFrame.className = "NowPlaying4CtrlRatingMeterFrame";
        for (var rmStarNum = 1; rmStarNum <= this._constants.MAX_RATING_METER_STAR_COUNT; rmStarNum++)
        {
            rmStarClassName = "NowPlaying4CtrlRmStar";
            if (this.properties.rating < rmStarNum - 0.5)
            {
                rmStarClassName += "Hollow";
            }
            else if (this.properties.rating < rmStarNum)
            {
                rmStarClassName += "Half";
            }
            else
            {
                rmStarClassName += "Filled";
            }
            log.debug("_updateRatingMeter(" + rmStarNum + "): " + rmStarClassName);
            this["_rmStarNum" + rmStarNum].className = rmStarClassName;
        }
    }
};

NowPlaying4Ctrl.prototype._updateHdSubstationStyles = function()
{
    if (this.properties.hdConfigObj)
    {
        // Scan all of the substation configurations
        for (var i = 1; i <= this._constants.MAX_HD_SUBSTATION_COUNT; i++)
        {
            // Local copy of the current substation configuration
            var hdSubst = this.properties.hdConfigObj.hdSubstList[i - 1];

            // If the substation is active while the tuner is unlocked, ...
            if ((hdSubst === "Active") &&
                this.properties.hdConfigObj.hdStatus !== "Locked")
            {
                // ... override the configuation so it appears inactive
                hdSubst = "Inactive";
            }

            // Set the class name based on the substation configuration
            switch (hdSubst)
            {
                case "Active":
                    // HD substation number is visible and highlighted
                    this["_hdSubstNum" + i].className = "NowPlaying4CtrlHdSubst" + i + "Active";
                    break;
                case "Inactive":
                    // HD substation number is visible, but greyed out
                    this["_hdSubstNum" + i].className = "NowPlaying4CtrlHdSubst" + i;
                    break;
                default:
                    // Anything else ("Unavailable" or "Undefined") is hidden (gap in display)
                    this["_hdSubstNum" + i].className = "NowPlaying4CtrlHidden";
                    break;
            }
        }

        // Adjust control title width to make room for HD display
        this._ctrlTitle.className = "NowPlaying4CtrlTitle";

        // Make the HD display visible
        this._hdDisplayFrame.className = "NowPlaying4CtrlHdDisplayFrame";

        // Make sure any branding image is hidden (without clearing its definition)
        this._ctrlTitleIconFrame.className = "NowPlaying4CtrlHidden";
    }
    else
    {
        // Scan all of the substation configurations & hide the displays
        for (var i = 1; i <= this._constants.MAX_HD_SUBSTATION_COUNT; i++)
        {
            this["_hdSubstNum" + i].className = "NowPlaying4CtrlHidden";
        }

        // Hide the HD display
        this._hdDisplayFrame.className = "NowPlaying4CtrlHidden";

        // If there's a branding image available, ...
        if (this.properties.ctrlTitleObj &&
            this.properties.ctrlTitleObj.ctrlTitleIcon)
        {
            // ... re-display it
            this.setBrandImage(this.properties.ctrlTitleObj.ctrlTitleIcon);
        }
    }
};

/* hides formatted text (song title, album name, artist name, genre name) to show unformatted text
 */

NowPlaying4Ctrl.prototype._hideFormattedText = function()
{
    this._audioTitleFrame.className = "NowPlaying4CtrlHidden";
    this._detailLine1Frame.className = "NowPlaying4CtrlHidden";
    this._detailLine2Frame.className = "NowPlaying4CtrlHidden";
    this._detailLine3Frame.className = "NowPlaying4CtrlHidden";
};


NowPlaying4Ctrl.prototype.setNowPlayingConfig = function(config)
{
    log.debug("setNowPlayingConfig() called...");

    // workaround for references, loadingIcon through setNowPlayingConfig
    var loadingIcon = false;

    // ---MZDMOD---
    // Add style8
    // Control style
    if (config.ctrlStyle &&
        ((config.ctrlStyle === "Style0") ||
         (config.ctrlStyle === "Style1") ||
         (config.ctrlStyle === "Style2") ||
         (config.ctrlStyle === "Style3") ||
         (config.ctrlStyle === "Style4") ||
         (config.ctrlStyle === "Style5") ||
         (config.ctrlStyle === "Style6") ||
         (config.ctrlStyle === "Style7") ||
         (config.ctrlStyle === "Style8")))
    {
        this.properties.ctrlStyle = config.ctrlStyle;
        loadingIcon = config.loadingIcon;
    }
    else
    {
        log.warn("Invalid control style \"" + config.ctrlStyle + "\" found -- defaulting to Style0!");
        this.properties.ctrlStyle = "Style0";
    }

    // Set control background
    if (this.properties.ctrlStyle === "Style0")
    {
        this.showBackgroundImage(false);
    }

    // Set control element styles
    for (var i in this._styles[this.properties.ctrlStyle])
    {
        this[i].className = this._styles[this.properties.ctrlStyle][i];
    }

    // Control Title (playlist, folder, etc.)
    this.setCtrlTitle(config.ctrlTitleObj);

    // HD Substation List
    this.setHdConfig(config.hdConfigObj);

    // Subtitle (for Style7)
    this.setCtrlSubtitle(config.ctrlSubtitleObj);

    // Audio Title (song/track)
    this.setAudioTitle(config.audioTitleObj);

    // Detail lines (Artist, Album, etc.)
    this.setDetailLine1(config.detailLine1Obj);
    this.setDetailLine2(config.detailLine2Obj);
    this.setDetailLine3(config.detailLine3Obj);

    if (this.properties.ctrlStyle === "Style7")
    {
        // No Album artwork div in this style
        this.clearArtworkImage();

        // restore config.loadingIcon, same as in properties
        config.loadingIcon = loadingIcon;
        // check for loading property
        if(config.loadingIcon)
        {
           this.setLoadingIcon(config.loadingIcon);
        }

        if(config.unformattedTextObj)
        {
            this.setUnformattedText(config.unformattedTextObj);
            this._unformattedTextFrame.className = "NowPlaying4CtrlUnformattedTextFrame";
        }
    }
    else
    {
        // "No Artwork" Image
        // Set this before calling setArtworkImagePath() so
        // the default "no-artwork" image is properly configured
        this.setNoArtworkImagePath(config.noArtworkImagePath);

        // Artwork Image
        this.setArtworkImagePath(config.artworkImagePath);
    }

    // Track display
    if (config.currentTrackNum)
    {
        this.setCurrentTrackNum(config.currentTrackNum);
    }
    this.setTrackCount(config.trackCount);

    // Phone number
    this.setPhoneNumber(config.phoneNumber);

    // Distance & direction
    this.setDistanceDirection(config.distanceDirection);

    // Rating meter
    this.setRating(config.rating);
};

/*
 * Utility function to set visible text strings on the control.
 * The text being set is checked for "</span>" tags and, if present,
 * uses the .innerHTML setter API on the DOM element to set the text.
 * Otherwise, it uses the .innerText setter API.
 *
 * This allows the use of strings with embedded <span> tags, e.g.
 * specifying classes on text fragments for strings with varying
 * font heights.
 *
 * Arguments:
 *     elt - The DOM element whose text is being set
 *     txt - The text string being set.
 */
NowPlaying4Ctrl.prototype._setInnerTextOrHTML = function(elt, txt)
{
    if (elt)
    {
        if (txt)
        {
            if(utility.toType(txt) == 'string')
            {
                var spanCloseIdx = txt.search("</span>");
                if (spanCloseIdx >= 0)
                {
                    // String has some embedded HTML, so use the appropriate API to set it
                    elt.innerHTML = txt;
                }
                else
                {
                    // String has no embedded HTML -- use the original text-only API to set it
                    elt.innerText = txt;
                }
            }
            else
            {
                elt.innerText = txt;
            }
        }
        else
        {
            elt.innerText = "";
        }
    }
};

/*
 * Public utility function for handling frequency & unit strings with multiple font characteristics.
 * It builds the correct HTML snippet for styling the text fragments correctly on a single visible line.
 *
 * Arguments:
 *    frequency: The radio frequency to be displayed (e.g. '96.7').
 *    units: The frequency units (e.g. 'MHz') to be displayed.
 *        NOTE: According to the language team, the frequency units always appear in English and are never
 *              translated; therefore, we use the passed-in string as-is.
 */
NowPlaying4Ctrl.prototype.getFrequencyAndUnitsText = function(frequency, units)
{
    var frequencyAndUnitText = "";

    if (frequency && units)
    {
        frequencyAndUnitText = '<span class="NowPlaying4CtrlFreqFragment">' + frequency + ' </span>' +
                               '<span class="NowPlaying4CtrlUnitFragment">' + units + '</span>';
    }

    return frequencyAndUnitText;
};

/*
 * Deprecated API
 */
NowPlaying4Ctrl.prototype.getStyle15FrequencyAndUnitsText = function(frequency, units)
{
    log.warn("Nowplaying4Ctrl : Deprecated function - use getFrequencyAndUnitsText API instead.")
	return this.getFrequencyAndUnitsText(frequency,units);
};

/*
 * Public utility function for handling Style15 radio station & relay station strings with multiple font characteristics.
 * It builds the correct HTML snippet for styling the text fragments correctly on a single visible line.
 * NOTE: There are currently (11/20/2015) two design studio options, A and B, for handling the relay station:
 *      A: Radio station followed by relay station, in parentheses, all on one line.
 *      B: Radio station and relay station on separate lines.
 *    This API should be used in either case to get the correct styling for the radio station (e.g. semi-bold font),
 *    even if the 'relay' parameter is null (for Option B).
 *
 * Arguments:
 *    station: The radio station string.
 *    relay: The relay station string (should be 'null' if using design studio option B).
 */
NowPlaying4Ctrl.prototype.getStationAndRelayText = function(station, relay)
{
    var stationAndRelayText = "";

    if (station && relay)
    {
        stationAndRelayText = '<span class="NowPlaying4CtrlStationFragment">' + station + ' </span>' +
                              '<span class="NowPlaying4CtrlRelayFragment">(' + relay + ')</span>';
    }
    else if (station)
    {
        stationAndRelayText = '<span class="NowPlaying4CtrlStationFragment">' + station + '</span>';
    }

    return stationAndRelayText;
};

/*
 * Deprecated API
 */
NowPlaying4Ctrl.prototype.getStyle15StationAndRelayText = function(station, relay)
{
    log.warn("Nowplaying4Ctrl : Deprecated function - use getStationAndRelayText API instead.")
	return this.getStationAndRelayText(station,relay);
};

NowPlaying4Ctrl.prototype.setCtrlTitle = function(ctrlTitleObj)
{
    log.debug("setCtrlTitle() called...");

    if (ctrlTitleObj)
    {
        this.properties.ctrlTitleObj = new Object();

        if (ctrlTitleObj.ctrlTitleId)
        {
            this.properties.ctrlTitleObj.ctrlTitle = framework.localize.getLocStr(this.uiaId,
                                                                                  ctrlTitleObj.ctrlTitleId,
                                                                                  ctrlTitleObj.subMap);
            this._setInnerTextOrHTML(this._ctrlTitle, this.properties.ctrlTitleObj.ctrlTitle);
        }
        else if (ctrlTitleObj.ctrlTitleText)
        {
            this.properties.ctrlTitleObj.ctrlTitle = ctrlTitleObj.ctrlTitleText;
            this._setInnerTextOrHTML(this._ctrlTitle, this.properties.ctrlTitleObj.ctrlTitle);
        }
        else
        {
            this._ctrlTitle.innerText = "";
        }

        if (ctrlTitleObj.ctrlTitleIcon)
        {
            // ---MZDMOD---

            this.properties.ctrlTitleObj.ctrlTitleIcon = ctrlTitleObj.ctrlTitleIcon;
            //this.setBrandImage(this.properties.ctrlTitleObj.ctrlTitleIcon);
            //Style8 is only used for USB audio, this will set a left most icon
            if (this.properties.ctrlStyle === "Style8")
            {
                this._ctrlTitleIconFrameLeft.style.backgroundImage = "url(" + this.properties.ctrlTitleObj.ctrlTitleIcon + ")";
            }
            else
            {
                this.setBrandImage(this.properties.ctrlTitleObj.ctrlTitleIcon);
            }
        }
    }
    else
    {
        this._ctrlTitle.innerText = "";
    }
};

/*
 * Fully configure the HD substation display.  This display consists of an "HD" logo
 * and up to 8 substation numbers ("1" through "8"), indicating available digital
 * audio substations.
 *
 * Arguments:
 *  hdConfigObj - An object with the following component fields:
 *      hdSubstAry - An array of substation configuration strings, one per substation,
 *                   with one of the following values:
 *                   "Active" - The currently-tuned substation.  If the HD tuner status
 *                      is "Locked", this substation will be highlighted.
 *                      NOTE: Only one substation can be active at a time.  If two
 *                            substations are marked "Active", the lower-numbered
 *                            one will be configured as "Inactive" (see below).
 *                   "Inactive" - A substation that has been detected by the HD tuner
 *                      (and is available for listening), but is not currently playing.
 *                   "Unavailable" - A substation that hasn't been detected yet by the
 *                      HD tuner.  "Unavailable" substation labels will not be displayed.
 *                      (Unrecognized configuration strings are treated as "Unavailable".)
 *
 *                   Substation [n] in the array corresponds to substation number (n+1);
 *                   displayed substation numbers are one-based (1-8).  For example: to
 *                   show substation #3 as the currently-playing substation, set
 *                   substAry[2] = "Active" in your application.
 *      hdStatus - A string indicating the status of the HD tuner's signal lock.  See
 *                   setHdStatus() below for details.
 *      hdSubstPresetNum - A substation number supplied when responding to a user's
 *                   preset selection, triggering special display handling (see
 *                   "Usage" below for details).
 *
 * Usage:
 *  Because the available subchannels are not known until the HD radio actually tunes
 *  to a particular frequency (for up to four seconds), an application should call
 *  setHdConfig() with an updated substation list whenever substations are detected or
 *  lost (e.g. due to changing reception conditions).
 *
 *  If an HD substation is tuned because of a user's preset selection, the display
 *  needs to indicate that substation's availability before it can be detected by the
 *  radio hardware. To this end, setting the "hdSubstPresetNum" will give a display
 *  consisting solely of the "HD" logo and that single substation, without the normal
 *  "gaps" for unavailable substations.  (This display is still subject to the tuner
 *  lock status rules -- see setHdStatus() below for details.)
 *
 *  It is expected that "hdSubstPresetNum" will NOT be used in later calls to
 *  setHdConfig(), once the HD tuner starts detecting substations normally (allowing
 *  multiple substations to appear, with gaps for unavailable substations).
 */
NowPlaying4Ctrl.prototype.setHdConfig = function(hdConfigObj)
{
    log.debug("setHdConfig() called...");

    if (hdConfigObj)
    {
        // Make sure the control style supports displaying HD substations
        if ((this.properties.ctrlStyle === "Style2") ||
            (this.properties.ctrlStyle === "Style4"))
        {
            // Initialize the internal HD configuration object
            this.properties.hdConfigObj = new Object();
            this.properties.hdConfigObj.hdSubstList = new Array();

            // If we have a valid HD substation preset number, ...
            if (hdConfigObj.hdSubstPresetNum &&
                (utility.toType(hdConfigObj.hdSubstPresetNum) == 'number') &&
                (hdConfigObj.hdSubstPresetNum >= 1) &&
                (hdConfigObj.hdSubstPresetNum <= this._constants.MAX_HD_SUBSTATION_COUNT))
            {
                // ... special initialization!
                // Set HD substation configuration for preset in first slot to "Active"
                this.properties.hdConfigObj.hdSubstList[0] = "Active";
                for (var i = 1; i < this._constants.MAX_HD_SUBSTATION_COUNT; i++)
                {
                    // Other HD substations are unavailable
                    this.properties.hdConfigObj.hdSubstList[i] = "Unavailable";
                }

                // Remember we've got a preset
                this.properties.hdConfigObj.hdSubstPresetNum = hdConfigObj.hdSubstPresetNum;

                // Update the displayed label to match the preset number
                this["_hdSubstNum1"].innerText = "" + hdConfigObj.hdSubstPresetNum;
            }
            else
            {
                var activeSubstNum = null;

                // No preset defined -- initialize the HD substation configuration normally
                // Configure the first 8 substation definitions (at most)
                for (var i = 0; i < this._constants.MAX_HD_SUBSTATION_COUNT; i++)
                {
                    if (hdConfigObj.hdSubstList[i] &&
                        ((hdConfigObj.hdSubstList[i] === "Active") ||
                         (hdConfigObj.hdSubstList[i] === "Inactive") ||
                         (hdConfigObj.hdSubstList[i] === "Unavailable")))
                    {
                        // Copy valid configurations as-is to internal array
                        this.properties.hdConfigObj.hdSubstList[i] = hdConfigObj.hdSubstList[i];
                        if (hdConfigObj.hdSubstList[i] === "Active")
                        {
                            // Track the new active HD substation (by number, not index)
                            activeSubstNum = i + 1;
                        }
                    }
                    else
                    {
                        // Anything else (incl. null) is unavailable
                        this.properties.hdConfigObj.hdSubstList[i] = "Unavailable";
                    }
                }

                if (activeSubstNum)
                {
                    // We've got an active HD substation -- set it
                    this.setActiveHdSubstation(activeSubstNum);
                }

                // Make sure the first slot's displayed label is correct
                // (if we're following a call to setHdConfig() for a preset)
                this["_hdSubstNum1"].innerText = "1";
            }

            // Update the global HD tuner lock status
            // (also updates the appearance of all of the HD substation styles)
            this.setHdStatus(hdConfigObj.hdStatus);
        }
        else
        {
            log.warn("HD substation configuration not allowed in " + this.properties.ctrlStyle);
        }
    }
};

/*
 * Update the control based on the status of the HD radio tuner.  Use this API
 * anytime the radio hardware notifies the application (via MMUI) of a change
 * in the HD tuner state.
 * Arguments:
 *  hdStatus - A string describing one of the available HD tuner states, as
 *             follows:
 *      "Locked"   - HD tuner is locked on; audio is available.  The "HD" logo
 *                   and the currently "Active" substation (if any) are
 *                   highlighted.
 *      "NoLock"   - HD tuner is searching for signal.  The "HD" logo & all
 *                   known substations are greyed out.
 *      "Disabled" - HD tuner has taken too long to lock on, or user has
 *                   turned off HD radio feature;  no digital substations are
 *                   available.  All substations and the "HD" logo disappear.
 *                   The user must re-tune radio to try again.
 *
 *  NOTE: Calling setHdStatus() with either "TimedOut" or "Disabled"
 *        will purge the control's internal HD substation configuration.  You
 *        must call setHdConfig() again (with a substation list or preset
 *        number) to see the HD substation display again -- just setting the
 *        tuner status with this API will not be sufficient.
 */
NowPlaying4Ctrl.prototype.setHdStatus = function(hdStatus)
{
    log.debug("setHdStatus(" + hdStatus + ")");

    if (this.properties.hdConfigObj)
    {
        // Cache the status update
        this.properties.hdConfigObj.hdStatus = hdStatus;

        switch(this.properties.hdConfigObj.hdStatus)
        {
            case "Locked":
                // Configure the HD display with the enabled Airbiquity HD logo
                this._hdDisplayIconImage.src = "common/controls/NowPlaying4/images/Logo_HD.png";
                break;

            case "NoLock":
                // Configure the HD display with the disabled Airbiquity HD logo
                this._hdDisplayIconImage.src = "common/controls/NowPlaying4/images/Logo_HD_Gray.png";
                break;

            case "Disabled":
                // The HD tuner lock has timed out or been turned off --
                // discard all HD configuration information & hide everything
                this.properties.hdConfigObj = null;

                // Restore any configured branding image
                if (this.properties.ctrlTitleObj &&
                    this.properties.ctrlTitleObj.ctrlTitleIcon)
                {
                    this.setBrandImage(this.properties.ctrlTitleObj.ctrlTitleIcon);
                }

                break;

            default:
                log.warn("setHdStatus(): invalid status \"" + hdStatus +
                         "\" received");
                break;
        }

        // Update the appearance of all of the HD substation styles
        this._updateHdSubstationStyles();
    }
};

/*
 * Utility method to set the active HD substation.  May be useful when the
 * substation configuration list hasn't changed (e.g. tune up/down).
 * Arguments:
 *  substNum - The HD substation number to activate.
 *             NOTE: Substation numbers are one-based (1-8),
 *                   not zero-based (0-7)!
 */
NowPlaying4Ctrl.prototype.setActiveHdSubstation = function(substNum)
{
    log.debug("setActiveHdSubstation(" + substNum + ")");

    if (this.properties.hdConfigObj &&
        substNum &&
        (utility.toType(substNum) == 'number') &&
        (substNum >= 1) &&
        (substNum <= this._constants.MAX_HD_SUBSTATION_COUNT))
    {
        // Is there a preset active?
        if (this.properties.hdConfigObj.hdSubstPresetNum)
        {
            // Yes -- move the preset to its rightful position
            this.properties.hdConfigObj.hdSubstList[this.properties.hdConfigObj.hdSubstPresetNum - 1] =
                this.properties.hdConfigObj.hdSubstList[0];

            // Clean up the first slot
            this.properties.hdConfigObj.hdSubstList[0] = "Unavailable";
            this["_hdSubstNum1"].innerText = "1";

            // Discard the preset definition
            this.properties.hdConfigObj.hdSubstPresetNum = undefined;
        }

        for (var i = 0; i < this._constants.MAX_HD_SUBSTATION_COUNT; i++)
        {
            // Find other substation(s) that are currently active ...
            if ((substNum != (i + 1)) &&
                (this.properties.hdConfigObj.hdSubstList[i] === "Active"))
            {
                // ... and make sure they're inactive (only one active substation at a time)
                this.properties.hdConfigObj.hdSubstList[i] = "Inactive";
            }
        }

        // Set the indicated substation as active
        this.properties.hdConfigObj.hdSubstList[substNum - 1] = "Active";

        // Update the appearance of all of the HD substation styles
        this._updateHdSubstationStyles();
    }
};

NowPlaying4Ctrl.prototype.setLoadingIcon = function(loading)
{
    if(this.properties.ctrlStyle == 'Style7')
    {
       this.properties.loadingIcon = loading;
       if (this.properties.loadingIcon === true)
       {
           this._loadingImageFrame.classList.add('loading');
           if(this._ctrlTitleIconFrame.className === "NowPlaying4CtrlHidden")
           {
               this._ctrlTitle.className =  "NowPlaying4CtrlTitle";
           }
           else
           {
               this._ctrlTitleIconFrame.className = "NowPlaying4CtrlHidden";
           }
        }
        else
        {
           this._loadingImageFrame.classList.remove('loading');

           if (this._ctrlTitleIconImage.src != "")
           {
                this._ctrlTitleIconFrame.className = "NowPlaying4CtrlTitleIconFrame";
           }
           else
           {
               this._ctrlTitle.className = "NowPlaying4CtrlTitleFull";
           }
        }
    }
};

NowPlaying4Ctrl.prototype.setCtrlSubtitle = function(ctrlSubtitleObj)
{
    log.debug("setCtrlSubtitle() called...");

    if (this.properties.ctrlStyle === "Style7")
    {
        var styleName = this._styles[this.properties.ctrlStyle]["_ctrlSubtitle"];

        if (ctrlSubtitleObj)
        {
            this.properties.ctrlSubtitleObj = new Object();

            if (ctrlSubtitleObj.ctrlSubtitleId)
            {
                this.properties.ctrlSubtitleObj.ctrlSubtitle = framework.localize.getLocStr(this.uiaId,
                                                                                        ctrlSubtitleObj.ctrlSubtitleId,
                                                                                        ctrlSubtitleObj.subMap);
                this._setInnerTextOrHTML(this._ctrlSubtitle, this.properties.ctrlSubtitleObj.ctrlSubtitle);
            }
            else if (ctrlSubtitleObj.ctrlSubtitleText)
            {
                this.properties.ctrlSubtitleObj.ctrlSubtitle = ctrlSubtitleObj.ctrlSubtitleText;
                this._setInnerTextOrHTML(this._ctrlSubtitle, this.properties.ctrlSubtitleObj.ctrlSubtitle);
            }
            else
            {
                this._ctrlSubtitle.innerText = "";
                styleName = "NowPlaying4CtrlHidden";
            }

            // No Icon allowed in this object
        }
        else
        {
            this._ctrlSubtitle.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }

        // Update the style to show/hide the line (so missing lines collapse properly)
        this._ctrlSubtitle.className = styleName;
    }
};

NowPlaying4Ctrl.prototype.setAudioTitle = function(audioTitleObj)
{
    log.debug("setAudioTitle() called...");

    var styleName = this._styles[this.properties.ctrlStyle]["_audioTitleFrame"];

    if (audioTitleObj && !this.properties.unformattedTextObj)
    {
        this.properties.audioTitleObj = new Object();

        if (audioTitleObj.audioTitleId)
        {
            this.properties.audioTitleObj.audioTitle = framework.localize.getLocStr(this.uiaId,
                                                                                    audioTitleObj.audioTitleId,
                                                                                    audioTitleObj.subMap);
            this._setInnerTextOrHTML(this._audioTitle, this.properties.audioTitleObj.audioTitle);
        }
        else if (audioTitleObj.audioTitleText)
        {
            this.properties.audioTitleObj.audioTitle = audioTitleObj.audioTitleText;
            this._setInnerTextOrHTML(this._audioTitle, this.properties.audioTitleObj.audioTitle);
        }
        else
        {
            this._audioTitle.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }

        if (audioTitleObj.audioTitleIcon)
        {
            this.properties.audioTitleObj.audioTitleIcon = audioTitleObj.audioTitleIcon;
            this._audioTitleIconFrame.style.backgroundImage = "url(" + this.properties.audioTitleObj.audioTitleIcon + ")";
        }
    }
    else
    {
        this._audioTitle.innerText = "";
        styleName = "NowPlaying4CtrlHidden";
    }

    // Update the style to show/hide the line (so missing lines collapse properly)
    this._audioTitleFrame.className = styleName;

};

NowPlaying4Ctrl.prototype.setDetailLine1 = function(detailLine1Obj)
{
    log.debug("setDetailLine1() called...");

    var styleName = this._styles[this.properties.ctrlStyle]["_detailLine1Frame"];

    if (detailLine1Obj && !this.properties.unformattedTextObj)
    {
        this.properties.detailLine1Obj = new Object();

        if (detailLine1Obj.detailTextId)
        {
            this.properties.detailLine1Obj.detailLine1 = framework.localize.getLocStr(this.uiaId,
                                                                                      detailLine1Obj.detailTextId,
                                                                                      detailLine1Obj.subMap);
            this._setInnerTextOrHTML(this._detailLine1, this.properties.detailLine1Obj.detailLine1);
        }
        else if (detailLine1Obj.detailText)
        {
            this.properties.detailLine1Obj.detailLine1 = detailLine1Obj.detailText;
            this._setInnerTextOrHTML(this._detailLine1, this.properties.detailLine1Obj.detailLine1);
        }
        else
        {
            this._detailLine1.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }

        if (detailLine1Obj.detailIcon)
        {
            this.properties.detailLine1Obj.detailIcon = detailLine1Obj.detailIcon;
            this._detailLine1IconFrame.style.backgroundImage = "url(" + this.properties.detailLine1Obj.detailIcon + ")";
        }
    }
    else
    {
        this._detailLine1.innerText = "";
        styleName = "NowPlaying4CtrlHidden";
    }

    // Update the style to show/hide the line (so missing lines collapse properly)
    this._detailLine1Frame.className = styleName;
};

NowPlaying4Ctrl.prototype.setDetailLine2 = function(detailLine2Obj)
{
    log.debug("setDetailLine2() called...");

    var styleName = this._styles[this.properties.ctrlStyle]["_detailLine2Frame"];

    if (detailLine2Obj && !this.properties.unformattedTextObj)
    {
        this.properties.detailLine2Obj = new Object();

        if (detailLine2Obj.detailTextId)
        {
            this.properties.detailLine2Obj.detailLine2 = framework.localize.getLocStr(this.uiaId,
                                                                                      detailLine2Obj.detailTextId,
                                                                                      detailLine2Obj.subMap);
            this._setInnerTextOrHTML(this._detailLine2, this.properties.detailLine2Obj.detailLine2);
        }
        else if (detailLine2Obj.detailText)
        {
            this.properties.detailLine2Obj.detailLine2 = detailLine2Obj.detailText;
            this._setInnerTextOrHTML(this._detailLine2, this.properties.detailLine2Obj.detailLine2);
        }
        else
        {
            this._detailLine2.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }

        if (detailLine2Obj.detailIcon)
        {
            this.properties.detailLine2Obj.detailIcon = detailLine2Obj.detailIcon;
            this._detailLine2IconFrame.style.backgroundImage = "url(" + this.properties.detailLine2Obj.detailIcon + ")";
        }
    }
    else
    {
        this._detailLine2.innerText = "";
        styleName = "NowPlaying4CtrlHidden";
    }

    // Update the style to show/hide the line (so missing lines collapse properly)
    this._detailLine2Frame.className = styleName;
};

NowPlaying4Ctrl.prototype.setDetailLine3 = function(detailLine3Obj)
{
    log.debug("setDetailLine3() called...");

    var styleName = this._styles[this.properties.ctrlStyle]["_detailLine3Frame"];

    if (detailLine3Obj && !this.properties.unformattedTextObj )
    {
        this.properties.detailLine3Obj = new Object();

        if (detailLine3Obj.detailTextId)
        {
            this.properties.detailLine3Obj.detailLine3 = framework.localize.getLocStr(this.uiaId,
                                                                                      detailLine3Obj.detailTextId,
                                                                                      detailLine3Obj.subMap);
            this._setInnerTextOrHTML(this._detailLine3, this.properties.detailLine3Obj.detailLine3);
        }
        else if (detailLine3Obj.detailText)
        {
            this.properties.detailLine3Obj.detailLine3 = detailLine3Obj.detailText;
            this._setInnerTextOrHTML(this._detailLine3, this.properties.detailLine3Obj.detailLine3);
        }
        else
        {
            this._detailLine3.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }

        if (detailLine3Obj.detailIcon)
        {
            this.properties.detailLine3Obj.detailIcon = detailLine3Obj.detailIcon;
            this._detailLine3IconFrame.style.backgroundImage = "url(" + this.properties.detailLine3Obj.detailIcon + ")";
        }
    }
    else
    {
        this._detailLine3.innerText = "";
        styleName = "NowPlaying4CtrlHidden";
    }

    // Update the style to show/hide the line (so missing lines collapse properly)
    this._detailLine3Frame.className = styleName;
};

NowPlaying4Ctrl.prototype.setUnformattedText = function(unformattedTextObj)
{
    log.debug("setUnformattedText() called...");

    var styleName = "NowPlaying4CtrlUnformattedTextFrame";

    if (unformattedTextObj && this.properties.ctrlStyle === 'Style7')
    {
        this.properties.unformattedTextObj = new Object();
        this._hideFormattedText();

        if (unformattedTextObj.unformattedTextId)
        {
            this.properties.unformattedTextObj.unformattedTextId = framework.localize.getLocStr(this.uiaId,
                                                                                      unformattedTextObj.unformattedTextId,
                                                                                      unformattedTextObj.subMap);
            this._setInnerTextOrHTML(this._unformattedText, this.properties.unformattedTextObj.unformattedTextId);
        }
        else if (unformattedTextObj.unformattedText)
        {
            this.properties.unformattedTextObj.unformattedText = unformattedTextObj.unformattedText;
            this._setInnerTextOrHTML(this._unformattedText, this.properties.unformattedTextObj.unformattedTextId);
        }
        else
        {
            this._unformattedText.innerText = "";
            styleName = "NowPlaying4CtrlHidden";
        }
     }
    else
    {
        this._unformattedText.innerText = "";
        styleName = "NowPlaying4CtrlHidden";

    }

    // Update the style to show/hide the line (so missing lines collapse properly)
    this._unformattedTextFrame.className = styleName;
    this.properties.unformattedTextObj = unformattedTextObj;
};

/*
 * Sets whether the artwork image should be displayed
 * @param   flag    Boolean true if the artwork image should be displayed
 */
NowPlaying4Ctrl.prototype.showArtworkImage = function(flag)
{
    log.debug("showArtworkImage() called: " + flag);

    // Make sure the control style supports artwork image display
    if (this.properties.ctrlStyle != "Style0")
    {
        if (flag)
        {
            this._artworkImageFrame.className = "NowPlaying4CtrlArtworkImageDiv";
        }
        else
        {
            this._artworkImageFrame.className = "NowPlaying4CtrlHidden";
        }
    }
};

/*
 * Sets the path to the artwork image
 * @param   imagePath    String for image path/file name
 */
NowPlaying4Ctrl.prototype.setArtworkImagePath = function(imagePath)
{
    log.debug("setArtworkImagePath() called: " + imagePath);

    // Album Image
    if (imagePath)
    {
        this.properties.artworkImagePath = imagePath;
        this._artworkImage.src = this.properties.artworkImagePath;
    }
    else
    {
        if (this.properties.ctrlStyle === "Style6")
        {
            // Control is in style "Style6", and no image is defined --
            // hide the image (no "no-artwork" image)
            this._artworkImageFrame.className = "NowPlaying4CtrlHidden";
        }
        else
        {
            // Show placeholder icon instead of album image art
            this.properties.artworkImagePath = "";
        	this._artworkImage.src = this.properties.noArtworkImagePath;
        }
    }
};

// This API is a shortcut method for clearing the Artwork Image. If the control is in
// a style supporting Now Artwork Image ("Style7", ONLY!), the image will be hidden
// and the "info box" text will be extended over the vacated real estate.
NowPlaying4Ctrl.prototype.clearArtworkImage = function()
{
    log.debug("clearArtworkImage() called...");

    // Remove any current branding image (all styles)
    this._artworkImage.src = "";

    // If we're in a style that supports no image, ...
    if (this.properties.ctrlStyle === "Style7")
    {
        // ... remove any branding image configuration
        if (this.properties.ctrlTitleObj &&
            this.properties.ctrlTitleObj.ctrlTitleIcon)
        {
            this.properties.ctrlTitleObj.ctrlTitleIcon = undefined;
        }

        // Hide the control title icon
        this._artworkImageFrame.className = "NowPlaying4CtrlHidden";

        // ... make sure the infobox is full-width
        // ex: this._ctrlTitle.className = "NowPlaying4CtrlTitleFull";
        this._infoBox.className = "NowPlaying4CtrlInfoBoxFull";
        this._audioTitle.className = "NowPlaying4CtrlAudioTitleFull";
        this._detailLine1.className = "NowPlaying4CtrlDetailLine1Full";
        this._detailLine2.className = "NowPlaying4CtrlDetailLine2Full";
        this._detailLine3.className = "NowPlaying4CtrlDetailLine3Full";
        this._unformattedText.className = "NowPlaying4CtrlUnformattedText";
    }
};

/*
 * Sets the path to the "no-artwork" image (displayed when no artwork image is available)
 * @param   imagePath    String for image path/file name
 */
NowPlaying4Ctrl.prototype.setNoArtworkImagePath = function(imagePath)
{
    log.debug("setNoArtworkImagePath() called: " + imagePath);

    // Album Image
    if (imagePath)
    {
        this.properties.noArtworkImagePath = imagePath;
    }
    else
    {
        this.properties.noArtworkImagePath = "common/images/no_artwork_icon.png";
    }

    if (!this.properties.artworkImagePath ||
        (this.properties.artworkImagePath == ""))
    {
        // Update the "no-artwork" image
    	this._artworkImage.src = this.properties.noArtworkImagePath;
    }
};

// This API is a shortcut method for setting the control title icon.  This appears above the
// album art, level with the control title, and left-justified with the artwork's left edge.
// If the control is in a style supporting branding (e.g. "Style2", "Style4" "Style5", or "Style7"),
// the image will be displayed (if it wasn't already) and the title text will be truncated to
// make room for it.
NowPlaying4Ctrl.prototype.setBrandImage = function(imagePath)
{
    log.debug("setBrandImage() called: " + imagePath);

    //setting loading to false when brandImage available
    this.setLoadingIcon(false);
    if (imagePath)
    {
        // If we're in a style that allows branding, ...
        if (((this.properties.ctrlStyle === "Style2") ||
             (this.properties.ctrlStyle === "Style4") ||
             (this.properties.ctrlStyle === "Style5") ||
             (this.properties.ctrlStyle === "Style7")) &&
             this.properties.ctrlTitleObj)
        {
            // ... save the branding image
            this.properties.ctrlTitleObj.ctrlTitleIcon = imagePath;

            // If no HD configuration is in place (Style2 & Style4), ...
            if (this.properties.hdConfigObj == null)
            {
                // ... show the control title icon
                this._ctrlTitleIconImage.src = this.properties.ctrlTitleObj.ctrlTitleIcon;
                this._ctrlTitleIconFrame.className = "NowPlaying4CtrlTitleIconFrame";

                // Make sure control title is truncated
                this._ctrlTitle.className = "NowPlaying4CtrlTitle";
            }
        }
    }
    else
    {
        this.clearBrandImage();
    }
};

// This API is a shortcut method for clearing the control title icon.  If the control is in
// a style supporting branding (e.g. "Style2", "Style4" or "Style5"), the image will be hidden
// and the title text will be extended over the album artwork image.
NowPlaying4Ctrl.prototype.clearBrandImage = function()
{
    log.debug("clearBrandImage() called...");

    // Remove any current branding image (all styles)
    this._ctrlTitleIconImage.src = "";

    // If we're in a style that supports branding, ...
    if ((this.properties.ctrlStyle === "Style2") ||
        (this.properties.ctrlStyle === "Style4") ||
        (this.properties.ctrlStyle === "Style5") ||
        (this.properties.ctrlStyle === "Style7"))
    {
        // ... remove any branding image configuration
        if (this.properties.ctrlTitleObj &&
            this.properties.ctrlTitleObj.ctrlTitleIcon)
        {
            this.properties.ctrlTitleObj.ctrlTitleIcon = undefined;
        }

        // Hide the control title icon
        this._ctrlTitleIconFrame.className = "NowPlaying4CtrlHidden";

        // If no HD configuration is in place, or HD isn't available (Style5), ...
        if ((this.properties.hdConfigObj == null) ||
            (this.properties.ctrlStyle === "Style5"))
        {
            if((this.properties.ctrlStyle === "Style7") && (this.properties.loadingIcon == false))
            // ... make sure the control title is full-width
            {
                this._ctrlTitle.className = "NowPlaying4CtrlTitleFull";
            }
        }
    }
};

NowPlaying4Ctrl.prototype.setCurrentTrackNum = function(currentTrackNum)
{
    log.debug("setCurrentTrackNum() called: " + currentTrackNum);

    if (currentTrackNum > 0)
    {
        this.properties.currentTrackNum = parseInt(currentTrackNum);
        this._updateTrackDisplay();
    }
    else
    {
        log.warn(this.uiaId + " setCurrentTrackNum() called with invalid parameter");
    }
};

NowPlaying4Ctrl.prototype.setTrackCount = function(trackCount)
{
    log.debug("setTrackCount() called: " + trackCount);

    if (trackCount >= 0)
    {
        this.properties.trackCount = parseInt(trackCount);
        this._updateTrackDisplay();
    }
    else
    {
        log.warn(this.uiaId + " setTrackCount() called with invalid parameter");
    }
};

NowPlaying4Ctrl.prototype.setPhoneNumber = function(phoneNum)
{
    log.debug("setPhoneNumber() called: " + phoneNum);

    if (this.properties.ctrlStyle !== "Style5")
    {
        this._phoneNumber.innerText = "";
        this._phoneNumber.className = "NowPlaying4CtrlHidden";
        this._phoneNumberIconFrame.className = "NowPlaying4CtrlHidden";
        log.debug("Phone number only visible in Style5");
    }
    else if (phoneNum)
    {
        this.properties.phoneNumber = phoneNum;
        this._phoneNumber.innerText = this.properties.phoneNumber;
        if (this.properties.phoneNumber != "")
        {
            this._phoneNumber.className = "NowPlaying4CtrlPhoneNumber";
            this._phoneNumberIconFrame.className = "NowPlaying4CtrlPhoneNumberIconFrame";
        }
        else
        {
            this._phoneNumber.className = "NowPlaying4CtrlHidden";
            this._phoneNumberIconFrame.className = "NowPlaying4CtrlHidden";
        }
    }
    else
    {
        this._phoneNumber.innerText = "";
        this._phoneNumber.className = "NowPlaying4CtrlHidden";
        this._phoneNumberIconFrame.className = "NowPlaying4CtrlHidden";
    }
};

NowPlaying4Ctrl.prototype.setDistanceDirection = function(distanceDirection)
{
    log.debug("setDistanceDirection() called: " + distanceDirection);

    if (this.properties.ctrlStyle !== "Style5")
    {
        this._distanceDirection.innerText = "";
        this._distanceDirection.className = "NowPlaying4CtrlHidden";
        this._distanceDirectionIconFrame.className = "NowPlaying4CtrlHidden";
        log.debug("Distance/direction only visible in Style5");
    }
    else if (distanceDirection)
    {
        this.properties.distanceDirection = distanceDirection;
        this._distanceDirection.innerText = this.properties.distanceDirection;
        if (this.properties.distanceDirection != "")
        {
            this._distanceDirection.className = "NowPlaying4CtrlDistanceDirection";
            this._distanceDirectionIconFrame.className = "NowPlaying4CtrlDistanceDirectionIconFrame";
        }
        else
        {
            this._distanceDirection.className = "NowPlaying4CtrlHidden";
            this._distanceDirectionIconFrame.className = "NowPlaying4CtrlHidden";
        }
    }
    else
    {
        this._distanceDirection.innerText = "";
        this._distanceDirection.className = "NowPlaying4CtrlHidden";
        this._distanceDirectionIconFrame.className = "NowPlaying4CtrlHidden";
    }
};

NowPlaying4Ctrl.prototype.setRating = function(rating)
{
    if (rating >= 0 || rating == -1)
    {
        rating *= 2;
        this.properties.rating = parseInt(rating) / 2;
        this._updateRatingMeter();
    }
    else
    {
        log.warn(this.uiaId + " setRating() called with invalid parameter");
    }
};

NowPlaying4Ctrl.prototype.setCustomRatingImg = function(imgPath)
{

    if (this.properties.ctrlStyle !== "Style5")
    {
        this._customRatingDiv.className = "NowPlaying4CtrlHidden";
        log.debug("Custom rating only visible in Style5");
    }
    else
    {
        var tmpImage = new Image();
            tmpImage.src = imgPath;
        this._ratingMeterFrame.className = "NowPlaying4CtrlHidden";
        this._customRatingDiv.style.backgroundImage = "url(\"" + imgPath + "\")";
        this._customRatingDiv.className = "NowPlaying4CtrlCustomRatingDiv";

        if (tmpImage.width > this._constants.MAX_RATING_IMG_WIDTH || tmpImage.height > this._constants.MAX_RATING_IMG_HEIGHT)
        {
            this._customRatingDiv.style.backgroundSize = "contain";
        }
        else
        {
            this._customRatingDiv.style.backgroundSize = "";
        }
    }
};

/*
 * Sets whether the control background image should be displayed
 * @param   flag    Boolean true if the background image should be displayed
 */
NowPlaying4Ctrl.prototype.showBackgroundImage = function(flag)
{
    log.debug("showBackgroundImage() called: " + flag);

    if (flag)
    {
        this.divElt.classList.remove("NowPlaying4CtrlNoBG");
    }
    else
    {
        this.divElt.classList.add("NowPlaying4CtrlNoBG");
    }
};

NowPlaying4Ctrl.prototype.getNowPlayingConfig = function()
{
	// extract the text from the fields and remove the unnecessary html tags
	var config = {
		"ctrlTitle": this._ctrlTitle,
		"audioTitle": this._audioTitle,
		"detailLine1": this._detailLine1,
		"detailLine2": this._detailLine2,
		"detailLine3": this._detailLine3,
		"unformattedText"  : this._unformattedText
	};

	return config;
};

NowPlaying4Ctrl.prototype.handleControllerEvent = function(eventId)
{
    log.debug("NowPlaying4Ctrl: handleControllerEvent() ", eventId);
    // Pass-through
    if (this.umpCtrl)
    {
        var response = this.umpCtrl.handleControllerEvent(eventId);
        return response;
    }
};

NowPlaying4Ctrl.prototype.getContextCapture = function()
{
    log.debug("NowPlaying4Ctrl: getContextCapture() called...");

    var controlContextCapture = this.umpCtrl.getContextCapture();
    return controlContextCapture;
};

NowPlaying4Ctrl.prototype.restoreContext = function(controlContextCapture)
{
    log.debug("NowPlaying4Ctrl: restoreContext() ", controlContextCapture);

    this.umpCtrl.restoreContext(controlContextCapture);
};

NowPlaying4Ctrl.prototype.finishPartialActivity = function()
{
    log.debug("NowPlaying4Ctrl: finishPartialActivity() called...");

    this.umpCtrl.finishPartialActivity();
};

NowPlaying4Ctrl.prototype.cleanUp = function(){
    log.debug("NowPlaying4Ctrl: cleanUp() called...");
    // Now Playing currently has no cleanup
    if (this.umpCtrl)
    {
        this.umpCtrl.cleanUp();
    }
};

framework.registerCtrlLoaded("NowPlaying4Ctrl");

/*
 Copyright 2012 by Johnson Controls
 __________________________________________________________________________

 Filename: usbaudioApp.js
 __________________________________________________________________________

 Project: JCI-IHU
 Language: EN
 Author: ayonchn
 Date: 10-May-2012
 __________________________________________________________________________

 Description: IHU GUI System App

 Revisions:
 v0.1 (10-May-2012)  usbaudioApp created for initial testing of active panel content
 v0.2 (06-June-2012) updated usbaudio for new debug system. Added usbaudioAppTest.js
 v0.3 (11-June-2012) filled out context data for full ListCtrl buttons -aganesar
 v0.4 (14-June-2012) Added dictionaires and functionality for Japanese -aganesar
 v0.5 (26-June-2012) Updated app standard functions.
 v0.6 (28-August-2012) Swithced to Common for Global events
 v0.7 (30-Aug-2012) Updated to use new selectCallbacks and appData
 v0.8 (06-Sep-2012) Updated to use new UMP updates
 v0.9 (10-Sep-2012) Integrate with latest wireframes/spreadsheet - ayonchn
 v1.0 (21-Jan-2013) AppSDK inregration - ayonchn
 v1.1 (17-Sep-2013) Dictionaries updated (SW00132354) - aikonot
 v1.2 (18-Jun-2014) GUI_USBAUDIO: MY15 Graphic Asset Update and Clean Up (SW00150288) - aikonot
 v1.3 (14-Nov-2014) GUI_USBAUDIO: Added null check for template (SW00157864)
 v1.4 (10-Mar-2015) GUI_USBAUDIO: MY15 Robustness - Core issue #91 - Audiobooks does not work correctly (SW00162025)
 v1.5 (13-Mar-2015) GUI_USBAUDIO: "More Like This" shows English even in "BR-PT" selected (SW00161914)
 v1.6 (27-Mar-2015) [CMU MY15 - USB Audio][iPod]Saved Subtitle metadata from disconnected Umass device. (SW00160602); GUI_USBAUDIO: MoreLikeThis is missing. (SW00162390)
 v1.6.1 (27-May-2015) [CI-1873] [0501-J03A-53-007] Set "More Like This", but it's not stored by recovery condition (SW00164718)
 __________________________________________________________________________

 */
log.addSrcFile("usbaudioApp.js", "usbaudio");
//log.setLogLevel("usbaudio", "debug");

/**********************************************
 * Start of Base App Implementation
 *
 * Code in this section should not be modified
 * except for function names based on the appname
 *********************************************/

function usbaudioApp(uiaId)
{
    log.debug("constructor called...");

    // Base application functionality is provided in a common location via this call to baseApp.init().
    // See framework/js/BaseApp.js for details.
    baseApp.init(this, uiaId);

    // All feature-specific initialization is done in appInit()
}

/**************************
 * Standard App Functions *
 **************************/
/*
 * Called just after the app is instantiated by framework.
 */
usbaudioApp.prototype.appInit = function()
{
    log.debug(" usbaudioApp appInit  called...");

    if (framework.debugMode)
    {
        utility.loadScript("apps/usbaudio/test/usbaudioAppTest.js");
    }

    // BLM metadata (md) filters
    this._mdFilter = {
        USBM_MetadataType_Unknown : 0,

        // String Types
        USBM_MetadataType_Storage : 1,              // Storage
        USBM_MetadataType_ObjectName : 2,           // Object (File) Title <String>, Chapter <String>
        USBM_MetadataType_GenreName : 3,            // Genre Table <String>
        USBM_MetadataType_AlbumName : 4,            // Album Table <String>, Audiobook Table <String>
        USBM_MetadataType_ArtistName : 5,           // Artist Table <String>
        USBM_MetadataType_PlaylistName : 6,         // Playlist Table <String>
        USBM_MetadataType_CategoryName : 7,         // library_category <String>
        USBM_MetadataType_ComposerName : 8,         // library_composer <String>

        // Numeric Types
        USBM_MetadataType_ObjectId : 9,             // Object (File) Id <Number>
        USBM_MetadataType_GenreId : 10,             // Genre Table <Number>
        USBM_MetadataType_AlbumId : 11,             // Album Table <Number>
        USBM_MetadataType_ArtistId : 12,            // Artist Table <Number>
        USBM_MetadataType_PlaylistId : 13,          // Playlist Table <Number>
        USBM_MetadataType_CategoryId : 14,          // library_category <Number>
        USBM_MetadataType_ComposerId : 15,          // library_composer <Number>
        USBM_MetadataType_ObjectFolderId : 16,      // Folder Id

        // Object Audio Info
        USBM_MetadataType_ObjectFileName : 17,      //library table (Object table) <String>
        USBM_MetadataType_ObjectFolderName : 18,    // folders table <String>
        USBM_MetadataType_Duration : 19,            // library table (Object table) <Number>
        USBM_MetadataType_BitRate : 20,             // library table (Object table) <Number> - bitrate, in [bits/sec]
        USBM_MetadataType_SampleRate : 21,          // library table (Object table) <Number> - sample rate of decoded stream, in [Hz]
        USBM_MetadataType_ChannelsCnt : 22,         // library table (Object table) <Number>
        USBM_MetadataType_MediaFormat : 23,         // library table (Object table) <Number> - MME_FORMAT_*
        // TBD:
        USBM_MetadataType_Kind : 24,                // Music, Audiobooks, Podcast episodes
        USBM_MetadataType_AlbumOrder : 25,          // Track Album Index
        USBM_MetadataType_Podcast : 26,             // Podcast name

        USBM_MetadataType_Max : 27
    };

    this._currentContextId = null;
	// BLM sort order (so) filters
    this._soFilter = {
        USBM_SortOrder_Raw : 0,
        USBM_SortOrder_AlphaAscending : 1,
        USBM_SortOrder_AlphaDescending : 2,
        USBM_SortOrder_AlphaNumericAscending : 3,
        USBM_SortOrder_AlphaNumericDescending : 4
    };

    this._payloadTable = {
        AllGenres: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_GenreName],
            md_info: {
                genre: {
                    value: "Genres",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_GenreName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Genres",
        },
        AllArtists: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ArtistName],
            md_info: {
                artist: {
                    value: "Artist",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Artists",
        },
        AllAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                album: {
                    value: "Album",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Albums",
        },
        AllSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                song: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Songs",
        },
        AllPlaylists: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_PlaylistName],
            md_info: {
                playlist: {
                    value: "Playlists",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_PlaylistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Playlists",
        },
        PlaylistSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                playlist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_PlaylistName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "playlistName",
        },
        GenreArtists: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ArtistName],
            md_info: {
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "genreName",
        },
        GenresAllArtists: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ArtistName],
            md_info: {
                artist: {
                    value: "Artist",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allArtists",
        },
        Genre_AllAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "genreName",
        },
        Genre_ArtistAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        GenresAllArtists_ArtistAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        GenresAllArtists_AllAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                album: {
                    value: "Album",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allAlbums",
        },
        ArtistAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        AllArtistsAllAlbums: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_AlbumName],
            md_info: {
                album: {
                    value: "Album",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allAlbums",
        },
        AlbumSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        AlbumsAllSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                song: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allSongs",
        },
        Artist_AlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        Artist_AllSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: true,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        Artist_OneAlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "artistName",
        },
        ArtistsAllAlbums_AlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        ArtistsAllAlbums_AllSongs :{
            hasLineNumbers: true,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                song: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allSongs",
        },
        Genre_Artist_AlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        Genre_Artist_AllSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        Genre_Artist_OneAlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        Genre_AllAlbums_AlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        Genre_AllAlbums_AllSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: true,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                genre: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_GenreName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "genreName",
        },
        GenresAllArtists_Artist_AlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        GenresAllArtists_Artist_AllSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: true,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "artistName",
        },
        GenresAllArtists_Artist_OneAlbumSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                },
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "artistName",
        },
        GenresAllArtists_AllAlbums_AlbumSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}],
            titleConfig: "albumName",
        },
        GenresAllArtists_AllAlbums_AllSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                song: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "allSongs",
        },
        FolderSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            index: 0,
            focused: 0,
            currentFolderName: "",
            foldersPath: [],
            browsingStarted: false,
            images: ["", "common/images/icons/IcnListFolder.png", "", "common/images/icons/IcnListSong.png"],
            disabled: [true, false, true, false, true, true, true]
        },
        FolderAllSongs: {
            hasLineNumbers: true,
            hasLetterIndexing: false,
            index: 0,
            focused: 0,
            name: null,
        },
        MoreLikeThisSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                song: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}]
        },
        Podcasts: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_Podcast],
            md_info: {
                podcast: {
                    value: "Podcast",
                    type: this._mdFilter.USBM_MetadataType_Unknown,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_Podcast, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Podcasts",
        },
        PodcastEpisodes: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                podcast: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Podcast,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "podcastName",
        },
        Audiobooks: {
            hasLineNumbers: false,
            hasLetterIndexing: true,
            checkValues: false,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_Kind],
            md_info: {
                audiobook: {
                    value: "Audiobook",
                    type: this._mdFilter.USBM_MetadataType_Kind,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_Kind, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "Audiobooks",
        },
        AudiobookChapters: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                audiobook: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_Kind,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "audiobookName",
        },
        Invalid: {
            index: 0,
            focused: 0,
            name: null,
        },
        AlbumsDisambiguateSongs: {
            hasLineNumbers: false,
            hasLetterIndexing: false,
            checkValues: true,
            index: 0,
            focused: 0,
            md_types: [this._mdFilter.USBM_MetadataType_ObjectName],
            md_info: {
                album: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_AlbumName,
                    id: 0,
                },
                artist: {
                    value: "",
                    type: this._mdFilter.USBM_MetadataType_ArtistName,
                    id: 0,
                }
            },
            sort_settings: [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
            titleConfig: "albumName",
        }
    };

    this._usbaudioErrorSbn = "UsbaudioError";
    this._topItemOptions =
    {
        setTopItem: false,
        top: null,
        focus: null,
    };

	// ---MZDMOD---
	// Object for NowPlaying control title and song list issue
	// What we do is save the folder ID and how we played the songs (enabled prop)
	// This is basically looking at single click vs. long press
	this._cachedFolder = {
		id: 0,
		//title: "",
		enabled: false,
		songList: false
	};

    this._cachedSongDetails = {
        screenTitle: null,
        genre: null,
        artist: null,
        title: null,
        album: null,
        coverArt: "None"
    };

    this._selectionId = {
        playing: null,
        browsing: 0,
    };

    this._listStatus = {
        requestSize: 20,
        cachedList: null,
    };

    this._connectedDevs = {
        selId: 0,
        deviceSelected: 0,
        selectedDevType: "",
        selectedDevCataloged: false,
        showGracenote: true,
        BODReady: false,
        connectionReason : null,
        A:{
            name: "",
            id: 0,
            deviceId: 0,
            type: null,
            alreadyCataloged: false,
            showGracenote: true,
            BODReady: false,
            connectionReason : "User",
        },
        B: {
            name: "",
            id: 0,
            deviceId: 0,
            type: null,
            alreadyCataloged: false,
            showGracenote: true,
            BODReady: false,
            connectionReason : "User",
        },
    };

    this._viewType = {
        tree: 1,
        list:2
    };

    this._gracenoteTimeout = null;
    this._gracenoteTimeoutTime = 3000;
    this._umpElapseTime = 0;
    this._umpTotalTime = 0;
    this._userIntent = "Browse";
    this._rootFolderId = 1;
    this._umpProgressValue = 0;
    this._stopElapsedUpdate = false;
    this._umpSecondaryElapseTime = 0;
    this._settleTime = 500;
    this._finalAdjustmentTimeout = null;

    this._umpButtonConfig = new Object();

    // UMP Default config
    var selectCallback = this._umpDefaultSelectCallback.bind(this);
    var holdStartCallback = this._umpHoldStartCallback.bind(this);
    var holdStopCallback = this._umpHoldStopCallback.bind(this);
    var slideCallback = this._umpSlideCallback.bind(this);
    //@formatter:off
    this._scrubberConfig = {
        "scrubberStyle": "Style01",
        "mode" : "slider",
        "hasActiveState" : true,
        "value" : 0,
        "min" : 0.0,
        "max" : 1.0,
        "increment" : 0.01,
        "currentValue" : 0,
        "minChangeInterval" : 250,
        "settleTime" : 1000,
        "slideCallback": slideCallback,
        "appData" : "scrubber",
        "elapsedTime" : "00:00",
        "totalTime" : "00:00",
        "disabled" : false,
        "buffering" : false,
        "duration": 0,
    };

    this._umpConfig =
    {
        hasScrubber                 : true,
        retracted                   : false,
        tooltipsEnabled             : true,
        defaultHoldStartCallback    : this._umpHoldStartCallback,
        defaultHoldStopCallback     : this._umpHoldStopCallback,
        defaultSlideCallback        : this._umpSlideCallback,
        initialButtonFocus          : "source",
        buttonConfig                : this._umpButtonConfig,
        scrubberConfig              : this._scrubberConfig,
    };

    this._umpButtonConfig["source"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpEntMenu",
        appData : "source",
        label : null,
        selectCallback: selectCallback
    };

    this._umpButtonConfig["BrowseFolders"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpUSBMenu",
        appData : "BrowseFolders",
        labelId : "RootMenu",
        selectCallback: selectCallback
    };
	// ---MZDMOD---
	this._umpButtonConfig["BrowseUSBFolders"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpTopList",
        appData : "BrowseUSBFolders",
        labelId : "Folders",
        selectCallback: selectCallback
    };

    this._umpButtonConfig["SongList"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpCurrentList",
        appData : "SongList",
        labelId : "Tooltip_IcnUmpCurrentList",
        selectCallback: selectCallback
    };

    this._umpButtonConfig["repeat"] =
    {
        buttonBehavior : "shortPressOnly",
        imageBase : "./apps/usbaudio/images/IcnUmpRepeat",
        currentState:"List",
        stateArray: [
            {
                state:"Song", labelId : "common.Tooltip_IcnUmpRepeat_Song",
            },
            {
                state:"List", labelId : "common.Tooltip_IcnUmpRepeat_List",
            },
            {
                state:"None", labelId : "common.Tooltip_IcnUmpRepeat_None",
            }
        ],
        disabled : false,
        appData:"repeat",
        selectCallback: selectCallback
    };

    this._umpButtonConfig["shuffle"] =
    {
        buttonBehavior : "shortPressOnly",
        imageBase : "IcnUmpShuffle",
        currentState:"Off",
        stateArray: [
            {
                state:"Off", label: null
            },
            {
                state:"On", label: null
            }
        ],
        disabled : false,
        appData:"shuffle",
        selectCallback: selectCallback
    };
	// ---MZDMOD---
	// Current CSS limits buttons only to 10 so need to remove one
	/*
    this._umpButtonConfig["GenerateMoreLikeThis"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpMore",
        appData : "GenerateMoreLikeThis",
        labelId : "common.Tooltip_IcnUmpMore",
        selectCallback: selectCallback
    };
	*/

    this._umpButtonConfig["prev"] =
    {
        buttonBehavior : "shortAndHold",
        imageBase : "IcnUmpPreviousAudio",
        disabled : false,
        appData : "prev",
        label : null,
        selectCallback: selectCallback,
        holdStartCallback : holdStartCallback,
        holdStopCallback : holdStopCallback
    };

    this._umpButtonConfig["playpause"] =
    {
        buttonBehavior : "shortPressOnly",
        imageBase : "IcnUmpPlayPause",
        currentState:"Pause",
        stateArray: [
            {
                state:"Play", label:null
            },
            {
                state:"Pause", label:null
            },

        ],
        disabled : false,
        appData : "playpause",
        selectCallback: selectCallback
    };

    this._umpButtonConfig["next"] =
    {
        buttonBehavior : "shortAndHold",
        imageBase : "IcnUmpNextAudio",
        disabled : false,
        appData : "next",
        label : null,
        selectCallback: selectCallback,
        holdStartCallback : holdStartCallback,
        holdStopCallback : holdStopCallback
    };

    this._umpButtonConfig["settings"] =
    {
        buttonBehavior : "shortPressOnly",
        disabled : false,
        imageBase : "IcnUmpEqualizer",
        appData : "settings",
        label : null,
        selectCallback: selectCallback
    };

    //@formatter:on
    this._usbaudioCtxtDataList = {
        itemCountKnown : true,
        itemCount : 8,
        vuiSupport: true,
        items: [
            // Note: appData values here are the EventIds that will be sent to MMUI on item selection
            { appData : 'BrowsePlaylists', text1Id : 'Playlist', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseArtists', text1Id : 'Artist', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseAlbums', text1Id : 'Album', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseSongs', text1Id : 'Song', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseGenres', text1Id : 'Genre', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseAudiobooks', text1Id : 'Audiobook', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowsePodcasts', text1Id : 'Podcast', itemStyle : 'style01', disabled: true, hasCaret: false },
            { appData : 'BrowseFolders', text1Id : 'Folder', itemStyle : 'style01', hasCaret: false }
        ]
    };

    var loadingDataList = {
        itemCountKnown : false,
        itemCount : -1,
        items : []
    };

    //@formatter:off
    this._contextTable = {

        "USBAudio" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    dataList: this._usbaudioCtxtDataList,
                    numberedList: true,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'RootMenu',
                        titleStyle : 'style02'
                    },
                    scrollTo: 0,
                    focussedItem: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextOutFunction": this._USBAudioCtxtOut.bind(this),
        }, // end of "USBAudio"

        "Playlists" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Playlists',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._PlaylistsCtxtContextIn.bind(this),
            "readyFunction": this._PlaylistsContextReady.bind(this),
            "contextOutFunction" : this._PlaylistsCtxtContextOut.bind(this),
        }, // end of "Playlists"

        "Podcasts" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Podcasts',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._PodcastsCtxtContextIn.bind(this),
            "readyFunction": this._PodcastsContextReady.bind(this),
            "contextOutFunction" : this._PodcastsCtxtContextOut.bind(this),
        }, // end of "Podcast"

        "Audiobooks" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Audiobooks',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._AudiobooksCtxtContextIn.bind(this),
            "readyFunction": this._AudiobooksContextReady.bind(this),
            "contextOutFunction" : this._AudiobooksCtxtContextOut.bind(this),
        }, // end of "Audiobooks"

        "Episodes" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        // text1Id : 'Episodes',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._EpisodesCtxtContextIn.bind(this),
            "readyFunction": this._EpisodesContextReady.bind(this),
            "contextOutFunction": this._EpisodesCtxtContextOut.bind(this)
        }, // end of "Episodes"

        "Chapters" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        // text1Id : 'Chapters',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._ChaptersCtxtContextIn.bind(this),
            "readyFunction": this._ChaptersContextReady.bind(this),
            "contextOutFunction": this._ChaptersCtxtContextOut.bind(this),
         }, // end of "Chapters"

        "Genres" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Genres',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction" : this._GenresCtxtContextIn.bind(this),
            "readyFunction": this._GenresContextReady.bind(this),
            "contextOutFunction": this._GenresCtxtContextOut.bind(this)
        }, // end of "Genres"

        "Artists" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Artists',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction": this._ArtistsCtxtContextIn.bind(this),
            "readyFunction": this._ArtistsContextReady.bind(this),
            "contextOutFunction" : this._ArtistsCtxtContextOut.bind(this),
        }, // end of "Artists"

        "Albums" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        text1Id : 'Albums',
                        titleStyle : 'style02'
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction": this._AlbumsCtxtContextIn.bind(this),
            "readyFunction": this._AlbumsContextReady.bind(this),
            "contextOutFunction" : this._AlbumsCtxtContextOut.bind(this)
        }, // end of "Albums"

        "Songs" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    requestSize: 20,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        titleStyle : 'style02',
                        text1Id: "AllSongs"
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "contextInFunction": this._SongsCtxtContextIn.bind(this),
            "readyFunction": this._SongsContextReady.bind(this),
            "contextOutFunction" : this._SongsCtxtContextOut.bind(this),
        }, // end of "Songs"

        "Folders" : {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            leftBtnStyle : "menuUp",
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    requestSize: 20,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        titleStyle : 'style02',
                        text1Id: "",
                        title1SubMap: null,
                        title: "",
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
					// ---MZDMOD---
					// Add call back for long press
					longPressCallback : this._listLongPressCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "readyFunction": this._FoldersContextReady.bind(this),
        }, // end of "Folders"

        "NowPlaying" : {
            "template" : "NowPlaying4Tmplt",
            "sbNameId": this.uiaId,
            "controlProperties": {
                "NowPlayingCtrl" : {
					// ---MZDMOD---
                    // Added stlye8 to NowPlaying4Ctrl.js, you must use this updated control and the CSS file
					//"ctrlStyle": "Style2",
                    "ctrlStyle": "Style8",
                    "umpConfig" : this._umpConfig,
                } // end of properties for "NowPlayingCtrl"
            }, // end of list of controlProperties
            "readyFunction" : this._NowPlayingCtxtReadyToDisplay.bind(this),
            "contextOutFunction": this._NowPlayingCtxtContextOut.bind(this)
        }, // end of "NowPlaying"

        "ErrorCondition" : {
            "template" : "Dialog3Tmplt",
            "sbNameId": this.uiaId,
            "controlProperties": {
                "Dialog3Ctrl" : {
                    "defaultSelectCallback" : this._dialogDefaultSelectCallback.bind(this),
                    "contentStyle" : "style02",
                    "fullScreen" : false,
                    "buttonCount" : 1,
                    "buttonConfig" : {
                        "button1" : {
                            buttonColor: "normal",
                            buttonBehavior : "shortPressOnly",
                            labelId: "common.Ok",
                            appData : "Global.OK",
                            disabled : false
                        },
                    }, // end of buttonConfig
                    "text1Id" : null,
                } // end of properties for "ErrorCondition"
            }, // end of list of controlProperties
            "contextInFunction": this._ErrorConditionCtxtIn.bind(this),
            "readyFunction" : this._ErrorConditionCtxtReadyToDisplay.bind(this),
        }, // end of "ErrorCondition"

        "AlbumBrowseDisambiguation": {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    requestSize: 20,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        titleStyle : 'style02',
                        text1Id: "Albums"
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "readyFunction": this._AlbumDisambiguationContextReady.bind(this),
        },

        "AlbumPlayDisambiguation": {
            "template" : "List2Tmplt",
            "sbNameId": this.uiaId,
            "sbNameSubMap": {deviceName: this._connectedDevs.A},
            "controlProperties": {
                "List2Ctrl" : {
                    numberedList: true,
                    requestSize: 20,
                    dataList: loadingDataList,
                    titleConfiguration : 'listTitle',
                    title : {
                        titleStyle : 'style02',
                        text1Id: "Albums"
                    },
                    hideLoadingOverlayTimeout: 0,
                    scrollTo : 0,
                    selectCallback : this._listItemClickCallback.bind(this),
                    needDataCallback : this._requestMoreDataCallback.bind(this)
                } // end of properties for "ListCtrl"
            }, // end of list of controlProperties
            "readyFunction": this._AlbumPlayDisambiguationContextReady.bind(this),
        }
    }; // end of this._contextTable
    //@formatter:on

    //@formatter:off
    this._messageTable = {
        "DeviceSelected": this._DeviceSelectedMsgHandler.bind(this),
        "PlaybackStatus" : this._PlaybackStatusMsgHandler.bind(this),
        "ObjectInfo" : this._ObjectInfoMsgHandler.bind(this),
        "NowPlayingData" : this._NowPlayingDataMsgHandler.bind(this),
        "PlayerState" : this._PlayerStateMsgHandler.bind(this),
        "CoverArt" : this._CoverArtMsgHandler.bind(this),
        "TimedSbn_ConnectionStatus" : this.TimedSbn_ConnectionStatusMsgHandler.bind(this),
        "RepeatShuffleStatus": this._RepeatShuffleStatusMsgHandler.bind(this),
        "TimedSbn_ErrorCondition": this._TimedSbn_ErrorConditionMsgHandler.bind(this),
        "TimedSbn_CurrentSong": this._TimedSbn_CurrentSongMsgHandler.bind(this),
        "DeviceReady": this._DeviceReadyMsgHandler.bind(this),
        "DeviceNormalized": this._DeviceNormalizedMsgHandler.bind(this),
        "BODReady": this._BODReadyMsgHandler.bind(this),
        "DeviceDisabled": this._DeviceDisabledMsgHandler.bind(this),
        // VR events
        "BrowseArtistDisambiguate": this._BrowseArtistDisambiguate.bind(this),
        "BrowseAlbumDisambiguate": this._BrowseAlbumDisambiguate.bind(this),
        "PlayAlbumDisambiguate": this._PlayAlbumDisambiguate.bind(this),
        "PlayRequest": this._PlayRequest.bind(this),
        "BrowsePlayRequest": this._BrowsePlayRequestMsgHandler.bind(this),
        "UserIntent": this._UserIntentMsgHandler.bind(this)

    }; // end of this._messageTable
    //@formatter:on

};

/**************************
 * Context handlers
 **************************/
// Songs Context
usbaudioApp.prototype._SongsCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._SongsContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._SongsCtxtContextOut = function ()
{
    this._saveIndex();
};

// Albums Context
usbaudioApp.prototype._AlbumsCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._AlbumsContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._AlbumsCtxtContextOut = function ()
{
    this._saveIndex();
};

// Artists Context
usbaudioApp.prototype._ArtistsCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._ArtistsContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._ArtistsCtxtContextOut = function ()
{
    this._saveIndex();
};

// Playlists Context
usbaudioApp.prototype._PlaylistsCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._PlaylistsContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._PlaylistsCtxtContextOut = function ()
{
    this._saveIndex();
};

// Genres Context
usbaudioApp.prototype._GenresCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._GenresContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._GenresCtxtContextOut = function ()
{
    this._saveIndex();
};

// Audiobooks Context
usbaudioApp.prototype._AudiobooksCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._AudiobooksContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._AudiobooksCtxtContextOut = function ()
{
    this._saveIndex();
};

// Podcasts Context
usbaudioApp.prototype._PodcastsCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._PodcastsContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._PodcastsCtxtContextOut = function ()
{
    this._saveIndex();
};

// Episodes Context
usbaudioApp.prototype._EpisodesCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._EpisodesContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._EpisodesCtxtContextOut = function ()
{
    this._saveIndex();
};

// Chapters Context
usbaudioApp.prototype._ChaptersCtxtContextIn = function ()
{
    this._presetContextConfig();
};

usbaudioApp.prototype._ChaptersContextReady = function (captureData)
{
    this._contextReadyAction(captureData);
};

usbaudioApp.prototype._ChaptersCtxtContextOut = function ()
{
    this._saveIndex();
};
// ---MZDMOD---
// Added check if coming from the song list button
// Folders context
usbaudioApp.prototype._FoldersContextReady = function (captureData)
{
	if (this._cachedFolder.songList == true)
	{
		this._cachedFolder.songList = false;
		if ((this._cachedFolder.enabled == true) && (this._cachedFolder.id != 0))
		{
			framework.sendEventToMmui(this.uiaId, "BrowseFolder", {payload:{folderId: this._cachedFolder.id, viewType: this._viewType.list}}, false);
			return;
		}
	}
	if (captureData)
	{
		this._topItemOptions.setTopItem = true;
		this._topItemOptions.top = captureData.templateContextCapture.controlData.topItem;
		this._topItemOptions.focus = captureData.templateContextCapture.controlData.focussedItem;
	}
	if (this._hasContextPayload() && this._currentContext.params.payload.hasOwnProperty("folderId") && this._currentContext.params.payload.hasOwnProperty("viewType"))
	{
		this._appsdkGetFolderItems(this._currentContext.params.payload.folderId, this._currentContext.params.payload.viewType, 0, null, "browse", false);
	}
	else
	{
		log.warn("USBAUDIO: Folders has context payload:", this._hasContextPayload());
	}
};

// USBAudio contxet
usbaudioApp.prototype._USBAudioCtxtOut = function ()
{
    if (this._outgoingContextTemplate)
    {
        this._contextTable["USBAudio"].controlProperties.List2Ctrl.scrollTo = this._outgoingContextTemplate.list2Ctrl.topItem;
        this._contextTable["USBAudio"].controlProperties.List2Ctrl.focussedItem = this._outgoingContextTemplate.list2Ctrl.focussedItem;
    }
};

// NowPlaying Context
usbaudioApp.prototype._NowPlayingCtxtReadyToDisplay = function ()
{
    log.debug("_NowPlayingCtxtReadyToDisplay called...");
    //Code logic for screenTitle now moved in _NowPlayingDataMsgHandler

    if (this._connectedDevs.BODReady)
    {
        this._BODReady(this._connectedDevs.BODReady);
        this._populateNowPlayingCtrl(this._currentContextTemplate, this._cachedSongDetails);
        this._populateCoverArt(this._currentContextTemplate, this._cachedSongDetails);
    }
    else
    {
        this._populateNowPlayingCtrl(this._currentContextTemplate, this._cachedSongDetails);
        this._BODReady(this._connectedDevs.BODReady);
    }

    if (this._cacheRepeatShuffleState)
    {
        this._updateUmpButtons(this._currentContextTemplate, this._cacheRepeatShuffleState);
    }

    this._setTotalElapsedTime();
};

usbaudioApp.prototype._NowPlayingCtxtContextOut = function ()
{
    log.debug("_NowPlayingCtxtContextOut called...");
    if (this._gracenoteTimeout != null)
    {
        this._removeGracenote();
    }
};

usbaudioApp.prototype._ErrorConditionCtxtIn = function ()
{
    if (this._currentContext && this._currentContext.params.hasOwnProperty("payload") && this._currentContext.params.payload.hasOwnProperty("deviceId"))
    {
        var id = 0;
        var name = "";
        if (this._connectedDevs.A.deviceId === this._currentContext.params.payload.deviceId)
        {
            id = 1;
            name = this._connectedDevs.A.name;
        }
        else
        {
            id = 2;
            name = this._connectedDevs.B.name;
        }

        this._contextTable["ErrorCondition"].sbNameSubMap = {deviceId: id, deviceName: name};
        this._contextTable["ErrorCondition"].sbNameIcon = "IcnSbnEnt.png";
    }
};

// Error Context
usbaudioApp.prototype._ErrorConditionCtxtReadyToDisplay = function ()
{
    if (this._hasContextPayload() && this._currentContext.params.payload.hasOwnProperty("error"))
    {
        var error = this._getErrorId(this._currentContext.params.payload.error);

        this._currentContextTemplate.dialog3Ctrl.setText1Id(error);
    }
    else
    {
        log.info("USBAUDIO: error context without error message.", this._currentContext);
    }
};

// Album Disambiguation context
usbaudioApp.prototype._AlbumDisambiguationContextReady = function (captureData)
{
    if (captureData)
    {
        this._topItemOptions.setTopItem = true;
        // captureData.templateContextCapture.controlData.hasFocus = true;
        this._topItemOptions.top = captureData.templateContextCapture.controlData.topItem;
        this._topItemOptions.focus = captureData.templateContextCapture.controlData.focussedItem;
    }

    if (this._hasContextPayload() && this._currentContext.params.payload.hasOwnProperty("albumName"))
    {
        var albumName = this._currentContext.params.payload.albumName;
        this._requestList(
            [this._mdFilter.USBM_MetadataType_ArtistName],                                                                              // metadata type list (array)
            [{value: albumName, type: this._mdFilter.USBM_MetadataType_AlbumName, item_id: 0}],                                         // metadata info value and type (array)
            [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],   // sort settings order metadata type (array)
            0,                                                                                                                          // offset index
            null,                                                                                                                       // context data list NOTE: empty every time we enter context
            0,                                                                                                                          // where to scroll the list
            "AlbumBrowseDisambiguation");                                                                                               // name of the context
    }
    else
    {
        log.info("USBAUDIO: album disambiguation context with empty payload.", this._currentContext.ctxtId);
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

// Album Play Disambiguation context
usbaudioApp.prototype._AlbumPlayDisambiguationContextReady = function (captureData)
{
    if (captureData)
    {
        this._topItemOptions.setTopItem = true;
        this._topItemOptions.top = captureData.templateContextCapture.controlData.topItem;
        this._topItemOptions.focus = captureData.templateContextCapture.controlData.focussedItem;
    }

    if (this._hasContextPayload() && this._currentContext.params.payload.hasOwnProperty("albumName"))
    {
        var albumName = this._currentContext.params.payload.albumName;
        this._requestList(
            [this._mdFilter.USBM_MetadataType_ArtistName],                                                                              // metadata type list (array)
            [{value: albumName, type: this._mdFilter.USBM_MetadataType_AlbumName, item_id: 0}],                                         // metadata info value and type (array)
            [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],   // sort settings order metadata type (array)
            0,                                                                                                                          // offset index
            null,                                                                                                                       // context data list NOTE: empty every time we enter context
            0,                                                                                                                          // where to scroll the list
            "AlbumPlayDisambiguation");                                                                                                 // name of the context
    }
    else
    {
        log.info("USBAUDIO: album play disambiguation context with empty payload.", this._currentContext.ctxtId);
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

/**************************
 * Control callbacks
 **************************/
usbaudioApp.prototype._dialogDefaultSelectCallback = function (dialogBtnCtrlObj, appData, params)
{
    log.debug("_dialogDefaultSelectCallback  called, appData: " + appData);

    if (this._currentContext && this._currentContextTemplate)
    {
        switch (this._currentContext.ctxtId)
        {
            case 'ErrorCondition' :
                switch (appData)
                {
                    case 'Global.OK':
                        framework.sendEventToMmui("Common", "Global.Yes");
                        break;
                }
                break;
        }
    }
};
// ---MZDMOD---
// Play folder if user long presses the list object
// This function is based on the code for _listItemClickCallBack
// Only available when under folders, this could probably be expanded to other USBAUDIO metadata based options (Artists, Albums, etc.)
// I have never used the metadata options due to it being incredibly slow with my USB drive, probably from the number of songs
usbaudioApp.prototype._listLongPressCallback = function (listCtrlObj, appData, params)
{
	// Probably don't need this debug code but including it anyways
	log.debug("_listLongPressCallback called...");
    var itemIndex = params.itemIndex;
    log.debug("   for context" + this._currentContext.ctxtId);
    log.debug("   itemIndex: "+ itemIndex + 'appData: '+ appData);
	if (this._currentContext.ctxtId == "Folders")
	{
		switch (appData.type)
		{
			// ALL SONGS
			case 7:
				if (this._currentContext.hasOwnProperty("params") &&
					this._currentContext.params.hasOwnProperty("payload") &&
					this._currentContext.params.payload.hasOwnProperty("folderId"))
					{
						this._cachedFolder.enabled = true;
						this._cachedFolder.id = this._currentContext.params.payload.folderId;
						this._appsdkGetFolderItems(this._currentContext.params.payload.folderId, this._viewType.list, 0, null, "play", params.fromVui);
					}
				break;
			// FOLDERS
			case 1:
				this._cachedFolder.enabled = true;
				this._cachedFolder.id = appData.id;
				this._appsdkGetFolderItems(appData.id, this._viewType.list, 0, null, "play", params.fromVui);
				break;
			// FILES
			case 3:
				// Removing this because single clicking files automatically plays them, shouldn't fire anyways
				//this._clearMetadata();
				//this._clearTotalElapsedTime();
				//framework.sendEventToMmui(this.uiaId, "BrowsePlayFileId", {payload:{fileId: appData.id, viewType: this._currentContext.params.payload.viewType, folderId: this._currentContext.params.payload.folderId}}, params.fromVui);
				break;
		}
	}
};

usbaudioApp.prototype._listItemClickCallback = function (listCtrlObj, appData, params)
{
    log.debug("_listItemClickCallback called...");
    var itemIndex = params.itemIndex;
    log.debug("   for context" + this._currentContext.ctxtId);
    log.debug("   itemIndex: "+ itemIndex + 'appData: '+ appData);

    switch(this._currentContext.ctxtId) {
        case 'USBAudio' :
            switch (appData)
            {
                case "BrowseSongs":
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlaySongs", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowseAlbums":
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayAlbums", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowseArtists":
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayArtists", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowseGenres":
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayGenres", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowsePlaylists":
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayPlaylists", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowseFolders" :
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayFolders", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowsePodcasts" :
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayPodcasts", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
                case "BrowseAudiobooks" :
                    if (this._userIntent == "Play")
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayAudiobooks", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, appData, params.fromVui);
                    }
                    break;
            }
            break;
        case "Playlists" :
            if (this._userIntent == "Play")
            {
                this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_PlaylistName, appData.id, params.fromVui);
            }
            else
            {
                framework.sendEventToMmui(this.uiaId, "BrowsePlaylist", {payload:{playlistName: appData.name, playlistId: appData.id}}, params.fromVui);
            }
            break;
        case 'Podcasts':
            if (this._userIntent == "Play")
            {
                this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_Podcast, appData.id, params.fromVui);
            }
            else
            {
                framework.sendEventToMmui(this.uiaId, "BrowsePodcast", {payload:{podcastName: appData.name, podcastId: appData.id}}, params.fromVui);
            }
            break;
        case 'Audiobooks':
            framework.sendEventToMmui(this.uiaId, "SetAudiobookType", {payload:{audiobookType: appData.type}}, params.fromVui);
            if (this._userIntent == "Play")
            {
          		log.debug("AUDIOBOOKS, PLAY, ITEM TYPE == " + appData.type);
            	if (appData.type == this._mdFilter.USBM_MetadataType_AlbumName) /// ( == 4) actually, the Audiobook Name
            	{
          			log.debug("AUDIOBOOKS, PLAY AUDIOBOOK");
	                this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_Kind, appData.id, params.fromVui);
	            }
            	else if (appData.type == this._mdFilter.USBM_MetadataType_ObjectName) /// ( == 2) actually, the Chapter name
            	{
          			log.debug("AUDIOBOOKS, PLAY CHAPTER");
	                this._clearMetadata();
	                this._clearTotalElapsedTime();
	                framework.sendEventToMmui(this.uiaId, "PlayChapterIndex", {payload:{chapterIndex : params.itemIndex, selectionId: this._selectionId.browsing}}, params.fromVui);
            	}
            }
            else
            {
          		log.debug("AUDIOBOOKS, BROWSE, ITEM TYPE == " + appData.type);
            	if (appData.type == this._mdFilter.USBM_MetadataType_AlbumName) /// ( == 4) actually, the Audiobook name
            	{
          			log.debug("AUDIOBOOKS, BROWSE AUDIOBOOK");
	                framework.sendEventToMmui(this.uiaId, "BrowseAudiobook", {payload:{audiobookName: appData.name, audiobookId: appData.id}}, params.fromVui);
            	}
            	else if (appData.type == this._mdFilter.USBM_MetadataType_ObjectName) /// ( == 2) actually, the Chapter name
            	{
          			log.debug("AUDIOBOOKS, PLAY CHAPTER");
	                this._clearMetadata();
	                this._clearTotalElapsedTime();
	                framework.sendEventToMmui(this.uiaId, "PlayChapterIndex", {payload:{chapterIndex : params.itemIndex, selectionId: this._selectionId.browsing}}, params.fromVui);
            	}
            }
            break;
        case 'Episodes' :
            if (appData.name != "allEpisodes")
            {
                this._clearMetadata();
                this._clearTotalElapsedTime();
                framework.sendEventToMmui(this.uiaId, "PlayEpisodeIndex", {payload:{episodeIndex : params.itemIndex - 1, selectionId: this._selectionId.browsing}}, params.fromVui);
            }
            else
            {
                this._clearMetadata();
                this._clearTotalElapsedTime();
                framework.sendEventToMmui(this.uiaId, "PlayEpisodeIndex", {payload:{episodeIndex : 0, selectionId: this._selectionId.browsing}}, params.fromVui);
            }
            break;
        case 'Chapters' :
       		log.debug("CHAPTERS, play==" + appData.name + ", ITEM TYPE = " + appData.type);
            if (appData.name != "AllChapters")
            {
                this._clearMetadata();
                this._clearTotalElapsedTime();
                framework.sendEventToMmui(this.uiaId, "PlayChapterIndex", {payload:{chapterIndex : params.itemIndex - 1, selectionId: this._selectionId.browsing}}, params.fromVui);
            }
            else
            {
                this._clearMetadata();
                this._clearTotalElapsedTime();
                framework.sendEventToMmui(this.uiaId, "PlayChapterIndex", {payload:{chapterIndex : 0, selectionId: this._selectionId.browsing}}, params.fromVui);
            }
            break;
        case "Genres" :
            if (appData.name != "allArtists")
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_GenreName, appData.id, params.fromVui);
                }
                else
                {
                    framework.sendEventToMmui(this.uiaId, "BrowseGenre", {payload:{genreName: appData.name, genreId: appData.id}}, params.fromVui);
                }
            }
            else
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(null, null, null, params.fromVui);
                }
                else
                {
                    framework.sendEventToMmui(this.uiaId, "BrowseAll", params.fromVui);
                }
            }
            break;
        case "Artists" :
            if (appData.name != "allAlbums")
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_ArtistName, appData.id, params.fromVui);
                }
                else
                {
                    // check how many albums this artist has. If only one go to Songs context
                    this._countAlbums(appData.name, "browse", appData.id, params.fromVui, this._currentContextId);
                }
            }
            else
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(null, null, null, params.fromVui);
                }
                else
                {
                    framework.sendEventToMmui(this.uiaId, "BrowseAll", params.fromVui);
                }
            }
            break;
        case "Albums" :
            if (appData.name != "allSongs")
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(appData.name, this._mdFilter.USBM_MetadataType_AlbumName, appData.id, params.fromVui);
                }
                else
                {
                    framework.sendEventToMmui(this.uiaId, "BrowseAlbumArtist", {payload:{albumName: appData.name, artistName: "", albumId: appData.id}}, params.fromVui);
                }
            }
            else
            {
                if (this._userIntent == "Play")
                {
                    this._playLineNumber(null, null, null, params.fromVui);
                }
                else
                {
                    framework.sendEventToMmui(this.uiaId, "BrowseAll", params.fromVui);
                }
            }
            break;
        case "Folders" :
            switch (appData.type)
            {
				// ---MZDMOD---
				// Set cached title enabled in case 7 (all songs) and 1 (folders)
                case 7:
                    if (this._userIntent == "Play" &&
                        this._currentContext.hasOwnProperty("params") &&
                        this._currentContext.params.hasOwnProperty("payload") &&
                        this._currentContext.params.payload.hasOwnProperty("folderId"))
                        {
							this._cachedFolder.enabled = false;
							this._cachedFolder.id = 0;
                            this._appsdkGetFolderItems(this._currentContext.params.payload.folderId, this._viewType.list, 0, null, "play", params.fromVui);
                        }
                        else
                        {
                            framework.sendEventToMmui(this.uiaId, "BrowseAll", params.fromVui);
                        }
                    break;
                case 1:
                if (this._userIntent == "Play")
                    {
						this._cachedFolder.enabled = false;
						this._cachedFolder.id = 0;
                        this._appsdkGetFolderItems(appData.id, this._viewType.list, 0, null, "play", params.fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, "BrowseFolder", {payload:{folderId: appData.id, viewType: this._viewType.tree}}, params.fromVui);
                    }
                    break;
                case 3:
					// Cached folder is cleared in _clearMetaData
                    this._clearMetadata();
                    this._clearTotalElapsedTime();
					//this._cachedFolder.enabled = false;
                    framework.sendEventToMmui(this.uiaId, "BrowsePlayFileId", {payload:{fileId: appData.id, viewType: this._currentContext.params.payload.viewType, folderId: this._currentContext.params.payload.folderId}}, params.fromVui);
                    break;
            }
            break;
        case "Songs" :
            this._clearMetadata();
            this._clearTotalElapsedTime();
            itemIndex = parseInt(itemIndex);
            framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: itemIndex, selectionId: this._selectionId.browsing}}, params.fromVui);
            this._selectionId.browsing = 0;
            break;
        case "AlbumBrowseDisambiguation":
            framework.sendEventToMmui(this.uiaId, "ChooseAlbumArtist", {payload:{artistName: appData.name, artistId: appData.id}}, params.fromVui);
            break;
        case "AlbumPlayDisambiguation":
            var albumName = this._currentContext.params.payload.albumName;
            var albumId = 0;
            if (this._currentContext.params.payload.albumId)
            {
                albumId = this._currentContext.params.payload.albumId;
            }

            this._SelectSongsAndPlay(
                [this._mdFilter.USBM_MetadataType_ObjectName],
                [{type: this._mdFilter.USBM_MetadataType_ArtistName, value: appData.name, item_id: appData.id}, {type: this._mdFilter.USBM_MetadataType_AlbumName, value: albumName, item_id: albumId}],
                [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumOrder, sort_order: this._soFilter.USBM_SortOrder_AlphaNumericAscending}], params.fromVui, "AlbumPlayDisambiguation");
            break;
        default:
            log.warn("USBAudioApp: Unknown context: ", this._currentContext.ctxtId);
            break;
    }
};

usbaudioApp.prototype._umpDefaultSelectCallback = function (ctrlObj, appData, params)
{
    log.debug("_umpDefaultSelectCallback called...", appData);

    switch (appData)
    {
        case "BrowseFolders":
            framework.sendEventToMmui(this.uiaId, "SelectRootFolder");
            break;
        case "playpause":
            if (params.state == "Play")
            {
                framework.sendEventToMmui("Common", "Global.Pause");
            }
            else if (params.state == "Pause")
            {
                framework.sendEventToMmui("Common", "Global.Resume");
            }
            else
            {
                log.warn("usbaudio: Uknown state of ump playpause button");
                framework.sendEventToMmui("Common", "Global.Play");
            }
            break;
        case 'shuffle':
            framework.sendEventToMmui(this.uiaId, "Shuffle");
            break;
        case 'repeat':
            framework.sendEventToMmui(this.uiaId, "Repeat");
            break;
		/*
        case "GenerateMoreLikeThis":
            framework.sendEventToMmui(this.uiaId, "GenerateMoreLikeThis", {payload:{"selectionId": this._selectionId.playing}});
			if (this._selectionId.browsing != 0)
		    {
		        this._releaseSelection(this._selectionId.browsing);
		        this._selectionId.browsing = 0;
		    }
            break;
		*/
		// ---MZDMOD---
		// Add folder browsing from UMP and set logic for song list button
		// Need to check how we played the songs, if we played them via long press
		case "BrowseUSBFolders":
            framework.sendEventToMmui(this.uiaId, "BrowseFolders");
            break;
        case "SongList":
			// Most of the browse events appear to require the list control to be active which is dumb
			// For a workaround, I am opening the folders list control and in the ready function of the control, going to the appropiate folder
			if ((this._cachedFolder.enabled == true) && (this._cachedFolder.id != 0))
			{
				this._cachedFolder.songList = true;
			}
			framework.sendEventToMmui(this.uiaId, "SongList");
            break;
        case "next":
            framework.sendEventToMmui("Common", "Global.Next");
            break;
        case "prev":
            framework.sendEventToMmui("Common", "Global.Previous");
            break;
        case "source":
            framework.sendEventToMmui(this.uiaId, "SelectSourceMenu");
            break;
        case "settings":
            framework.sendEventToMmui(this.uiaId, "SelectSettings");
            break;
        default:
            log.warn("usbaudio: Unrecognized ump button clicked");
    }
};

usbaudioApp.prototype._umpHoldStartCallback = function (ctrlObj, appData, params)
{
    log.debug("_umpHoldStartCallback called...", appData);

    if (appData == "next")
    {
        framework.sendEventToMmui(this.uiaId, "FastForward");
    }
    else if (appData == "prev")
    {
        framework.sendEventToMmui(this.uiaId, "Rewind");
    }
};

usbaudioApp.prototype._umpHoldStopCallback = function (ctrlObj, appData, params)
{
    log.debug("_umpHoldStopCallback called...", appData);
    //Take no action if app has changed.
    if(framework._currentAppUiaId === 'usbaudio')
    {
        if (this._umpButtonConfig["playpause"].currentState == "Play")
        {
            framework.sendEventToMmui("Common", "Global.Pause");
        }
        else
        {
            framework.sendEventToMmui("Common", "Global.Resume");
        }
    }
};

usbaudioApp.prototype._umpSlideCallback = function (ctrlObj, appData, params)
{
    clearTimeout(this._finalAdjustmentTimeout);
    this._finalAdjustmentTimeout = null;
    if (appData == "scrubber" && params.finalAdjustment != true)
    {
        this._finalAdjustmentTimeout = setTimeout(this._jumpToPosition.bind(this), this._settleTime);
    }


    this._umpProgressValue = params.value;
    if (params.value < 0)
    {
        params.value = 0;
    }
    else if (params.value > 1)
    {
        params.value = 1;
    }
    if (appData == "scrubber" && params.finalAdjustment == true)
    {
        this._stopElapsedUpdate = false;
    }

    if (appData == "scrubber" && params.finalAdjustment == true && (Math.abs(this._umpElapseTime - (this._umpTotalTime*params.value)) > 2))
    {
        var percent = Math.round(params.value*100);
        this._umpElapseTime = parseInt(this._umpTotalTime * this._umpProgressValue);
        framework.sendEventToMmui(this.uiaId, "PlaybackJumpToPosition", {payload:{percent: percent}});
    }
    else if (params.finalAdjustment == false)
    {
        this._stopElapsedUpdate = true;
        this._umpSecondaryElapseTime = parseInt(this._umpTotalTime * this._umpProgressValue);
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setElapsedTime(this._secondsToHHMMSS(this._umpSecondaryElapseTime));
    }
};

usbaudioApp.prototype._requestMoreDataCallback = function (index)
{
    if (this._currentContext.ctxtId != "Folders")
    {
        this._requestMore(index);
    }
    else
    {
		this._appsdkGetFolderItems(this._currentContext.params.payload.folderId, this._currentContext.params.payload.viewType, index-1, this._currentContextTemplate.list2Ctrl.dataList, "browse", false);
    }
};

/******************************
 * Message Handlers
 ******************************/
usbaudioApp.prototype._TimedSbn_ErrorConditionMsgHandler = function (msg)
{
    var error = this._getErrorId(msg.params.payload.error);
    framework.common.startTimedSbn(this.uiaId, this._usbaudioErrorSbn, "errorNotification", {sbnStyle: "Style02", imagePath1 : 'IcnSbnEnt.png', text1Id: error});
};

usbaudioApp.prototype._DeviceReadyMsgHandler = function (msg)
{

};

usbaudioApp.prototype._DeviceNormalizedMsgHandler = function (msg)
{
    if (this._connectedDevs.deviceSelected == msg.params.payload.deviceId)
    {
        // cataloging is ready enable the other menus in USBAudio context
        this._connectedDevs.selectedDevCataloged = true;
        if (this._currentContext && this._currentContext.ctxtId && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying" && this._connectedDevs.BODReady && this._cachedSongDetails.title)
        {
            //this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("GenerateMoreLikeThis", !this._connectedDevs.selectedDevCataloged);
            if (this._connectedDevs.showGracenote == true)
            {
                this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine3({detailText: "Powered By Gracenote®"});
                this._gracenoteTimeout = setTimeout(this._removeGracenote.bind(this), this._gracenoteTimeoutTime);
            }
        }

        this._enableUSBAudioMenus();
    }

    if (msg.params.payload.deviceId == this._connectedDevs.A.deviceId)
    {
        this._connectedDevs.A.alreadyCataloged = true;
    }
    else if (msg.params.payload.deviceId == this._connectedDevs.B.deviceId)
    {
        this._connectedDevs.B.alreadyCataloged = true;
    }
};

usbaudioApp.prototype._BODReadyMsgHandler = function (msg)
{
    if (this._connectedDevs.deviceSelected == msg.params.payload.deviceId)
    {
        // cataloging is ready enable the other menus in USBAudio context
        this._connectedDevs.BODReady = true;
        if (this._currentContext && this._currentContext.ctxtId && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
        {
            this._BODReady(true);
            if (this._connectedDevs.selectedDevCataloged == true && this._cachedSongDetails.title)
            {
                //this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("GenerateMoreLikeThis", !this._connectedDevs.selectedDevCataloged);
            }

            if (this._connectedDevs.showGracenote == true && this._cachedSongDetails.title)
            {
                this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine3({detailText: "Powered By Gracenote®"});
                this._gracenoteTimeout = setTimeout(this._removeGracenote.bind(this), this._gracenoteTimeoutTime);
            }
        }
    }

    if (msg.params.payload.deviceId == this._connectedDevs.A.deviceId)
    {
        this._connectedDevs.A.BODReady = true;
    }
    else if (msg.params.payload.deviceId == this._connectedDevs.B.deviceId)
    {
        this._connectedDevs.B.BODReady = true;
    }
};

usbaudioApp.prototype._DeviceDisabledMsgHandler = function (msg)
{
    if (this._connectedDevs.deviceSelected == msg.params.payload.deviceId)
    {
        this._clearSelectionId();
        this._clearMetadata();
        this._clearTotalElapsedTime();
    }
    if(this._connectedDevs.A.deviceId == msg.params.payload.deviceId)
    {
        this._connectedDevs.A.alreadyCataloged = false;
        this._connectedDevs.A.showGracenote = true;
    }
    if(this._connectedDevs.B.deviceId == msg.params.payload.deviceId)
    {
        this._connectedDevs.B.alreadyCataloged = false;
        this._connectedDevs.B.showGracenote = true;
    }

};

usbaudioApp.prototype._DeviceSelectedMsgHandler = function (msg)
{
    if (this._connectedDevs.deviceSelected != msg.params.payload.deviceId)
    {
        this._clearMetadata();
        this._clearUSBData();
        this._clearSelectionId();
        this._disableUSBAudioMenus();
        this._clearTotalElapsedTime();
    }

    this._connectedDevs.deviceSelected = msg.params.payload.deviceId;
    var id = 0;
    var name = "";
    var type = "";
    var cataloged = "";
    var showGracenote = true;
    var BODReady = false;
    if (this._connectedDevs.A.deviceId == msg.params.payload.deviceId)
    {
        id = 1;
        name = this._connectedDevs.A.name;
        type = this._connectedDevs.A.type;
        cataloged = this._connectedDevs.A.alreadyCataloged;
        showGracenote = this._connectedDevs.A.showGracenote;
        BODReady = this._connectedDevs.A.BODReady;
    }
    else
    {
        id = 2;
        name = this._connectedDevs.B.name;
        type = this._connectedDevs.B.type;
        cataloged = this._connectedDevs.B.alreadyCataloged;
        showGracenote = this._connectedDevs.B.showGracenote;
        BODReady = this._connectedDevs.B.BODReady;
    }

    this._connectedDevs.selectedDevType = type;
    this._connectedDevs.selectedDevCataloged = cataloged;
    this._connectedDevs.showGracenote = showGracenote;
    this._connectedDevs.BODReady = BODReady;

    for (var i in this._contextTable)
    {
        if ("ErrorCondition" !== i)
        {
            this._contextTable[i].sbNameSubMap = {deviceId: id, deviceName: name};
            this._contextTable[i].sbNameIcon = "IcnSbnEnt.png";
        }
    }

    if (this._currentContext && this._currentContext.uiaId == "usbaudio" && this._currentContextTemplate)
    {
        framework.common.setSbNameId(this.uiaId, this.uiaId, {deviceId: id, deviceName: name});
    }

    if ((msg.params.payload.deviceId == this._connectedDevs.A.deviceId && this._connectedDevs.A.alreadyCataloged == false && this._connectedDevs.A.type != "IPOD") ||
        (msg.params.payload.deviceId == this._connectedDevs.B.deviceId && this._connectedDevs.B.alreadyCataloged == false && this._connectedDevs.B.type != "IPOD"))
        {
            this._disableUSBAudioMenus();
        }
        else
        {
            this._enableUSBAudioMenus();
        }
};

usbaudioApp.prototype.TimedSbn_ConnectionStatusMsgHandler = function (msg)
{
    if (msg.params.payload.status == "Disconnected")
    {
        if (msg.params.payload.usb == "A")
        {
            this._connectedDevs.A.name = "";
            this._connectedDevs.A.deviceId = null;
            this._connectedDevs.A.type = null;
            this._connectedDevs.A.alreadyCataloged = false;
            this._connectedDevs.A.showGracenote = true;
            this._connectedDevs.A.BODReady = false;
            if (msg.params.payload.hasOwnProperty("reason"))
            {
                this._connectedDevs.A.connectionReason = msg.params.payload.reason;
            }

            if (msg.params.payload.hasOwnProperty("reason") && (msg.params.payload.reason === "Lang"))
            {
                this._connectedDevs.selId = 0;
                this._connectedDevs.deviceSelected = 0;
                this._connectedDevs.selectedDevType = "";
                this._connectedDevs.selectedDevCataloged = false;
                this._connectedDevs.showGracenote = true;
                this._connectedDevs.BODReady = false;
            }
            else if (this._connectedDevs.A.connectionReason !== "System")
            {
                var SbnString = "USB1Disconnected";
                // show sbn
                framework.common.startTimedSbn(this.uiaId, 'USBA_ConnectionStatus_Sbn', 'deviceRemoved', {
                    sbnStyle : 'Style02',
                    imagePath1 : 'IcnSbnEnt.png',
                    text1Id : SbnString,
                    text1SubMap: {"usbName": msg.params.payload.name}
                });
            }
        }
        else
        {
            this._connectedDevs.B.name = "";
            this._connectedDevs.B.deviceId = null;
            this._connectedDevs.B.type = null;
            this._connectedDevs.B.alreadyCataloged = false;
            this._connectedDevs.B.showGracenote = true;
            this._connectedDevs.B.BODReady = false;
            if (msg.params.payload.hasOwnProperty("reason"))
            {
                this._connectedDevs.B.connectionReason = msg.params.payload.reason;
            }

            if (msg.params.payload.hasOwnProperty("reason") && (msg.params.payload.reason === "Lang"))
            {
                this._connectedDevs.selId = 0;
                this._connectedDevs.deviceSelected = 0;
                this._connectedDevs.selectedDevType = "";
                this._connectedDevs.selectedDevCataloged = false;
                this._connectedDevs.showGracenote = true;
                this._connectedDevs.BODReady = false;
            }
            else if (this._connectedDevs.B.connectionReason !== "System")
            {
                var SbnString = "USB2Disconnected";
                // show sbn
                framework.common.startTimedSbn(this.uiaId, 'USBB_ConnectionStatus_Sbn', 'deviceRemoved', {
                    sbnStyle : 'Style02',
                    imagePath1 : 'IcnSbnEnt.png',
                    text1Id : SbnString,
                    text1SubMap: {"usbName": msg.params.payload.name}
                });
            }
        }
    }
    else if (msg.params.payload.status == "Connected")
    {
        // show sbn
        if (msg.params.payload.usb == "A")
        {
            this._connectedDevs.A.name = msg.params.payload.name;
            this._connectedDevs.A.deviceId = msg.params.payload.deviceId;
            this._connectedDevs.A.type = msg.params.payload.type;
            // this._connectedDevs.A.connectionReason = msg.params.payload.reason;
            // if (msg.params.payload.type == "IPOD")
            // {
                // this._connectedDevs.A.alreadyCataloged = true;
            // }
            if (this._connectedDevs.A.connectionReason === "User")
            {
                var SbnString = "USB1Connected";
                // show sbn
                framework.common.startTimedSbn(this.uiaId, 'USBA_ConnectionStatus_Sbn', 'deviceConnected', {
                    sbnStyle : 'Style02',
                    imagePath1 : 'IcnSbnEnt.png',
                    text1Id : SbnString,
                    text1SubMap: {"usbName": msg.params.payload.name}
                });
            }
        }
        else
        {
            this._connectedDevs.B.name = msg.params.payload.name;
            this._connectedDevs.B.deviceId = msg.params.payload.deviceId;
            this._connectedDevs.B.type = msg.params.payload.type;
            // this._connectedDevs.B.connectionReason = msg.params.payload.reason;
            // if (msg.params.payload.type == "IPOD")
            // {
                // this._connectedDevs.B.alreadyCataloged = true;
            // }
            if (this._connectedDevs.B.connectionReason === "User")
            {
                var SbnString = "USB2Connected";
                // show sbn
                framework.common.startTimedSbn(this.uiaId, 'USBB_ConnectionStatus_Sbn', 'deviceConnected', {
                    sbnStyle : 'Style02',
                    imagePath1 : 'IcnSbnEnt.png',
                    text1Id : SbnString,
                    text1SubMap: {"usbName": msg.params.payload.name}
                });
            }
        }
    }
};

usbaudioApp.prototype._PlaybackStatusMsgHandler = function (msg)
{
    /*
    if (this._scrubberConfig.duration != (msg.params.payload.playbackStatus.length*1000))
    {
        this._scrubberConfig.duration = msg.params.payload.playbackStatus.length*1000;
        if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
        {
            this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setScrubberDuration(this._scrubberConfig.duration);
        }
    }
    */

    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying" && this._umpTotalTime != parseInt(msg.params.payload.playbackStatus.length))
    {
        this._umpSecondaryElapseTime = parseInt(parseInt(msg.params.payload.playbackStatus.length) * this._umpProgressValue);
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setElapsedTime(this._secondsToHHMMSS(this._umpSecondaryElapseTime));
    }

    //SW00154449 - Ensuring that the play/pause button is in the correct state, while we're playing
   /* if (this._currentContext && this._currentContext.ctxtId && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
    {
        if(this._umpButtonConfig["playpause"].currentState != "Pause")
        {
            this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonState("playpause", "Pause");
        }
    }
    else
    {
        this._umpButtonConfig["playpause"].currentState = "Pause";
    }*/

    this._umpTotalTime = parseInt(msg.params.payload.playbackStatus.length);
    this._umpElapseTime = parseInt(msg.params.payload.playbackStatus.elapsed);
    var progress = this._umpElapseTime / this._umpTotalTime;
    log.debug('Updating progress', this._umpTotalTime, this._umpElapseTime, progress);
    // Update control if context is bound to a template
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying" && this._stopElapsedUpdate == false)
    {
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setElapsedTime(this._secondsToHHMMSS(this._umpElapseTime));
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setTotalTime(this._secondsToHHMMSS(this._umpTotalTime));
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.updateScrubber(progress);
    }
    else if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying" && this._stopElapsedUpdate == true)
    {
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setTotalTime(this._secondsToHHMMSS(this._umpTotalTime));
    }

    if (msg.params.payload.playbackStatus.hasOwnProperty("selectionId"))
    {
        if (this._selectionId.playing != msg.params.payload.playbackStatus.selectionId && this._selectionId.playing != null)
        {
            // release selection
            this._releaseSelection(this._selectionId.playing);
            this._selectionId.playing = msg.params.payload.playbackStatus.selectionId;
        }
        else if (this._selectionId.playing != msg.params.payload.playbackStatus.selectionId && this._selectionId.playing == null)
        {
            this._selectionId.playing = msg.params.payload.playbackStatus.selectionId;
        }
    }
};

usbaudioApp.prototype._NowPlayingDataMsgHandler = function (msg)
{
    log.debug("Inside _NowPlayingDataMsgHandler with msg : ", msg );
    if (!this._currentContext){
    	log.debug('No this._currentContext !!!');
    }
    else
    {
    	log.debug('this._currentContext.ctxtId', this._currentContext.ctxtId);
    }

    if (this._currentContext && this._currentContext.ctxtId == "NowPlaying")
	{
        if (msg && msg.params && msg.params.payload && msg.params.payload.folderId != 0)
        {
			// ---MZDMOD---
			if ((this._cachedFolder.enabled == true) && (this._cachedFolder.id != 0))
			{
				this._appsdkGetFolderItems(this._cachedFolder.id, this._viewType.tree, 0, null, "getFolderName", false);
			}
			else
			{
				var folderId = parseInt(msg.params.payload.folderId);
				this._appsdkGetFolderItems(folderId, this._viewType.tree, 0, null, "getFolderName", false);
			}
        }
        else if (msg && msg.params && msg.params.payload && msg.params.payload.playlistName)
        {
            var playList = msg.params.payload.playlistName;

            if (playList.toLowerCase() == 'more like this')
            {
                playList = framework.localize.getLocStr('usbaudio', 'common.Tooltip_IcnUmpMore');
                //test
                if (this._selectionId.browsing != 0)
			    {
			        this._releaseSelection(this._selectionId.browsing);
			        this._selectionId.browsing = 0;
			    }
            }

            if (playList == "")
            {
		    	log.debug('Playlist is empty string!!!');
            	playList = "";
            }

            this._cachedSongDetails.screenTitle = playList;
		    if (this._currentContextTemplate)
    		{
				// ---MZDMOD---
				// Add image for playlist objects
            	//this._currentContextTemplate.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: playList});
				this._currentContextTemplate.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: playList, ctrlTitleIcon: "common/images/icons/IcnListPlaylist_En.png"});
           	}
        }
    }
};

usbaudioApp.prototype._ObjectInfoMsgHandler = function (msg)
{
    this._cachedSongDetails.genre = msg.params.payload.genre;
    this._cachedSongDetails.artist = msg.params.payload.artist;
    this._cachedSongDetails.title = msg.params.payload.title;
    this._cachedSongDetails.album = msg.params.payload.album;
    this._stopElapsedUpdate = false;

    // Update control if context is bound to a template
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId && this._currentContext.ctxtId == "NowPlaying")
    {
        clearTimeout(this._finalAdjustmentTimeout);
        this._finalAdjustmentTimeout = null;
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.releaseScrubber(0);
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setElapsedTime(this._secondsToHHMMSS(0));
        this._populateNowPlayingCtrl(this._currentContextTemplate, this._cachedSongDetails);
        if (this._connectedDevs.selectedDevCataloged == true)
        {
            //this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("GenerateMoreLikeThis", !this._connectedDevs.selectedDevCataloged);
            if (this._connectedDevs.showGracenote == true)
            {
                this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine3({detailText: "Powered By Gracenote®"});
                this._gracenoteTimeout = setTimeout(this._removeGracenote.bind(this), this._gracenoteTimeoutTime);
            }
        }
    }
};

usbaudioApp.prototype._TimedSbn_CurrentSongMsgHandler = function (msg)
{
    framework.common.startTimedSbn(this.uiaId, 'TimedSbn_UsbAudio_CurrentSong', 'typeE', {
        sbnStyle : 'Style02',
        imagePath1 : 'IcnSbnEnt.png',
		text1 : "USB",
        text2 : msg.params.payload.title,
    });
};

usbaudioApp.prototype._PlayerStateMsgHandler = function (msg)
{
    /*
    if ((msg.params.payload.playerState == "Paused" || msg.params.payload.playerState == "Stopped") && this._umpButtonConfig["playpause"].currentState != "Play")
    {
        if (this._currentContext && this._currentContext.ctxtId && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
        {
            this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonState("playpause", "Play");

        }
        else
        {
            this._umpButtonConfig["playpause"].currentState = "Play";
        }
    }
    else if (msg.params.payload.playerState == "Playing" && this._umpButtonConfig["playpause"].currentState != "Pause")
    {
        if (this._currentContext && this._currentContext.ctxtId && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
        {
            this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonState("playpause", "Pause");
        }
        else
        {
            this._umpButtonConfig["playpause"].currentState = "Pause";
        }
    }
    */
    if(msg && msg.params && msg.params.payload && msg.params.payload.playerState)
    {
        switch(msg.params.payload.playerState) {
        case "Paused":
        case "Stopped":
            this._changePlayButton("Play");
            break;
        case "Playing":
            this._changePlayButton("Pause");
            break;
        default :
            log.warn("Incorrect player state "+msg.params.payload.playerState);
        }
    }
};
usbaudioApp.prototype._changePlayButton = function(nextButtonStatus)
{
    console.log("ENTER _changePlayButton, value:[" +nextButtonStatus+ "]");
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
    {
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonState("playpause", nextButtonStatus);
    }
    this._umpButtonConfig["playpause"].currentState = nextButtonStatus;
};

usbaudioApp.prototype._CoverArtMsgHandler = function (msg)
{
    if (this._cachedSongDetails.coverArt != "None" && this._cachedSongDetails.coverArt != msg.params.payload.path && this._cachedSongDetails.coverArt != "./common/images/no_artwork_icon.png")
    {
        // Send msg to mmui to remove the old cover art image
        framework.sendEventToMmui(this.uiaId, "ReleaseCoverArt", {payload:{path: this._cachedSongDetails.coverArt}});
    }

    this._cachedSongDetails.coverArt = msg.params.payload.path;
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId == "NowPlaying")
    {
        this._populateCoverArt(this._currentContextTemplate, this._cachedSongDetails);
    }
};

usbaudioApp.prototype._RepeatShuffleStatusMsgHandler = function (msg)
{
    this._cacheRepeatShuffleState = msg.params.payload;
    if (this._currentContext && this._currentContextTemplate && this._currentContext.ctxtId && this._currentContext.ctxtId == "NowPlaying")
    {
        this._updateUmpButtons(this._currentContextTemplate, this._cacheRepeatShuffleState);
    }
};

usbaudioApp.prototype._PlayRequest = function (msg)
{
    // count using path and metadata
    this._selectData(msg, true);
};
// ---MZDMOD---
usbaudioApp.prototype._BrowsePlayRequestMsgHandler = function (msg)
{
	this._cachedFolder.enabled = true;
	this._cachedFolder.id = msg.params.payload.folderId;
    this._appsdkGetFolderItems(msg.params.payload.folderId, this._viewType.list, 0, null, "play", true);
};

usbaudioApp.prototype._BrowseArtistDisambiguate = function (msg)
{
    this._countAlbums(msg.params.payload.artistName, "browse", null, true, "BrowseArtistDisambiguate");
};

usbaudioApp.prototype._BrowseAlbumDisambiguate = function (msg)
{
    if ((this._currentContext &&
        this._currentContext.hasOwnProperty("params") &&
        this._currentContext.params.hasOwnProperty("payload") &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._currentContext.params.payload.path != "Genre_ArtistAlbums" &&
        this._currentContext.params.payload.path != "GenresAllArtists_ArtistAlbums" &&
        this._currentContext.params.payload.path != "ArtistAlbums") ||
        (!this._currentContext) ||
        (this._currentContext.ctxtId == "USBAudio") || (this._currentContext.ctxtId == "NowPlaying") || (this._currentContext.ctxtId == "Folders"))
        {
            this._countArtists(msg.params.payload.albumName, "browse", true, "BrowseAlbumDisambiguate");
        }
        else
        {
            framework.sendEventToMmui(this.uiaId, "BrowseAlbumArtist", {payload:{albumName: msg.params.payload.albumName}}, true);
        }
};

usbaudioApp.prototype._PlayAlbumDisambiguate = function (msg)
{
    if ((this._currentContext &&
        this._currentContext.hasOwnProperty("params") &&
        this._currentContext.params.hasOwnProperty("payload") &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._currentContext.params.payload.path != "Genre_ArtistAlbums" &&
        this._currentContext.params.payload.path != "GenresAllArtists_ArtistAlbums" &&
        this._currentContext.params.payload.path != "ArtistAlbums") || (!this._currentContext))
        {
            this._countArtists(msg.params.payload.albumName, "play", true, "PlayAlbumDisambiguate");
        }
        else if (this._currentContext && (!this._currentContext.params.hasOwnProperty("payload") || !this._currentContext.params.payload.hasOwnProperty("path")))
        {
            this._countArtists(msg.params.payload.albumName, "play", true, "PlayAlbumDisambiguate");
        }
        else
        {
            var artistName = this._currentContext.params.payload.metadata.artistName;
            var artistId = this._currentContext.params.payload.metadata.artistId;
            // make selection and play songs
            this._SelectSongsAndPlay(
                [this._mdFilter.USBM_MetadataType_ObjectName],
                [{type: this._mdFilter.USBM_MetadataType_AlbumName, value: msg.params.payload.albumName, item_id: 0}, {type: this._mdFilter.USBM_MetadataType_ArtistName, value: artistName, item_id: artistId}],
                [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}], true, "PlayAlbumDisambiguate");
        }
};

usbaudioApp.prototype._UserIntentMsgHandler = function (msg)
{
    if (msg.params.payload.intent == "Invalid")
    {
        this._userIntent = "Browse";
    }
    else
    {
        this._userIntent = msg.params.payload.intent;
    }
};

/******************************
 * APPSDK Requests
 ******************************/
usbaudioApp.prototype._requestList = function (mdTypeList, mdInfo, sortSettings, offset, dataList, scrollIndex, contextName, fromVui)
{
    // TODO: Make sure the input is valid
    // appsdk request
    var isiPod = false;
    if (this._connectedDevs.selectedDevType == "IPOD")
    {
        isiPod = true;
    }

    var params = {
        "dev_id":this._connectedDevs.deviceSelected,
        "md_types_sz":{
            "types_list_sz": mdTypeList.length
        },
        "md_types": {
            "types_list": mdTypeList            // this is ussually changed
        },
        "md_info_list_sz": {
            "metadata_info_sz": mdInfo.length
        },
        "md_info_list": {
            "metadata_info": mdInfo
        },
        "sort_sett_list_sz": {
            "sort_settings_sz": sortSettings.length
        },
        "sort_sett_list": {
            "sort_settings": sortSettings
        },
        "max_list_size": this._listStatus.requestSize,
        "offset": offset,
        "sel_id": this._selectionId.browsing,
        "bUseAsBOD": isiPod,
    };

    framework.sendRequestToAppsdk(this.uiaId, this._appsdkCallback.bind(this, dataList, scrollIndex, contextName, fromVui), "usbm", "GetPropertyInfoListAsync", params);
};

usbaudioApp.prototype._appsdkGetFolderItems = function (folderId, viewType, index, dataList, action, fromVui)
{
    var params = {
        view_t: 1,      // tree view type by default
        folder_id: 1,   // browse root folder by default
        offset: index,      // start from first item by default
        get_num_items: this._listStatus.requestSize,
        dev_id: this._connectedDevs.deviceSelected,
    };
    if (folderId != undefined && viewType != undefined)
    {
        params.view_t = viewType;
        params.folder_id = folderId;
    }
    else
    {
        log.warn("Missing folderId or viewType");
    }
    // temporary request all items. Until BLM fix total_count issue
    if (action != "play" && action != "getFolderName")
    {
        params.get_num_items =  20;
    }
    else
    {
        params.get_num_items = 1;
    }

    framework.sendRequestToAppsdk(this.uiaId, this._getItemsCallback.bind(this, index, dataList, action, fromVui, viewType), "usbm", "BOD_GetFolderItems", params);
};

// release selection by its ID
usbaudioApp.prototype._releaseSelection = function (selId)
{
    var params = {sel_id: selId};
    framework.sendRequestToAppsdk(this.uiaId, this._selectionReleased.bind(this), "usbm", "GetPropertyInfoListReleaseQueryHandle", params);
};

// request alphabet and its letters indexes
usbaudioApp.prototype._requestLetterIndexing = function (sel_id, md_type, contextRequested)
{
    var params = {sel_id: sel_id, md_type: md_type};
    framework.sendRequestToAppsdk(this.uiaId, this._letterIndexingCallback.bind(this, contextRequested), "usbm", "GetAlphabet", params);
};

/******************************
 * APPSDK Callbacks
 ******************************/
usbaudioApp.prototype._appsdkCallback  = function (dataList, scrollIndex, context, fromVui, params)
{
    if (params.msgType == "methodResponse")
    {
        if(params.hasOwnProperty("params") && params.params.hasOwnProperty("sel_id_out"))
        {
            if (this._selectionId.browsing != params.params.sel_id_out && this._selectionId.browsing != 0)
            {
                // release selection that is not used
                this._releaseSelection(this._selectionId.browsing);
                this._selectionId.browsing = params.params.sel_id_out;
            }
            else if (this._selectionId.browsing == 0 && this._selectionId.browsing != params.params.sel_id_out)
            {
                this._selectionId.browsing = params.params.sel_id_out;
            }
        }

        if ((this._currentContext && this._currentContextTemplate && this._currentContext.hasOwnProperty("params") &&
            this._currentContext.params.hasOwnProperty("payload") && this._currentContext.params.payload.hasOwnProperty("path") &&
            this._currentContext.params.payload.path == context) || (context == "AlbumBrowseDisambiguation") || (context == "AlbumPlayDisambiguation"))
            {
                this._populateList(this._currentContextTemplate, params, this._currentContext.ctxtId, dataList, scrollIndex);
                if (context == "AlbumBrowseDisambiguation" || context == "AlbumPlayDisambiguation" ||
                    (this._payloadTable[this._currentContext.params.payload.path].hasLetterIndexing == true &&
                    this._currentContextTemplate.list2Ctrl.letterIndex &&
                    !this._currentContextTemplate.list2Ctrl.letterIndex.getElementsByTagName('li').length))
                    {
                        // ask BLM for alphabet and indexes of the letters
                        this._requestLetterIndexing(this._selectionId.browsing, this._payloadTable[this._currentContext.params.payload.path].md_types[0], context);
                    }
            }
            else
            {
                log.debug("USBUADIO: received appsdk response is not for this context", context);
            }
        }
        else if (params.msgType == "methodErrorResponse")
        {
            log.error("USBAUDIO: GetPropertyInfoListAsync request failed!");
            if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
            {
                this._currentContextTemplate.list2Ctrl.setLoading(false);
            }
        }
};

usbaudioApp.prototype._letterIndexingCallback = function (context, params)
{
    if (params.msgType == "methodResponse")
    {
        if (this._currentContext && this._currentContext.ctxtId &&
            this._contextTable[this._currentContext.ctxtId].controlProperties["List2Ctrl"]["hasLetterIndex"] == true &&
            (this._currentContext.hasOwnProperty("params") && this._currentContext.params.hasOwnProperty("payload") &&
            this._currentContext.params.payload.hasOwnProperty("path") && this._currentContext.params.payload.path == context) ||
            (context == "AlbumBrowseDisambiguation") || (context == "AlbumPlayDisambiguation"))
            {
                this._setContextLetterIndexing(params.params.alphabet_list.item);
            }
            else
            {
                log.debug("USBAUDIO: alphabet response is not for this context", context);
            }
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAUDIO: GetAlphabet appsdk request failed");
        if (this._currentContext && this._currentContext.ctxtId &&
            this._contextTable[this._currentContext.ctxtId].controlProperties["List2Ctrl"]["hasLetterIndex"] == true)
            {
                log.debug("USBAUDIO: GetAlphabet request failed!");
            }
    }
};

usbaudioApp.prototype._getItemsCallback = function (index, dataList, action, fromVui, viewType, params)
{
    if (params.msgType == "methodResponse")
    {
        if (action != "play" && action != "getFolderName")
        {
            this._populateFolders(this._currentContextTemplate, params, dataList, index, viewType);
            if (params.params.folder_inf.id != params.params.parent_id)
            {
                framework.sendEventToMmui(this.uiaId, "BrowseParentId", {payload:{parentId: params.params.parent_id}}, fromVui);
            }
        }
        else if (action != "getFolderName")
        {
            this._clearMetadata(false);
            this._clearTotalElapsedTime();
            framework.sendEventToMmui(this.uiaId, "BrowsePlayFileId", {payload:{fileId: params.params.itms.item[0].id, folderId: params.params.folder_inf.id, viewType: this._viewType.list}}, fromVui);
        }
        else
        {
      			// ---MZDMOD---
      			// Remove the '/' character off the folder string by cutting last char
      			var renamedItem = params.params.folder_inf.name;
      			if (renamedItem.length > 1)
      			{
      				renamedItem = renamedItem.slice(0,-1);
      			}
            else if (renamedItem.length === 1)
            {
              renamedItem = "";
            }
            if (this._currentContext && this._currentContext.ctxtId == "NowPlaying" && this._currentContextTemplate)
            {
				// Add the image for the folder title
                //this._currentContextTemplate.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: params.params.folder_inf.name});
				this._currentContextTemplate.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: renamedItem, ctrlTitleIcon: "common/images/icons/IcnListFolder.png"});
            }
            else
            {
				//this._cachedSongDetails.screenTitle = params.params.folder_inf.name;
                this._cachedSongDetails.screenTitle = renamedItem;
            }
        }
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAUDIO: BOD_GetFolderItems request failed!");
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

usbaudioApp.prototype._selectionReleased = function (params)
{
    if (params.msgType == "methodResponse")
    {
        log.debug("USBAudio: APPSDK callback - result of selection release", params.params.result);
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAudio: APPSDK GetPropertyInfoListReleaseQueryHandle failed");
    }
};

/******************************
 * Helper Functions
 ******************************/
usbaudioApp.prototype._BODReady = function (isReady)
{
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setBuffering(!isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("SongList", !isReady);
	this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("BrowseUSBFolders", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("BrowseFolders", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("repeat", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("shuffle", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("prev", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("playpause", !isReady);
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("next", !isReady);

    if (isReady)
    {
        this._currentContextTemplate.nowPlaying4Ctrl.setAudioTitle({audioTitleText: "", audioTitleIcon:"", audioTitleId: ""});
        this._populateNowPlayingCtrl(this._currentContextTemplate, this._cachedSongDetails);
        this._populateCoverArt(this._currentContextTemplate, this._cachedSongDetails);
    }
    else
    {
        this._currentContextTemplate.nowPlaying4Ctrl.setAudioTitle({audioTitleText: "", audioTitleIcon:"none", audioTitleId: "common.Loading"});
        this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine1({detailText: "", detailIcon: "none"});
        this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine2({detailText: "", detailIcon: "none"});
        this._currentContextTemplate.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: ""});
        this._currentContextTemplate.nowPlaying4Ctrl.setArtworkImagePath();
    }
};

usbaudioApp.prototype._jumpToPosition = function ()
{
    this._stopElapsedUpdate = false;
    this._umpElapseTime = parseInt(this._umpTotalTime * this._umpProgressValue);
    var percent = Math.round(this._umpProgressValue*100);
    framework.sendEventToMmui(this.uiaId, "PlaybackJumpToPosition", {payload:{percent: percent}});
};

usbaudioApp.prototype._contextReadyAction = function (captureData)
{
    if (this._hasContextPayload() &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._currentContext.params.payload.hasOwnProperty("metadata") &&
        this._currentContext.params.payload.path != "Invalid")
        {
            if (captureData)
            {
                this._topItemOptions.setTopItem = true;
                this._topItemOptions.top = captureData.templateContextCapture.controlData.topItem;
                this._topItemOptions.focus = captureData.templateContextCapture.controlData.focussedItem;
            }

            this._createRequest();
        }
        else if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
};

usbaudioApp.prototype._presetContextConfig = function ()
{
    if (this._hasContextPayload() &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._currentContext.params.payload.hasOwnProperty("metadata") &&
        this._currentContext.params.payload.path != "Invalid")
        {
            this._setTopItem();
            this._setLetterIndexing();
            this._setTitle();
        }
        else if (this._hasContextPayload() &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._currentContext.params.payload.hasOwnProperty("metadata") &&
        this._currentContext.params.payload.path == "Invalid")
        {
            log.warn("USBAUDIO: context change with invalid path!", this._currentContext.ctxtId);
        }
        else
        {
            log.warn("USBAUDIO: invalid context payload!");
        }
};

usbaudioApp.prototype._setTopItem = function ()
{
    var ctxtId = this._currentContext.ctxtId;
    this._currentContextId = this._currentContext.params.payload.path;
    if (this._payloadTable[this._currentContextId].checkValues == true &&
        !this._equalValues(this._payloadTable[this._currentContextId].md_info, this._currentContext.params.payload.metadata))
        {
            this._contextTable[ctxtId].controlProperties.List2Ctrl.scrollTo = 0;
            this._payloadTable[this._currentContextId].index = 0;
            this._contextTable[ctxtId].controlProperties.List2Ctrl.focussedItem = 0;
            this._payloadTable[this._currentContextId].focused = 0;
        }
        else
        {
            this._contextTable[ctxtId].controlProperties.List2Ctrl.scrollTo = this._payloadTable[this._currentContextId].index;
            this._contextTable[ctxtId].controlProperties.List2Ctrl.focussedItem = this._payloadTable[this._currentContextId].focused;
        }
};

usbaudioApp.prototype._setNumberedList = function ()
{
    if (this._currentContext && this._hasContextPayload())
    {
        this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.numberedList = this._payloadTable[this._currentContext.params.payload.path].hasLineNumbers;
    }
};

usbaudioApp.prototype._setLetterIndexing = function ()
{
    if (this._currentContext && this._hasContextPayload())
    {
        this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.hasLetterIndex = this._payloadTable[this._currentContext.params.payload.path].hasLetterIndexing;
    }
};

usbaudioApp.prototype._setContextLetterIndexing = function (items)
{
    var additionalItems = 0;
    if (this._hasAdditionalItem(this._currentContext.ctxtId))
    {
        additionalItems = 1;
    }

    var letterIndexing = new Array();
    for (var i = 0; i < items.length; i++)
    {
        var index;

        if (parseInt(items[i].index) != -1)
        {
            index = parseInt(items[i].index) + additionalItems;
        }
        else
        {
            index = parseInt(items[i].index);
        }
        log.debug ("usbaudio: adding alphabet and indexes", items[i].letter, index);
        letterIndexing[i] = {
            label : items[i].letter.toString(),
            itemIndex : index
        };
    }

    this._currentContextTemplate.list2Ctrl.setLetterIndexData(letterIndexing);
};

usbaudioApp.prototype._populateFolders = function (tmplt, data, dataList, index, viewType)
{
    if (data == null || data == undefined)
    {
        return;
    }
    var context = this._currentContext.ctxtId;

    // set new data list if needed

	// ---MZDMOD---
	/*
		Check if the first item is of type folder; folders are 1, files are 3
		Objects are sorted such that if there are folders, they are at the start of the array
		If folder found in first position, include ALL SONGS
		If folder not found in first position (end of current folder tree), exclude ALL SONGS
		Essentially this is a "new" view and could probably be better implemented but this is a dirty fix
		ADDITIONAL NOTES:
		_initDataList checks the viewType and adds the ALL SONGS option if viewType is 1, by default viewType is always 1 for USBAUDIO unless you are under ALL SONGS (7)
		viewType can be better described as the object list types
		For USBAUDIO, the only valid types are 1, 3 and 7 which are folders, files and ALL SONGS respectively
		If the viewType is anything other than 1, exclude ALL SONGS, assumption is that we are looking at ALL SONGS
		Setting the viewType to 0 enforces this
	*/
	var items = data.params.itms.item;
	var currentView = viewType;

	if ((items != null) && (items.length > 0) && (items[0].type != 1))
	{
		currentView = 0;
	}

	var listConfig = this._initDataList(dataList, context, tmplt, data, currentView);

    var incrementValue;
	// ---MZDMOD---
	// Make sure we are using the correct view from above
    if (this._hasAdditionalItem(context, currentView))
    {
        incrementValue = 1;
    }
    else
    {
        incrementValue = 0;
    }

    // Fill with empty items above the offset. Better use other function for doing this
    if (listConfig.setAgain)
    {
        listConfig.dataList = this._setEmptyItems(listConfig.dataList, incrementValue, index);
        listConfig.dataList.vuiSupport = true;
    }

    var j = 0;
    for (var i = index + incrementValue; i < items.length + index + incrementValue; i++)
    {
		// ---MZDMOD---
		// Remove the leading '/' character off the folder string by cutting last char
		// Only do it to items with type 1, folders are type 1, files are type 3
		// Setup item press behavior, either shortAndLong or shortPressOnly
		var renamedItem = items[j].name;
		var itemPress = "shortPressOnly";
		if (items[j].type == 1 && renamedItem.length > 1)
		{
			renamedItem = renamedItem.slice(0,-1);
			itemPress = "shortAndLong";
		}
        listConfig.dataList.items[i] = {
            appData : {
                name: items[j].name,
                id: items[j].id,
                //add type for check if 2 or 4
                type: items[j].type,
            },
            text1: renamedItem,
			// JCI commented this line out for some reason, payload table already contains icon info
            image1: this._payloadTable["FolderSongs"].images[items[j].type],
            itemStyle: 'style01',
            disabled: this._payloadTable["FolderSongs"].disabled[items[j].type],
            hasCaret: false,
			// Set item press behavior
			itemBehavior: itemPress,
        };
        j++;
    }
	// ---MZDMOD---
	// Note that this viewType stays as 1 because this is the title, not the content of the list
    if (viewType == 1)
    {
		// Remove the leading / off the folder string by cutting last char
		var renamedItem2 = data.params.folder_inf.name;
		if (renamedItem2.length > 1)
		{
			renamedItem2 = renamedItem2.slice(0,-1);
		}
    else if (renamedItem2.length === 1)
    {
      renamedItem2 = "";
    }
    tmplt.list2Ctrl.setTitle({titleStyle : 'style02', text1: renamedItem2});
		//tmplt.list2Ctrl.setTitle({titleStyle : 'style02', text1: data.params.folder_inf.name});
    }
    else
    {
        tmplt.list2Ctrl.setTitle({titleStyle : 'style02', text1Id: "AllSongs"});
    }

    if (this._topItemOptions.setTopItem == true)
    {
        tmplt.list2Ctrl.topItem = this._topItemOptions.top;
        tmplt.list2Ctrl.focussedItem = this._topItemOptions.focus;
        this._topItemOptions.setTopItem = false;
        this._topItemOptions.top = null;
        this._topItemOptions.focus = null;
    }
	// ---MZDMOD---
	// Make sure we are using the correct view from above
    this._updateItems(tmplt, context, index, items.length, listConfig, currentView);
};

usbaudioApp.prototype._populateList = function (tmplt, data, context, dataList, scrollIndex)
{
    if (data == null || data == undefined)
    {
        return;
    }

    // set new data list config if needed
    var listConfig = this._initDataList(dataList, context, tmplt, data);

    var items = data.params.prop_info_list.prop_info_list;

    var incrementValue;
    if (this._hasAdditionalItem(context))
    {
        incrementValue = 1;
    }
    else
    {
        incrementValue = 0;
    }

    // Fill with empty items above the offset. Better use other function for doing this
    if (listConfig.setAgain)
    {
        listConfig.dataList = this._setEmptyItems(listConfig.dataList, incrementValue, data.params.offset_out);
        listConfig.dataList.vuiSupport = true;
    }

    var j = 0;
    if (this._currentContext && this._currentContext.ctxtId == "Playlists")
    {
        for (var i = data.params.offset_out + incrementValue; i < data.params.result_count + data.params.offset_out + incrementValue; i++)
        {
            var localizedName;
            if (items[j].metadata_info[0].value.toLowerCase() == "more like this")
            {
                localizedName = framework.localize.getLocStr('usbaudio', 'common.Tooltip_IcnUmpMore');
            }
            else
            {
                localizedName = items[j].metadata_info[0].value;
            }

            listConfig.dataList.items[i] = {
                appData : {
                    name: items[j].metadata_info[0].value,
                    id: items[j].metadata_info[0].item_id,
                    type: items[j].metadata_info[0].type
                },
                text1 : localizedName,
                itemStyle : 'style01',
                hasCaret: false,
            };
            j++;
        }
    }
    else
    {
        for (var i = data.params.offset_out + incrementValue; i < data.params.result_count + data.params.offset_out + incrementValue; i++)
        {
            listConfig.dataList.items[i] = {
                appData : {
                    name: items[j].metadata_info[0].value,
                    id: items[j].metadata_info[0].item_id,
                    type: items[j].metadata_info[0].type
                },
                text1 : items[j].metadata_info[0].value,
                itemStyle : 'style01',
                hasCaret: false,
            };
            j++;
        }
    }

    if (this._topItemOptions.setTopItem == true)
    {
        tmplt.list2Ctrl.properties.scrollTo = this._topItemOptions.top;
        tmplt.list2Ctrl.properties.focussedItem = this._topItemOptions.focus;
        this._topItemOptions.setTopItem = false;
        this._topItemOptions.top = null;
        this._topItemOptions.focus = null;
    }

    this._updateItems(tmplt, context, data.params.offset_out, data.params.result_count, listConfig);

};

// update items depending on if there is additional item and where is th list position
usbaudioApp.prototype._updateItems = function (tmplt, context, offset, resultCount, listConfig, viewType)
{
    if (listConfig.setAgain)
    {
        tmplt.list2Ctrl.setDataList(listConfig.dataList);
        tmplt.list2Ctrl.updateItems(0, tmplt.list2Ctrl.dataList.itemCount - 1);
    }
    else if (this._hasAdditionalItem(context, viewType))
    {
        if (offset == 0)
        {
            tmplt.list2Ctrl.updateItems(offset, resultCount);
        }
        else
        {
            tmplt.list2Ctrl.updateItems(offset + 1, resultCount + offset);
        }
    }
    else
    {
        tmplt.list2Ctrl.updateItems(offset, resultCount + offset - 1);
    }

    // Force leaving loading state upon items update.
    if (tmplt.list2Ctrl.setLoading && tmplt.list2Ctrl.inLoading)
    {
        tmplt.list2Ctrl.setLoading(false);
    }
};

usbaudioApp.prototype._hasAdditionalItem = function (context, viewType)
{
    var hasAdditionalItem = false;
    switch (context)
    {
        case "Artists":
        case "Albums":
        case "Genres":
        // case "Audiobooks":
        case "Chapters":
        case "Episodes":
            hasAdditionalItem = true;
            break;
    }

    if (viewType == 1 && context == "Folders")
    {
         hasAdditionalItem = true;
    }
    else if (viewType != 1 && context == "Folders")
    {
        hasAdditionalItem = false;
    }
    return hasAdditionalItem;
};

// Configure dataList. If dataList already configured return the same dataList
usbaudioApp.prototype._initDataList = function (dataList, context, tmplt, data, viewType)
{
    var incrementValue = 0;
    var dataList = dataList;
    var setAgain = false;
    if ((dataList == null || dataList == undefined) && data.params.total_count != 0)
    {
        setAgain = true;
        // Some contexts have additional item which is not received from BLM
        switch (context)
        {
            case "Artists":
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count + 1,
                    items: [{
                        appData : {
                            name: "allAlbums"
                        },
                        text1Id : "AllAlbums",
                        itemStyle : 'style01',
                        hasCaret: false,
                    }]
                };
                incrementValue = 1;
                break;
            case "Albums":
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count + 1,
                    items: [{
                        appData : {
                            name: "allSongs"
                        },
                        text1Id : "AllSongs",
                        itemStyle : 'style01',
                        hasCaret: false
                    }]
                };
                incrementValue = 1;
                break;
            case "Genres":
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count + 1,
                    items: [{
                        appData : {
                            name: "allArtists"
                        },
                        text1Id : "AllArtists",
                        itemStyle : 'style01',
                        hasCaret: false,
                    }]
                };
                incrementValue = 1;
                break;
            case "Episodes":
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count + 1,
                    items: [{
                        appData : {
                            name: "allEpisodes"
                        },
                        text1Id : "AllEpisodes",
                        itemStyle : 'style01',
                        hasCaret: false,
                    }]
                };
                incrementValue = 1;
                break;
            case "Chapters":
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count + 1,
                    items: [{
                        appData : {
                            name: "allChapters"
                        },
                        text1Id : "AllChapters",
                        itemStyle : 'style01',
                        hasCaret: false
                    }]
                }
                incrementValue = 1;
                break;
            case "Folders":
                if (viewType == 1)
                {
                    dataList = {
                        itemCountKnown : true,
                        itemCount : data.params.total_items + 1,
                        vuiSupport: true,
                        items: [{
                            appData : {
                                name: "allSongs",
                                type: 7,
                            },
                            text1Id : "AllSongs",
                            itemStyle : 'style01',
                            hasCaret: false,
							// ---MZDMOD---
							// Allow long press for the list control
							itemBehavior: 'shortAndLong',
                        }]
                    };
                    incrementValue = 1;
                }
                else
                {
                    dataList = {
                        itemCountKnown : true,
                        itemCount : data.params.total_items,
                        items: new Array()
                    };
                }
                break;
            default:
                // All other contexts do not have additional item
                dataList = {
                    itemCountKnown : true,
                    itemCount : data.params.total_count,
                    items: new Array()
                };
        }
    }
    else if (data.params.total_count == 0)
    {
        setAgain = true;
        dataList = {
            itemCountKnown : true,
            itemCount : data.params.total_count,
            items: new Array()
        };
    }

    return {dataList: dataList, setAgain: setAgain};
};

usbaudioApp.prototype._setEmptyItems = function (dataList, start, count)
{
    for (var i = start; i < count + start; i++)
    {
        dataList.items[i] = {
            appData : "",
            text1 : "",
            itemStyle : 'style01',
            hasCaret: false,
        };
    }
    return dataList;
};

// Callculate offset
usbaudioApp.prototype._calculateOffset = function (offset, context)
{
    var newOffset = offset - 10;
    if (this._hasAdditionalItem(context))
    {
        if (newOffset < 2)
        {
            newOffset = 0;
        }
        else
        {
            newOffset = newOffset - 1;
        }
    }
    else
    {
        if (newOffset < 0)
        {
            newOffset = 0;
        }
    }
    return newOffset;
};

usbaudioApp.prototype._equalValues = function (oldValues, newValues)
{
    var equalValues = true;
    if (oldValues.hasOwnProperty("artist"))
    {
        if (oldValues.artist.value != newValues.artistName)
        {
            equalValues = false;
            oldValues.artist.value = newValues.artistName;
            if (newValues.hasOwnProperty("artistId"))
            {
                oldValues.artist.id = newValues.artistId;
            }
            else
            {
                oldValues.artist.id = 0;
            }
        }
    }

    if (oldValues.hasOwnProperty("album"))
    {
        if (oldValues.album.value != newValues.albumName)
        {
            equalValues = false;
            oldValues.album.value = newValues.albumName;
            if (newValues.hasOwnProperty("albumId"))
            {
                oldValues.album.id = newValues.albumId;
            }
            else
            {
                oldValues.album.id = 0;
            }
        }
    }

    if (oldValues.hasOwnProperty("genre"))
    {
        if (oldValues.genre.value != newValues.genreName)
        {
            equalValues = false;
            oldValues.genre.value = newValues.genreName;
            if (newValues.hasOwnProperty("genreId"))
            {
                oldValues.genre.id = newValues.genreId;
            }
            else
            {
                oldValues.genre.id = 0;
            }
        }
    }

    if (oldValues.hasOwnProperty("audiobook"))
    {
        if (oldValues.audiobook.value != newValues.audiobookName)
        {
            equalValues = false;
            oldValues.audiobook.value = newValues.audiobookName;
            if (newValues.hasOwnProperty("audiobookId"))
            {
                oldValues.audiobook.id = newValues.audiobookId;
            }
            else
            {
                oldValues.audiobook.id = 0;
            }
        }
    }

    if (oldValues.hasOwnProperty("podcast"))
    {
        if (oldValues.podcast.value != newValues.podcastName)
        {
            equalValues = false;
            oldValues.podcast.value = newValues.podcastName;
            if (newValues.hasOwnProperty("podcastId"))
            {
                oldValues.podcast.id = newValues.podcastId;
            }
            else
            {
                oldValues.podcast.id = 0;
            }
        }
    }

    if (oldValues.hasOwnProperty("playlist"))
    {
        if (oldValues.playlist.value != newValues.playlistName)
        {
            equalValues = false;
            oldValues.playlist.value = newValues.playlistName;
            if (newValues.hasOwnProperty("playlistId"))
            {
                oldValues.playlist.id = newValues.playlistId;
            }
            else
            {
                oldValues.playlist.id = 0;
            }
        }
    }

    return equalValues;
};

usbaudioApp.prototype._composeId = function (newValues, oldValues)
{
    if (newValues.hasOwnProperty("artist"))
    {
        if (oldValues.hasOwnProperty("artistId"))
        {
            newValues.artist.id = oldValues.artistId;
        }
        else
        {
            newValues.artist.id = 0;
        }
    }

    if (newValues.hasOwnProperty("album"))
    {
        if (oldValues.hasOwnProperty("albumId"))
        {
            newValues.album.id = oldValues.albumId;
        }
        else
        {
            newValues.album.id = 0;
        }
    }

    if (newValues.hasOwnProperty("genre"))
    {
        if (oldValues.hasOwnProperty("genreId"))
        {
            newValues.genre.id = oldValues.genreId;
        }
        else
        {
            newValues.genre.id = 0;
        }
    }

    if (newValues.hasOwnProperty("audiobook"))
    {
        if (oldValues.hasOwnProperty("audiobookId"))
        {
            newValues.audiobook.id = oldValues.audiobookId;
        }
        else
        {
            newValues.audiobook.id = 0;
        }
    }

    if (newValues.hasOwnProperty("podcast"))
    {
        if (oldValues.hasOwnProperty("podcastId"))
        {
            newValues.podcast.id = oldValues.podcastId;
        }
        else
        {
            newValues.podcast.id = 0;
        }
    }

    if (newValues.hasOwnProperty("playlist"))
    {
        if (oldValues.hasOwnProperty("playlistId"))
        {
            newValues.playlist.id = oldValues.playlistId;
        }
        else
        {
            newValues.playlist.id = 0;
        }
    }
};

usbaudioApp.prototype._createMdInfo = function (mdInfo)
{
    var mdInfoList = new Array();
    if (mdInfo.hasOwnProperty("genre"))
    {
        mdInfoList.push({value: mdInfo.genre.value, type: mdInfo.genre.type, item_id: mdInfo.genre.id});
    }

    if (mdInfo.hasOwnProperty("artist"))
    {
        mdInfoList.push({value: mdInfo.artist.value, type: mdInfo.artist.type, item_id: mdInfo.artist.id});
    }

    if (mdInfo.hasOwnProperty("album"))
    {
        mdInfoList.push({value: mdInfo.album.value, type: mdInfo.album.type, item_id: mdInfo.album.id});
    }

    if (mdInfo.hasOwnProperty("playlist"))
    {
        mdInfoList.push({value: mdInfo.playlist.value, type: mdInfo.playlist.type, item_id: mdInfo.playlist.id});
    }

    if (mdInfo.hasOwnProperty("audiobook"))
    {
        mdInfoList.push({value: mdInfo.audiobook.value, type: mdInfo.audiobook.type, item_id: mdInfo.audiobook.id});
    }

    if (mdInfo.hasOwnProperty("podcast"))
    {
        mdInfoList.push({value: mdInfo.podcast.value, type: mdInfo.podcast.type, item_id: mdInfo.podcast.id});
    }

    if (mdInfo.hasOwnProperty("song"))
    {
        mdInfoList.push({value: mdInfo.song.value, type: mdInfo.song.type, item_id: mdInfo.song.id});
    }

    return mdInfoList;
};

usbaudioApp.prototype._createMdInfoFromMsg = function (msg)
{
    var mdInfoList = new Array();
    var mdInfo = this._payloadTable[msg.params.payload.path].md_info;
    if (mdInfo.hasOwnProperty("genre") && msg.params.payload.metadata.hasOwnProperty("genreName"))
    {
        mdInfoList.push({value: msg.params.payload.metadata.genreName, type: mdInfo.genre.type, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("artist") && msg.params.payload.metadata.hasOwnProperty("artistName"))
    {
        mdInfoList.push({value: msg.params.payload.metadata.artistName, type: mdInfo.artist.type, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("album") && msg.params.payload.metadata.hasOwnProperty("albumName"))
    {
        mdInfoList.push({value: msg.params.payload.metadata.albumName, type: mdInfo.album.type, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("audiobook") && msg.params.payload.metadata.hasOwnProperty("audiobookName"))
    {
        mdInfoList.push({value: msg.params.payload.metadata.audiobookName, type: mdInfo.audiobook.type, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("podcast") && msg.params.payload.metadata.hasOwnProperty("podcastName"))
    {
		mdInfoList.push({value: msg.params.payload.metadata.podcastName, type: this._mdFilter.USBM_MetadataType_Podcast, item_id: 0});
    }

    if (msg.params.payload.metadata.hasOwnProperty("episodeName") && this._currentContext && this._currentContext.ctxtId == "Episodes")
    {
        mdInfoList.push({value: msg.params.payload.metadata.episodeName, type: this._mdFilter.USBM_MetadataType_ObjectName, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("playlist") && msg.params.payload.metadata.hasOwnProperty("playlistName"))
    {
        mdInfoList.push({value: msg.params.payload.metadata.playlistName, type: mdInfo.playlist.type, item_id: 0});
    }

    if (mdInfo.hasOwnProperty("song"))
    {
        mdInfoList.push({value: mdInfo.song.value, type: mdInfo.song.type, item_id: 0});
    }

    return mdInfoList;
};

usbaudioApp.prototype._createRequest = function ()
{
    var ctxtId = this._currentContext.ctxtId;
    if (this._hasContextPayload())
    {
        var mdTypeList = this._payloadTable[this._currentContextId].md_types;
        var mdInfo = this._payloadTable[this._currentContextId].md_info;

        this._composeId( mdInfo, this._currentContext.params.payload.metadata );

        var mdInfoList = this._createMdInfo( mdInfo );
        var sortSettings = this._payloadTable[this._currentContextId].sort_settings;

        this._requestList(
            mdTypeList,                                                                                              // metadata type list (array)
            mdInfoList,                                                                                              // metadata info value and type (array)
            sortSettings,                                                                                            // sort settings order metadata type (array)
            this._calculateOffset(this._payloadTable[this._currentContextId].index, this._currentContext.ctxtId),    // offset index
            null,                                                                                                    // context data list NOTE: empty every time we enter context
            this._payloadTable[this._currentContextId].index,                                                        // where to scroll the list
            this._currentContext.params.payload.path);                                                               // name of the context
    }
    else
    {
        log.warn("usbaudio: Context with empty payload!");
    }
};

usbaudioApp.prototype._setTitle = function ()
{
    if (this._currentContext &&
        this._currentContext.params.hasOwnProperty("payload") &&
        this._currentContext.params.payload.hasOwnProperty("path"))
        {
            this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "";
            this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1SubMap = "";
            this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = "";

            var title = this._payloadTable[this._currentContext.params.payload.path].titleConfig;
            switch (title)
            {
                case "Playlists":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Playlists";
                    break;
                case "playlistName":
                     if (this._currentContext.params.payload.metadata.playlistName.toLowerCase() == 'more like this')
                    {
                        this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = framework.localize.getLocStr('usbaudio', 'common.Tooltip_IcnUmpMore');
                    }
                    else
                    {
                        this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.playlistName;
                    }
                    break;
                case "Artists":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Artists";
                    break;
                case "allArtists":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "AllArtists";
                    break;
                case "artistName":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.artistName;
                    break;
                case "Albums":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Albums";
                    break;
                case "allAlbums":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "AllAlbums";
                    break;
                case "albumName":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.albumName;
                    break;
                case "Songs":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Songs";
                    break;
                case "allSongs":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "AllSongs";
                    break;
                case "Genres":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Genres";
                    break;
                case "genreName":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.genreName;
                    break;
                case "Audiobooks":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Audiobooks";
                    break;
                case "audiobookName":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.audiobookName;
                    break;
                case "Podcasts":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1Id = "Podcasts";
                    break;
                case "podcastName":
                    this._contextTable[this._currentContext.ctxtId].controlProperties.List2Ctrl.title.text1 = this._currentContext.params.payload.metadata.podcastName;
                    break;
                default:
                    log.debug("Unknown title config:", title);
            }
        }
        else
        {
            log.debug("No context payload or path");
        }
};

usbaudioApp.prototype._playLineNumber = function (itemName, itemType, itemId, fromVui)
{
    this._clearMetadata();
    this._clearTotalElapsedTime();
    var mdTypeList = [this._mdFilter.USBM_MetadataType_ObjectName];
    var mdInfoList = this._createMdInfo(this._payloadTable[this._currentContextId].md_info);
    var sortSettings;
    if (itemType != this._payloadTable["Podcasts"].md_info[0])
    {
        sortSettings = this._payloadTable[this._currentContextId].sort_settings;
    }
    else
    {
        sortSettings = this._payloadTable["PodcastEpisodes"].sort_settings;
    }

    if (itemName != undefined && itemType != undefined && itemId != undefined &&
        itemName != null && itemType != null && itemId != null)
    {
        mdInfoList.push({value: itemName, type: itemType, item_id: itemId});
    }
    if (mdInfoList.length > 1)
    {
        for (var i=0; i < mdInfoList.length; i++)
        {
            if (mdInfoList[i].type == 0)
            {
                mdInfoList.splice(i, 1);
                i--;
            }
        }
    }

    this._SelectSongsAndPlay(mdTypeList, mdInfoList, sortSettings, fromVui, this._currentContextId);
};

// Fill NowPlaying with data
usbaudioApp.prototype._populateNowPlayingCtrl = function (tmplt, songDetails)
{
	log.debug('_populateNowPlayingCtrl called... songDetails.screenTitle: ', songDetails.screenTitle);
    if (this._connectedDevs.BODReady)
    {
        log.debug("_populateNowPlayingCtrl called...");
        tmplt.nowPlaying4Ctrl.setAudioTitle({audioTitleText: songDetails.title, audioTitleIcon: "common/images/icons/IcnListSong.png"});
        tmplt.nowPlaying4Ctrl.setDetailLine1({detailText: songDetails.artist, detailIcon: "common/images/icons/IcnListContact_Placeholder.png"});
        tmplt.nowPlaying4Ctrl.setDetailLine2({detailText: songDetails.album, detailIcon: "common/images/icons/IcnListCdPlayer_En.png"});

        if (songDetails.screenTitle)
        {
            tmplt.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: songDetails.screenTitle});
			//songDetails.screenTitle = null;
        }
        else
        {
			log.debug('Playlist appears to be null, so assuming EMPTY!!!');
            tmplt.nowPlaying4Ctrl.setCtrlTitle({ctrlTitleText: ""});
        }
        if (this._connectedDevs.showGracenote == true && songDetails.title && songDetails.artist && songDetails.album && this._connectedDevs.selectedDevCataloged)
        {
            tmplt.nowPlaying4Ctrl.setDetailLine3({detailText: "Powered By Gracenote®"});
            this._gracenoteTimeout = setTimeout(this._removeGracenote.bind(this), this._gracenoteTimeoutTime);
        }
    }
    //tmplt.nowPlaying4Ctrl.umpCtrl.setButtonDisabled("GenerateMoreLikeThis", !this._connectedDevs.selectedDevCataloged);
};

usbaudioApp.prototype._setTotalElapsedTime = function ()
{
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setElapsedTime(this._secondsToHHMMSS(this._umpElapseTime));
    this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.setTotalTime(this._secondsToHHMMSS(this._umpTotalTime));

    var progress = this._umpElapseTime / this._umpTotalTime;
    if (this._umpElapseTime != 0 && this._umpTotalTime != 0)
    {
        this._currentContextTemplate.nowPlaying4Ctrl.umpCtrl.updateScrubber(progress);
    }
};

usbaudioApp.prototype._removeGracenote = function ()
{
    clearTimeout(this._gracenoteTimeout);
    this._gracenoteTimeout = null;
    this._connectedDevs.showGracenote = false;

    if (this._connectedDevs.deviceSelected == this._connectedDevs.A.deviceId)
    {
        this._connectedDevs.A.showGracenote = false;
    }
    else
    {
        this._connectedDevs.B.showGracenote = false;
    }

    if (this._currentContext.ctxtId == "NowPlaying" && this._currentContextTemplate)
    {
        this._currentContextTemplate.nowPlaying4Ctrl.setDetailLine3({detailText: ""});
    }
};

usbaudioApp.prototype._updateUmpButtons = function (tmplt, buttons)
{
    if (buttons.repeat == "USBM_REPEAT_MODE_ALL" && this._umpButtonConfig["repeat"].currentState !== "List")
    {
        tmplt.nowPlaying4Ctrl.umpCtrl.setButtonState("repeat", "List");
    }
    else if (buttons.repeat == "USBM_REPEAT_MODE_ONE" && this._umpButtonConfig["repeat"].currentState !== "Song")
    {
        tmplt.nowPlaying4Ctrl.umpCtrl.setButtonState("repeat", "Song");
    }
    else if (buttons.repeat == "USBM_REPEAT_MODE_NONE" && this._umpButtonConfig["repeat"].currentState !== "None")
    {
        tmplt.nowPlaying4Ctrl.umpCtrl.setButtonState("repeat", "None");
    }

    if (buttons.shuffle == "USBM_SHUFFLE_MODE_NONE" && this._umpButtonConfig["shuffle"].currentState != "Off")
    {
        tmplt.nowPlaying4Ctrl.umpCtrl.setButtonState("shuffle", "Off");
    }
    else if (buttons.shuffle == "USBM_SHUFFLE_MODE_TRACKS" && this._umpButtonConfig["shuffle"].currentState != "On")
    {
        tmplt.nowPlaying4Ctrl.umpCtrl.setButtonState("shuffle", "On");
    }
};

usbaudioApp.prototype._populateCoverArt = function (tmplt, songDetails)
{
    if (this._connectedDevs.BODReady)
    {
        log.debug("usbaudioApp _populateCoverArt called...", songDetails);

         var ctrlData = {
             imagePath: null
         };

        if (songDetails.coverArt != "None")
        {
            ctrlData = {ctrlTitle:songDetails.genre, audioTitle:songDetails.title, detailLine1:songDetails.artist, detailLine2:songDetails.album, imagePath: songDetails.coverArt};
            tmplt.nowPlaying4Ctrl.setArtworkImagePath(songDetails.coverArt+"?" + new Date().getTime());
        }
        else
        {
            ctrlData = {"ctrlTitle":songDetails.genre, "audioTitle":songDetails.title, "detailLine1":songDetails.artist, "detailLine2":songDetails.album, imagePath:"./common/images/no_artwork_icon.png"};
            songDetails.coverArt = "./common/images/no_artwork_icon.png";
            tmplt.nowPlaying4Ctrl.setArtworkImagePath();
        }
    }
};

usbaudioApp.prototype._requestMore = function (index)
{
    var scrollIndex = this._currentContextTemplate.list2Ctrl.topItem;

    // if the list has additional item set by the application decrease the offset with one
    if (this._hasAdditionalItem(this._currentContext.ctxtId) && index > 0)
    {
        index = index - 1;
    }

    var mdTypeList = this._payloadTable[this._currentContextId].md_types;
    var mdInfoList = this._createMdInfo(this._payloadTable[this._currentContextId].md_info);
    var sortSettings = this._payloadTable[this._currentContextId].sort_settings;
    this._requestList(
        mdTypeList,                                         // metadata type list (array)
        mdInfoList,                                         // metadata info value and type (array)
        sortSettings,                                       // sort settings order metadata type (array)
        index,                                              // offset index
        this._currentContextTemplate.list2Ctrl.dataList,    // context data list NOTE: empty every time we enter context
        scrollIndex,                                        // where to scroll the list
        this._currentContext.params.payload.path);          // name of the context
};

usbaudioApp.prototype._saveIndex = function ()
{
    if (this._outgoingContext &&
        this._outgoingContext.hasOwnProperty("params") &&
        this._outgoingContext.params.hasOwnProperty("payload") &&
        this._outgoingContext.params.payload.hasOwnProperty("path") &&
        this._outgoingContext.params.payload.path != "Invalid" )
    {
        if(this._outgoingContextTemplate) // check added for SCR SW00157864
        {
            this._payloadTable[this._outgoingContext.params.payload.path].index = this._outgoingContextTemplate.list2Ctrl.topItem;
            this._payloadTable[this._outgoingContext.params.payload.path].focused = this._outgoingContextTemplate.list2Ctrl.focussedItem;
        }
        else
        {
            log.warn("USBAUDIO: outgoing context template is null!");
        }
    }
    else if (this._outgoingContext &&
        this._outgoingContext.hasOwnProperty("params") &&
        this._outgoingContext.params.hasOwnProperty("payload") &&
        this._outgoingContext.params.payload.hasOwnProperty("path") &&
        this._outgoingContext.params.payload.path == "Invalid")
    {
        log.warn("USBAUDIO: outgoing context with invalid path!");
    }
    else
    {
        log.warn("USBAUDIO: outgoing context with invalid payload");
    }
};

usbaudioApp.prototype._hasContextPayload = function ()
{
    var returnValue = false;
    if (this._currentContext &&
        this._currentContext.hasOwnProperty("params") &&
        this._currentContext.params.hasOwnProperty("payload"))
        {
            returnValue = true;
        }
    return returnValue;
};
// ---MZDMOD---
// Add "optional" parameter that defaults to true when not supplied
// This is a check for the _getItemsCallBack, otherwise it clears the cachedTitle variables
usbaudioApp.prototype._clearMetadata = function (noCallBack)
{
	if (noCallBack === undefined)
	{
		noCallBack = true;
	}
    framework.sendEventToMmui(this.uiaId, "ReleaseCoverArt", {payload:{path: this._cachedSongDetails.coverArt}});
    this._cachedSongDetails = {
        screenTitle: null,
        genre: null,
        artist: null,
        title: null,
        album: null,
        coverArt: "None"
    };
	if (noCallBack)
	{
		this._cachedFolder.songList = false;
		this._cachedFolder.enabled = false;
		this._cachedFolder.id = 0;
	}
};

usbaudioApp.prototype._clearTotalElapsedTime = function ()
{
    this._umpElapseTime = 0;
    this._umpTotalTime = 0;
    this._stopElapsedUpdate = false;
};

usbaudioApp.prototype._clearUSBData = function ()
{
    var epmtyMD = {
        artistName: "",
        albumName: "",
        genreName: "",
        audiobookName: "",
        podcastName: "",
        playlistName: "",
        artistId: "",
        albumId: "",
        genreId: "",
        audiobookId: "",
        podcastId: "",
        playlistId: "",
    };

    for (var i in this._payloadTable)
    {
        this._payloadTable[i].index = 0;
        this._payloadTable[i].focused = 0;

        if (this._payloadTable[i].hasOwnProperty("md_info") && this._payloadTable[i].checkValues)
        {
            this._equalValues(this._payloadTable[i].md_info, epmtyMD);
        }
    }
};

usbaudioApp.prototype._clearSelectionId = function ()
{
    if (this._selectionId.playing != null)
    {
        this._releaseSelection(this._selectionId.playing);
        this._selectionId.playing = null;
    }

    if (this._selectionId.browsing != 0)
    {
        this._releaseSelection(this._selectionId.browsing);
        this._selectionId.browsing = 0;
    }
};

usbaudioApp.prototype._disableUSBAudioMenus = function ()
{
    if ((this._connectedDevs.deviceSelected == this._connectedDevs.A.deviceId && this._connectedDevs.A.type == "UMASS") ||
        (this._connectedDevs.deviceSelected == this._connectedDevs.B.deviceId && this._connectedDevs.B.type == "UMASS"))
    {
        // if the selected device type is UMASS "Podcasts" and "Audiobooks" should remain disabled
        this._disableUMASSMenu();
    }
    else
    {
        this._disableiPodMenu();
    }

    if (this._currentContext && this._currentContext.ctxtId == "USBAudio" && this._currentContextTemplate)
    {
        this._currentContextTemplate.list2Ctrl.updateItems(0, this._usbaudioCtxtDataList.itemCount);
    }
};

usbaudioApp.prototype._disableUMASSMenu = function ()
{
    for (var i = 0; i < this._usbaudioCtxtDataList.itemCount - 1; i++)
    {
        this._usbaudioCtxtDataList.items[i].disabled = true;
    }
    this._usbaudioCtxtDataList.items[this._usbaudioCtxtDataList.itemCount - 1].disabled = false;
};

usbaudioApp.prototype._disableiPodMenu = function ()
{
    for (var i = 0; i < this._usbaudioCtxtDataList.itemCount; i++)
    {
        this._usbaudioCtxtDataList.items[i].disabled = true;
    }
};

usbaudioApp.prototype._enableUSBAudioMenus = function ()
{
    // already enabled is 1 because "Folders" item is always enabled
    var doNotEnable = 1;
    // check which device is selected and its type
    if ((this._connectedDevs.deviceSelected == this._connectedDevs.A.deviceId && this._connectedDevs.A.type == "UMASS") ||
        (this._connectedDevs.deviceSelected == this._connectedDevs.B.deviceId && this._connectedDevs.B.type == "UMASS"))
    {
        // if the selected device type is UMASS "Podcasts" and "Audiobooks" should remain disabled
        doNotEnable = 3;
        this._usbaudioCtxtDataList.items[this._usbaudioCtxtDataList.itemCount - 2].disabled = true;
        this._usbaudioCtxtDataList.items[this._usbaudioCtxtDataList.itemCount - 3].disabled = true;
        this._usbaudioCtxtDataList.items[this._usbaudioCtxtDataList.itemCount - 1].disabled = false;
    }
    else
    {
        this._usbaudioCtxtDataList.items[this._usbaudioCtxtDataList.itemCount - 1].disabled = true;
    }

    for (var i = 0; i < this._usbaudioCtxtDataList.itemCount - doNotEnable; i++)
    {
        this._usbaudioCtxtDataList.items[i].disabled = false;
    }

    if (this._currentContext && this._currentContext.ctxtId == "USBAudio" && this._currentContextTemplate)
    {
        this._currentContextTemplate.list2Ctrl.updateItems(0, this._usbaudioCtxtDataList.itemCount);
    }
};

usbaudioApp.prototype._getErrorId = function (error)
{
    var text1Id = null;
    switch (error)
    {
        case "USBM_DEVICE_ERR_UNKNOWN_DEV":
            text1Id = "UnknownType";
            break;
        case "USBM_DEVICE_ERR_NOTSUP_DEV":
            text1Id = "NotSupported";
            break;
        case "USBM_DEVICE_ERR_BAD_FIRMWARE":
            text1Id = "IncompatibleFirmware";
            break;
        case "USBM_DEVICE_ERR_AUTH_FAILED":
            text1Id = "AuthenticationFailure";
            break;
        case "USBM_DEVICE_ERR_NO_FILES":
            text1Id = "NoPlayableFiles";
            break;
    }
    return text1Id;
};

usbaudioApp.prototype._secondsToHHMMSS = function (seconds)
{
        // var hr = Math.floor(seconds / 3600);
        var min = Math.floor(seconds /60);
        var sec = seconds - (min * 60);

        // if (hr < 10) {hr = "0" + hr; }
        if (min < 10) {min = "0" + min;}
        if (sec < 10) {sec = "0" + sec;}
        return min + ':' + sec;
};

usbaudioApp.prototype._addAlbumsAdditionalFilters = function (mdInfo)
{
    if (this._currentContext &&
        this._currentContext.params.hasOwnProperty("payload") &&
        this._currentContext.params.payload.hasOwnProperty("path") &&
        this._payloadTable[this._currentContext.params.payload.path].md_info.hasOwnProperty("genre"))
        {
            mdInfo.unshift({
                value: this._payloadTable[this._currentContext.params.payload.path].md_info.genre.value,
                type: this._payloadTable[this._currentContext.params.payload.path].md_info.genre.type,
                item_id: this._payloadTable[this._currentContext.params.payload.path].md_info.genre.id});
        }

    return mdInfo;
};

// Check how many albums an artist have
usbaudioApp.prototype._countAlbums = function (artistName, action, artistId, fromVui, contextPath)
{
    var isiPod = false;
    if (this._connectedDevs.selectedDevType == "IPOD")
    {
        isiPod = true;
    }
    if (!artistId)
    {
        artistId = 0;
    }

    var mdInfo = [{value: artistName, type: this._mdFilter.USBM_MetadataType_ArtistName, item_id: artistId}];

    mdInfo = this._addAlbumsAdditionalFilters(mdInfo);

    var params = {
        "dev_id":this._connectedDevs.deviceSelected,
        "md_types_sz":{
            "types_list_sz": 1,
        },
        "md_types": {
            "types_list": [this._mdFilter.USBM_MetadataType_AlbumName]
        },
        "md_info_list_sz": {
            "metadata_info_sz": mdInfo.length,
        },
        "md_info_list": {
            "metadata_info": mdInfo
        },
        "sort_sett_list_sz": {
            "sort_settings_sz": 1,
        },
        "sort_sett_list": {
            "sort_settings": [{metadata_type: this._mdFilter.USBM_MetadataType_AlbumName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
        },
        "max_list_size": 5,
        "offset": 0,
        "sel_id": this._selectionId.browsing,
        "bUseAsBOD": isiPod,
    };
    framework.sendRequestToAppsdk(this.uiaId, this._countAlbumsCallback.bind(this, artistName, action, fromVui, contextPath), "usbm", "GetPropertyInfoListAsync", params);
};

// check how many artists have albums with that name
usbaudioApp.prototype._countArtists = function (albumName, action, fromVui, contextPath)
{
    var isiPod = false;
    if (this._connectedDevs.selectedDevType == "IPOD")
    {
        isiPod = true;
    }

    var mdInfo = [{value: albumName, type: this._mdFilter.USBM_MetadataType_AlbumName, item_id: 0}];

    var params = {
        "dev_id":this._connectedDevs.deviceSelected,
        "md_types_sz":{
            "types_list_sz": 1,
        },
        "md_types": {
            "types_list": [this._mdFilter.USBM_MetadataType_ArtistName]
        },
        "md_info_list_sz": {
            "metadata_info_sz": mdInfo.length,
        },
        "md_info_list": {
            "metadata_info": mdInfo,
        },
        "sort_sett_list_sz": {
            "sort_settings_sz": 1,
        },
        "sort_sett_list": {
            "sort_settings": [{metadata_type: this._mdFilter.USBM_MetadataType_ArtistName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}],
        },
        "max_list_size": 5,
        "offset": 0,
        "sel_id": this._selectionId.browsing,
        "bUseAsBOD": isiPod,
    };
    framework.sendRequestToAppsdk(this.uiaId, this._countArtistsCallback.bind(this, albumName, action, fromVui, contextPath), "usbm", "GetPropertyInfoListAsync", params);
};

usbaudioApp.prototype._countArtistsCallback = function (albumName, action, fromVui, contextPath, params)
{
    if (params.msgType == "methodResponse")
    {
        if(params.hasOwnProperty("params") && params.params.hasOwnProperty("sel_id_out"))
        {
            if (this._selectionId.browsing != params.params.sel_id_out && this._selectionId.browsing != 0)
            {
                // release selection that is not used
                this._releaseSelection(this._selectionId.browsing);
                this._selectionId.browsing = params.params.sel_id_out;
            }
            else if (this._selectionId.browsing == 0 && this._selectionId.browsing != params.params.sel_id_out)
            {
                this._selectionId.browsing = params.params.sel_id_out;
            }
        }

        if (params.params.total_count > 1)
        {
            var lastItem = params.params.result_count - 1;
            if ((this._connectedDevs.selectedDevType == "UMASS") ||
                (params.params.prop_info_list.prop_info_list[lastItem].metadata_info[0].type == this._mdFilter.USBM_MetadataType_ArtistName))
                {
                    // send event to go to all albums
                    if (action == "browse")
                    {
                        framework.sendEventToMmui(this.uiaId, "BrowseAlbumDisambiguate", {payload:{albumName: albumName}}, fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, "PlayAlbumDisambiguate", {payload:{albumName: albumName}}, fromVui);
                    }
                }
                else
                {
                    if (action == "browse")
                    {
                        // framework.sendEventToMmui(this.uiaId, "ChooseAlbumArtist", {payload:{artistName: "", artistId: 0}}, fromVui);
                        framework.sendEventToMmui(this.uiaId, "BrowseAlbumArtist", {payload:{albumName: albumName}}, fromVui);
                    }
                    else
                    {
                        framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
                    }
                }
        }
        else
        {
            var artistName = params.params.prop_info_list.prop_info_list[0].metadata_info[0].value;
            var artistId = params.params.prop_info_list.prop_info_list[0].metadata_info[0].item_id;
            var lastItem = params.params.result_count - 1;
            if ((this._connectedDevs.selectedDevType == "UMASS") ||
                (params.params.prop_info_list.prop_info_list[lastItem].metadata_info[0].type == this._mdFilter.USBM_MetadataType_ArtistName))
                {
                    if (action == "browse")
                    {
                        // send event to go songs of the current albums
                        framework.sendEventToMmui(this.uiaId, "BrowseAlbumArtist", {payload:{albumName: albumName}}, fromVui);
                    }
                    else
                    {
                        // select songs of this artist with this album
                        var mdType = [this._mdFilter.USBM_MetadataType_ObjectName];
                        var mdInfo = [{value: albumName, type: this._mdFilter.USBM_MetadataType_AlbumName, item_id: 0}, {value: artistName, type: this._mdFilter.USBM_MetadataType_ArtistName, item_id: artistId}];
                        var sortSettings = [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}];
                        this._SelectSongsAndPlay(mdType, mdInfo, sortSettings, fromVui, contextPath);
                   }
                }
                else
                {
                    if (action == "browse")
                    {
                        // send event to go songs of the current albums
                        framework.sendEventToMmui(this.uiaId, "BrowseAlbumArtist", {payload:{albumName: albumName}}, fromVui);
                    }
                    else
                    {
                        // select songs of this artist with this album
                        framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
                   }
                }
        }
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAUDIO: GetPropertyInfoListAsync request failed!");
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

usbaudioApp.prototype._countAlbumsCallback= function (artistName, action, fromVui, contextPath, params)
{
    if (params.msgType == "methodResponse")
    {
        if(params.hasOwnProperty("params") && params.params.hasOwnProperty("sel_id_out"))
        {
            if (this._selectionId.browsing != params.params.sel_id_out && this._selectionId.browsing != 0)
            {
                // release selection that is not used
                this._releaseSelection(this._selectionId.browsing);
                this._selectionId.browsing = params.params.sel_id_out;
            }
            else if (this._selectionId.browsing == 0 && this._selectionId.browsing != params.params.sel_id_out)
            {
                this._selectionId.browsing = params.params.sel_id_out;
            }
        }

        if (params.params.total_count > 1)
        {
            var lastItem = params.params.result_count - 1;
            if ((this._connectedDevs.selectedDevType == "UMASS") ||
                (params.params.prop_info_list.prop_info_list[lastItem].metadata_info[0].type == this._mdFilter.USBM_MetadataType_AlbumName))
                {
                    // send event to go to all albums
                    if (action == "browse")
                    {
                        framework.sendEventToMmui(this.uiaId, "BrowseArtistGUI", {payload:{artistName: artistName}}, fromVui);
                    }
                    else
                    {
                        // TODO: check if first have to show the albums?
                        // select songs of this artist
                        var mdType = [this._mdFilter.USBM_MetadataType_ObjectName];
                        var mdInfo = [{value: artistName, type: this._mdFilter.USBM_MetadataType_ArtistName, item_id: 0}];
                        var sortSettings = [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}];
                        this._SelectSongsAndPlay(mdType, mdInfo, sortSettings, fromVui);
                    }
                }
                else
                {
                    if (action == "browse")
                    {
                        framework.sendEventToMmui(this.uiaId, "BrowseArtistAlbum", {payload:{artistName: artistName, albumName: ""}}, fromVui);
                    }
                    else
                    {
                        // play songs of this artist
                        framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
                    }
                }
        }
        else
        {
            var albumName = params.params.prop_info_list.prop_info_list[0].metadata_info[0].value;
            var albumId = params.params.prop_info_list.prop_info_list[0].metadata_info[0].item_id;
            var lastItem = params.params.result_count - 1;
            if ((this._connectedDevs.selectedDevType == "UMASS") ||
                (params.params.prop_info_list.prop_info_list[lastItem].metadata_info[0].type == this._mdFilter.USBM_MetadataType_AlbumName))
                {
                    if (action == "browse")
                    {
                        // send event to go songs of the current albums
                        framework.sendEventToMmui(this.uiaId, "BrowseArtistAlbum", {payload:{artistName: artistName, albumName: albumName}}, fromVui);
                    }
                    else
                    {
                        // select songs of this artist with this album
                        var mdType = [this._mdFilter.USBM_MetadataType_ObjectName];
                        var mdInfo = [{value: albumName, type: this._mdFilter.USBM_MetadataType_AlbumName, item_id: albumId}, {value: artistName, type: this._mdFilter.USBM_MetadataType_ArtistName, item_id: 0}];
                        var sortSettings = [{metadata_type: this._mdFilter.USBM_MetadataType_ObjectName, sort_order: this._soFilter.USBM_SortOrder_AlphaAscending}];
                        this._SelectSongsAndPlay(mdType, mdInfo, sortSettings, fromVui, contextPath);
                   }
               }
               else
               {
                   if (action == "browse")
                    {
                        // send event to go songs of the current albums
                        framework.sendEventToMmui(this.uiaId, "BrowseArtistAlbum", {payload:{artistName: artistName, albumName: ""}}, fromVui);
                    }
                    else
                    {
                        // play songs of this artist with this album
                        framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
                   }
               }
        }
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAUDIO: GetPropertyInfoListAsync request failed!");
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

usbaudioApp.prototype._SelectSongsAndPlay = function (md_types, md_info, sort_settings, fromVui, contextPath)
{
    var isiPod = false;
    if (this._connectedDevs.selectedDevType == "IPOD")
    {
        isiPod = true;
    }

    var params = {
        "dev_id":this._connectedDevs.deviceSelected,
        "md_types_sz":{
            "types_list_sz": md_types.length,
        },
        "md_types": {
            "types_list": md_types
        },
        "md_info_list_sz": {
            "metadata_info_sz": md_info.length,
        },
        "md_info_list": {
            "metadata_info": md_info
        },
        "sort_sett_list_sz": {
            "sort_settings_sz": sort_settings.length,
        },
        "sort_sett_list": {
            "sort_settings": sort_settings,
        },
        "max_list_size": 2,
        "offset": 0,
        "sel_id": this._selectionId.browsing,
        "bUseAsBOD": isiPod,
    };

	/// why limit to 2??? 2015.03.05 AN
	params.max_list_size = 20;

	if(contextPath == "Audiobooks")
	{
		params.max_list_size = 20;
	}
	framework.sendRequestToAppsdk(this.uiaId, this._PlaySongs.bind(this, fromVui, contextPath), "usbm", "GetPropertyInfoListAsync", params);
};

usbaudioApp.prototype._selectData = function (msg, fromVui)
{
    var contextPath = msg.params.payload.path;
    var mdTypeList = this._payloadTable[contextPath].md_types;
    var mdInfoList = this._createMdInfoFromMsg(msg);
    var sortSettings = this._payloadTable[msg.params.payload.path].sort_settings;
    if (mdInfoList.length < 2)
    {
        switch (mdTypeList[0])
        {
            case 2:
                if (msg.params.payload.path == "PodcastEpisodes" && msg.params.payload.metadata.episodeName == "")
                {
                    this._SelectSongsAndPlay(mdTypeList, [{value: msg.params.payload.metadata.podcastName, type: this._mdFilter.USBM_MetadataType_Podcast, item_id: 0}], sortSettings, fromVui, contextPath);
                }
                else if (msg.params.payload.path == "PodcastEpisodes" && msg.params.payload.metadata.episodeName != "")
                {
                    this._SelectSongsAndPlay(mdTypeList, [{value: msg.params.payload.metadata.podcastName, type: this._mdFilter.USBM_MetadataType_Podcast, item_id: 0}, {value: msg.params.payload.metadata.episodeName, type: this._mdFilter.USBM_MetadataType_ObjectName, item_id: 0}], sortSettings, fromVui, contextPath);
                }
                else
                {
                    this._SelectSongsAndPlay(mdTypeList, mdInfoList, sortSettings, fromVui, contextPath);
                }
                break;
            case 4:
                this._countArtists(msg.params.payload.albumName, "play", fromVui, contextPath);
                break;
            case 5:
                this._countAlbums(msg.params.payload.artistName, "play", null, fromVui, contextPath);
                break;
			case 24:
				if (msg.params.payload.path == "Audiobooks" && msg.params.payload.metadata.audiobookName == "")
                {
                    this._SelectSongsAndPlay(mdTypeList, mdInfoList, sortSettings, fromVui, contextPath);
                }
                else if (msg.params.payload.path == "Audiobooks" && msg.params.payload.metadata.audiobookName != "")
                {
                    this._SelectSongsAndPlay(mdTypeList, [{value: msg.params.payload.metadata.audiobookName, type: this._mdFilter.USBM_MetadataType_Kind, item_id: 0}], sortSettings, fromVui, contextPath);
                }
				break;
            case 26:
                this._SelectSongsAndPlay(this._payloadTable["PodcastEpisodes"].md_types, mdInfoList, this._payloadTable["PodcastEpisodes"].sort_settings, fromVui, contextPath);
                break;
        }
    }
    else
    {
        this._SelectSongsAndPlay(mdTypeList, mdInfoList, sortSettings, fromVui, contextPath);
    }
};

usbaudioApp.prototype._PlaySongs = function (fromVui, contextPath, params)
{
    this._clearMetadata();
    this._clearTotalElapsedTime();

    if (params.msgType == "methodResponse")
    {
        if(params.hasOwnProperty("params") && params.params.hasOwnProperty("sel_id_out"))
        {
            if (this._selectionId.browsing != params.params.sel_id_out && this._selectionId.browsing != 0)
            {
                // release selection that is not used
                this._releaseSelection(this._selectionId.browsing);
                this._selectionId.browsing = params.params.sel_id_out;
            }
            else if (this._selectionId.browsing == 0 && this._selectionId.browsing != params.params.sel_id_out)
            {
                this._selectionId.browsing = params.params.sel_id_out;
            }
        }
        if (contextPath != "PodcastEpisodes" && contextPath != "Chapters")
        {
            framework.sendEventToMmui(this.uiaId, "PlaySongIndex", {payload:{songIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
        }
        else if (contextPath == "PodcastEpisodes")
        {
			framework.sendEventToMmui(this.uiaId, "PlayEpisodeIndex", {payload:{episodeIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
		}
        else
        {
            framework.sendEventToMmui(this.uiaId, "PlayChapterIndex", {payload:{chapterIndex: 0, selectionId: this._selectionId.browsing}}, fromVui);
        }

        this._selectionId.browsing = 0;
    }
    else if (params.msgType == "methodErrorResponse")
    {
        log.error("USBAUDIO: GetPropertyInfoListAsync request failed!");
        if (this._currentContextTemplate.hasOwnProperty("list2Ctrl") && this._currentContextTemplate.list2Ctrl.setLoading && this._currentContextTemplate.list2Ctrl.inLoading)
        {
            this._currentContextTemplate.list2Ctrl.setLoading(false);
        }
    }
};

framework.registerAppLoaded("usbaudio", null, true);

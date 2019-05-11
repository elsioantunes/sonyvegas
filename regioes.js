/**
 * script para Sony Vegas
 *
 * Crea una Marca en Cada Clip
 *
 * por Jorge Moron
 * 17-01-2006
 **/

import System;
import System.IO;
import System.Windows.Forms;
import Microsoft.Win32;
import Sony.Vegas;

try {
    var myMarker : Marker;
    var LastFileName = " ";

    //Find the first selected track
    var track = FindSelectedTrack();
    if (null == track)
        throw "no selected track";

    var eventEnum = new Enumerator(track.Events);

    // Cycle through all events on the selected track

    while (!eventEnum.atEnd()) {
        var evnt : TrackEvent = TrackEvent(eventEnum.item());
        var MyFilePath = evnt.ActiveTake.MediaPath;
        var extFileName = Path.GetFileName(MyFilePath);
        var baseFileName = Path.GetFileNameWithoutExtension(extFileName); // Media file name for this event

        // Only add marker if this event's media is different from last event, and if no marker already exists.
        if ( (baseFileName != LastFileName) && (!MarkerExist(evnt.Start.ToMilliseconds() ) ) ) {
            myMarker = new Marker(evnt.Start);
            Vegas.Project.Markers.Add(myMarker);
            myMarker.Label = baseFileName;
        }

        // Prepare for next event
        LastFileName = baseFileName;
        eventEnum.moveNext();
    }

} catch (e) {
    MessageBox.Show(e);
}



// Function to find first selected track
function FindSelectedTrack() : Track {
    var trackEnum = new Enumerator(Vegas.Project.Tracks);
    while (!trackEnum.atEnd()) {
        var track : Track = Track(trackEnum.item());
        if (track.Selected) {
            return track;
        }
        trackEnum.moveNext();
    }
    return null;
}


// Function to check if there is a marker at timecode passed to this function
// Timecode (dStart) must be in milliseconds
function MarkerExist (dStart) : boolean {
    var fmarkerEnum = new Enumerator(Vegas.Project.Markers);
    while (!fmarkerEnum.atEnd()) {
        var fMyMarker = fmarkerEnum.item();
        var fMarkerStart = fMyMarker.Position.ToMilliseconds();
        if ( dStart == fMarkerStart ) {
            return 1;
        }
        fmarkerEnum.moveNext();
    } // End while fmarkerEnum
    return 0;
}

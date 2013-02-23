on run argv
	set _result to {}
	tell application "iTunes"
		repeat with i from 1 to number of items in argv
			set _playlist to item i of argv
			set _tracks to {}
			repeat with t in every track of playlist _playlist
				set loc to location of t
				set end of _tracks to {_artist:artist of t, _album:album of t, _trackno:track number of t, _name:name of t, _location:(POSIX path of loc), _database_ID:database ID of t}
			end repeat
			set end of _result to {_playlist:_playlist, _track:_tracks}
		end repeat
	end tell
	-- Requires JSON Helper (http://www.mousedown.net/mouseware/JSONHelper.html)
	tell application "JSON Helper" to make JSON from _result
end run

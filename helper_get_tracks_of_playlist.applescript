on run argv
	set _tracks to {}
	tell application "iTunes"
		repeat with t in every track of playlist (item 1 of argv)
			set loc to location of t
			set end of _tracks to {_artist:artist of t, _album:album of t, _trackno:track number of t, _name:name of t, _location:(POSIX path of loc), _database_ID:database ID of t}
		end repeat
	end tell
	tell application "JSON Helper" to make JSON from _tracks
end run
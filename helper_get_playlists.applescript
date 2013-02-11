tell application "iTunes"
	set playlist_names to (name of every playlist whose special kind is none)
	
	-- An easy to way to sort a list of names
	-- (stolen from http://www.mindingthegaps.com/blog/2011/04/29/sorting-with-applescript-applescrunix-style/)
	set backup to AppleScript's text item delimiters
	set AppleScript's text item delimiters to {ASCII character 10}
	set playlist_names to playlist_names as string
	set playlist_names to paragraphs of (do shell script "echo " & quoted form of (playlist_names) & " | sort -f")
	set AppleScript's text item delimiters to backup
	
	activate
	choose from list playlist_names multiple selections allowed yes empty selection allowed yes with title "Choose playlists to sync with FSIO"
	tell application "JSON Helper" to make JSON from the result
end tell

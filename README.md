# PCAP Database Website
This website is used by the University of Michigan Prisoner Creative Arts Project organization.

##Contents
1. Basic Description
2. Technical

###Basic Description
The website allows users to search the PCAP database for art pieces produced by prisoners.

The following information is provided for each art piece:

- The title of the piece
- The artist
- The facility of the artist
- The location in the PCAP art show where the piece can be located

###Technical

The website is currently implemented for localhost viewing. 

It allows administrators to add new pieces and update or remove existing ones. Administrators will see all art pieces in the database. Art pieces shown to users will be those whose artists have not received a critique for *any* of their work.


When all artists have received at least one critique, the website will then allow users to peruse pieces that have not individually received critiques. 

Users and administrators may also search and filter database entries by title, artist name, facility name, or location in the art show. Administrators alone may filter by whether the art piece has been critiqued. 


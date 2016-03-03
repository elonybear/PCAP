# PCAP Database Website
This website is used by the University of Michigan Prisoner Creative Arts Project organization.

##Contents
1. Basic Description
2. Installation
3. Usage
4. Next steps

###Basic Description
The website allows users to search the PCAP database for art pieces produced by prisoners.

The following information is provided for each art piece:

- The title of the piece
- The artist
- The facility of the artist
- The location in the PCAP art show where the piece can be located

The website is currently implemented for localhost viewing. 

It allows administrators to add new pieces and update or remove existing ones. Administrators will see all art pieces in the database. Art pieces shown to users will be those whose artists have not received a critique for *any* of their work.


When all artists have received at least one critique, the website will then allow users to peruse pieces that have not individually received critiques. 

Users and administrators may also search and filter database entries by title, artist name, facility name, or location in the art show. Administrators alone may filter by whether the art piece has been critiqued. 

### Installation

Node is required to run this application. 

For Macs:

1. If necessary, install brew: `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. This is done in the Terminal application for Mac OSX platforms. 
2. Install node with brew: `brew install node`. This is also done in the Terminal. 

For Windows:

1. Navigate to this blog post, which details Node.js installation: http://blog.teamtreehouse.com/install-node-js-npm-windows 

The various packages required to run this server are already installed and located in the `node_modules` directory

### Usage

1. In the Terminal for Mac OSX or Command Prompt for Windows, navigate to the folder containing the PCAP Database Website files
2. Run the server: `node server.js`
3. Admin: In a browser, navigate to `http://localhost:3000/admin.html` - Username: admin, Password: hello
  
  Change your password
  
  Add, update, or delete entries
5. User: In a browser, navigate to `http://localhost:3000/user.html`

### Next Steps

1. Allow for multiple user accounts
2. Create 'favoriting' system for users
3. Allow users to post critiques online
4. Allow users to post comments for different art pieces and to have users see all comments made to a piece
5. Allow comments to be made private
6. Adapt website to work on real server

# maktup
Node.js chat application that relies on websockets to connect users to server.
A user can create multiple rooms, and opened rooms are displayed in the home page.
A room is open when it has one user or more.

Under the main socket namespace, when a user connects; the main namespace redirects the user 
to a channel named after the room that the user visited.
For example; when a user visits: maktup/rooms/room/9fk4lell5kiq9mn, a socket connection is made
to the main server (main namespace), and directed to a channel by the name of "9fk4lell5kiq9mn" 
under the main namespace.

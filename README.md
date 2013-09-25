#Marbes#


##Abstract##

A small nodejs based scanimage interface intended to run on a raspberry pi to offer a central webbased scanner service.

##Description##
Marbels is a light weight self contained application to use your scanner via a simplistic webinterface. To keep it easy to use, it only offers the most basic features, like selecting the scan resolution and the scan mode (lineart, gray or color).
Beside the preview there are two scan feature:
* scan to jpg
* scan multiple page to a single pdf file

##What features are not part of marbles##
* You can't scan just a single range. You can only scan full pages
* There is no image correction what so ever - Marbles is not intended to do any kind of "photo-editing"
* Well, the UI could use some beautification

##Known show stopppers##
The main issue keeping marbles right now from a public beta release is the lack of file extensions when downloading a scaned file. I haven't been able how to force the download to keep the file extension provided by the server. For any reason its being trunkcated. This wouldn't pose that much of a problem for *nix users, but renders the software unhandlable for any windows user.

##Technology##


On the backend it uses [Node.js](http://nodejs.org/) for the buissness logic. 

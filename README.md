ma#Marbles#


##Abstract##

A small nodejs based scanimage interface intended to run on a [Raspberry Pi](http://www.raspberrypi.org/) to offer a central webbased scanner service.

##Description##
Marbles is a light weight self contained application to use your scanner via a simplistic webinterface. To keep it easy to use, it only offers the most basic features, like selecting the scan resolution and the scan mode (lineart, gray or color).
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
What kind of technology does marbles use?
* It's an interface for scanimage provided within the linux scanner environment [sane](http://www.sane-project.org/) (Thus the name)
* Marbles is a nodejs application
* Being based on nodejs comes with the advantage, that it contains its own webserver (default port 8080)
* It uses imagemagic to generate the pdf file from the images
* All configuration can be changed within the ./config/config.json file
* As template engine it uses [jade](http://jade-lang.com/) - the templates are pre-cached upon start of marbles
* On the client side marbles uses [angularjs](http://angularjs.org/) for a simplistic yet feature rich ui-experiance
* On and of cause [jQuery](http://jquery.com/) has it's part
* To avoid to much css hassle [less](http://www.lesscss.de/) is used

##What about the new feature? / I've got a feature idea##
You got an idea for a new feature!? Well good for you! - Will I implement it. Probarbly not. This is a small project within my free time, due to my pixma printer scanner being a little to old to having wlan. Most modern systems have wlan support and a bunch of software supporting it. All features are either the result of me needing the feature or my girlfriend complaining not having the feature. But if you think there is something you can't live without start a discussion within the github forum.

##Features to come##
Currently I only have three things on my todo list:
* Cleaning up the ui
* Finding out why the hell the fileextensions are getting lost!
* Fixing the internally used pdf-generation; Currently it places a file on the disk during the pdf generation. Normally it's intended to do the via the stdout of the convert tool, but for some reason that didn't work out.

##Usage##
You need two parts:
* A unix / linux type system your scanner is attached to. (your "Server")
  Marbles is written on [Raspberry](http://www.raspberrypi.org/) Arch Linux - It has not been testes on any other *nix system, but there is no reason it shouldn't work on other platforms.
* Any client with a modern webbrowser (Firefox, Safari, Chrome) - IE is mostlikely going to fail... (No surprise there)

##Dependancies##
What do you need to run marbles.js?
You need several packages:

* Nodejs (obviously) - [pacman -S nodejs](https://www.archlinux.org/packages/community/i686/nodejs/)
* Sane - [pacman -S sane](https://www.archlinux.org/packages/extra/x86_64/sane/)
* image magic (for the pdf feature) - [pacman -S imagemagic](https://www.archlinux.org/packages/extra/x86_64/imagemagick/)

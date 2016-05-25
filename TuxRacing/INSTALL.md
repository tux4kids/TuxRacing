Installation
=============
---------------------------------------
No setup/installation is required! You can simply go to http://klocatelli.name/TuxRacing to play the game. Alternatively, packages for some mobile devices are available at https://github.com/klocatelli/TuxRacing/downloads


Basic setup
-------------
TuxRacing is a self-contained website, easily packaged in a PhoneGap or used through a browser:

- PhoneGap: put the contents of the TuxRacing `www/` folder in your PhoneGap `assets/www/` folder.
- Website: Exact procedure depends on your setup or how you intend on using the project, but you will want to copy the contents to a publicly available location. No server-side languages are required.

This method uses *un-optimized* JavaScript, which means RequireJS dynamically loads the files on-demand. It is strongly suggested you use the following instructions to optimize the project's JavaScript into a single file.


Advanced / Development setup
-------------
Requirements:

- [nodejs](http://nodejs.org/)
- [npm](https://npmjs.org/)
- [volo (via npm)](https://npmjs.org/package/volo)

**JavaScript Optimization**

The un-optimized project uses RequireJS for dependency management, which makes numerous requests to load all of the required JavaScript files. This is useful for development, but unnecessary in production. Solution: [volo]((https://npmjs.org/package/volo) / [almond](https://github.com/jrburke/almond). Volo calls the RequireJS optimizer to concat and optimize most of the JavaScript into a single output file, and almond replaces RequireJS in the output optimized file. The result is a single small optimized file.

After installing the above requirements, you can create an optimized site by running the following command from the TuxRacing root directory (parent of the `www/` folder):

    volo appcache

This creates a `www-built/` folder containing the optimized project. You may choose to manually edit the output index.html to remove the script element for RequireJS. The file is excluded from the build output and will not load, though aside from an unnecessary request it will not cause any problems.

**LESS**

TuxRacing uses [LESS](http://lesscss.org/#about) to speed up and simplify style sheet development. After modifying the less files, you will need to run `volo less` in the TuxRacing project root. This will output an optimized CSS file to `www/css/app.css`.
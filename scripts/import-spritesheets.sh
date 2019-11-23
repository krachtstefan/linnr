#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
exportFolder=~/Desktop/export/
spritesheetPath=~/git/linnr/public/images/spritesheet
folder=~/Dropbox/linnr
file=WORM

echo "📁 exportFolder: $exportFolder"
echo "📁 spritesheetPath: $spritesheetPath"
echo "🔧 exporting from aseprite file"

aseprite --batch $folder/$file.aseprite --save-as $folder/_temp/$file{tag}_{slice}.png
mkdir -p $exportFolder
cp -r $folder/_temp/$file-* $exportFolder/

echo "🔧 creating spritesheet with TexturePacker"

TexturePacker $exportFolder --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json
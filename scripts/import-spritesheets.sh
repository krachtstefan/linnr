#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
ts=$(date '+%s')
asepriteExportFolder=~/Dropbox/linnr/_temp/aseprite-export
texturePackerImportFolder=~/Dropbox/linnr/_temp/texturepacker-import

spritesheetPath=~/git/linnr/public/images/spritesheet

folder=~/Dropbox/linnr
file=WORM

echo "📁 asepriteExportFolder: $asepriteExportFolder"
echo "📁 texturePackerImportFolder: $texturePackerImportFolder"
echo "📁 spritesheetPath: $spritesheetPath"

echo "🔧 exporting from aseprite file"
aseprite --batch $folder/$file.aseprite --save-as $asepriteExportFolder/$file$ts/$file{tag}_{slice}.png

mkdir -p $texturePackerImportFolder/$file$ts/
cp -r $asepriteExportFolder/$file$ts/$file-* $texturePackerImportFolder/$file$ts

echo "🔧 creating spritesheet with TexturePacker"
TexturePacker $asepriteExportFolder/$file$ts --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json
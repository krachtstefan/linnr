#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
ts=$(date '+%s')
asepriteExportFolder=~/Desktop/_temp/aseprite-export
texturePackerImportFolder=~/Desktop/_temp/texturepacker-import

spritesheetPath=~/git/linnr/public/images/spritesheet

folder=~/Dropbox/linnr/ART/ASEs
file=WORM

echo "📁 asepriteExportFolder: $asepriteExportFolder"
echo "📁 texturePackerImportFolder: $texturePackerImportFolder"
echo "📁 spritesheetPath: $spritesheetPath"

echo "🔧 exporting from aseprite file"
aseprite --batch $folder/$file.aseprite --save-as $asepriteExportFolder/$file$ts/$file{tag}_{slice}.png

mkdir -p $texturePackerImportFolder/$file$ts/
cp -r $asepriteExportFolder/$file$ts/$file-* $texturePackerImportFolder/$file$ts

echo "🔧 creating spritesheet with TexturePacker"

TexturePacker $texturePackerImportFolder/$file$ts --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json
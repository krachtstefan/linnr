#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
ts=$(date '+%s')
asepriteExportFolder=~/Desktop/_temp/aseprite-export
texturePackerImportFolder=~/Desktop/_temp/texturepacker-import


spritesheetPath=~/git/linnr/public/images/spritesheet
folder=~/Dropbox/linnr/ART/ASEs
folderSpritesheetCopy=~/Dropbox/linnr/SHARED/SPRITESHEET/TODO
fileWorm=WORM
fileHitboxes=OBJECTS.HITBOX

echo "📁 asepriteExportFolder: $asepriteExportFolder"
echo "📁 texturePackerImportFolder: $texturePackerImportFolder"
echo "📁 spritesheetPath: $spritesheetPath"

echo "🔧 exporting from aseprite file"
aseprite --batch $folder/$fileWorm.aseprite --save-as $asepriteExportFolder/$fileWorm$ts/$fileWorm{tag}_{slice}.png
aseprite --batch $folder/$fileHitboxes.aseprite --save-as $asepriteExportFolder/$fileHitboxes$ts/$fileHitboxes{tag}_{slice}.png

mkdir -p $texturePackerImportFolder/$ts/
cp -r $asepriteExportFolder/$fileWorm$ts/$fileWorm-* $texturePackerImportFolder/$ts
cp -r $asepriteExportFolder/$fileHitboxes$ts/$fileHitboxes-* $texturePackerImportFolder/$ts

echo "🔧 creating spritesheet with TexturePacker"

TexturePacker $texturePackerImportFolder/$ts --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json

echo "🔧 save a copy of the spritesheet"
cp $spritesheetPath.png $folderSpritesheetCopy
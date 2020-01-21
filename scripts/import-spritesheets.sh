#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
ts=$(date '+%s')
asepriteExportFolder=~/Desktop/_temp/aseprite-export
texturePackerImportFolder=~/Desktop/_temp/texturepacker-import


spritesheetPath=~/git/linnr/public/images/spritesheet
folder=~/Dropbox/linnr/CHRISTIAN/_ASE
fileWorm=WORM
fileHitboxes=OBJECTS.HITBOX
fileHighboxes=OBJECTS.HIGHBOX

echo "📁 asepriteExportFolder: $asepriteExportFolder"
echo "📁 texturePackerImportFolder: $texturePackerImportFolder"
echo "📁 spritesheetPath: $spritesheetPath"

echo "🔧 exporting from aseprite file"
aseprite --batch $folder/$fileWorm.aseprite --save-as $asepriteExportFolder/$fileWorm$ts/$fileWorm{tag}_{slice}.png
aseprite --batch $folder/$fileHitboxes.aseprite --save-as $asepriteExportFolder/$fileHitboxes$ts/$fileHitboxes{tag}_{slice}.png
aseprite --batch $folder/$fileHighboxes.aseprite --save-as $asepriteExportFolder/$fileHighboxes$ts/$fileHighboxes{tag}_{slice}.png

mkdir -p $texturePackerImportFolder/$ts/
cp -r $asepriteExportFolder/$fileWorm$ts/$fileWorm-* $texturePackerImportFolder/$ts
cp -r $asepriteExportFolder/$fileHitboxes$ts/$fileHitboxes-* $texturePackerImportFolder/$ts
cp -r $asepriteExportFolder/$fileHighboxes$ts/$fileHighboxes-* $texturePackerImportFolder/$ts

echo "🔧 creating spritesheet with TexturePacker"

TexturePacker $texturePackerImportFolder/$ts --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json
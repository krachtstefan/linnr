#!/bin/bash
export PATH="/Applications/Aseprite.app/Contents/MacOS/:$PATH"
ts=$(date '+%s')
asepriteExportFolder=~/Desktop/_temp/aseprite-export
texturePackerImportFolder=~/Desktop/_temp/texturepacker-import


spritesheetPath=~/git/linnr/public/images/spritesheet
folder=~/Dropbox/linnr/CHRISTIAN/_ASE

files=(WORM SPRITES.1x1 SPRITES.1x2 SPRITES.2x1 SPRITES.2x2)

echo "📁 asepriteExportFolder: $asepriteExportFolder"
echo "📁 texturePackerImportFolder: $texturePackerImportFolder"
echo "📁 spritesheetPath: $spritesheetPath"

echo "🔧 exporting from aseprite file"
mkdir -p $texturePackerImportFolder/$ts/
for file in "${files[@]}" 
do
  echo "🔧 processing $file"
  aseprite --batch $folder/$file.aseprite --save-as $asepriteExportFolder/$file$ts/$file{tag}_{slice}.png
  cp -r $asepriteExportFolder/$file$ts/$file-* $texturePackerImportFolder/$ts
done

echo "🔧 creating spritesheet with TexturePacker"
TexturePacker $texturePackerImportFolder/$ts --format pixijs4 --sheet $spritesheetPath.png --data $spritesheetPath.json
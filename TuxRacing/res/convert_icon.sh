declare -A res
res[hdpi]="72x72"
res[mdpi]="48x48"
res[ldpi]="36x36"

declare -A dens
dens[hdpi]="240"
dens[mdpi]="160"
dens[ldpi]="120"

for dir in "${!res[@]}";
do
    mkdir -p "drawable-$dir"
    convert -background transparent title_penguin.svg -density "${dens["$dir"]}" -resize "${res["$dir"]}" -gravity center -extent "${res["$dir"]}" "drawable-$dir/ic_launcher.png"
done

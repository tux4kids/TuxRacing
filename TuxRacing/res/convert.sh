declare -A res
res[hdpi]="640x480"
res[mdpi]="470x320"
res[ldpi]="426x320"

declare -A dens
dens[hdpi]="240"
dens[mdpi]="160"
dens[ldpi]="120"

for dir in "${!res[@]}";
do
    mkdir -p "drawable-$dir"
    convert tux4kids.png -size "${res["$dir"]}" xc:black +swap -gravity center -composite  -density "${dens["$dir"]}" "drawable-$dir/splash.jpg"
done

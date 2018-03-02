#git clone https://github.com/lucasjellema/webshop-customers-soaring-through-the-cloud-native-sequel
# cd webshop-customers-soaring-through-the-cloud-native-sequel

git pull
wait

npm install
wait
ojet build 
# this line produced an error on uglifying one of the files
#ojet build  --release
wait
cp -a ./web/. ./jet-on-node/public
wait
cd jet-on-node
wait
npm install
wait
zip -r webshopcustomers.zip .
wait
cd /oracle-cloud-psm-cli/webshop-customers-soaring-through-the-cloud-native-sequel/jet-on-node
wait
psm accs push -n SoaringWebshopCustomers -r node -s hourly -d deployment.json -p webshopcustomers.zip




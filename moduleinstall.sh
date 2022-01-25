echo "请输入模块名称"
read module_name
npm view $module_name version
echo "是否安装"
read option
if [ "$option" == "n" ] ||[ "$option" == "N" ]
then
echo '激动。。。'
exit 1
else
yarn add $module_name
fi
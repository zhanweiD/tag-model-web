#!/bin/bash
# 打 开发包
# eg sh ./deploy.sh
# 打 提测包
# eg: sh ./deploy.sh tag_name

package_name="asset_tag"
# 打包命令
npm run build

# 判断是否有tag_name
if [ x$1 != x ]
then
  #...有参数
  tar_name="${package_name}-web-v$1.tgz"
else
  #...没有参数
  tar_name="${package_name}.tgz"
fi

# 如果文件不存在，则创建文件夹
if [ ! -d "tgz" ]; then
  mkdir -p tgz
fi

# 复制dist文件夹到tgz下
cp -r dist $package_name
cp -r public $package_name/public
# 压缩
tar -zcvf tgz/$tar_name $package_name/

rm -rf $package_name/

echo "打包完成!"
echo "可使用scp命令进行上传：scp tgz/${tar_name} deploy@192.168.90.112:/opt/workspace/front"

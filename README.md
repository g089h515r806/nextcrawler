# nextcrawler
## 简介
> Next Crawler 是使用Playwright + Next.js + Prisma等主流技术搭建的网页数据采集器，通过可视化的UI进行配置，即可周期性的通过Playwright驱动浏览器爬取网页数据。内置支持
- 使用mozilla/readability智能识别网页正文;
- 可配置的正文图片自动下载功能;
- 可以选择的文件下载功能，支持PDF、MP3、MP4、等多种格式;
- 可以配置的多字段解析;
- 可以配置的Playwright基本动作;
- 支持定时任务，并且可以配置周期采集数量;
- 支持采集模板，并且支持导入导出;
- 支持代理;
- 支持错误日志;
- 可选的基本用户认证管理;
- 支持浏览器持久化上下文(完全真实浏览器);
- 支持采集评论;
- 支持批量导入、导出种子，支持导出种子的条目数据，采用excel格式。

## 安装指南

### 数据库
> 目前我们默认支持的是MYSQL，我们使用JSON字段存储任意数据，所以需要MYSQL最低版本5.7。MYSQL的安装请参考官方文档。
-  Pgsql、sqlite目前尚未测试

### Node.js版本
> 我们使用的是react19，next.js16。最低Node版本20.9.

### 安装流程
> (1),下载了源代码以后，使用npm 命令安装依赖
-  npm install
 
> (2),Playwright包安装以后，需要执行特有的安装步骤，用来安装下载使用的浏览器。
-  npx playwright install

> (3), Prisma
>   数据库安装好了以后，启动数据库；请修改.env文件中的数据库连接信息，设置正确的数据库连接设置正确。
- DATABASE_URL="mysql://root:root@localhost:3306/nextcrawler"

> 创建对应的数据库：
-  create database nextcrawler;

> 自1.0-beta5版本以后，prisma升级到了7.x，需要生成客户端代码, 请确保tsc命令可用(npm install -g typescript)
-  npm run generateClient
-  或者 npx prisma generate && tsc --project tsconfig.prisma.json

> 数据库初始化：
-  npx prisma migrate dev --name init

> 完成了上述操作，就可以使用
-  npm run dev

> 启动系统了。
> 如果上面操作顺利，正常情况下，访问 http://localhost:3000/， 进入管理界面

![管理界面](https://raw.githubusercontent.com/g089h515r806/nextcrawler/0d91acc4bb6a7fd552557199ddb901e74a41dc24/public/file/images/demo.jpg)

## 视频教程
> 作者录制了相关的视频教程，放在了抖音上
- [Next Crawler 简介](https://www.douyin.com/video/7578491830568832302)
- [Next Crawler 安装](https://www.douyin.com/video/7578493339683573042)
- [爬取示例1:简单资讯新闻](https://www.douyin.com/video/7578494081442286857)
- [爬取示例2:爬取出版社图书信息,字段映射与转换](https://www.douyin.com/video/7578809442225884479)
- [爬取示例3:采集模板规则的使用](https://www.douyin.com/video/7579251571523996969)
- [爬取示例4:浏览器动作的使用](https://www.douyin.com/video/7579919925095992617)
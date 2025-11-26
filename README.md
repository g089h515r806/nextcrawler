# nextcrawler
Next Crawler 是使用Playwright + Next.js + Prisma等主流技术搭建网页数据采集器，通过可视化的UI进行配置，即可周期性的通过Playwright驱动浏览器爬取网页数据。内置支持
使用mozilla/readability智能识别网页正文;
可配置的正文图片自动下载功能;
可以选择的文件下载功能，支持PDF、MP3、MP4、等多种格式;
可以配置的多字段解析;
可以配置的Playwright基本动作;
支持定时任务，并且可以配置周期采集数量;
支持采集模板，并且支持导入导出;
支持代理;
支持错误日志;
可选的基本用户认证管理。


安装指南

数据库
目前我们默认支持的是MYSQL，我们使用JSON字段存储任意数据，所以需要MYSQL最低版本5.7。MYSQL的安装请参考官方文档。
Pgsql、sqlite目前测试

Node.js版本
我们使用的是react19，next.js16。最低Node版本20.9.

安装流程
(1),载了源代码以后，使用npm 命令安装依赖
npm install
 
(2),Playwright包安装以后，需要执行特有的安装步骤，用来安装下载使用的浏览器。
npx playwright install

(3), Prisma
  数据库安装好了以后，启动数据库；请修改.env文件中的数据库连接信息，设置正确的数据库连接设置正确。
DATABASE_URL="mysql://root:root@localhost:3306/nextcrawler"

创建对应的数据库：
create database nextcrawler;

数据库初始化：
npx prisma migrate dev --name init

完成了上述操作，就可以使用
npm run dev

启动系统了。
如果上面操作顺利，正常情况下，访问 http://localhost:3000/

